import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import axios from "axios";

function RecipeTable() {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    calories: "",
    title: "",
    cuisine: "",
    total_time: "",
    rating: "",
  });

  const totalPages = Math.ceil(total / limit);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [totalTimeExpanded, setTotalTimeExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const hasFilters = Object.values(filters).some((val) => val !== "");
      const params = new URLSearchParams({
        page,
        limit,
        ...Object.fromEntries(Object.entries(filters).filter(([_, val]) => val !== ""))
      });

      const endpoint = hasFilters ? "/api/recipes/search" : "/api/recipes";

      try {
        const res = await axios.get(`${endpoint}?${params.toString()}`);
        const data = res.data;
        setRecipes(data.data || []);
        setTotal(data.total || data.data?.length || 0);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
      }
    };

    fetchData();
  }, [page, limit, filters]);

  const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{ color: i < fullStars ? "#f5a623" : "#ddd", fontSize: "1.2em" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const closeDrawer = () => {
    setSelectedRecipe(null);
    setTotalTimeExpanded(false);
  };

  return (
    <>
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: "1rem" }}>RECIPE TABLE</h1>

        
        <SearchForm filters={filters} setFilters={setFilters} setPage={setPage} />

        {/* Results per page dropdown */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="resultsPerPage">Results per page: </label>
          <select
            id="resultsPerPage"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            {[15, 20, 25, 30, 40, 50].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", wordWrap: "break-word" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px", width: "30%", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title="Title">Title</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px", width: "20%", textAlign: "left" }}>Cuisine</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px", width: "15%", textAlign: "center" }}>Rating</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px", width: "15%", textAlign: "center" }}>Total time</th>
              <th style={{ borderBottom: "2px solid #ccc", padding: "8px", width: "20%", textAlign: "center" }}>No. of people Serves</th>
            </tr>
          </thead>
          <tbody>
            {recipes.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center" }}>
                  No recipes found.
                </td>
              </tr>
            ) : (
              recipes.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid #eee", cursor: "pointer" }}
                  onClick={() => setSelectedRecipe(r)}
                  title="Click to view details"
                >
                  <td style={{ padding: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>
                    {r.title}
                  </td>
                  <td style={{ padding: "8px" }}>{r.cuisine}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{renderStars(r.rating)}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{r.total_time}</td>
                  <td style={{ padding: "8px", textAlign: "center" }}>{r.serves}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem", alignItems: "center" }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span>Page {page} of {totalPages || 1}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
        </div>
      </div>

      
      {selectedRecipe && (
        <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: "400px", backgroundColor: "#fff", boxShadow: "-2px 0 5px rgba(0,0,0,0.3)", padding: "1rem 1.5rem", overflowY: "auto", zIndex: 9999 }}>
          <button onClick={closeDrawer} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", position: "absolute", top: "10px", right: "15px" }} aria-label="Close details">×</button>
          <h2>{selectedRecipe.title}</h2>
          <h4 style={{ color: "#555" }}>{selectedRecipe.cuisine}</h4>
          <p><strong>Description:</strong> {selectedRecipe.description || "No description available."}</p>
          <div>
            <strong onClick={() => setTotalTimeExpanded(!totalTimeExpanded)} style={{ cursor: "pointer" }}>
              Total Time: {selectedRecipe.total_time} ▶
            </strong>
            {totalTimeExpanded && (
              <div>
                <div><strong>Cook Time:</strong> {selectedRecipe.cook_time || "N/A"}</div>
                <div><strong>Prep Time:</strong> {selectedRecipe.prep_time || "N/A"}</div>
              </div>
            )}
          </div>
          <div>
            <strong>Nutrition:</strong>
            {selectedRecipe.nutrients ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {Object.entries({
                    Calories: "calories",
                    Carbohydrate: "carbohydrateContent",
                    Cholesterol: "cholesterolContent",
                    Fiber: "fiberContent",
                    Protein: "proteinContent",
                    "Saturated Fat": "saturatedFatContent",
                    Sodium: "sodiumContent",
                    Sugar: "sugarContent",
                    Fat: "fatContent",
                  }).map(([label, key]) => (
                    <tr key={key}>
                      <td style={{ border: "1px solid #ddd", padding: "6px", backgroundColor: "#f9f9f9", fontWeight: "600" }}>{label}</td>
                      <td style={{ border: "1px solid #ddd", padding: "6px", textAlign: "right" }}>{selectedRecipe.nutrients[key] ?? "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p><i>Nutrition info not available.</i></p>
            )}
          </div>
        </div>
      )}
      {selectedRecipe && (
        <div onClick={closeDrawer} style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: "100vw", backgroundColor: "rgba(0,0,0,0.3)", zIndex: 9998 }} aria-hidden="true" />
      )}
    </>
  );
}

export default RecipeTable;