const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const pool = require('./db'); 

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML/CSS/JS)


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
    res.status(200).json({ message: 'User registered successfully!', userId: result.rows[0].id });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: "There's already an account like this" });
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

    res.status(200).json({ message: 'Login successful!' });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Login failed!' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
