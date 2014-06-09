module.exports.nodemailer = {
  from: 'casas@medellinvivelamusica.com',
  host: 'mail.medellinvivelamusica.com',
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS
};
