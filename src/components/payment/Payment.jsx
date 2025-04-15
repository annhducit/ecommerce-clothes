import React, { useContext, useEffect, useState } from "react";
import "./Payment.css";
import { ShopContext } from "../context/ShopContext.jsx";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
const Payment = () => {
  const { userId } = useContext(ShopContext);
  const [cartItems, setCartItems] = useState([]);

  const [cartItemTotals, setCartItemTotals] = useState({});
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [paymentMoMo, SetPaymentMoMo] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    country: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "",
  });

  // const navigate = useNavigate();
  // Fetch all cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cart/cart-items/${userId}`
        );
        const jsonData = response.data;
        const cartItemsArray = JSON.parse(jsonData.data);
        setCartItems(cartItemsArray);

        // Calculate individual item totals based on price * quantity
        const totals = {};
        cartItemsArray.forEach((item) => {
          totals[item.cartItemID] = (item.price * item.quantity).toFixed(2);
        });
        setCartItemTotals(totals);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  // Fetch cart total amount
  useEffect(() => {
    const fetchCartTotal = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/cart/total/${userId}`
        );

        if (response.status === 200) {
          const jsonData = response.data;
          // Kiểm tra xem data có phải là một giá trị số hay không
          if (typeof jsonData.data === "string") {
            setCartTotalAmount(parseFloat(jsonData.data) || 0);
          } else if (typeof jsonData.data === "number") {
            setCartTotalAmount(jsonData.data);
          } else {
            // Nếu không phải số hoặc không thể parse, tính tổng từ các sản phẩm
            const total = cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );
            setCartTotalAmount(total);
          }
        }
      } catch (error) {
        console.error("Error fetching cart total:", error);
        // Fallback: tính tổng từ các sản phẩm nếu API gặp lỗi
        const total = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setCartTotalAmount(total);
      }
    };

    if (userId && cartItems.length > 0) {
      fetchCartTotal();
    } else {
      setCartTotalAmount(0); // Reset total when cart is empty
    }
  }, [userId, cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
    if (formData.paymentMethod === "COD") {
      navigate("/orderSuccess");
    }
    try {
      // Gửi yêu cầu thanh toán lên backend
      const paymentResponse = await axios.post(
        `http://localhost:8080/api/orders/${userId}/create-order`,
        {
          userId: userId,
          paymentMethod: formData.paymentMethod.toUpperCase(),
          shippingAddress: formData.address,
          billingAddress: formData.billingAddress,
        }
      );
      console.log(133535);

      // console.log("paymentResponse", paymentResponse);
      // console.log("cartTotalAmount", `${Math.floor(cartTotalAmount)}000`);
      const cartTotalAmountMomo = `${Math.floor(cartTotalAmount) * 24000}`;
      if (paymentResponse.status === 200) {
        if (formData.paymentMethod === "MOMO") {
          // Gọi API MoMo để lấy URL thanh toán
          console.log("2352353");

          const momoResponse = await axios.post(
            `http://localhost:8080/api/momo/${userId}`,
            {
              amount: cartTotalAmountMomo,
            }
          );

          if (cartTotalAmount > 50000000) {
            alert(
              "Số tiền thanh toán vượt quá giới hạn 50,000,000 VND. Vui lòng chọn phương thức khác hoặc giảm số lượng sản phẩm."
            );
            return;
          }

          const momoData = JSON.parse(momoResponse.data.data);
          console.log("momoData", momoData);

          if (momoData.payUrl) {
            window.location.href = momoData.payUrl; // Điều hướng sang trang thanh toán MoMo
            console.log("momoData.payUrl", momoData.payUrl);
          } else {
            alert("Lỗi khi tạo thanh toán MoMo!");
          }
        }
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Thanh toán thất bại, vui lòng thử lại!");
    }
  };

  // Tính tổng số lượng sản phẩm
  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Tính tổng tiền
  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity * 25, 0)
      .toFixed(2)
      .toLocaleString();
  };

  return (
    <div className="payment">
      <div className="delivery-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="section-title">Delivery</h2>

            <div className="input-full">
              <input
                type="text"
                name="country"
                placeholder="Country/Region"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-half">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-half">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-full">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-half">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-half">
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-full">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">Payment</h2>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MOMO"
                  checked={formData.paymentMethod === "MOMO"}
                  onChange={handleChange}
                />
                <div className="payment-label">
                  <div className="payment-icon momo-icon">
                    <span>MO</span>
                    <span>MO</span>
                  </div>
                  <span className="payment-text">
                    Ví điện tử MoMo(****1234)
                  </span>
                </div>
              </label>
            </div>

            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                <div className="payment-label">
                  <div className="payment-icon cod-icon">
                    <span>COD</span>
                  </div>
                  <span className="payment-text">Thanh toán khi nhận hàng</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="complete-order-btn">
            Complete Order
          </button>
        </form>
      </div>

      <div className="payment-right">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="payment-right-children">
              <div className="payment-right-product">
                <img src={item.imageURL} alt={item.productName} />
                <div className="payment-right-product-right">
                  <p>{item.productName}</p>
                </div>
              </div>
              <div className="payment-right-bill-totall">
                <div className="payment-right-bill">
                  <p>Subtotal</p>
                  <p>Quantity</p>
                  <p>Size</p>
                  <p>Shipping</p>
                </div>

                <div className="payment-right-total">
                  <p>
                    {(item.price * item.quantity * 25)
                      .toFixed(2)
                      .toLocaleString()}{" "}
                    đ
                  </p>
                  <p>{item.quantity}</p>
                  <p>{item.size}</p>
                  <p>0%</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart-message">Your cart is empty</div>
        )}

        <div className="payment-right-quanlity payment-right">
          <div className="payment-right-bill">
            <p>Total Quantity</p>
            <p>Total Amount</p>
          </div>
          <div className="payment-right-total">
            <p>{calculateTotalQuantity()}</p>
            <p>{calculateTotalPrice()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
