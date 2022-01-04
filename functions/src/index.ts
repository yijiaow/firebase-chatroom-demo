const serviceAccount = require('../firechat-service-account.json');
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const config = functions.config();

const generateToken = async (userId: string, channelId: string) => {
  const additionalClaims = { channelId };

  return await admin.auth().createCustomToken(userId, additionalClaims);
};

// const generateEmailLink = async (email: string, channelId: string) => {
//   const actionCodeSettings = {
//     url: `http://localhost:3000/channels/${channelId}`,
//     handleCodeInApp: true,
//   };

//   return await admin
//     .auth()
//     .generateSignInWithEmailLink(email, actionCodeSettings);
// };

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailer.gmail_acct,
    pass: config.nodemailer.gmail_pw,
  },
});

const sendOneMail = async (
  dest: string,
  sender: { email: string; name: string },
  channel: { id: string; name: string }
) => {
  const token = await generateToken(dest, channel.id);

  const mailOptions = {
    from: `${sender.name} <${sender.email}>`,
    to: dest,
    subject: "I'M A PICKLE!",
    html: `<p>Your friend ${sender.name} from FireChat has invited you to join ${channel.name}.
          Click the link below to chat!</p>
          <br />
          <a href="http://localhost:3000/channels/${channel.id}?token=${token}">http://localhost:3000/channel/${channel.id}</a>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return reject(err);

      resolve(info);
    });
  });
};

export const sendMails = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { invites, sender, channel } = req.body;

    try {
      await Promise.all(
        invites.map(async (dest: string) => {
          await sendOneMail(dest, sender, channel);
        })
      );
      res.status(200).send('Invites sent');
    } catch (err) {
      res.status(500).send(err);
    }
  });
});
