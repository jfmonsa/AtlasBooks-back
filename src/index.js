import Server from "./app.js";

const server = new Server();
let app;

// Inicializamos la app una sola vez
const getApp = async () => {
  if (!app) {
    app = await server.create();
  }
  return app;
};

// Para desarrollo local
if (process.env.NODE_ENV !== "prod") {
  server.create().then(() => {
    server.start();
  });
}

// Handler para Vercel
export default async function handler(req, res) {
  const app = await getApp();
  return app(req, res);
}
