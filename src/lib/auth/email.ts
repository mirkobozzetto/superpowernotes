import { Resend } from "resend";

const resendClient = new Resend(process.env.AUTH_RESEND_KEY);

interface SendVerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    from: string;
  };
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: SendVerificationRequestParams): Promise<void> {
  const { host } = new URL(url);
  try {
    const result = await resendClient.emails.send({
      from: provider.from,
      to: identifier,
      subject: `Connexion à ${host}`,
      html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Connexion à Super Power Notes</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 20px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px;">
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Bienvenue sur Super Power Notes</h1>
              <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">Cliquez sur le bouton ci-dessous pour vous connecter :</p>
              <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" bgcolor="#3B82F6" style="border-radius: 5px;">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold;">Se Connecter</a>
                  </td>
                </tr>
              </table>
              <p style="color: #999999; font-size: 14px; margin: 30px 0 0 0;">Si vous n'avez pas demandé cet email, vous pouvez l'ignorer.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; font-size: 14px; margin: 0;">Contact : <a href="mailto:support@superpowernot.es" style="color: #3B82F6; text-decoration: none;">support@superpowernot.es</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
