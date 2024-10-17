const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Serve your static files
app.use(express.static('public'));

app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Replace with your SMTP host
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: "hmdwael744@gmail.com", // Replace with your email
            pass: "Easports2025077@" // Replace with your email password or app-specific password
        }
    });

    // Setup email data
    let mailOptions = {
        from: '"Your Website" <your-email@gmail.com>', // sender address
        to: "your-personal-email@example.com", // list of receivers
        subject: "New Contact Form Submission", // Subject line
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // plain text body
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong> ${message}</p>` // html body
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error: Could not send email');
        } else {
            console.log('Message sent: %s', info.messageId);
            res.status(200).send('Message sent successfully');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
