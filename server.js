const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
let id = 0;

const makeLastIn = () => {
  const today = Date.now();
  const date = new Date(today);
  const dateReg = date.toDateString();
  return dateReg;
}
let dateLastIn = makeLastIn();
let userIn;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'production'|| process.env.NODE_ENV === 'staging') {
  app.use(express.static(path.join(__dirname,'client/build')));
  app.get('*', function(_req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
};

const db = mysql.createConnection({
    host: 'sql11.freesqldatabase.com',
    user: 'sql11473005',
    password: 'HUG9AbWmyq',
    database: 'sql11473005',
    port: 3306,
});

db.connect(function(err, _result) {
  if (err) console.log(err);
 /* const sql = 'CREATE TABLE Users (Id int, Name VARCHAR(100), Email VARCHAR(100),Password VARCHAR(100), Date_Regist VARCHAR(100), Date_LastIn VARCHAR(100), Status_user VARCHAR(100), End VARCHAR(100))';
  db.query(sql, function (err, _result) {
      if (err) console.log(err);
      console.log('Table created');
  });*/
});


app.post('/addUser', (req, res) => {
  const sql = 'SELECT * FROM Users WHERE Name=? AND Password=?';
  const { login, password, email, dateRegist, status } = req.body;
  db.query(sql, [login,password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if(result.length > 0) {
        res.send('Such user already exists in the database');
      } else {
        id++;
        db.query(
          'INSERT INTO Users (Id, Name, Email, Password, Date_Regist, Status_user) VALUES (?,?,?,?,?,?)',
          [id, login, email, password, dateRegist, status],
          (err, result) => {
            (err) ? console.log(err) : res.send('User registered successfully, you can login');
          }
        );
      }
    }
  );
});

app.post('/deleteUser', (req, res) => {
const { del } = req.body;
let sql;
(del == 'all') ? sql = 'DELETE FROM Users' : sql = 'DELETE FROM Users WHERE Id =?';
db.query(sql, (del == 'all') ? []: [del],
  (err, _result) => {
    (err) ? console.log(err) : (userIn == del || del == 'all') ? res.send('reload') : res.send('no');
  })
})

app.post('/blockUser', (req, res) => {
const { block } = req.body;
const status = 'Block';
let sql;
(block == 'all') ? sql = `UPDATE Users SET Status_user=?` : sql = `UPDATE Users SET Status_user=? WHERE Id =?`;
db.query(sql, (block == 'all') ? [status] : [status, block],
  (err, _result) => {
    (err) ? console.log(err) : (userIn == block || block == 'all') ? res.send('reload') : res.send('no');
  })
})

app.post('/unBlockUser', (req, _res) => {
const { unblock } = req.body;
const status = 'OK';
const sql = `UPDATE Users SET Status_user=? WHERE Id =?`;
db.query(sql, [status, unblock],
  (err, _result) => {
    if (err) console.log(err);
  })
})

app.post('/haveUser', (req, res) => {
  const { login, password } = req.body;
  const sql = 'SELECT * FROM Users WHERE Name=? AND Password=?';
  db.query(sql, [login,password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if(result.length > 0 && result[0].Status_user !='Block') {
        userIn = result[0].Id
        const update = 'UPDATE Users SET Date_LastIn=? WHERE Name=?';
        db.query(update, [dateLastIn, login],
          (err, _res) => {
            if (err) console.log(err);
        });
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
});


app.post('/showUsers', (_req, res) => {
db.query('SELECT * FROM Users;', (err, result) => {
  (err) ? console.log(err) : res.send(result);
});
});

app.listen(PORT, () => {
  console.log('Server is running');
});