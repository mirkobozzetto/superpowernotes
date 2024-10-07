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
      subject: `Sign in to ${host}`,
      html: `
        <body>
          <h1>Welcome to SuperPowerNotes</h1>
          <p>Click the link below to sign in:</p>
          <a href="${url}">Sign In</a>
          <p>If you didn't request this email, you can safely ignore it.</p>
          <a>contatc: bozzettomirko88@gmail.com</a>
        </body>
      `,
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
