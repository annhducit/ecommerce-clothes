import React, { useState, useEffect } from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (prop) => {
  const [salePrice, setSalePrice] = useState(0);

  useEffect(() => {
    // Generate a random discount between 10% and 30%
    const discountPercent = Math.floor(Math.random() * 21) + 10; // 10-30%
    const calculatedSalePrice = (
      ((prop.new_price * (100 - discountPercent)) / 100) *
      25
    ).toFixed(2);
    setSalePrice(calculatedSalePrice);
  }, [prop.new_price]);

  return (
    <div className="item">
      <Link to={`/product/${prop.id}`}>
        <img
          style={{ width: "250px", height: "200px" }}
          src={prop.image}
          alt=""
        />
      </Link>
      <p>{prop.name}</p>
      <div className="item-prices">
        <div className="item-prices-old">
          <p>{(prop.new_price * 25).toLocaleString()}đ</p>
        </div>
        <div className="item-prices-new">
          <p style={{ fontWeight: "600", color: "#ff0000" }}>{salePrice} đ</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
