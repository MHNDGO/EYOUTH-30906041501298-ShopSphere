const nodemailer = require('nodemailer');

function buildTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  // Dev/test fallback: does not actually send over the network,
  // just returns a serialized message so callers get a usable result.
  return nodemailer.createTransport({ jsonTransport: true });
}

async function sendWelcomeEmail(to, name) {
  const transport = buildTransport();
  const info = await transport.sendMail({
    from: 'no-reply@ecommerce-platform.local',
    to,
    subject: 'Welcome to the store!',
    text: `Hi ${name}, thanks for signing up!`,
    html: `<p>Hi ${name},</p><p>Thanks for signing up to our store.</p>`,
  });
  return info;
}

module.exports = { sendWelcomeEmail };
