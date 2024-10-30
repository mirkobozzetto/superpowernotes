import { SearchParams } from "@src/hooks/useDashoard";
import React from "react";
import { SearchInputs } from "./SearchInputs";

export interface SearchFormProps {
  searchParams: SearchParams;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  handleSearch,
  handleInputChange,
  isLoading,
}) => (
  <form style={{ marginBottom: "-8px" }} onSubmit={handleSearch}>
    <button
      type="submit"
      className="bg-white hover:bg-gray-150 mt-2 mb-2 px-4 py-2 border rounded-full w-full font-bold transition-colors duration-200"
      disabled={isLoading}
    >
      Search
    </button>
    <SearchInputs handleInputChange={handleInputChange} />
  </form>
);
