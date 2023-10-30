import React, { useState, useEffect } from "react";
import Article from "./Article";

const regions = [
  { name: "Africa" },
  { name: "Antarctic" },
  { name: "Americas" },
  { name: "Asia" },
  { name: "Europe" },
  { name: "Oceania" },
];

export default function Countries() {
  const [searchText, setSearchText] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [countriesData, setCountriesData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");
  const [apiError, setApiError] = useState(null);

  const handleError = (error) => setApiError(error.message);

  useEffect(() => {
    const fetchData = async () => {
      let url = `${process.env.REACT_APP_API_URL}/countries?page=${page}`;
      if (query) {
        url = `${process.env.REACT_APP_API_URL}/countries/${query}?page=${page}`;
      } else if (currentRegion) {
        url = `${process.env.REACT_APP_API_URL}/regions/${currentRegion}?page=${page}`;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await res.json();
        setCountriesData(result);
        setTotalPages(Math.ceil(result.length / 8));
      } catch (error) {
        handleError(error);
      }
    };
    fetchData();
  }, [page, query, currentRegion]);

  const handleSearchCountry = (e) => {
    e.preventDefault();
    setQuery(searchText);
    setCountriesData([]); // Reset data and page to initial state when a new search/filter is performed
    setPage(1);
  };

  const handleFilterByRegion = (e) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    setCurrentRegion(selectedValue);
    setCountriesData([]); // Reset data and page to initial state when a new search/filter is performed
    setPage(1);
  };

  const displayedCountries = countriesData.slice((page - 1) * 8, page * 8);
  return (
    <>
      {apiError && (
        <div className="flex justify-center items-center">
          <div className="bg-teal-500 m-4 p-4 rounded-lg shadow-lg">
            <big className=""> {apiError}</big>
          </div>
        </div>
      )}
      {!countriesData.length ? (
        <div className="flex justify-center items-center">
          <div className="bg-teal-500 m-4 p-4 rounded-lg shadow-lg">
            <big>Loading...</big>
          </div>
        </div>
      ) : (
        <section className="container mx-auto p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <form
              onSubmit={handleSearchCountry}
              autoComplete="off"
              className="max-w-4xl md:flex-1"
            >
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Enter a country name"
                required
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="py-3 px-4 text-gray-700 focus:bg-gray-300 placeholder-gray-900 w-full shadow rounded outline-none dark:text-gray-300 dark:bg-cyan-700 dark:focus:bg-slate-800 dark:placeholder-gray-400 transition-all duration-200"
              />
            </form>
            <form onSubmit={handleFilterByRegion}>
              <select
                name="filter by region"
                id="filter-by-region"
                value={currentRegion}
                onChange={handleFilterByRegion}
                className="md:w-52 py-3 px-4 outline-none shadow rounded text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:bg-cyan-700 dark:hover:bg-slate-800 dark:placeholder-slate-800 transition-all duration-200"
              >
                <option id="default-option" value="">
                  All Regions
                </option>
                {regions.map((region, index) => (
                  <option key={index} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </form>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {displayedCountries.map((country) => (
              <Article key={country.name.common} {...country} />
            ))}
          </div>
          <div className="pagination-controls flex items-center justify-center my-4">
            <button
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2  mr-2 rounded bg-teal-300 border-gray-300 rounded-l text-gray-700 hover:bg-blue-200 disabled:bg-red-500 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 rounded bg-green-400 border-gray-300 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prevPage) => Math.min(prevPage + 1, totalPages))
              }
              disabled={page === totalPages}
              className="px-4 py-2 ml-2 rounded bg-teal-300 border-gray-300 rounded-r text-gray-700 hover:bg-blue-200 disabled:bg-red-500 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
}
