// app.get("/api", (req, res) => {
//   //response de prueba
//   res.send({
//     data: "Hola mundo",
//   });
// });

// //EJEMPLO: exponer los resultados de usuarios
// // el json de users que retornamos es temporal, ahí debe ir
// // el resultado de una query a la base de datos
// app.get("/api/user", (req, res) => {
//   res.json({ users: ["user1", "user2", "user3", "user4"] });
// });

import { Router } from "express";
const router = Router();

//routes here
export default router;
