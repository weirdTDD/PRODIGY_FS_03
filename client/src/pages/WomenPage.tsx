import ProductCollection from "../components/ProductCollection";
import { getLegacyByCollection } from "../utils/legacyProducts";

const WomenPage = () => {
  const products = getLegacyByCollection("women");

  return (
    <ProductCollection
      title="Women's Collection"
      description="Best picks for women. Filter by price, size, or search by name."
      products={products}
    />
  );
};

export default WomenPage;
