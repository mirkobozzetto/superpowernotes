import { cn } from "@chadcn/lib/utils";
import { useNewsletter } from "@src/hooks/newsletter/useNewsletter";

type NewsletterFormProps = {
  className?: string;
};

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ className }) => {
  const { email, status, error, setEmail, handleSubmit } = useNewsletter();

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-2 mx-auto max-w-md", className)}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email pour vous inscrire  à la newsletter"
          className={cn(
            "flex-1 p-2 border rounded-full",
            status === "error" ? "border-red-500" : "border-gray-200 focus:border-blue-500",
            "outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          )}
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-white",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {status === "loading" ? "..." : "Rejoindre"}
        </button>
      </div>
      <div className="ml-2">
        {status === "success" && (
          <p className="pl-2 text-green-600 text-sm">Merci de votre inscription !</p>
        )}
        {status === "error" && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </form>
  );
};
