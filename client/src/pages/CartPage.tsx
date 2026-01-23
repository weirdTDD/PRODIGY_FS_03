import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { CartItem, Product } from "../types";

const formatPrice = (amount: number) => `GH₵ ${amount.toFixed(2)}`;

const getProductFromItem = (item: CartItem) => {
  return typeof item.product === "string" ? null : (item.product as Product);
};

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const updateItem = useCartStore((state) => state.updateItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartTotal = useCartStore((state) => state.totalPrice());
  const [error, setError] = useState<string | null>(null);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const total = cartTotal || subtotal;

  const handleUpdateQuantity = async (
    itemId: string,
    nextQuantity: number
  ) => {
    if (!itemId) return;
    setBusyItemId(itemId);
    setError(null);

    try {
      updateItem(itemId, nextQuantity);
    } catch (err) {
      setError("We couldn't update that item. Please try again.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!itemId) return;
    setBusyItemId(itemId);
    setError(null);

    try {
      removeItem(itemId);
    } catch (err) {
      setError("We couldn't remove that item. Please try again.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    setError(null);

    try {
      clearCart();
    } catch (err) {
      setError("We couldn't clear your cart. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif text-gray-900">Your Cart</h1>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
              >
                {isClearing ? "Clearing..." : "Clear cart"}
              </button>
            )}
          </div>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          {items.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">
              <p className="text-sm text-gray-500">
                Your cart is empty. Time to browse new arrivals.
              </p>
              <Link
                to="/products"
                className="inline-block mt-4 text-xs uppercase tracking-widest text-black underline"
              >
                Shop now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const product = getProductFromItem(item);
                const image = product?.images?.[0];
                const maxQuantity = product?.stock ?? 99;
                const disabled = busyItemId === item._id;

                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-6 border border-gray-100 rounded-2xl p-4 sm:p-6"
                  >
                    <div className="w-full sm:w-32 aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={product?.name || "Cart item"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-widest text-gray-500">
                            {product?.category && typeof product.category !== "string"
                              ? product.category.name
                              : "Item"}
                          </p>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {product?.name || "Product"}
                          </h2>
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {item.size}{" "}
                            {item.color ? `· Color: ${item.color}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="inline-flex items-center border border-gray-200 rounded-full">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item._id || "",
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-3 py-1 text-sm text-gray-600 hover:text-black"
                            disabled={disabled || item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item._id || "",
                                Math.min(maxQuantity, item.quantity + 1)
                              )
                            }
                            className="px-3 py-1 text-sm text-gray-600 hover:text-black"
                            disabled={disabled || item.quantity >= maxQuantity}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id || "")}
                          disabled={disabled}
                          className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                        >
                          {disabled ? "Updating..." : "Remove"}
                        </button>
                        {product?.stock !== undefined && product.stock < 5 && (
                          <span className="text-xs text-red-500">
                            Low stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 border border-gray-100 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between text-gray-900 font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className={`btn btn-primary w-full mt-6 text-center ${
              items.length === 0 ? "pointer-events-none opacity-60" : ""
            }`}
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
