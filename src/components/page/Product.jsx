import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductDisplay from "../productDisplay/ProductDisplay";

export const Product = () => {
  const { productId } = useParams(); // 📌 Lấy id từ URL
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/available?page=1&pageSize=10"
        );
        const jsonData = JSON.parse(response.data.data); // 📌 Kiểm tra API trả về
        console.log("json:", jsonData);
        setProducts(jsonData);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Tìm sản phẩm khi products cập nhật
  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find(
        (e) => e.productId === Number(productId)
      );
      setSelectedProduct(foundProduct || null);
    }
  }, [products, productId]);

  return (
    <div className="product">
      {selectedProduct ? (
        <ProductDisplay product={selectedProduct} />
      ) : (
        <p>Không tìm thấy sản phẩm!</p>
      )}
    </div>
  );
};
