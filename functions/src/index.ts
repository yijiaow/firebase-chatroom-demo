const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const config = functions.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailer.gmail_acct,
    pass: config.nodemailer.gmail_pw,
  },
});

export const sendMail = functions.https.onRequest(
  async (req: any, res: any) => {
    cors(req, res, () => {
      const dest = req.body.dest;
      const { sender, channel } = req.body;

      const mailOptions = {
        from: `${sender.name} <${sender.email}>`,
        to: dest,
        subject: "I'M A PICKLE!",
        html: `<p>Your friend ${sender.name} from FireChat has invited you to join ${channel.name}.
          Click the link below to chat!</p>
          <br />
          <a href="http://localhost:3000/channels/${channel.id}">http://localhost:3000/channel/${channel.id}</a>`,
      };

      return transporter.sendMail(mailOptions, (err: any, info: any) => {
        if (err) {
          return res.send(err.toString());
        }

        return res.send('Email sent');
      });
    });
  }
);
