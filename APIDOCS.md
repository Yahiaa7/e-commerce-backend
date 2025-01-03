here is the list of the User types with their corresponding premissions:
### Permissions Table
| Role                	| Access Area   | Permissions                                                                                  |
|-----------------------|---------------|----------------------------------------------------------------------------------------------|
| Admin          	| API/Dashboard | Full access to all resources and routes, including user management.                          |
| Store Manager  	| API/Dashboard | Manage suppliers, categories, products, monthly expenses, and advertisements. No user access.|
| Advertising Manager 	| API/Dashboard | View and manage advertisements only.                                                         |
| User           	| API           | Access public product information, rate, and purchase products. Cannot access the dashboard. |


here is the list of the ```/api``` routs along with ```/dashboard``` routes:

### API Routes Table
| Route                              | Method | Description                                                                                  |
|------------------------------------|--------|----------------------------------------------------------------------------------------------|
| `{{host}}/auth/signUp`             | POST   | User registration.                                                                           |
| `{{host}}/auth/signIn`             | POST   | User login and JWT generation.                                                               |
| `{{host}}/auth/refreshToken`       | POST   | Refresh JWT token.                                                                           |
| `{{host}}/auth/signout`             | POST   | User logout and session invalidation.                                                        |
| `{{host}}/users`                   | GET    | Retrieve all users (Admin only).                                                             |
| `{{host}}/users/:id`               | GET    | Retrieve specific user by ID.                                                                |
| `{{host}}/users/:id`               | PUT    | Update a user by ID.                                                                         |
| `{{host}}/users/:id`               | DELETE | Delete a user by ID.                                                                         |
| `{{host}}/categories`              | GET    | Retrieve all categories.                                                                     |
| `{{host}}/products`                | GET    | Retrieve all products.                                                                       |
| `{{host}}/products/rate`           | POST   | Rate a product.                                                                              |
| `{{host}}/products/buy`            | POST   | Purchase a product.                                                                          | 
| `{{host}}/products/popular`        | GET    | View popular products.                                                                       |
| `{{host}}/products/:id`            | GET    | Retrieve product details by ID.                                                              | 
| `{{host}}/invoices`                | GET    | Retrieve all invoices (Admin only).                                                          |
| `{{host}}/invoices/:id`            | GET    | Retrieve a specific invoice by ID.                                                           |


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
| `/dashboard/suppliers`             | Manage suppliers (Store Manager only).                                                       |
| `/dashboard/categories`            | Manage categories (Store Manager only).                                                      |
| `/dashboard/products`              | Manage products (Store Manager only).                                                        |
| `/dashboard/ads`                   | Manage advertisements (Advertising Manager and Store Manager).                               |
| `/dashboard/me`                    | Manage monthly expenses (Store Manager only).                                                |
| `/dashboard/404`                   | Custom 404 page for invalid dashboard routes.                                                |
