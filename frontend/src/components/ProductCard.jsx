import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {

    const { addToCart } = useCart();

  return (
    <div
          key={product.productId}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
        >
          {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-48 w-full object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=No+Image";
            }}
          />

          {/* Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {product.title}
          </h3>

          {/* Category */}
          <p className="text-xs text-gray-500 mt-1">
            {product.category}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4">
            {/* Placeholder price (if not available yet) */}
            <span className="text-lg font-bold text-indigo-600">
              ₹{product.price ?? 991}
            </span>

            <button
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
  );
};

export default ProductCard;