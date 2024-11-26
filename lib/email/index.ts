import nodemailer from "nodemailer";

export async function sendResetPasswordEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    from: process.env.EMAIL_FROM || "no-reply@jeff-dev.fr",
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "no-reply@votresite.com",
    to,
    subject,
    text,
    html,
  });
}
export function generateResetPasswordEmail(resetUrl: string): {
  text: string;
  html: string;
} {
  const text = `Bonjour,

      Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :

      ${resetUrl}

      Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.

      Cordialement,
      L'équipe`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Réinitialisation de votre mot de passe</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="padding: 40px 30px; background-color: #1f2937; text-align: center;">
            <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Réinitialisation de votre mot de passe</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">Bonjour,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder à la réinitialisation :</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-bottom: 20px;">Veuillez noter que ce lien est valide pendant 1 heure seulement.</p>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center">
                  <a href="${resetUrl}" style="display: inline-block; background-color: #1f2937; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 12px 30px; border-radius: 5px; text-transform: uppercase;">Réinitialiser mon mot de passe</a>
                </td>
              </tr>
            </table>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail.</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 30px;">Cordialement,<br>L'équipe</p>
            <p style="font-size: 14px; line-height: 1.6; color: #333; margin-top: 30px;">Si le bouton ne s'affiche pas correctement, veuillez cliquer sur le lien suivant : <a href="${resetUrl}" style="color: #1f2937;">${resetUrl}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 30px; background-color: #f8f8f8; text-align: center; font-size: 14px; color: #888;">
            <p style="margin: 0;">Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { text, html };
}

export function generateWelcomeEmail(username: string): {
  text: string;
  html: string;
} {
  const text = `Bonjour ${username}, bienvenue sur notre site !`;
  const html = `<p>Bonjour ${username}, bienvenue sur notre site !</p>`;

  return { text, html };
}
