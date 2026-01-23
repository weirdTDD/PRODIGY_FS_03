import React from "react";
import ProductCollection from "../components/ProductCollection";
import allProducts from "../Assets/all_product";
import { mapLegacyItems } from "../utils/legacyProducts";

const ProductsPage = () => {
  const products = mapLegacyItems(allProducts);

  return (
    <ProductCollection
      title="All Collections"
      description="Explore our full range of thrift finds. Use the filters to narrow by price, size, and name."
      products={products}
    />
  );
};

export default ProductsPage;
