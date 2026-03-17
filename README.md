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
email ,password,confirm password


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

# USER PROFILE & SOCIAL GRAPH – API FEATURES

GET    /api/users/me
PUT    /api/users/me
GET    /api/users/:id
POST   /api/users/follow/:id
POST   /api/users/unfollow/:id
POST   /api/users/block/:id

CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    profile_image TEXT,
    cover_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
1️⃣ GET /api/users/me
✅ Feature

Fetch logged-in user’s own profile
This is used for:
Profile screen
Settings page
Auto-fill edit profile form

🔁 Internal Flow
JWT token is validated
Extract user_id from token
Fetch user + profile data
Return combined response

🗄️ Tables Used

users
user_profiles
user_followers (optional – counts)

📤 Sample Response
{
  "id": 12,
  "email": "user@mail.com",
  "username": "ajit_dev",
  "bio": "Backend Engineer",
  "profile_image": "https://cdn/app/profile.jpg",
  "followers": 120,
  "following": 98
}

🔐 Security
Requires JWT
User can access only their own data
2️⃣ PUT /api/users/me
✅ Feature
Update logged-in user’s profile
Used for:
Edit profile
Change bio, images, username

🔁 Internal Flow
Authenticate user
Validate input (username uniqueness)
Update user_profiles
Update updated_at

🗄️ Tables Used
user_profiles

📥 Request Body
{
  "username": "ajit_backend",
  "bio": "Senior Node.js Developer",
  "profile_image": "https://cdn/new.jpg"
}

🔐 Security
JWT required
Only owner can update profile
Rate limit to prevent abuse

3️⃣ GET /api/users/:id
✅ Feature

View another user’s public profile
Used for:
Viewing other users
Profile screen on search
Followers list click

🔁 Internal Flow
Validate :id
Check block status
Fetch public profile
Hide private fields

🗄️ Tables Used
user_profiles
user_blocks
user_followers

📤 Response (Public)
{
  "user_id": 45,
  "username": "rahul",
  "bio": "Photographer",
  "profile_image": "https://cdn/pic.jpg",
  "is_following": true
}

🔐 Security
Public API (JWT optional)
Respect privacy & block rules

4️⃣ POST /api/users/follow/:id
✅ Feature
Follow another user
Used for:
Building social graph
Feed personalization

🔁 Internal Flow
Authenticate user
Prevent self-follow
Check if already followed
Insert into user_followers


🗄️ Tables Used
user_followers



📌 Example Insert
INSERT INTO user_followers (follower_id, following_id)
VALUES (1, 45);

🔐 Security
JWT required
Prevent duplicate follows

5️⃣ POST /api/users/unfollow/:id
✅ Feature
Unfollow a user

Used for:
Removing connections
Feed recalculation

🔁 Internal Flow
Authenticate user
Validate follow relationship
Delete record

🗄️ Tables Used
user_followers

🔐 Security
JWT required
Only follower can unfollow

6️⃣ POST /api/users/block/:id
✅ Feature
Block a user

Used for:
Safety
Abuse prevention
Privacy control

🔁 Internal Flow
Authenticate user
Insert into user_blocks
Remove follow relationships
Hide content both ways

🗄️ Tables Used
user_blocks
user_followers

📌 Example Logic
DELETE FROM user_followers
WHERE (follower_id = me AND following_id = blocked)
   OR (follower_id = blocked AND following_id = me);

🔐 Security
JWT required
Permanent until unblock


“These APIs together build the social identity layer of the application.”

GET /me → Who am I
PUT /me → Edit myself
GET /:id → Who is this person
follow → Connect
unfollow → Disconnect
block → Protect myself


create Post - image / vedio , captions, tag- userid, location - postid
getmypost by id - 
get all my post-
archive post
delete post


postid - comments,likes,share,save