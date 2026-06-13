import React, { useEffect, useState, useRef } from "react";

interface SearchProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  debounceTime?: number;
}

export const Search: React.FC<SearchProps> = ({
  value = "",
  placeholder = "Search...",
  onChange,
  debounceTime = 300,
}) => {
  const [input, setInput] = useState(value);
  const mounted = useRef(false);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (mounted.current) onChangeRef.current(input);
      else mounted.current = true;
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [input, debounceTime]);

  return (
    <div className="relative w-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {input && (
        <button
          type="button"
          onClick={() => setInput("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          ✕
        </button>
      )}
    </div>
  );
};
