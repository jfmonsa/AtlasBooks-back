import { transporter } from "../config/mailer.js";

export default async function sendEmail({ toEmail, subject, htmlContent }) {
  await transporter.sendMail({
    from: `"New Email" <${process.env.MAILER_USER}>`,
    to: [toEmail],
    subject,
    html: htmlContent,
  });
}
