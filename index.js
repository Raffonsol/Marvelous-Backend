const con = require('./connection');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const jsonParser = bodyParser.json();

app.use(cors({
  credentials: true,
  origin: true,
}));

app.get('/', (req, res) => {
  res.status(200).send('api running');
});

app.get('/Tasks', (req, res) => {
  const status = req.query.status;
  con.query('select * from Tasks where `status` = ?', status, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let formattedResults = result;
      if (status === 'Done') {
        // If it's done, only show the 10 most recently completed
        formattedResults = formattedResults.sort((a, b) => a.updated_at < b.updated_at).reverse();
        formattedResults = formattedResults.slice(0, 10);
      }
      res.status(200).send(
        // alphabetical sorting
        formattedResults.sort((a, b) => a.name.localeCompare(b.name))
      );
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

app.patch('/Task/:id', jsonParser, (req, res) => {
  const id = req.params.id;

  con.query('update `Tasks`'
  + ' set `status` ='
  + ' case when `status` = \'To Do\' then \'Done\''
  + ' else \'To Do\' end,'
  + ' `updated_at` = NOW()'
  + ' where `Tasks`.`id` = ?', id, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

app.delete('/Tasks', jsonParser, (req, res) => {
  const status = req.query.status;
  const finish = (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  }
  if (!status ) {
    con.query('delete from Tasks', finish);
  } else {
    con.query('delete from Tasks where status = ?', status, finish);
  }
});

app.listen(4200);