import React from "react";

const SearchBar = () => {
  return (
    <div className="w-1/4">
      <input
        type="text"
        placeholder="Search"
        className="w-full p-2 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring focus:ring-green-400"
      />
    </div>
  );
};

export default SearchBar;
