import axios from "axios";


export const apiaut = axios.create({
    baseURL: "http://localhost:8080/api/auth",
    timeout: 10000, // 10 seconds timeout,
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    },
});
export const registerUser = async (userData) => {
    try {
        const response = await apiaut.post("/register", userData);
        console.log("Đăng ký thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);

        // Create a standardized error object
        let errorMessage = "Có lỗi xảy ra khi đăng ký!";

        if (error.response) {
            console.error("⚠️ Chi tiết lỗi:", error.response.data);
            errorMessage = error.response.data.message || "Lỗi từ server!";
        } else if (error.request) {
            console.error("⚠️ Không nhận được phản hồi từ server");
            errorMessage = "Không thể kết nối đến server!";
        } else {
            console.error("⚠️ Lỗi cấu hình request:", error.message);
            errorMessage = "Có lỗi xảy ra khi gửi yêu cầu!";
        }

        throw new Error(errorMessage);
    }
};



export const loginUser = async (loginData) => {
    try {
        const response = await apiaut.post("/login", loginData);
        if (response.status === 200) {

            return response.data;

        } else {
            alert("Login failed")
        }


    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error);
        if (error.response) {
            console.error("⚠️ Chi tiết lỗi:", error.response.data);
            throw error.response.data || "Có lỗi xảy ra khi đăng nhập!";
        } else if (error.request) {
            console.error("⚠️ Không nhận được phản hồi từ server");
            throw "Không thể kết nối đến server!";
        } else {
            console.error("⚠️ Lỗi cấu hình request:", error.message);
            throw "Có lỗi xảy ra khi gửi yêu cầu!";
        }

    }
};

export const apiCategory = axios.create({
    baseURL: "http://localhost:8080",

});

// Hàm gọi API trả về danh sách danh mục
export const getPopular = async () => {
    try {
        const response = await apiCategory.get("/shop_quanao");  // Đợi dữ liệu trả về
        console.log("✅ Lấy danh mục thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
        throw error;
    }
};
export const getShopcategory = async () => {
    try {
        const response = await apiCategory.get("/api/categories/");  // Đợi dữ liệu trả về
        console.log("✅ Lấy danh mục thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh mục:", error);
        throw error;
    }
};



