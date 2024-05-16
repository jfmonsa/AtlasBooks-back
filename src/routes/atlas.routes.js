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
import { Router } from 'express';
import { register, login } from "../controllers/atlas.controller.js";
import { current_user, change_password } from '../controllers/myaccount.controller.js';

const router = Router();

router.post('/register', register)
router.post('/login', login)

//myaccount routes
router.get('/myaccount/current-user', current_user); // /api/current-user
router.post('/myaccount/change-password', change_password);   // /api/change-password

//routes here
export default router;
