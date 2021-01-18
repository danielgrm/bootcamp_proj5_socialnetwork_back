
const sgMail = require('@sendgrid/mail');
const config = require('config')

function send_mail(usuario){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || config.get("SENDGRID_API_KEY"));
    const msg = {
    to: usuario.email,
    from: 'webmarter@socialnetwork.com',
    subject: 'Cadastro Realizado',
    text: 'Seu cadastro foi realizado com sucesso.',
    html: `<h1>Seja bem-vindo,  ${usuario.name}</h1>
    <br/>
    <p>Obrigado por cadastrar-se em mais essa rede social inútil. :)</p>`,
    };

    sgMail
    .send(msg)
    .then(() => {}, error => {
        console.error(error);

        if (error.response) {
        console.error(error.response.body)
        }
    });
}

module.exports = send_mail