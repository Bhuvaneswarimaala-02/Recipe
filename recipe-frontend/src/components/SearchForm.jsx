import React, { useState, useEffect } from "react";

function SearchForm({ filters, setFilters, setPage }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters); 
  }, [filters]);

  const handleChange = (e) => {
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
    setPage?.(1); 
  };

    const handleClear = () => {
    const emptyFilters = {
      calories: "",
      title: "",
      cuisine: "",
      total_time: "",
      rating: "",
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
    setPage?.(1);
  };

    return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      <input name="title" placeholder="Title" value={localFilters.title} onChange={handleChange} />
      <input name="cuisine" placeholder="Cuisine" value={localFilters.cuisine} onChange={handleChange} />
      <input name="calories" placeholder="Calories (e.g. >=100)" value={localFilters.calories} onChange={handleChange} />
      <input name="total_time" placeholder="Total Time (e.g. <=30)" value={localFilters.total_time} onChange={handleChange} />
      <input name="rating" placeholder="Rating (e.g. >=4.5)" value={localFilters.rating} onChange={handleChange} />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>Clear</button>
      </div>
    </form>
  );
}

export default SearchForm;
