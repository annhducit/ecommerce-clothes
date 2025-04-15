import React, { useContext, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
export const Navbar = () => {
  const { searchQuery, handleSearch, userId, addCart, isLoggedIn, userName } =
    useContext(ShopContext);

  console.log("isLogger", isLoggedIn);

  const [menu, setMenu] = useState(""); // Quản lý menu đang chọn
  const [cart, setCart] = useState(""); // Quản lý menu đang chọn

  const [categories, setCategories] = useState([]); // Lưu danh sách category từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories/"
        );
        const jsonData = response.data; // API trả về một object
        const categoriesArray = JSON.parse(jsonData.data); // Giải mã chuỗi JSON trong `data`

        setCategories(categoriesArray); // Lưu danh mục vào state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const cartTotl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cart/cart-items/${userId}/quantities`
        );
        const jsonData = response.data;
        console.log("cart", jsonData);

        const cartTotl = JSON.parse(jsonData.data);
        setCart(cartTotl);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    cartTotl();
  }, [addCart]);

  return (
    <div className="nav">
      <div className="nav-lerf">
        <ul className="nav-menu">
          {Array.isArray(categories) &&
            categories
              .filter((category) => category.categoryId <= 6)
              .map((category) => (
                <li
                  key={category.categoryId}
                  onClick={() => setMenu(category.categoriesName)}
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/${category.categoriesName.toLowerCase()}`}
                  >
                    {category.categoriesName}
                  </Link>
                  {menu === category.categoriesName ? <hr /> : null}
                </li>
              ))}
        </ul>
      </div>

      <div className="nav-right">
        <div className="nav-right-input">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          <label htmlFor="search">
            <IoIosSearch size="30px" />
          </label>
        </div>
        <div className="nav-right-login-cart">
          {isLoggedIn ? (
            <span className="nav-username">{userName}</span>
          ) : (
            <Link
              style={{ textDecoration: "none", color: "inherit" }}
              to={"/registerSingin"}
            >
              <FaRegUser fontSize="25px" />
            </Link>
          )}
          <Link
            style={{ textDecoration: "none", color: "inherit" }}
            to={"/cart"}
          >
            <MdOutlineShoppingCart size="30px" />
          </Link>
          <div className="nav-cart-accourt">{cart}</div>
        </div>
      </div>
    </div>
  );
};
