import { transporter } from "../utils/mailer.js";
import jwt from "jsonwebtoken";

export const sendMail = async (req, res, email, url) => {
  try {
    const { id } = req.user;

    const tokenmail = jwt.sign({ id, email }, process.env.JWT_SECRET, {
      expiresIn: "60m",
    });
    const verficationLink = `http://localhost:5173/${url}/${tokenmail}`;

    await transporter.sendMail({
      from: `"New Email" <${process.env.MAILER_USER}>`,
      to: email,
      subject: "New Email",
      html: `<b>Porfavor presiona en el siguiente link, o copialo en tu navegador para completar la verificación:</b>
             <a href=${verficationLink}>${verficationLink}</a>`,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
      data: err,
    });
  }
};

export const sendMailRecovery = async (req, res, id ,email, url) => {
  try {
    
    const tokenmail = jwt.sign({id ,email }, process.env.JWT_SECRET, {
      expiresIn: "60m",
    });
    
    const verficationLink = `http://localhost:5173/${url}/${tokenmail}`;
    
    await transporter.sendMail({
      from: `"New Email" <${process.env.MAILER_USER}>`,
      to: email,
      subject: "New Email",
      html: `<b>Porfavor presiona en el siguiente link, o copialo en tu navegador para completar la verificación:</b>
             <a href=${verficationLink}>${verficationLink}</a>`,
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
      data: err,
    });
  }
};
