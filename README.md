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
## Installation

Install the E-Commerce Project as follows:

* Clone the repo using the following command:
```bash
git clone https://github.com/your-repo/e-commerce-backend.git
cd e-commerce-backend
```
* Install dependencies:
```bash
npm install
```
* Create a ```.env``` file and configure the following environment variables:

```bash
# hsot and port
HOST=http://localhost:5000
PORT=5000

# DB connection info
DB_HOST=''
DB_USERNAME=''
DB_PASSWORD=''
DB_NAME='e_commerce'

# Cookie Secret key
CK = ''
# Session Secret key
SK = ''

# JWT key pairs
# Use openSSL for key generation or you can generate them in a .pem files
PDK = ``        # JWT public Decryption Key
PEK = ``        # JWT private Encryption Key
REFRESH_PDK=``  # Refresh JWT Public Decryption Key
REFRESH_PEK=``  # Refresh JWT Private Encryption Key
```
* Run database migrations:
```bash
npx sequelize-cli db:migrate
```

* run the server:
```bash
node server.js
```
The server will run on ```http://localhost:5000```.

    
## API Documentation
please view the [API Documentation](APIDOCS.md) page.
