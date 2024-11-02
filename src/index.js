import Server from "./app.js";

const server = new Server();
let app;

// Initialize the app only once
const getApp = async () => {
  if (!app) {
    app = await server.create();
  }
  return app;
};

let handler;

if (process.env.NODE_ENV === "production") {
  // Handler for Vercel
  handler = async function (req, res) {
    const app = await getApp();
    return app(req, res);
  };
} else {
  // For local development
  getApp().then(() => {
    server.start();
  });
}

export default handler;
