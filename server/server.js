const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('documents.db', (err) => {
  if (err) console.error('Database opening error: ', err);
  else console.log('Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    is_admin INTEGER DEFAULT 0
  )`);

  // Documents table
  db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    content TEXT,
    creator_name TEXT,
    price REAL,
    created_at TEXT,
    preview TEXT
  )`);

  // Insert default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (email, password, is_admin) VALUES (?, ?, 1)`, 
    ['admin@example.com', adminPassword]);

  // Insert default user
  const userPassword = bcrypt.hashSync('user123', 10);
  db.run(`INSERT OR IGNORE INTO users (email, password, is_admin) VALUES (?, ?, 0)`,
    ['user@example.com', userPassword]);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, isAdmin: user.is_admin });
  });
});

// Get all documents (with preview only)
app.get('/api/documents', authenticateToken, (req, res) => {
  db.all('SELECT id, name, creator_name, price, created_at, preview FROM documents', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Get full document content
app.post('/api/documents/:id/access', authenticateToken, (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  // Simple password check (in real app, would be more secure)
  if (password !== '1234') {
    return res.status(401).json({ error: 'Invalid access code' });
  }

  db.get('SELECT * FROM documents WHERE id = ?', [id], (err, document) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json(document);
  });
});

// Admin: Upload new document
app.post('/api/documents', authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.sendStatus(403);

  const { name, content, creator_name, price } = req.body;
  const preview = content.substring(0, 100) + '...';
  const created_at = new Date().toISOString();

  db.run(
    'INSERT INTO documents (name, content, creator_name, price, created_at, preview) VALUES (?, ?, ?, ?, ?, ?)',
    [name, content, creator_name, price, created_at, preview],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});