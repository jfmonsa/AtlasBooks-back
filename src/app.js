// import Server from "./app.js";

// const server = new Server();
// let app;

// // initialize app (singleton)
// const getApp = async () => {
//   if (!app) {
//     app = await server.create();
//   }
//   return app;
// };

// // for local development
// if (process.env.NODE_ENV !== "prod") {
//   server.create().then(() => {
//     server.start();
//   });
// }

// // handler for vercel
// export default async function handler(req, res) {
//   const app = await getApp();
//   return app(req, res);
// }
