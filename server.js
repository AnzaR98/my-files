const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Initialize SQLite Database
const db = new sqlite3.Database(':memory:');

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Create products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT
      )
    `);

    // Create orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `);

    // Create order items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )
    `);

    // Insert sample products
    const products = [
      {
        name: 'Dell Pro 15 Laptop',
        price: 16500,
        description: 'Dell Pro 15 PV15250 15.6″ Laptop\n15th Gen\n15.6 inch screen\ni7, 16GB RAM, 512GB SSD, Win 11 Home.',
        image: 'https://tech.co.za/wp-content/uploads/2025/10/Dell-Pro-15-PV1250b.jpg'
      },
      {
        name: 'HP 250 G10 Laptop',
        price: 9500,
        description: 'Hp 250 15.6″ Laptop\n10th Gen\n15.6 inch screen\ni3, 8GB RAM, 256GB SSD, Win 11 Pro.',
        image: 'https://tech.co.za/wp-content/uploads/2025/02/HP-250-G10b.jpg'
      },
      {
        name: 'Lenovo V15 G4 AMN 15.6″ Laptop',
        price: 9000,
        description: 'Levovo V15 G4 AMN Laptop\n15.6 inch screen\nRyzen 5, 8GB RAM, 512GB SSD, Win 11 Home.',
        image: 'https://tech.co.za/wp-content/uploads/2023/09/Lenovo-V15-G4-AMN-Business-Blackb.png'
      }
    ];

    products.forEach(product => {
      db.run(
        `INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`,
        [product.name, product.price, product.description, product.image]
      );
    });

    console.log('✅ Database initialized with sample products');
  });
}

// Initialize database on startup
initializeDatabase();

// Routes

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(rows);
  });
});

// Get a specific product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Create a new order
app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  db.run(
    'INSERT INTO orders (total, status) VALUES (?, ?)',
    [total, 'pending'],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create order' });
      }

      const orderId = this.lastID;

      // Insert order items
      let itemsInserted = 0;
      items.forEach(item => {
        db.run(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.id, item.quantity, item.price],
          (err) => {
            if (err) {
              console.error('Database error inserting item:', err);
            }
            itemsInserted++;

            // When all items are inserted, send response
            if (itemsInserted === items.length) {
              res.status(201).json({
                id: orderId,
                total: total,
                status: 'pending',
                items: items,
                created_at: new Date().toISOString()
              });
            }
          }
        );
      });
    }
  );
});

// Get all orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(rows);
  });
});

// Get a specific order with items
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.all(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id],
      (err, items) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to fetch order items' });
        }

        res.json({
          ...order,
          items: items
        });
      }
    );
  });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Shopping.html');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('🛒 King-Tech Store server running!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close((err) => {
    if (err) console.error(err);
    process.exit(0);
  });
});
