import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});


export const sendResetEmail = async (recipientEmail, resetUuid) =>
{
    const mailOptions = {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Reset your login password',
        text: `Please reset your login password by visiting this link in your web browser: ${process.env.FRONTEND_HOST_URL}:${process.env.FRONTEND_HOST_PORT}/users/reset_password?reset_uuid=${resetUuid}.`,
        html: `<p>Please reset your login password by visiting this link in your web browser : <strong>${process.env.FRONTEND_HOST_URL}:${process.env.FRONTEND_HOST_PORT}/users/reset_password?reset_uuid=${resetUuid}</strong>.</p>`
    };

    try{
        await transporter.sendMail(mailOptions);
    } 
    catch (error){
        console.error('Error sending reset password email:', error);
        throw error;
    }
}


export const sendActivationEmail = async (recipientEmail, activationUuid) =>
{
    const mailOptions = {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Activate Your Account',
        text: `Please activate your account by visiting this link in your web browser: ${process.env.FRONTEND_HOST_URL}:${process.env.FRONTEND_HOST_PORT}/users/activate?activation_uuid=${activationUuid}.`,
        html: `<p>Please activate your account by visiting this link in your web browser : <strong>${process.env.FRONTEND_HOST_URL}:${process.env.FRONTEND_HOST_PORT}/users/activate?activation_uuid=${activationUuid}</strong>.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } 
    catch (error){
        console.error('error sendActivationEmail: ', error);
        throw error;
    }
}
