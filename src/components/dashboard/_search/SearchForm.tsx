import { SearchParams } from "@src/hooks/useDashoard";
import React from "react";
import { SearchInputs } from "./SearchInputs";

export interface SearchFormProps {
  searchParams: SearchParams;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ handleSearch, handleInputChange, isLoading }) => (
  <form onSubmit={handleSearch} className="mb-6 space-y-4">
    <SearchInputs handleInputChange={handleInputChange} />
    <button
      type="submit"
      className="w-full border font-bold py-2 px-4 rounded mb-4"
      disabled={isLoading}
    >
      Search
    </button>
  </form>
);

export default SearchForm;
