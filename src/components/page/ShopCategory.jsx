import React, { useEffect, useState } from "react";
import "./Css/ShopCategory.css";
import { ShopContext } from "../context/ShopContext";
import Item from "../Item/Item";
import axios from "axios";
import SalesBanner from "./SalesBanner "; // Import the SalesBanner component

export const ShopCategory = (props) => {
  const [getMenuCategory, setGetMenuCategory] = useState([]);

  useEffect(() => {
    const fetchJsongetMenuCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/available?page=1&pageSize=10"
        );
        const jsonData = response.data; // API trả về một object
        const JsongetMenuCategory = JSON.parse(jsonData.data); // Giải mã chuỗi JSON trong `data`
        console.log("jsonCart1:", JsongetMenuCategory);

        setGetMenuCategory(JsongetMenuCategory); // Cập nhật state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchJsongetMenuCategory();
  }, []);

  return (
    <div className="ShopCategory">
      {/* Replace the static image with our dynamic SalesBanner component */}
      <SalesBanner />

      <div className="ShopCategory-products">
        {getMenuCategory.map((item, i) => {
          if (item.description === props.description) {
            return (
              <Item
                key={i}
                id={item.productId}
                name={item.productsName}
                image={`/${item.images[0].imageUrl}`}
                new_price={item.price}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default ShopCategory;
