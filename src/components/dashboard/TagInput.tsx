import React, { KeyboardEvent, useState } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e && (e.key === "Enter" || e.key === ",")) {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      onChange([...tags, trimmedInput]);
    }
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center border p-2 rounded">
      {tags.map((tag) => (
        <span key={tag} className="bg-gray-200 px-2 py-1 rounded mr-2 mb-2 flex items-center">
          {tag}
          <button onClick={() => removeTag(tag)} className="ml-1">
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Add tags..."
        className="outline-none flex-grow min-w-[100px]"
      />
    </div>
  );
};

export default TagInput;
