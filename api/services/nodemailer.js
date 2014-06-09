var nodemailer = require('nodemailer');
module.exports = {

  /**
* Sends an email to a given recipient
* @param {object} email an object containing all of the necessary data to email
* @param {Function} cb[err, res] the callback to call once email is sent, or if it fails
*/
  send: function(email, cb){

    /** sets up the modemailer smtp transport */
    // Debug a través de telnet http://technet.microsoft.com/en-us/library/aa995718(v=exchg.65).aspx
    // base64 encoder http://www.motobit.com/util/base64-decoder-encoder.asp
    var transport = nodemailer.createTransport("SMTP", {
      service: 'Gmail',
      //host: sails.config.nodemailer.host,
      debug: true,
      auth: {
        user: sails.config.nodemailer.user,
        pass: sails.config.nodemailer.pass
        }
    });

    /** sets up the mail options, from and such like that **/
    var from = email.from || 'nobody@nobody.com';

    if (sails.config.nodemailer.prepend_subject){
      var subject = sails.config.nodemailer.prepend_subject + email.subject;
    }else{
      var subject = email.subject;
    }

    var mailOptions = {
      from: email.name + '<' + from + '>',
      to: email.to,
      subject: subject,
      html: email.messageHtml
    };

    /** Actually sends the email */
    transport.sendMail(mailOptions, function(err, response){
      sails.log.verbose("MANDANDO EL MAIL");
      if(err) return cb(err);
      return cb(null, response);
    });
  }
};
