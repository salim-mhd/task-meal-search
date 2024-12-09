import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // states
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const itemsPerPage = 6;

  // fetch API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`
        );
        const result = await response.json();
        setData(result.meals || []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [value]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCardClick = (meal) => {
    setSelectedMeal(meal);
  };

  const closeModal = () => {
    setSelectedMeal(null);
  };

  return (
    <div>
      <h1>Meal Search</h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search Meal"
      />
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="meal-grid">
            {paginatedData.map((meal) => (
              <div
                className="meal-card"
                key={meal.idMeal}
                onClick={() => handleCardClick(meal)}
              >
                <img src={meal.strMealThumb} alt={meal.strMeal} />
                <h2>{meal.strMeal}</h2>
                <p>{meal.strInstructions}</p>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal for Meal Details */}
      {selectedMeal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedMeal.strMeal}</h2>
            <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
            <ul>{selectedMeal.strInstructions}</ul>
          </div>
        </div>
      )}
    </div>
  );
}
