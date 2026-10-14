# ShopKart 🛒

ShopKart is a full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application. It features customer authentication, dynamic product catalog with search, category filtering, and pagination, shopping cart and wishlist management, and secure payment processing with Razorpay integration including failed payment retry recovery.

---

## 🚀 Features

- **Authentication & Authorization**: Secure signup and login with hashed passwords and JWT stored in HTTP-only cookies.
- **Product Catalog**:
  - Filter products by category (Electronics, Fashion, Books, Home, etc.).
  - Real-time keyword search.
  - Sorting by price (low to high, high to low) and newest arrivals.
  - Dynamic pagination with responsive page navigation.
  - Product details view with stock availability indicator.
- **Cart & Wishlist**:
  - Add, update quantity, and remove items with real-time price calculations.
  - Wishlist management to save favorite products for later.
- **Checkout & Razorpay Payments**:
  - Seamless Razorpay checkout gateway modal integration.
  - Automatic payment signature verification on the server.
  - Instant stock deduction and cart reset on payment success.
  - **Payment Retry Handling**: Failed payment attempts are recorded with the order marked as `FAILED`. Users can retry payment directly from order details or checkout without re-adding items.
- **Order History & Tracking**:
  - View all past orders with status badges (`SUCCESS`, `FAILED`, `PENDING`).
  - Itemized order breakdown with delivery address and payment metadata.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **React Router DOM** (v7) for client-side routing
- **Axios** for API requests with cookie credentials
- **Tailwind CSS / Custom CSS** for UI styling

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (MongoDB Atlas or local)
- **JWT (JSON Web Tokens)** & **Cookie-Parser** for authentication
- **Bcrypt.js** for password encryption
- **Razorpay SDK** for payment processing

---

## 📂 Project Structure

```text
ShopKart/
├── backend/
│   ├── config/             # Razorpay configuration
│   ├── controllers/        # Express route controllers (auth, cart, order, product, wishlist)
│   ├── middlewares/        # JWT auth verification middleware
│   ├── models/             # Mongoose schemas (Customer, Product, Order, Wishlist)
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper utilities (token generator)
│   ├── .env.example        # Backend environment variables template
│   ├── index.js            # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App images and illustrations
│   │   ├── components/     # Reusable UI components (Navbar, ProductCard, CartItem, etc.)
│   │   ├── context/        # React Context (AuthContext, CartContext)
│   │   ├── pages/          # Page components (Home, Products, ProductDetails, Cart, Checkout, Orders, etc.)
│   │   ├── services/       # Axios API client functions
│   │   ├── App.jsx         # App router and layouts
│   │   └── main.jsx        # Frontend entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore              # Root gitignore rules
└── README.md               # Project documentation
```

---

## ⚙️ Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or later recommended)
- **npm** (v9.x or later)
- **MongoDB** connection URI (MongoDB Atlas cluster or local MongoDB instance)
- **Razorpay Test Account** (for `Key ID` and `Key Secret` from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys))

---

## 📦 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/RanojjoyC/ShopKart.git
cd ShopKart
```

---

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open `backend/.env` and fill in your actual credentials:
   ```env
   PORT=7777
   DB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopkart?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. Start the Backend Server:
   ```bash
   # Development mode with nodemon
   npm run dev

   # Or standard node execution
   npm start
   ```
   The backend server will run on `http://localhost:7777`.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

---

## 🔐 Environment Variables Reference

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express backend | `7777` |
| `DB_URL` | MongoDB connection string (Atlas or Local) | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | `your_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (Test or Live) | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret Key | `your_secret` |

> ⚠️ **Security Warning**: Never commit your actual `.env` file or API secrets to GitHub. Both root and backend `.gitignore` are configured to prevent secrets from being tracked.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register new customer account | No |
| `POST` | `/customers/login` | Authenticate customer and set cookie | No |
| `POST` | `/customers/logout` | Clear auth cookie | Yes |
| `GET` | `/customers/profile` | Get current customer profile | Yes |
| `GET` | `/products` | Get products (supports `?page=`, `?limit=`, `?category=`, `?search=`, `?sort=`) | No |
| `GET` | `/products/:id` | Get single product details | No |
| `GET` | `/cart` | Fetch current customer cart | Yes |
| `POST` | `/cart` | Add item to cart | Yes |
| `PUT` | `/cart/:productId` | Update item quantity in cart | Yes |
| `DELETE` | `/cart/:productId` | Remove item from cart | Yes |
| `GET` | `/wishlist` | Get customer wishlist | Yes |
| `POST` | `/wishlist/:productId` | Toggle product in wishlist | Yes |
| `POST` | `/orders/create-payment-order` | Create Razorpay order & pending Order document | Yes |
| `POST` | `/orders/verify-payment` | Verify HMAC signature, deduct stock, complete order | Yes |
| `POST` | `/orders/payment-failed` | Mark order status as `FAILED` on cancellation/error | Yes |
| `GET` | `/orders` | Fetch customer order history | Yes |
| `GET` | `/orders/:id` | Fetch details of a specific order | Yes |

---

## 🧪 Testing Razorpay Payment Flow

1. Register or log in to an account.
2. Add products to the cart and click **Checkout**.
3. Fill in the delivery address and click **Proceed to Payment**.
4. In the Razorpay modal:
   - Use Razorpay Test Cards / Netbanking / UPI simulators.
   - **To test Success**: Choose Success in the simulator to verify order completion and stock deduction.
   - **To test Failure/Retry**: Close the modal or select Failure in the simulator. The order will be marked as `FAILED`, and a **Retry Payment** option will be available to re-attempt payment seamlessly.

---

