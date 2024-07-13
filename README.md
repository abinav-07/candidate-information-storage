# READ ME

## INTRODUCTION

The application is built using Next14, express, sequelize ORM, Docker(docker compose), MySQL and node-cache. 

This Readme file will help you in configuring the application.

## CONFIGURATION

This section covers the process for configuring and installing the application packages.

1. Install `docker` in your system.
2. Add `.env` to your `root` directory, It has env.example file, you can copy same values to .env.
3. In root directory, run `docker compose up --build` to run the application for the first time, after that you can simply use `docker compose up` if no new npm packages are installed, node.js port is taken from env, takes some time to build :). `Make sure you have space left in your device for the application to install`
4. You can now access the server in 5000 port for nodejs and 5001 for admin database.
5. You can now access the app in this URL `http://localhost:3000`

## Assumptions
- Availability Start time and end time can have any order i.e start_time > end_time or end_time > start_time.
- Creating candidate profiles with same email will override previous data.

## Future Changes
- Paginations in List Page.
- Display confirmation message on Create candidate page for overriding previously created candidate with same email.
- Redis for caching because of its scalability and data persistance.

## For API Documentation

Open `http://localhost:5000/api/documentation` for APIs documentation.

`NOTE: Seeder is already run along with migrations, so you can login using the admin credentials:`

`Admin Cred: admin@gmail.com admin`

# Database Documentation

Open `http://localhost:5001` for adminer setup. Use the host and username and password from .env file. 

This document provides an overview of the database schema for the system.
Below are the details of the main entities and their relationships within the database.

`NOTE: Every table has timestamps i.e created_at, updated_at and deleted_at for soft delete.`

## Entities and Relationships

### Users and auth related entities

#### roles table

- **id** (Primary Key): Unique identifier.
- **name**: Role type: mentor, student, admin.

#### users table

- **id** (Primary Key): Unique identifier
- **first_name**: User's first name.
- **last_name**: User's last name.
- **email**: The user's email address.
- **password** (Nullable): password of the user if gone through normal registration(not oauth).
- **jwt_token** (Nullable): Jwt Access token to know if the user is logged in currently or not.

#### user_roles table

- **id** (Primary Key): Unique identifier.
- **user_id** (Foreign Key): References `users` table `id` column.
- **role_id** (Foreign Key): References `roles` table `id` column.

#### candidates table

- **id** (Primary Key): Unique identifier
- **added_by** (Foreign Key): Referencing `users` table, admin who added the candidate's information.
- **first_name**: Candidates's first name.
- **last_name**: Candidates's last name.
- **email**: Candidates's email address.
- **free_text**: Candidates's description.
- **phone_number** (Nullable): Candidates's phone number
- **linkedin_url** (Nullable): Candidates's linkedin URL.
- **github_url** (Nullable): Candidates's github URL.
- **availability_start_time** (Nullable): Candidates's availability start time.
- **availability_end_time** (Nullable): Candidates's availability end time.

# Happy Codding!
