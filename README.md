# E-Commerce API

A production-style RESTful e-commerce backend built with **Node.js, TypeScript, Express 5, PostgreSQL, and Drizzle ORM**.

The project is designed to demonstrate practical backend engineering skills beyond basic CRUD, including authentication, authorization, validation, relational data modeling, inventory management, transactional workflows, and HTTP-level integration testing.

> **API version:** `/api/v1`

## Highlights

- JWT-based authentication and role-based authorization
- User registration and login
- Admin-only product and category management
- Shopping cart and cart-item management
- Order checkout and lifecycle management
- Inventory and stock validation
- Transaction-backed checkout and order cancellation
- Product name and price snapshots in order items
- Zod request validation
- Centralized application error handling
- PostgreSQL relational data modeling
- Modular controller/service/repository architecture
- Integration testing with Vitest and Supertest
- Separate development and test databases
- Reusable test factories and helpers

## Tech Stack

| Area             | Technology         |
| ---------------- | ------------------ |
| Runtime          | Node.js            |
| Language         | TypeScript         |
| Framework        | Express 5          |
| Database         | PostgreSQL         |
| ORM              | Drizzle ORM        |
| Migrations       | Drizzle Kit        |
| Validation       | Zod / drizzle-zod  |
| Authentication   | JWT (`jose`)       |
| Password hashing | bcrypt             |
| Testing          | Vitest / Supertest |
| Security         | Helmet / CORS      |
| Logging          | Morgan             |

## Architecture

The application uses a modular, layered architecture that separates HTTP handling, business rules, and database access.

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
 Middleware
 ┌───┼──────────────┐
 │   │              │
Auth Authorization Validation
     │
     ▼
 Controller
     │
     ▼
  Service
     │
     ▼
 Repository
     │
     ▼
 PostgreSQL
```

Typical feature modules contain:

```text
module/
├── controller
├── service
├── repository
├── routes
├── validator
├── schema
└── types
```

Controllers focus on HTTP concerns, services contain business logic, and repositories isolate database operations.

## Project Structure

```text
.
├── env.ts
├── drizzle.config.ts
├── package.json
├── src/
│   ├── index.ts
│   ├── server.ts
│   ├── db/
│   │   ├── connection.ts
│   │   ├── migrations/
│   │   └── schema/
│   ├── errors/
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── carts/
│   │   ├── categories/
│   │   ├── orders/
│   │   └── products/
│   ├── tests/
│   │   ├── factories/
│   │   ├── helpers/
│   │   └── setup.ts
│   ├── types/
│   └── utils/
└── tsconfig.json
```

## Database Model

The application uses PostgreSQL with relational tables for:

- Users
- Categories
- Products
- Product images
- Carts
- Cart items
- Orders
- Order items
- Addresses
- Order addresses
- Reviews

Important constraints include unique user emails, unique product/category names and slugs, one cart per user, one cart item per product within a cart, non-negative prices and stock, and valid order statuses.

## API Overview

### Authentication

Base path: `/api/v1/auth`

| Method | Endpoint    | Auth   | Description             |
| ------ | ----------- | ------ | ----------------------- |
| POST   | `/register` | Public | Register a customer     |
| POST   | `/login`    | Public | Authenticate a customer |

Protected requests use:

```http
Authorization: Bearer <JWT>
```

The application has two roles:

- `user` — customer access to their own cart and orders
- `admin` — customer access plus product/category administration and order-status management

Users cannot register themselves as administrators.

### Categories

Base path: `/api/v1/categories`

| Method | Endpoint | Role       | Description     |
| ------ | -------- | ---------- | --------------- |
| POST   | `/`      | Admin      | Create category |
| GET    | `/`      | User/Admin | List categories |
| GET    | `/:id`   | User/Admin | Get category    |
| PUT    | `/:id`   | Admin      | Update category |
| DELETE | `/:id`   | Admin      | Delete category |

### Products

Base path: `/api/v1/products`

| Method | Endpoint | Role   | Description    |
| ------ | -------- | ------ | -------------- |
| GET    | `/`      | Public | List products  |
| GET    | `/:id`   | Public | Get product    |
| POST   | `/`      | Admin  | Create product |
| PATCH  | `/:id`   | Admin  | Update product |
| DELETE | `/:id`   | Admin  | Delete product |

Product creation validates name, slug, price, stock, and category ownership.

### Shopping Cart

Base path: `/api/v1/items`

The endpoint represents the authenticated user's cart.

| Method | Endpoint | Role       | Description             |
| ------ | -------- | ---------- | ----------------------- |
| POST   | `/`      | User/Admin | Add product to cart     |
| GET    | `/`      | User/Admin | Get current user's cart |
| PATCH  | `/:id`   | User/Admin | Update item quantity    |
| DELETE | `/:id`   | User/Admin | Remove cart item        |

Cart operations enforce user ownership and available product stock.

Adding the same product again increases its existing cart-item quantity. Updating an item's quantity to `0` removes it.

### Orders

Base path: `/api/v1/orders`

| Method | Endpoint      | Role       | Description                |
| ------ | ------------- | ---------- | -------------------------- |
| POST   | `/`           | User/Admin | Checkout current cart      |
| GET    | `/`           | User/Admin | List current user's orders |
| GET    | `/:id`        | User/Admin | Get an order               |
| PATCH  | `/:id/cancel` | User/Admin | Cancel an order            |
| PATCH  | `/:id/status` | Admin      | Change order status        |

Supported statuses:

```text
pending
processing
shipped
delivered
cancelled
```

Valid workflow:

```text
pending ───────► processing ───────► shipped ───────► delivered
   │                   │
   └────► cancelled ◄──┘
```

Customers can cancel orders while they are `pending` or `processing`. Administrators control order-status changes.

## Checkout Workflow

Checkout is one of the main business workflows in the project.

When a user checks out:

1. The current user's cart is loaded.
2. The cart is validated as non-empty.
3. Product availability is checked.
4. The order total is calculated from current product prices and requested quantities.
5. Order items store product information needed as a historical snapshot.
6. Product stock is decremented.
7. Cart items are removed.
8. The order is returned to the client.

The database changes are performed inside a transaction so that a failure during the workflow rolls back previously completed database changes.

This is also covered by integration tests that intentionally simulate failures and verify rollback behavior.

## Validation and Error Handling

Requests are validated with Zod before reaching controllers.

The API consistently handles:

- Invalid request bodies → `400`
- Invalid UUID parameters → `400`
- Authentication failures → `401`
- Authorization failures → `403`
- Missing resources → `404`
- Business conflicts → `409`
- Unexpected errors → `500`

Application errors use a centralized error handler and return a consistent response shape:

```json
{
  "message": "Error message"
}
```

## Security

The API includes:

- JWT authentication
- Bcrypt password hashing
- Role-based authorization
- Zod input validation
- Helmet security headers
- Configurable CORS
- Centralized error handling
- Separate test and development databases
- Authentication responses that avoid unnecessarily revealing account existence

## Testing

The project uses **Vitest + Supertest** for HTTP-level integration testing.

Tests exercise the actual Express application and test database rather than mocking the entire application.

The suite covers:

- Health endpoint
- Authentication
- Category CRUD operations
- Product CRUD operations
- Cart creation and ownership
- Cart item validation and stock rules
- Order checkout
- Order retrieval
- Order cancellation
- Order status management
- Transaction rollback scenarios
- Authorization and authentication failures
- Invalid request data and resource identifiers

Reusable factories and helpers under `src/tests/factories` and `src/tests/helpers` keep test setup consistent and allow individual tests to focus on behavior.

### Test Commands

```bash
npm test
npm run test:watch
npm run test:coverage
```

The latest recorded test run:

```text
Test Files  17 passed (17)
Tests       137 passed (137)
```

## Getting Started

### Requirements

- Node.js
- npm
- PostgreSQL

Create two PostgreSQL databases:

- One for development
- One for automated tests

### Install

```bash
npm install
```

### Environment Configuration

Create `.env` for development and `.env.test` for tests.

Example:

```dotenv
NODE_ENV=development
APP_STAGE=dev
PORT=3000
HOST=localhost

DATABASE_URL=postgresql://postgres:password@localhost:5432/e_commerce

JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

Do not commit real credentials or secrets.

### Database

After configuring the database:

```bash
npm run db:generate
npm run db:migrate
```

For local development, the current schema can also be pushed directly:

```bash
npm run db:push
```

Open Drizzle Studio with:

```bash
npm run db:studio
```

### Run the API

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Seed Data

Demo data can be generated with:

```bash
npm run db:seed
```

Test seed:

```bash
npm run db:seed:test
```

> Seeding is destructive and should only be used with disposable development/test databases.

## NPM Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start API with Node watch mode |
| `npm start`             | Start API                      |
| `npm test`              | Run tests                      |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Generate test coverage         |
| `npm run db:generate`   | Generate Drizzle migrations    |
| `npm run db:migrate`    | Apply migrations               |
| `npm run db:push`       | Push current schema            |
| `npm run db:studio`     | Open Drizzle Studio            |
| `npm run db:seed`       | Seed development database      |
| `npm run db:seed:test`  | Seed test database             |

## What This Project Demonstrates

This project was built to demonstrate practical backend engineering rather than simply CRUD implementation.

It demonstrates:

- Designing RESTful APIs
- Building modular Node.js applications with TypeScript
- Separating controllers, business logic, and data access
- Modeling relational data with PostgreSQL
- Using an ORM effectively
- Implementing JWT authentication and RBAC
- Validating untrusted input
- Enforcing business rules at the service layer
- Managing inventory and stock
- Designing transactional workflows
- Handling failures and rollback scenarios
- Writing integration tests around real HTTP behavior
- Building reusable test factories and helpers
- Maintaining separate development and test environments

## Future Improvements

Potential next improvements include:

- Pagination, filtering, and product search
- Product image endpoints
- Review endpoints
- Address management
- Refresh-token authentication
- Stronger concurrency protection during checkout
- Docker/Docker Compose
- CI/CD pipeline
- Deployment

## License

This project is released under the **ISC License**.
