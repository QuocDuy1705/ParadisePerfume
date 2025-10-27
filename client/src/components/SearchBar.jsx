import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "../assets/styles/searchBar.css";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher des parfums..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <button type="submit" className="search-btn">
        RECHERCHER
      </button>
    </form>
  );
};

export default SearchBar;
