import ProductCollection from "../components/ProductCollection";
import { getLegacyByCollection } from "../utils/legacyProducts";

const MenPage = () => {
  const products = getLegacyByCollection("men");

  return (
    <ProductCollection
      title="Men's Collection"
      description="Curated pieces for men. Filter by price, size, or search by name."
      products={products}
    />
  );
};

export default MenPage;
