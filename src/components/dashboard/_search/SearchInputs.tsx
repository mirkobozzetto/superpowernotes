import React from "react";
import { SearchFormProps } from "./SearchForm";

export const SearchInputs: React.FC<Pick<SearchFormProps, "handleInputChange">> = ({
  handleInputChange,
}) => {
  return (
    <>
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
    </>
  );
};
