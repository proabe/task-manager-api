const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "abesingh1@gmail.com",
        subject: "Thank you for joining in !",
        text: `Welcome to the app, ${name}. Let me know how you are getting along with the app`
    });
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "abesingh1@gmail.com",
        subject: "Goodbye !",
        html: `<p>Farewell, <h2>${name}</h2> We don't know what went wrong but you can tell us what should we do to improve on 😉😉</p>`
    });
}

module.exports = {sendWelcomeEmail, sendCancelationEmail};