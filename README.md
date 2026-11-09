# Instagram AI Agent

The project has two separate applications:

- `Front-End`: React/Vite user interface
- `Back-End`: Express API and optional Instagram/AI integrations

## Run locally

Use Node.js and npm. Install dependencies and start each application in a
separate terminal:

```sh
cd Back-End
npm install
npm start
```

```sh
cd Front-End
npm install
npm run dev
```

The API listens on port `3001` by default, and the UI is available at
`http://localhost:8080`. The Vite development server proxies `/api` requests to
the API.

The API's health endpoint is `http://localhost:3001/api/health`. MongoDB is
optional for the API routes currently used by the UI. Set `MONGODB_URI` in
`Back-End/.env` to enable the database connection. See
[`Back-End/.env.example`](./Back-End/.env.example) for the environment file
format.
