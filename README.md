# Room Reservations API

This API allows users to manage room reservations for a coworking space. Users can register, sign in, create, read, update, and delete room reservations. The API also provides endpoints to manage room types, special equipment, and users (admins only).

## Deployed API

- API Endpoint: [roomreservations.azurewebsites.net](https://roomreservations.azurewebsites.net)

## Deployed Web Application

- Web Application: [Smart Coworking](https://smartcoworkinglasti.netlify.app/login)

## Endpoints

### User Registration

- **POST** `/register`: Register a new user. Requires a unique username and a password.

### User Sign-In

- **POST** `/signin`: Sign in a user with a username and password. Returns an authentication token.

### Reservations

- **GET** `/reservasi`: Retrieve all reservations for the authenticated user.
- **GET** `/reservasi/{reservasi_id}`: Retrieve a specific reservation by ID for the authenticated user.
- **POST** `/reservasi`: Create a new reservation for the authenticated user.
- **DELETE** `/reservasi/{reservasi_id}`: Delete a reservation by ID for the authenticated user.

### Room Types

- **GET** `/jenis-ruang`: Retrieve all room types.
- **GET** `/jenis-ruang/{jenis_ruang_id}`: Retrieve a specific room type by ID.
- **POST** `/jenis-ruang`: Create a new room type (admin only).
- **PUT** `/jenis-ruang/{jenis_ruang_id}`: Update a room type by ID (admin only).
- **DELETE** `/jenis-ruang/{jenis_ruang_id}`: Delete a room type by ID (admin only).

### Special Equipment

- **GET** `/peralatan-khusus`: Retrieve all special equipment.
- **GET** `/peralatan-khusus/{id_peralatan}`: Retrieve a specific piece of special equipment by ID.
- **POST** `/peralatan-khusus`: Create a new piece of special equipment (admin only).
- **PUT** `/peralatan-khusus/{id_peralatan}`: Update a piece of special equipment by ID (admin only).
- **DELETE** `/peralatan-khusus/{id_peralatan}`: Delete a piece of special equipment by ID (admin only).

## Authentication

- JWT (JSON Web Tokens) are used for authentication.
- Users need to sign in to obtain an authentication token, which is required for protected endpoints.

## Dependencies

- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python.
- Pydantic: Data validation and parsing using Python type hints.
- Supabase: Used to interact with a Supabase database.
- Passlib: Password hashing and verification.
- HTTPx: An HTTP client for Python.
- jose: JavaScript Object Signing and Encryption for JWT.

## Deployment

The API is currently deployed to [roomreservations.azurewebsites.net](https://roomreservations.azurewebsites.net).

## Usage

To use this API, you can make HTTP requests to the provided endpoints using a tool like `curl` or by integrating it into your web or mobile application.

Please make sure to include the authentication token in the `Authorization` header when making requests to protected endpoints.

## Notes

- The API has an admin user with the username "Admin123" for performing admin-only actions.

Happy coding!
