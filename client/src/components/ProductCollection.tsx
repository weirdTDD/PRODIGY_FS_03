import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { splitOptions } from "../utils/productOptions";

type Props = {
  title: string;
  description?: string;
  products: Product[];
};

const ProductCollection = ({ title, description, products }: Props) => {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("price-asc");

  const sizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((product) => {
      splitOptions(product.size).forEach((size) => set.add(size));
    });
    return Array.from(set.values());
  }, [products]);

  const filtered = useMemo(() => {
    const min = minPrice ? Number(minPrice) : undefined;
    const max = maxPrice ? Number(maxPrice) : undefined;
    const query = search.trim().toLowerCase();

    let list = products.filter((product) => {
      if (query && !product.name.toLowerCase().includes(query)) return false;
      if (sizeFilter) {
        const sizeOptions = splitOptions(product.size);
        if (!sizeOptions.includes(sizeFilter)) return false;
      }
      if (min !== undefined && product.price < min) return false;
      if (max !== undefined && product.price > max) return false;
      return true;
    });

    if (sort === "price-asc") {
      list = list.slice().sort((a, b) => a.price - b.price);
    }
    if (sort === "price-desc") {
      list = list.slice().sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, sizeFilter, minPrice, maxPrice, sort]);

  return (
    <section className="py-10">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
              {title}
            </h1>
            {description && (
              <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
                {description}
              </p>
            )}
          </div>

          <div className="text-xs uppercase tracking-widest text-gray-500">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="input"
          />

          <select
            value={sizeFilter}
            onChange={(event) => setSizeFilter(event.target.value)}
            className="input"
          >
            <option value="">All sizes</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <input
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Min price"
            type="number"
            min="0"
            className="input"
          />

          <input
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="Max price"
            type="number"
            min="0"
            className="input"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
          <label className="text-xs uppercase tracking-widest text-gray-500">
            Sort by
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="input max-w-[220px]"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center">
            <p className="text-sm text-gray-500">
              No products match your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filtered.map((product) => {
              const image = product.images?.[0];
              return (
                <Link
                  key={product._id}
                  to={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] tracking-wide text-gray-800 uppercase font-medium group-hover:text-black transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-3 pt-1">
                      <span className="text-sm font-semibold text-black">
                        GH₵ {product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCollection;
