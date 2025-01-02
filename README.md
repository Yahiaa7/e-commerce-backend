
# E-Commerce Backend API with Node.js and MySQL

This project is a robust backend system for an e-commerce platform, designed using Node.js and Express.js, and powered by a MySQL database. It provides a seamless experience for managing users, products, categories, suppliers, advertisements, invoices, and monthly expenses. The backend includes role-based access control (RBAC), secure authentication mechanisms, and a comprehensive API for both the admin dashboard and the client-facing application.

## Features

### Core Functionalities
* User Management: Handle user accounts with roles, authentication, and profile updates.
* Product Management: Manage product details, images, ratings, and categories.
* Supplier Management: Record supplier information for inventory purposes.
* Advertisement Management: Manage and schedule promotional ads for products.
* Invoices and Expenses: Generate invoices for orders and track monthly expenses.
### Security Features
* Role-based access control for different user types.
* Password hashing and secure authentication.
* Input validation and data encryption.
### Database Design
The database is designed with normalization principles, view the following ERD for all details:

![E-Commerce ERD](https://github.com/user-attachments/assets/c03d9143-e8b9-48c3-9b50-5952b992beda)


## Technologies Used

* **Node.js:** JavaScript runtime for building the backend.
* **Express.js:** Framework for API routing and middleware.
* **MySQL:** Relational database for data persistence.
* **Sequelize:** ORM for database migrations and interactions.
* **JWT:** For secure token-based authentication.
* **bcrypt:** For password hashing.

## API Documentation
### API Routes
![image](https://github.com/user-attachments/assets/0196efc0-1d24-4e62-bfb0-799a7745e563)
### Dashboard Routes
### Dashboard Routes Table
| Route                              | Description                                                                                  |
|------------------------------------|----------------------------------------------------------------------------------------------|
| `/dashboard/`                      | Returns the dashboard home page.                                                             |
| `/dashboard/auth/login`            | Login page for dashboard access.                                                             |
| `/dashboard/auth/logout`           | Logout functionality for the dashboard.                                                      |
| `/dashboard/users`                 | View all users (Admin only).                                                                 |
| `/dashboard/users/add`             | Add a new user (Admin only).                                                                 |
| `/dashboard/users/:id`             | View a specific user (Admin only).                                                           |
| `/dashboard/users/update/:id`      | Update a specific user's information (Admin only).                                           |
| `/dashboard/users/setStatus/:id`   | Set the status of a user (Admin only).                                                       |
| `/dashboard/users/delete/:id`      | Delete a user (Admin only).                                                                  |
| `/dashboard/suppliers`             | Manage suppliers (Admin & Store Manager only).                                               |
| `/dashboard/categories`            | Manage categories (Admin & Store Manager only).                                              |
| `/dashboard/products`              | Manage products (Admin & Store Manager only).                                                |
| `/dashboard/ads`                   | Manage advertisements (Admin, Store Manager & Advertising Manager).                          |
| `/dashboard/me`                    | Manage monthly expenses (Admin, Store Manager only).                                         |
| `/dashboard/404`                   | Custom 404 page for invalid dashboard routes.                                                |


