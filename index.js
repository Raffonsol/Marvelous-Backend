const con = require('./connection');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();

app.get('/', (req, res) => {
  res.status(200).send('api running');
});

app.get('/Tasks', (req, res) => {
  con.query('select * from Tasks', (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.post('/Task', jsonParser, (req, res) => {
  const data = req.body;
  // if name not provided, use default
  if (!data?.name) {
    data.name = 'New Task';
  }
  con.query('insert into Tasks set ?', data, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.listen(4200);