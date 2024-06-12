const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sql10.freemysqlhosting.net',
  user: 'sql10713574',
  password: 'lih98bUaaU',
  database: 'sql10713574'
});

connection.connect();

function insertInto(tableName, data) {
  console.log('Insert into ' + tableName + ' called');
  const query = 'INSERT INTO ' + tableName + ' SET ?'; // Use SET ? to specify data
  connection.query(query, data, (err, result) => { // Pass the data as the second parameter
      if (err) {
          console.error('Error inserting into ' + tableName + ':', err);
          throw err;
      }
      console.log('Inserted into ' + tableName + ' successfully.');
  });
}



function selectFrom(tabla, callback) {
  const query = 'SELECT * FROM ' + tabla;
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error selecting from ' + tabla + ':', err);
      throw err;
    }
    callback(rows);
  });
}

function selectOneFrom(tabla, id, callback) {
  const query = 'SELECT * FROM ' + tabla + ' WHERE id = ?';
  connection.query(query, [id], (err, rows) => {
    if (err) {
      console.error('Error selecting from ' + tabla + ':', err);
      throw err;
    }
    callback(rows[0]);
  });
}

function updateSetWhere(tabla, datos, condicion) {
  const query = 'UPDATE ' + tabla + ' SET ? WHERE ' + condicion;
  connection.query(query, datos, (err, result) => {
    if (err) {
      console.error('Error updating ' + tabla + ':', err);
      throw err;
    }
    console.log('Updated ' + result.affectedRows + ' rows in ' + tabla + ' successfully.');
  });
}

function deleteFromWhere(tabla, condicion) {
  const query = 'DELETE FROM ' + tabla + ' WHERE ' + condicion;
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error deleting from ' + tabla + ':', err);
      throw err;
    }
    console.log('Deleted ' + result.affectedRows + ' rows from ' + tabla + ' successfully.');
  });
}

module.exports = {
  insertInto: insertInto,
  selectFrom: selectFrom,
  updateSetWhere: updateSetWhere,
  deleteFromWhere: deleteFromWhere,
  selectOneFrom: selectOneFrom
};

// You might not want to call connection.end() here if your application needs to keep the connection open
// Typically, you close the connection when your application is shutting down
