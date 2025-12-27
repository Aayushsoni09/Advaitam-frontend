import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import SearchBar from "../components/SearchBar";
import api from "../api/client";
import axios from "axios";

const SEARCH_API = "https://advaitam.monkweb.tech/search";

const Home = () => {
  const [products, setProducts] = useState([]);       // DynamoDB default list
  const [query, setQuery] = useState("");             // Search text
  const [results, setResults] = useState([]);         // OpenSearch results
  const [error, setError] = useState(null);
  const { cart } = useCart();
  const navigate = useNavigate();

  // 1️⃣ Load all products initially (DynamoDB)
  useEffect(() => {
    api.get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
      });
  }, []);

  // 2️⃣ Search products from OpenSearch
  useEffect(() => {
    if (!query.trim()) {
      setResults([]); // reset to show dynamodb results
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${SEARCH_API}?q=${query}`);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Search failed", error);
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  // 3️⃣ Decide what to render (search > fallback)
  const displayProducts =
    results.length > 0
      ? results
      : products.length > 0
      ? products
      : [{
          productId: "sample",
          title: "Sample Product",
          category: "General",
          imageUrl: "https://via.placeholder.com/300x300?text=No+Products",
        }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Advaitam<span className="text-indigo-600">Store</span>
          </h1>

          <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            onClick={() => navigate("/cart")}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
            </svg>
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
              {cart.length}
            </span>
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-5">Featured Collection</h2>

        {/* Search */}
        <SearchBar value={query} onChange={setQuery} placeholder="Search products..." />

        {error && <p className="text-center text-red-500 mb-6">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
