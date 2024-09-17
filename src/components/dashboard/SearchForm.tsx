import { SearchParams } from "@/src/hooks/useDashoard";
import React from "react";

interface SearchFormProps {
  searchParams: SearchParams;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  // searchParams,
  handleSearch,
  handleInputChange,
  isLoading,
}) => (
  <form onSubmit={handleSearch} className="mb-6 space-y-4">
    <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma-separated)"
        onChange={handleInputChange}
        className="flex-grow border p-2 rounded"
      />
      <input
        type="text"
        name="keyword"
        placeholder="Search keyword"
        onChange={handleInputChange}
        className="flex-grow border p-2 rounded"
      />
    </div>
    <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
      <input
        type="date"
        name="startDate"
        onChange={handleInputChange}
        className="flex-grow border p-2 rounded"
        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
      />
      <input
        type="date"
        name="endDate"
        onChange={handleInputChange}
        className="flex-grow border p-2 rounded"
        onClick={(e) => (e.target as HTMLInputElement).showPicker()}
      />
    </div>
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
