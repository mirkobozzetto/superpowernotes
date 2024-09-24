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
  <form onSubmit={handleSearch}>
    <button
      type="submit"
      className="w-full border font-bold py-2 px-4 rounded-full mb-2"
      disabled={isLoading}
    >
      Search
    </button>
    <SearchInputs handleInputChange={handleInputChange} />
  </form>
);
