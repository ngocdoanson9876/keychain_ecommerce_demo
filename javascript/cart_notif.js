// File cart_logic.js

let cart = []; // Danh sách sản phẩm trong giỏ hàng
const cartDot = document.getElementById("cart-dot");
const stickyCartDot = document.getElementById("sticky-cart-dot");
const cartContainers = document.querySelectorAll(".cart-container");
const popupNotification = document.getElementById("popup-notification");

let products = []; // Mảng chứa dữ liệu sản phẩm

// Tải dữ liệu từ file JSON
fetch("products.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Không thể tải file JSON");
        }
        return response.json();
    })
    .then((data) => {
        products = data; // Gán dữ liệu vào mảng
    })
    .catch((error) => {
        console.error("Lỗi:", error);
    });

// Thêm sản phẩm vào giỏ hàng
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
        const productCard = e.target.closest(".product-card");
        const productId = productCard.querySelector(".product-id").innerText.split(": ")[1];
        const productName = productCard.querySelector(".product-name").innerText;
        const productPrice = productCard.querySelector(".product-price").innerText;

        // Kiểm tra sản phẩm đã tồn tại
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
            // Thông báo nếu sản phẩm đã có trong giỏ hàng
            showPopup(`Sản phẩm với mã ${productId} đã có trong giỏ hàng.`);
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });

            // Hiển thị popup thành công
            showPopup(`Thêm sản phẩm \"${productName}\" (Mã: ${productId}) thành công`);

            // Hiển thị chấm đỏ trên cả hai thanh
            cartDot.style.display = "inline-block";
            cartDot.classList.add("active");
            stickyCartDot.style.display = "inline-block";
            stickyCartDot.classList.add("active");
        }

        // Lưu giỏ hàng vào LocalStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    }
});

// Ẩn chấm đỏ khi bấm vào giỏ hàng
cartContainers.forEach((cart) => {
    cart.addEventListener("click", () => {
        cartDot.style.display = "none";
        stickyCartDot.style.display = "none";
        cartDot.classList.remove("active");
        stickyCartDot.classList.remove("active");
    });
});

// Hàm hiển thị popup
function showPopup(message) {
    popupNotification.innerText = message; // Gán nội dung thông báo
    popupNotification.style.display = "block"; // Hiển thị popup
    popupNotification.classList.add("active");

    // Ẩn popup sau 3 giây
    setTimeout(() => {
        popupNotification.style.display = "none";
        popupNotification.classList.remove("active");
    }, 3000);
}
