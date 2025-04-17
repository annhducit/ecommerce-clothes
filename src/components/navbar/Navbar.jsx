import React, { useContext, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import categoryService from "../../services/categoryService";
import { useQuery } from "@tanstack/react-query";
import { Flex, Input, Menu, Spin } from "antd";

export const Navbar = () => {
    const { searchQuery, handleSearch, userId, addCart, isLoggedIn, userName } =
        useContext(ShopContext);

    const [cart, setCart] = useState(""); // Quản lý menu đang chọn

    const { data: categories, isLoading } = useQuery({
        queryKey: ["/categories/all"],
        queryFn: () => categoryService.getCategories(),
        select: (data) => {
            return data?.data ? JSON.parse(data.data) : null;
        },
    });

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
        <Flex vertical>
            <div className="nav">
                <div className="nav-lerf">
                    <ul className="nav-menu">
                        {isLoading ? (
                            <Spin />
                        ) : (
                            <Menu
                                mode="horizontal"
                                defaultSelectedKeys={["whatever"]}
                            >
                                <Menu.Item key="whatever">
                                    <Link to={`/`}>Whatever</Link>
                                </Menu.Item>
                                <Menu.Item key="shop">
                                    <Link to={`/shop`}>Shop</Link>
                                </Menu.Item>
                                <Menu.Item key="support">
                                    <Link to={`/support`}>Support</Link>
                                </Menu.Item>

                                {categories?.map((category) => (
                                    <Menu.Item key={category.categoryId}>
                                        <Link
                                            to={`/category?p=${category.categoryId}`}
                                        >
                                            {category.categoriesName}
                                        </Link>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        )}
                    </ul>
                </div>

                <div className="nav-right">
                    <Input.Search
                        size="large"
                        placeholder="Tìm kiếm sản phẩm"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <div className="nav-right-login-cart">
                        {isLoggedIn ? (
                            <span className="nav-username">{userName}</span>
                        ) : (
                            <Link
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
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
        </Flex>
    );
};
