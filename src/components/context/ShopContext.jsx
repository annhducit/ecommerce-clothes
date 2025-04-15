import React, { createContext, useState, useEffect } from "react";
import all_data from "../assets/all_data";
import axios from "axios";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < all_data.length; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = ({ children }) => {
  const [cartItem, setCartItem] = useState(getDefaultCart());
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm từ API
  const [addCart, setAddCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Lưu danh sách sản phẩm đã lọc
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  const [cartItemId, setCartItemId] = useState(null); // Lưu ID của người dùng đã đăng nhập

  // Gọi API để lấy danh sách sản phẩm khi component được render lần đầu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/products/available?page=1&pageSize=10"
        );
        const jsonData = JSON.parse(response.data.data); // Chuyển đổi chuỗi JSON thành object
        console.log(response.data);

        setProducts(jsonData); // Lưu danh sách sản phẩm vào state
        setFilteredProducts(jsonData); // Ban đầu hiển thị toàn bộ sản phẩm
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // Lọc sản phẩm khi searchQuery thay đổi
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.productsName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/${userId}`
      );
      const cartData = response.data;
      setCartItem(cartData); // Cập nhật giỏ hàng
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };
  // Hàm xử lý tìm kiếm
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/cart/add", {
        userId: userId,
        productId: productId,
        quantity: 1,
      });
      fetchCart(); // Cập nhật lại giỏ hàng sau khi thêm
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  const removeToCart = async (productId) => {
    if (!userId) return;

    try {
      await axios.post("http://localhost:8080/api/cart/remove", {
        userId: userId,
        productId: productId,
      });
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const removeCartAll = async () => {
    if (!userId) return;

    try {
      await axios.post("http://localhost:8080/api/cart/clear", { userId });
      setCartItem(getDefaultCart());
    } catch (error) {
      console.error("Lỗi khi xóa toàn bộ giỏ hàng:", error);
    }
  };

  const totalCheckOut = () => {
    let total = 0;
    for (let itemId in cartItem) {
      let itemInfo = all_data.find(
        (itemData) => itemData.id === Number(itemId)
      );
      if (itemInfo) {
        total += itemInfo.new_price * cartItem[itemId];
      }
    }
    return total;
  };

  const totalCart = () => {
    return Object.values(cartItem).reduce((sum, quantity) => sum + quantity, 0);
  };

  // Update this function to accept userName as well

  const handleLogin = (id, name) => {
    setUserId(id);
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem("userId", id); // Lưu vào localStorage
  };
  const handleCartItem = (id) => {
    setCartItemId(id);
    fetchCart();
  };

  // Hàm đăng xuất
  const handleLogout = () => {
    setUserId(null);
    setCartItem(getDefaultCart());
  };

  const contextValue = {
    all_data,
    filteredProducts,
    cartItem,
    addToCart,
    removeToCart,
    removeCartAll,
    totalCheckOut,
    totalCart,
    searchQuery,
    handleSearch,
    handleLogin,
    handleLogout,
    handleCartItem,
    userId,
    addCart,
    setAddCart,
    isLoggedIn,
    userName,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
