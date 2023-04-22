const mysql = require('mysql');
const con = mysql.createConnection({
  host: '82.180.174.154',
  user: 'u682812974_raffonsol',
  password: '',
  database: 'u682812974_ricwebdb'
});

// heartbeat query to keep connection alive
setInterval(() => {
  con.query('select 1');
}, 3000);

con.connect((err) => {
  if (err) {
    console.log('Connection failed. Error:\n', err);
  } else {
    console.log('Connection running successfully');
  }
});

module.exports = con;