import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { Tailwind } from "@react-email/tailwind";

interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export const MagicLinkEmail = ({ url, host }: MagicLinkEmailProps) => (
  <Html>
    <Head>
      <title>Connexion à Super Power Notes</title>
    </Head>
    <Preview>Connectez-vous à Super Power Notes</Preview>
    <Tailwind>
      <Body className="bg-gray-100 m-0 p-0 font-sans">
        <Container className="py-5 w-full">
          <Section className="bg-white shadow-sm mx-auto rounded-lg max-w-[600px] overflow-hidden">
            <Section className="px-8 py-10 text-center">
              <Text className="m-0 mb-5 font-bold text-2xl text-gray-800">
                Bienvenue sur Super Power Notes
              </Text>
              <Text className="mb-8 text-base text-gray-600">
                Cliquez sur le bouton ci-dessous pour vous connecter :
              </Text>
              <Button
                href={url}
                className="inline-block bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded font-bold text-white no-underline"
              >
                Se Connecter
              </Button>
              <Text className="mt-8 mb-0 text-gray-400 text-sm">
                {`Si vous n'avez pas demandé cet email, vous pouvez l'ignorer.`}
              </Text>
            </Section>
            <Section className="bg-gray-50 p-6 text-center">
              <Text className="m-0 text-gray-400 text-sm">
                Contact :{" "}
                <Link
                  href="mailto:support@superpowernot.es"
                  className="text-blue-500 hover:underline no-underline"
                >
                  support@superpowernot.es
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default MagicLinkEmail;
