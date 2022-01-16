const nodemailer = require('nodemailer')

function enviar(to, subject, text) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'bb7a66ebbaac89',
            pass: '2f0fad1eda56be'
        } 
    })

    const mailOption = {
        from: 'programador.8789@gmail.com',
        to,
        subject,
        text,
    }

    transporter.sendMail(mailOption, (err, data) => {
        if(err) console.log(err)
        if(data) console.log(data)
    })
}

module.exports = enviar