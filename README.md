## Getting started

## To start the server:

1. Make sure you have ruby-3.2.2 installed
2. Make sure you have postgresql installed and running
3. Generate a `master.key` and `credentials.yml.enc` file in the `config` directory
4. Set the ENV variables in the `backend/.env` files. See `backend/.env.example` for reference
5. Bundle gems: `cd backend & bundle`
6. Create and seed the database: `rails db:setup`
7. Start the server: `rails s -p 3000`

## To generate and view api docs:

1. Generate `swagger.yaml`: `SWAGGER_DRY_RUN=0 RAILS_ENV=test rails rswag`
2. Start the server: `rails s -p 3000`
3. Go to `http://localhost:3000/api-docs/index.html`

## To start the frontend:

1. `cd/frontend`
2. `yarn install`
3. `yarn dev`
4. Front-end will start on `http://localhost:4000`