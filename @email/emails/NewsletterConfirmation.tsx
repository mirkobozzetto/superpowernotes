import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

const baseUrl =
  process.env.NODE_ENV === "production" ? "https://www.superpowernot.es" : "http://localhost:3000";

export const NewsletterConfirmation = () => (
  <Html>
    <Head />
    <Preview>Bienvenue à la newsletter Super Power Notes</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto py-10">
          <Section className="border-gray-200 bg-white shadow-lg mx-auto p-10 border rounded-xl max-w-xl">
            <div className="flex items-center gap-4">
              <Img src={`${baseUrl}/SPN.png`} width="120" height="120" alt="Super Power Notes" />
              <Heading className="font-bold text-gray-900 text-xl">
                Bienvenue chez Super Power Notes
              </Heading>
            </div>
            <Section className="mt-6 text-gray-700 text-lg leading-relaxed">
              Merci pour votre inscription à notre newsletter.
              <br />
              Vous recevrez désormais nos actualités <br /> et nos meilleures astuces directement
              dans votre boîte mail.
            </Section>
            <Section className="border-gray-200 mt-6 pt-6 border-t">
              <p className="text-gray-600 text-sm">
                Pour gérer vos préférences ou vous désinscrire,{" "}
                <a href="{unsubscribeUrl}" className="font-medium text-blue-600 hover:underline">
                  cliquez ici
                </a>
              </p>
            </Section>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default NewsletterConfirmation;
