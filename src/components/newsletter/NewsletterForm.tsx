import { useNewsletter } from "@src/hooks/newsletter/useNewsletter";

export const NewsletterForm = () => {
  const { email, status, error, setEmail, handleSubmit } = useNewsletter();

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mx-auto max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Pour être informé des nouveautés"
          className={`flex-1 p-2 border rounded-full ${status === "error" ? "border-red-500" : ""}`}
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-full text-white disabled:cursor-not-allowed"
        >
          {status === "loading" ? "..." : "S'inscrire"}
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
