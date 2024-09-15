const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pool = require('./db'); // Import the database connection

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve HTML/CSS files

// Registration Route
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Password Hashing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, email, passwordHash]
    );
    res.json({ message: 'User registered successfully!', userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed!' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password!' });
    }

    res.json({ message: 'Login successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed!' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
