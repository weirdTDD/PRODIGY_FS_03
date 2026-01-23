import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Product } from "../types";
import { useCartStore } from "../store/cartStore";
import { splitOptions } from "../utils/productOptions";
import { getLegacyProductBySlug } from "../utils/legacyProducts";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const product = useMemo(
    () => (slug ? getLegacyProductBySlug(slug) : null),
    [slug]
  );
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const sizeOptions = useMemo(() => splitOptions(product?.size), [product?.size]);
  const colorOptions = useMemo(
    () => splitOptions(product?.color),
    [product?.color]
  );

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
    }
  }, [product]);

  useEffect(() => {
    if (!selectedSize && sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [selectedSize, sizeOptions]);

  useEffect(() => {
    if (!selectedColor && colorOptions.length > 0) {
      setSelectedColor(colorOptions[0]);
    }
  }, [selectedColor, colorOptions]);

  const maxQuantity = product?.stock ? Math.max(product.stock, 1) : 1;
  const canAddToCart = Boolean(
    product && product.isAvailable && product.stock > 0 && selectedSize
  );

  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }

    setIsAdding(true);
    setError(null);

    try {
      addItem({
        _id: `${product._id}-${selectedSize}-${selectedColor || "none"}`,
        product,
        quantity,
        price: product.price,
        size: selectedSize,
        color: selectedColor || undefined
      });
    } catch (err) {
      setError("We couldn't add this item to your cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  if (error && !product) {
    return (
      <div className="container-custom py-12">
        <p className="text-red-600">{error}</p>
        <Link to="/products" className="text-sm text-gray-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/products" className="text-sm text-gray-600 underline">
          Back to products
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="container-custom py-12">
      <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase tracking-widest mb-8">
        <Link to="/products" className="hover:text-black transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                No image available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setActiveImageIndex(index)}
                  className={`aspect-[3/4] rounded-lg overflow-hidden border transition-colors ${
                    index === activeImageIndex
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {product.brand ? `${product.brand} · ` : ""}
              {product.condition} condition
            </p>
            <p className="text-2xl font-semibold text-gray-900 mt-4">
              GH₵ {product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-5">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Stock</span>
              <span>
                {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
              </span>
            </div>

            {sizeOptions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border rounded-full transition-colors ${
                        selectedSize === size
                          ? "border-black text-black"
                          : "border-gray-300 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {colorOptions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Color
                </p>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs uppercase tracking-widest border rounded-full transition-colors ${
                        selectedColor === color
                          ? "border-black text-black"
                          : "border-gray-300 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Quantity
              </p>
              <div className="inline-flex items-center border border-gray-200 rounded-full">
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, prev - 1))
                  }
                  className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(maxQuantity, prev + 1))
                  }
                  className="px-4 py-2 text-sm text-gray-600 hover:text-black"
                  disabled={quantity >= maxQuantity}
                >
                  +
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart || isAdding}
              className="btn btn-primary w-full sm:w-auto"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
            <Link
              to="/cart"
              className="btn btn-outline w-full sm:w-auto text-center"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
