import MagicLinkEmail from "@email/emails/MagicLink";
import { render } from "@react-email/render";
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
      html: await render(MagicLinkEmail({ url, host })),
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
