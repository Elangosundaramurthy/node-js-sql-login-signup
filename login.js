const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
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
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and pasword is not entered' });
  }db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      throw err;
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User is not found' });
    }
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }    res.status(200).json({ message: 'Logged in successful' });
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
