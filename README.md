# SUP_Social_Media
Social Media

npm inti -y
create idex.js file
create server with node and express
create a socialmedia databse in your pgadmin
create a user table with proper coulmn
install pg 
connect to databse
create user schema in postgres
write code in node js to connect to database and print users from tables


19th Dec----

Monolithic  -- total project only one port , one db connection, single repo
MVC - 

app.js,index.js,start.js,server.js -->
routes -- different types of path to handle client communictions
controler --> input validation,modify request,response,
model/service --> bussiness logic (e.g; login)


, Microservcies- diferent port and connection for each individual service

--- user sign up
store credentials in .env file
CRUD operation with user table in index.js file

createuser
updateuser
deleteuser
getalluser
getsingleuserbyid

app.js ---> roues ---> controller ----> model/services
# Auth Api 

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

# Role Task
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    role_id BIGINT REFERENCES ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


1️⃣ Role Table – CRUD Explanation
What is a Role Table?
The role table defines what type of user is using the system and what permissions they have.

#  Roles
Admin
Manager
Employee
User

# Role Table Fields
id
role_name
description
status (active / inactive)
created_at
updated_at

# CRUD Operations

Create Role → Add a new role
Read Role → Get all roles or a single role
Update Role → Modify role name or permissions
Delete Role → Soft delete or deactivate role

# 2️⃣ Authentication APIs – Overview
Authentication verifies who the user is and gives access using a JWT token.

Main APIs:
Register
Login

# 3️⃣ Register API – Explanation
Purpose
Create a new user in the system.
# Flow
Receive user details:
Name
Email
Password
Role
Validate input (backend validation)
Check if email already exists in DB
Hash the password (bcrypt)
Store user details in DB
Set user status as active
Send confirmation / welcome email (optional)
Return success response
# Important Points
Password should never be stored in plain text
Email must be unique
Role must exist in role table

# 4️⃣ Login API – Explanation
Purpose
Authenticate user and issue a JWT token.
Flow
Receive:
Email
Password
Validate input
Check if user exists in DB using email

If user not found → throw error
❌ “Email or password incorrect”
Check user status
If status = false → user is inactive
Compare input password with hashed password
If password mismatch → throw error
If valid → login success
Generate JWT token
Return token and user info

# 5️⃣ JWT Token – Explanation
JWT (JSON Web Token) is used for stateless authentication.

JWT Structure
HEADER.PAYLOAD.SIGNATURE

Header
Contains metadata:
Token type (JWT)
Algorithm used (HS256, RS256)

Payload
Contains user data and claims:
iss – Issuer
sub – User ID
aud – Audience
exp – Expiry time
iat – Issued at
role – User role

Signature
Created using secret key
Ensures token is not tampered

6️⃣ Authentication Flow Using JWT

User logs in
Server generates JWT
Token sent to frontend
Frontend stores token (cookie / localStorage)
Token sent in Authorization Header
Authorization: Bearer <token>
Backend verifies token for protected routes

7️⃣ Error Handling Scenarios

User not found → Email or password incorrect
Password mismatch → Invalid credentials
User inactive → User is inactive
Token expired → Unauthorized

Task ---
implement formot password and reset password
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


sendEmail thorugh nodemailer while successfully registration