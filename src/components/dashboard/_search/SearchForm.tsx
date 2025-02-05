import { STORAGE_KEY } from "@src/constants/demoConstants";
import { SearchParamsType } from "@src/validations/routes/voiceNoteRoutes";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchInputs } from "./SearchInputs";

export type SearchFormProps = {
  searchParams: SearchParamsType;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
};

export const SearchForm: React.FC<SearchFormProps> = ({
  handleSearch,
  handleInputChange,
  isLoading,
  searchParams,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const savedParams = localStorage.getItem(STORAGE_KEY);
      if (savedParams) {
        const params = JSON.parse(savedParams);
        Object.entries(params).forEach(([name, value]) => {
          if (name !== "startDate" && name !== "endDate") {
            handleInputChange({
              target: { name, value },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        });
      }
    }
  }, [handleInputChange]);

  const handleSubmitWithStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    const { startDate, endDate, ...textParams } = searchParams;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(textParams));
    await handleSearch(e);
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200 border-gray-300 mb-4"
        disabled={isLoading}
      >
        <span className="flex items-center w-4 h-4">
          <Search />
        </span>
        Rechercher dans les notes
      </button>

      {isExpanded && (
        <div className="transition-all duration-200 ease-in-out opacity-100">
          <form onSubmit={handleSubmitWithStorage} className="space-y-4">
            <SearchInputs handleInputChange={handleInputChange} />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
              disabled={isLoading}
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
