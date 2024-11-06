import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

const baseUrl =
  process.env.NODE_ENV === "production" ? "https://www.superpowernot.es" : "http://localhost:3000";

type AdminEmailTemplateProps = {
  subject: string;
  title: string;
  content: string;
  unsubscribeUrl: string;
};

export const AdminEmailTemplate = ({
  subject,
  title,
  content = "",
  unsubscribeUrl,
}: AdminEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Super Power Notes ✨</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="mx-auto py-10">
          <Section className="border-gray-200 bg-white shadow-lg mx-auto p-10 border rounded-xl max-w-xl">
            <div className="flex items-center gap-4 mb-8">
              <Img src={`${baseUrl}/SPN.png`} width="64" height="64" alt="Super Power Notes" />
            </div>
            <Heading className="mb-6 font-bold text-gray-900 text-xl">{title}</Heading>
            <Section className="mb-8 text-base text-gray-700 leading-relaxed">
              {content.split("\n").map((line, i) => (
                <Text key={i}>{line}</Text>
              ))}
            </Section>
            <Hr className="border-gray-200 my-8 border-t" />
            <Text className="text-gray-500 text-sm">
              Vous recevez cet email car vous êtes inscrit à la newsletter Super Power Notes.
              <br />
              Pour vous désinscrire,{" "}
              <a href={unsubscribeUrl} className="text-blue-600 hover:underline">
                cliquez ici
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default AdminEmailTemplate;
