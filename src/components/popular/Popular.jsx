import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Item from "../Item/Item";
import "./Popular.css";
const Popular = () => {
  const { filteredProducts } = useContext(ShopContext);

  return (
    <div className="popular">
      <div className="popular-item">
        {filteredProducts.map((item, i) => (
          <Item
            key={i}
            id={item.productId}
            categoryName={item.categoryName}
            stockQuantity={item.stockQuantity}
            name={item.productsName}
            variant={item.variants?.[4]?.size || "N/A"}
            image={`/${item.images[0].imageUrl}`}
            new_price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
