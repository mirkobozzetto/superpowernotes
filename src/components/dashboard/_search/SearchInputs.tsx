import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchFormProps } from "./SearchForm";

export const SearchInputs: React.FC<Pick<SearchFormProps, "handleInputChange">> = ({
  handleInputChange,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    handleInputChange({
      target: { name: "startDate", value: update[0] ? update[0].toISOString() : "" },
    } as React.ChangeEvent<HTMLInputElement>);
    handleInputChange({
      target: { name: "endDate", value: update[1] ? update[1].toISOString() : "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="text"
          name="tags"
          placeholder="Search tags (comma-separated)"
          onChange={handleInputChange}
          className="flex-grow border p-2 rounded-full text-center placeholder-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="keyword"
          placeholder="Search keyword"
          onChange={handleInputChange}
          className="flex-grow border p-2 rounded-full text-center placeholder-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full">
        <DatePicker
          selectsRange={true}
          startDate={startDate ?? undefined}
          endDate={endDate ?? undefined}
          onChange={handleDateRangeChange}
          className="w-full border p-2 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          dateFormat="MMM d, yyyy"
          isClearable
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="From - To"
        />
      </div>
    </div>
  );
};
