import express from "express";
import { pool } from "./db.js";
const app = express();

// TODO: hacer un archivo donde tengamos todas las constantes env
// de datos sensibles como la password para la base de datos, el puerto,
// etc. (este archivo se debe poner en el git ignore)
const port = process.env.PORT || 3001;

app.get("/api", (req, res) => {
  //response de prueba
  res.send({
    data: "Hola mundo",
  });
});

//EJEMPLO: exponer los resultados de usuarios
// el json de users que retornamos es temporal, ahí debe ir
// el resultado de una query a la base de datos
app.get("/api/user", (req, res) => {
  res.json({ users: ["user1", "user2", "user3", "user4"] });
});

app.listen(port, () => {
  console.log(`Server at: http://loacalhost:${port}`);
});
