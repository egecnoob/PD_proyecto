var express = require('express');
var router = express.Router();
var database = require('./database.js');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  // Retrieve destination data from the database
  database.selectFrom('Destinos', function(destinos) {
    // Retrieve data from other tables
    database.selectFrom('Actividades', function(actividades) {
      database.selectFrom('Comentarios', function(comentarios) {
        // Render the index.ejs template and pass all the data to it
        res.render('index.ejs', { 
          destinos: destinos,
          actividades: actividades,
          comentarios: comentarios
        });
      });
    });
  });
});

/* login */
router.get('/login', function(req, res, next) {
  res.render('login.ejs')
});

router.get('/registro', function(req, res, next) {
  res.render('registro.ejs')
});

/* get admin crud */
router.get('/admin', function(req, res) {
  // Call the selectFrom function to retrieve data from the database
  database.selectFrom('Destinos', function(destinos) {
    // Pass the retrieved data to the admin.ejs template
    res.render('admin.ejs', { destinos: destinos });
  });
});

/* dynamically displayed table */
router.get('/display/:table', function(req, res, next) {
  const tableName = req.params.table;
  
  // Check if the specified table exists (for security purposes)
  const allowedTables = ['destinos', 'comentarios', 'usuarios', 'reservas', 'actividades'];
  if (!allowedTables.includes(tableName)) {
    return res.status(404).send('Table not found');
  }

  // Query the database to retrieve data from the specified table
  database.selectFrom(tableName, function(data) {
    // Render a template dynamically based on the retrieved data
    res.render('display_table.ejs', { tableName: tableName, data: data });
  });
});


// DELETE route to delete a destination
router.delete('/delete/:tableName/:id', (req, res) => {
  const tableName = req.params.tableName;
  const id = req.params.id;
  database.deleteFromWhere(tableName, `id = ${id}`, (err, result) => {
      if (err) {
          console.error('Error deleting:', err);
          res.status(500).send('Error deleting ');
      } else {
          console.log('Deleted successfully.');
          res.sendStatus(200);
      }
  });
});

router.post('/update/:tableName/:condition', (req, res) => {
  const tableName = req.params.tableName;
  const condition = req.params.condition;
  const data = req.body;

  //console.log('Body:', req.body);
  //console.log('Data:', data);

  // Insert the new data into the specified table
  database.updateSetWhere(tableName, data, condition);
  
  console.log('Data updated from ' + tableName + ' where ' + condition + ' successfully.');
  res.sendStatus(200);
});

router.post('/add/:tableName', (req, res) => {
  const tableName = req.params.tableName; // Get tableName from request parameters
  const data = req.body; // Extract destination data from request body

  console.log('Body:', req.body);
  console.log('Data:', data);

  // Insert the new data into the specified table
  database.insertInto(tableName, data);
  
  console.log('Data added to ' + tableName + ' successfully.');
  res.sendStatus(200);
});




module.exports = router;
