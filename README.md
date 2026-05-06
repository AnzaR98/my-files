# King-Tech Online Store

A full-stack e-commerce application built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

- 🛍️ Product catalog with responsive grid layout
- 🛒 Shopping cart with localStorage persistence
- 📦 Order management system
- 💾 SQLite database for products and orders
- 🔄 RESTful API endpoints
- 📱 Mobile-responsive design
- ✨ Bootstrap 5 styling

## Project Structure

```
├── Shopping.html       # Frontend UI with cart functionality
├── server.js          # Express.js backend server
├── package.json       # Dependencies and scripts
├── .env.example       # Environment configuration template
└── README.md          # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd king-tech-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the store**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product

### Orders
- `POST /api/orders` - Create a new order
  ```json
  {
    "items": [
      {"id": 1, "quantity": 2, "price": 16500, "name": "Dell Pro 15 Laptop"}
    ],
    "total": 33000
  }
  ```
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get a specific order with items

## Usage

### Frontend
1. Browse products in the product grid
2. Click "Add to Cart" to add items to your shopping cart
3. Click the cart icon (🛒) to view cart contents
4. Adjust quantities or remove items
5. Click "Checkout" to place an order

### Backend Database

The server uses an in-memory SQLite database initialized with 3 sample products:
- Dell Pro 15 Laptop (R16,500)
- HP 250 G10 Laptop (R9,500)
- Lenovo V15 G4 AMN Laptop (R9,000)

To use persistent storage, modify `server.js`:
```javascript
// Change from:
const db = new sqlite3.Database(':memory:');

// To:
const db = new sqlite3.Database('./store.db');
```

## Technologies Used

### Frontend
- HTML5
- CSS3 (with CSS Grid)
- JavaScript (ES6+)
- Bootstrap 5
- localStorage API

### Backend
- Node.js
- Express.js
- SQLite3
- CORS middleware

## Features Breakdown

### Shopping Cart
- **Persistence**: Cart data stored in browser's localStorage
- **Real-time updates**: Cart count displayed in header
- **Quantity management**: Increase/decrease item quantities
- **Remove items**: Delete items from cart
- **Total calculation**: Automatic price calculation

### Order Management
- **Order creation**: POST endpoint to save orders to database
- **Order history**: GET endpoint to retrieve past orders
- **Order details**: View individual orders with items

### Database Schema

**Products Table**
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- price (REAL)
- description (TEXT)
- image (TEXT)

**Orders Table**
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- total (REAL)
- created_at (DATETIME)
- status (TEXT)

**Order Items Table**
- id (INTEGER, PRIMARY KEY, AUTOINCREMENT)
- order_id (INTEGER, FOREIGN KEY)
- product_id (INTEGER, FOREIGN KEY)
- quantity (INTEGER)
- price (REAL)

## Error Handling

The application includes error handling for:
- Failed API requests (with fallback to hardcoded products)
- Invalid cart operations
- Order placement errors
- Database errors

## Future Enhancements

- [ ] User authentication system
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Order tracking system
- [ ] Admin dashboard
- [ ] Product search and filtering
- [ ] User reviews and ratings
- [ ] Email notifications
- [ ] Inventory management

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please create an issue in the repository or contact the maintainer.

---

**Created by**: AnzaR98  
**Last Updated**: 2026-05-06
