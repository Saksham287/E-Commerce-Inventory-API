# E-Commerce Inventory API
**Comprehensive Intern Project Assignment & 10-Day Sprint Schedule**

## 1. Project Overview & Tech Stack
**Objective:** Build a secure, robust RESTful API to manage an online store's product catalog and inventory levels. This project simulates real-world enterprise backend development, focusing on database management, authentication, role-based access control (RBAC), and business logic validation.

**Tech Stack Required:** Python 3.10+, Flask, MySQL, Git, Postman.
**Key Libraries:** 
* `Flask` (Web framework)
* `PyMySQL` or `Flask-SQLAlchemy` (Database connection and ORM)
* `PyJWT` or `Flask-JWT-Extended` (Authentication token generation)
* `werkzeug.security` (Password hashing)
* `Marshmallow` or `Pydantic` (Data validation and serialization)
* `python-dotenv` (Environment variable management)

## 2. Local Development Setup Guide
Before writing code, ensure your environment is configured correctly:
1. **Virtual Environment:** Always use a virtual environment. 
   * `python -m venv venv`
   * Activate: `source venv/bin/activate` (Mac/Linux) or `venv\Scriptsctivate` (Windows).
2. **Requirements:** Maintain a `requirements.txt` file. Run `pip freeze > requirements.txt` before committing.
3. **Environment Variables:** Create a `.env` file at the root (DO NOT commit this to Git). It should contain:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_inventory
   JWT_SECRET_KEY=super_secret_random_string_change_this
   ```

## 3. Database Schema Definitions
You will need to create the following relational tables. Ensure you use appropriate Foreign Key constraints.

### Table: `users`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Unique identifier. |
| `username` | VARCHAR(50) | Unique, Not Null | User's login name. |
| `password_hash` | VARCHAR(255) | Not Null | Hashed password (never plain text). |
| `role` | ENUM | Not Null | Allowed values: `'Admin'`, `'Staff'`. |

### Table: `categories`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Unique identifier. |
| `name` | VARCHAR(100) | Unique, Not Null | e.g., 'Electronics', 'Apparel'. |
| `description` | TEXT | Nullable | Optional details about the category. |

### Table: `products`
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INT | Primary Key, Auto Increment | Unique identifier. |
| `name` | VARCHAR(150) | Not Null | Name of the product. |
| `sku` | VARCHAR(50) | Unique, Not Null | Stock Keeping Unit (e.g., 'MSE-001'). |
| `price` | DECIMAL(10,2) | Not Null, > 0 | Product price. |
| `stock_quantity` | INT | Not Null, >= 0 | Current inventory level. |
| `category_id` | INT | Foreign Key | References `categories(id)`. |
| `is_active` | BOOLEAN | Default: TRUE | Used for "soft deletes". |

## 4. The 10 Core Requirements
1. **Product Resource Management (CRUD):** Implement Create, Read, Update, and Delete functionality for products.
2. **Inventory Tracking Logic:** Maintain the `stock_quantity` field. Handle "Order" requests (decrement stock) and "Restock" requests (increment stock). Prevent negative stock.
3. **Data Validation:** Use Marshmallow to validate incoming JSON (e.g., prices must be > 0, SKU cannot be empty, category_id must exist).
4. **Relational Category System:** Link products to Categories (Many-to-One). Create an endpoint to get all products for a specific category.
5. **Advanced Filtering & Pagination:** `GET /products` must accept query parameters (`?page=1&limit=10&min_price=10&max_price=50`). Do not return the whole database at once.
6. **Soft Deletes:** When a product is deleted, set `is_active = FALSE` instead of dropping the row. `GET /products` should only return active products by default.
7. **Authentication:** Implement `POST /users/register` and `POST /users/login`. Passwords must be hashed using `generate_password_hash`.
8. **Role-Based Access Control (RBAC):** 
   * **Staff:** Can view categories/products and place orders.
   * **Admin:** Can create/update/delete categories/products, and restock.
9. **Global Error Handling:** Use Flask's `@app.errorhandler` to catch 400, 401, 403, 404, and 500 errors and return a standard JSON format: `{"status": "error", "message": "..."}`.
10. **Standardized Documentation:** A professional `README.md` and an exported Postman Collection with saved examples.

## 5. Git & Version Control Workflow
As an intern, practicing standard Git workflows is just as important as writing the code.
* **Branching:** Do not work on `main`. Create feature branches:
  * `git checkout -b feature/user-auth`
  * `git checkout -b feature/product-crud`
* **Commit Messages:** Use descriptive, conventional commits:
  * `feat: added JWT login endpoint`
  * `fix: corrected stock deduction bug`
  * `docs: updated readme with setup instructions`

## 6. System Logic Flows

### Flow A: Authentication & Authorization
1. **Login:** User sends POST to `/users/login` with credentials.
2. **Verification:** API verifies hashed password using `check_password_hash`. Generates a JWT payload: `{"user_id": 1, "role": "Admin", "exp": <timestamp>}`.
3. **Request:** User sends API request with header: `Authorization: Bearer <token>`.
4. **Middleware Check:** Custom `@token_required` decorator decodes token, checks expiration, and validates role before executing the route function.

### Flow B: Inventory "Order" Processing
1. **Request:** Staff sends POST to `/products/<id>/order` with `{"quantity": 2}`.
2. **Validation:** API checks if quantity > 0.
3. **Stock Check:** API queries product. If `requested_quantity > stock_quantity`, return `400 Bad Request: Insufficient stock`.
4. **Transaction:** API deducts quantity, updates database, and returns `200 OK`.

## 7. 10-Day Sprint Schedule

### Week 1: Security Foundation & Infrastructure
* **Day 1: Setup & DB Schema** - Setup venv, `.env`, install libraries, and write SQL scripts/models for Users, Categories, and Products.
* **Day 2: Registration & Hashing** - Build `POST /users/register`. Ensure passwords are saved as hashes.
* **Day 3: Login & JWT** - Build `POST /users/login`. Return a valid JWT upon success.
* **Day 4: Middleware & Decorators** - Create `@admin_required` and `@staff_required` wrappers to protect routes.
* **Day 5: Categories API** - Build `POST /categories` (Admin) and `GET /categories` (Auth). Test middleware. End of week PR/Push.

### Week 2: E-Commerce Logic & Polish
* **Day 6: Products CRUD** - Build `POST`, `PUT`, `DELETE` (Soft Delete) for products. Apply Marshmallow validation.
* **Day 7: Inventory Operations** - Build the `/order` (Staff) and `/restock` (Admin) endpoints. Handle all edge cases (negative stock).
* **Day 8: Pagination & Search** - Upgrade `GET /products` to accept query params (`page`, `limit`, `category_id`, `search`).
* **Day 9: Error Handlers & Refactor** - Implement global JSON error handlers. Clean up code, remove print statements.
* **Day 10: Documentation & Demo** - Finalize `README.md`. Set up Postman Environment variables `{{base_url}}` and `{{jwt_token}}`. Export collection. Present project.

## 8. API Interface Specifications (Inputs & Outputs)

### Users & Auth
**`POST /users/register`** (Public)
```json
// Request
{
  "username": "intern_staff",
  "password": "securepassword123",
  "role": "Staff" // "Admin" or "Staff"
}
// Response (201 Created)
{
  "message": "User registered successfully",
  "user_id": 1
}
```

**`POST /users/login`** (Public)
```json
// Request
{
  "username": "intern_staff",
  "password": "securepassword123"
}
// Response (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### Categories
**`POST /categories`** (Admin Only)
```json
// Request
{
  "name": "Electronics",
  "description": "Gadgets and devices"
}
// Response (201 Created)
{
  "id": 1,
  "name": "Electronics",
  "description": "Gadgets and devices"
}
```

### Products & Inventory
**`POST /products`** (Admin Only)
```json
// Request
{
  "name": "Wireless Mouse",
  "sku": "MSE-001",
  "price": 25.99,
  "stock_quantity": 100,
  "category_id": 1
}
// Response (201 Created)
{
  "id": 101,
  "name": "Wireless Mouse",
  "sku": "MSE-001",
  "price": 25.99,
  "stock_quantity": 100,
  "category_id": 1,
  "is_active": true
}
```

**`GET /products?page=1&limit=10`** (Auth Required)
```json
// Response (200 OK)
{
  "data": [
    {
      "id": 101,
      "name": "Wireless Mouse",
      "sku": "MSE-001",
      "price": 25.99,
      "stock_quantity": 100
    }
  ],
  "pagination": {
    "total_records": 1,
    "current_page": 1,
    "total_pages": 1
  }
}
```

**`POST /products/<id>/order`** (Staff Only)
```json
// Request
{
  "quantity": 2
}
// Response (200 OK)
{
  "message": "Order processed successfully",
  "product_id": 101,
  "quantity_ordered": 2,
  "remaining_stock": 98
}
// Error Response (400 Bad Request)
{
  "status": "error",
  "message": "Insufficient stock. Only 1 item remaining."
}
```
