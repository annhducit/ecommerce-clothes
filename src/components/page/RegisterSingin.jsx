import React, { useState } from "react";
import "./Css/RegisterSingin.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from "../utils/apiFunction";

export const RegisterSingin = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook để chuyển trang

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userData = {
      userName,
      password,
      firstName,
      lastName,
      phoneNumber,
      authProvider: "USER_NAME",
    };

    try {
      const data = await registerUser(userData);
      console.log("✅ Đăng ký thành công:", data);
      alert("🎉 Đăng ký thành công!");
      navigate("/loginSingup"); // Chuyển hướng sau khi đăng ký thành công
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      setError("Đăng ký thất bại! Vui lòng thử lại."); // Hiển thị lỗi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Register</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? "Registering..." : "Continue"}
          </button>
        </form>

        <div className="social-divider">
          <span>Already have an account? </span>
          <Link to={"/loginSingup"}>Login now</Link>
        </div>
      </div>
    </div>
  );
};
