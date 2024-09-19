import React from "react";
import { SearchFormProps } from "../SearchForm";
import "./SearchInputs.css";

export const SearchInputs: React.FC<Pick<SearchFormProps, "handleInputChange">> = ({
  handleInputChange,
}) => {
  return (
    <>
      <div className="input-group">
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          onChange={handleInputChange}
          className="input-field"
        />

        <input
          type="text"
          name="keyword"
          placeholder="Search keyword"
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="input-group">
        <input
          type="date"
          name="startDate"
          onChange={handleInputChange}
          className="input-field"
          onClick={(e) => (e.target as HTMLInputElement).showPicker()}
        />
        <input
          type="date"
          name="endDate"
          onChange={handleInputChange}
          className="input-field"
          onClick={(e) => (e.target as HTMLInputElement).showPicker()}
        />
      </div>
    </>
  );
};
