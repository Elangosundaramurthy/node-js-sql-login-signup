const mysql = require('mysql');
const bodyParser = require('body-parser');
const express = require('express');
const db = mysql.createConnection({
  host: 'localhost',
  port: 3309,
  user: 'root',
  password: '',
  database: 'login'
});
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected');
});
const app = express();
app.use(bodyParser.json());
app.post('/createAccount', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    db.query('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)', [firstName, lastName, email, password], (err) => {
      if (err) {
        throw err;
      }
      res.status(200).json({ message: 'Account created successfully' });
    });
  });
});
//start the server start:3000,the data base(host name :localhost,port:3309,user:root,password:" ")
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
