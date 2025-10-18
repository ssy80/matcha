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

export const sendActivationEmail = async (recipientEmail, activationUuid) =>
{
    const mailOptions = 
    {
        from: `"No Reply" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: 'Activate Your Account',
        text: `Please activate your account by visiting this link in your web browser: ${process.env.API_HOST_URL}:${process.env.PORT}/api/users/activate?hash=${activationUuid}.`,
        html: `<p>Please activate your account by visiting this link in your web browser : <strong>${process.env.API_HOST_URL}:${process.env.PORT}/api/users/activate?hash=${activationUuid}</strong>.</p>`
    };

    try 
    {
        await transporter.sendMail(mailOptions);
    } 
    catch (error) 
    {
        console.error('Error sending Activation email:', error);
        throw error;
    }
}