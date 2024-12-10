# Getting Started

Follow these steps to set up the backend project on your local machine:

## 1. Clone the repository
Clone this repository to your local machine using the following command:

```sh
git clone <REPOSITORY_URL>
cd <PROJECT_NAME>
```

## 2. Install dependencies
Install the dependencies using npm (a migration to pnpm is planned):

```sh
npm install
```

## 3. Set up environment variables
Copy the .env.example file as .env:

```sh
cp .env.example .env
```
Reach out to the project contributors to obtain all the required environment variables and configure them in the .env file.

## 4. Set up the database

1. Create a local PostgreSQL database with a name of your choice.
2. Configure the database connection variables (name, user, password, host, port, etc.) in the .env file.
3. Run the SQL scripts

Execute the SQL scripts located in the db/migrations folder in the following order:

```
0_schema.sql
1_indexes.sql
2_categories_seed.sql
3_books_seed.sql
```

You can use a tool like psql or graphical clients such as DBeaver or pgAdmin to execute the scripts.

## 5. Use the package.json scripts
The project includes several scripts in the `package.json` file. Use the appropriate ones to start the server or run tests:

Start the development server in watch mode:

```sh
npm run dev
```

Format and lint (configured already in pre-push husky hook)

```sh
npm run format
npm run lint
```

Run tests:

```sh
npm run test
```

