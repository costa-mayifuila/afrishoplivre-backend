// 📁 utils/sendEmail.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📌 Função para enviar e-mails com HTML
const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });
        console.log(`📩 E-mail enviado para ${to}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
};

export default sendEmail;
