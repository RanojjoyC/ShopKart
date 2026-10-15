# ShopKart 🛒

ShopKart is a modern, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce web application. It features customer authentication via secure HTTP-only cookies, a dynamic product catalog with real-time search, category filtering, and pagination, shopping cart and wishlist management, and full payment lifecycle handling with Razorpay integration—including automatic signature verification and failed payment retry recovery.

---

## 🌟 Key Features

- **Authentication & Security**:
  - Secure customer registration and login with bcrypt password hashing.
  - JWT (JSON Web Tokens) stored in HTTP-only cookies (`withCredentials`) to prevent XSS.
  - Route protection middleware for sensitive customer actions.
- **Dynamic Product Catalog**:
  - Category filtering (`Electronics`, `Fashion`, `Books`, `Home`, etc.).
  - Debounced real-time keyword search.
  - Sorting by price (low-to-high, high-to-low) and newest arrivals.
  - Responsive pagination with page jump and limit controls.
  - Product detail views with live stock availability indicators.
- **Cart & Wishlist Management**:
  - Add, adjust quantities, and remove items with real-time subtotal calculations.
  - One-click wishlist toggle for bookmarking favorite items.
- **Checkout & Razorpay Payment Integration**:
  - Direct integration with Razorpay Checkout modal gateway.
  - Server-side cryptographic HMAC-SHA256 signature verification.
  - Real-time stock decrement upon successful order placement.
  - **Payment Retry Mechanism**: Failed payments transition the order state to `FAILED` without emptying the cart or requiring re-entry. Users can retry payment immediately from checkout or order history.
- **Order History & Tracking**:
  - Itemized past orders with real-time status badges (`SUCCESS`, `FAILED`, `PENDING`).
  - Delivery address summary, payment transaction IDs, and order timestamps.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router DOM (v7), Axios, Tailwind CSS |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `cookie-parser`, `bcrypt` |
| **Payments** | Razorpay Node.js SDK & Razorpay Checkout Modal |

---

## 📂 Project Structure

```text
ShopKart/
├── backend/
│   ├── config/             # Razorpay client instance setup
│   ├── controllers/        # Route logic (auth, cart, order, product, wishlist)
│   ├── middlewares/        # JWT cookie authentication verification
│   ├── models/             # Mongoose schemas (Customer, Product, Order, Wishlist)
│   ├── routes/             # Express API route endpoints
│   ├── utils/              # Token generation helper
│   ├── .env                # Backend environment configuration (create this)
│   ├── index.js            # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App icons & graphics
│   │   ├── components/     # Reusable UI components (Navbar, ProductCard, SearchBar, etc.)
│   │   ├── context/        # React Context (AuthContext, CartContext)
│   │   ├── pages/          # Pages (Home, Products, ProductDetails, Cart, Checkout, Orders, Login, Register)
│   │   ├── services/       # Axios API clients (`api.js`, `productApi.js`)
│   │   ├── App.jsx         # Router configuration
│   │   └── main.jsx        # React application entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore              # Repository gitignore
└── README.md               # Project documentation
```

---

## ⚙️ Prerequisites

Before you start, make sure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: A running MongoDB instance (MongoDB Atlas connection string or local MongoDB: `mongodb://localhost:27017/shopkart`)
- **Razorpay Account**: A free [Razorpay](https://razorpay.com) account in **Test Mode** for your `Key ID` and `Key Secret` from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys).

---

## 🚀 Quick Setup & Installation

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/RanojjoyC/ShopKart.git
cd ShopKart
```

---

### 2. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `backend/` directory with the following variables:
   ```env
   # MongoDB Connection String (Atlas URI or local instance)
   DB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopkart?retryWrites=true&w=majority

   # Secret key used for signing JWT authentication tokens
   JWT_SECRET=your_jwt_secret_key_here

   # Razorpay API Credentials (from Razorpay Dashboard -> API Keys in Test Mode)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the Backend Server:**
   ```bash
   npx nodemon index.js
   ```
   *(or run with standard Node: `node index.js`)*

   **Expected Console Output:**
   ```text
   Server Started at Port: 7777
   Connection to DB Established
   ```

---

### 3. Frontend Setup

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

   **Expected Console Output:**
   ```text
   VITE ready in ... ms

   ➜  Local:   http://localhost:5173/
   ```

4. **Open the Application:**
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 🛒 Adding Initial Products (Catalog Population)

If your database is empty, you can add products via the `POST /products` endpoint using `curl` or Postman:

```bash
curl -X POST http://localhost:7777/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Noise Cancelling Headphones",
    "description": "High-fidelity audio with active noise cancellation and 30-hour battery life.",
    "price": 2999,
    "category": "Electronics",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "stock": 25
  }'
```

Categories recognized by the UI filter:
- `Electronics`
- `Fashion`
- `Books`
- `Home`

---

## 💳 Testing Razorpay Payments & Retry Flow

The application is integrated with the Razorpay Checkout simulator in test mode.

1. **Sign Up / Log In**:
   - Go to [http://localhost:5173/register](http://localhost:5173/register) and create an account.
2. **Add Items to Cart**:
   - Browse products and click **Add to Cart**.
3. **Checkout**:
   - Navigate to the Cart and click **Checkout**.
   - Enter your delivery address and select **Proceed to Payment**.
4. **Simulate Payment**:
   - **To Test Success**:
     - In the Razorpay modal, select **Card** or **Netbanking / UPI**.
     - Complete the simulator modal with **Success**.
     - The backend verifies the HMAC signature, deducts product stock, empties the cart, and redirects to your order confirmation.
   - **To Test Failure & Retry**:
     - In the Razorpay modal, click the close button `(X)` or simulate **Failure**.
     - The order status will automatically record as `FAILED`.
     - A **Retry Payment** option will be available on the Checkout page and in the **Orders** page (`/orders`), enabling you to resume checkout without rebuilding your cart.

---

## 📡 API Reference Overview

All backend routes are hosted under `http://localhost:7777`.

### Authentication & Profile (`/customers`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register a new customer (`name`, `email`, `password`) | No |
| `POST` | `/customers/login` | Authenticate customer and set HTTP-only cookie | No |
| `POST` | `/customers/logout` | Clear authentication cookie | Yes |
| `GET` | `/customers/profile` | Get logged-in customer details | Yes |

### Products (`/products`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/products` | List products (`?search=`, `?category=`, `?sort=`, `?page=`, `?limit=`) | No |
| `GET` | `/products/:id` | Get details of a single product by ID | No |
| `POST` | `/products` | Create a new product (`name`, `description`, `price`, `category`, `image`, `stock`) | No |

### Shopping Cart (`/cart`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/cart` | Get current customer's cart | Yes |
| `POST` | `/cart` | Add item to cart (`productId`, `quantity`) | Yes |
| `PUT` | `/cart/:productId` | Update item quantity in cart (`quantity`) | Yes |
| `DELETE` | `/cart/:productId` | Remove item from cart | Yes |

### Wishlist (`/wishlist`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `GET` | `/wishlist` | Retrieve all items in the customer's wishlist | Yes |
| `POST` | `/wishlist/:productId` | Add / remove toggle product in wishlist | Yes |

### Orders & Payments (`/orders`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/orders/create-payment-order` | Create Razorpay order and pending DB order record | Yes |
| `POST` | `/orders/verify-payment` | Verify Razorpay HMAC signature and complete order | Yes |
| `POST` | `/orders/payment-failed` | Mark an order as `FAILED` on modal cancellation/error | Yes |
| `GET` | `/orders` | Fetch customer order history | Yes |
| `GET` | `/orders/:id` | Fetch specific order details | Yes |

---

## 🔧 Common Troubleshooting

<details>
<summary><b>1. MongoDB Atlas querySrv ECONNREFUSED or DNS Timeout</b></summary>

Certain ISPs or DNS resolvers fail to resolve MongoDB `mongodb+srv://` connection strings. 
The backend entry point (`index.js`) already includes Google Public DNS servers:
```javascript
dns.setServers(['8.8.8.8', '[2001:4860:4860::8888]']);
```
If you still experience timeouts, ensure your current IP address is whitelisted in your **MongoDB Atlas Network Access** settings (`0.0.0.0/0` for development).
</details>

<details>
<summary><b>2. Razorpay Modal Does Not Open</b></summary>

- Verify that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your `backend/.env` are populated and start with `rzp_test_`.
- Check browser console for network blocks (ad-blockers or firewall rules blocking `https://checkout.razorpay.com/v1/checkout.js`).
</details>

<details>
<summary><b>3. Authentication / Cookie Issues</b></summary>

The backend sends JWT tokens via HTTP-only cookies with `credentials: true`. 
- Ensure the frontend runs on `http://localhost:5173` and backend on `http://localhost:7777`.
- If testing in incognito mode or Safari, ensure third-party cookies or cross-site tracking protections are not blocking localhost cookies.
</details>

<details>
<summary><b>4. Port 7777 or 5173 Already in Use</b></summary>

- On Windows PowerShell:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 7777).OwningProcess | Stop-Process
  ```
- On Linux/macOS:
  ```bash
  lsof -ti:7777 | xargs kill -9
  ```
</details>

---

## 📄 License

This project is licensed under the ISC License.
