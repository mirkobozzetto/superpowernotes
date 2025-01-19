import { Button } from "@chadcn/components/ui/button";
import { cn } from "@chadcn/lib/utils";
import { useCopyToClipboard } from "@src/hooks/useCopyToClipboard";
import { Check, Copy } from "lucide-react";

type CopyToClipboardProps = {
  text: string;
  className?: string;
};

export const CopyToClipboard = ({ text, className }: CopyToClipboardProps) => {
  const { copyToClipboard, isCopied, error } = useCopyToClipboard();

  const handleCopy = async () => {
    await copyToClipboard(text);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={cn(
        "flex items-center gap-2 bg-blue-50 border-blue-100 text-blue-400 hover:bg-blue-100 hover:border-blue-200",
        isCopied && "bg-blue-100 text-blue-500 hover:bg-blue-200",
        error && "bg-red-50 text-red-600 hover:bg-red-100 border-red-200",
        className
      )}
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {isCopied ? "Copié!" : "Copier"}
    </Button>
  );
};
