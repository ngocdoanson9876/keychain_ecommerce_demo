// File cart_update_invoice.js
const invoiceSection = document.getElementById("invoice-details"); // Phần thông tin hóa đơn

let total = 0;
// Hàm cập nhật thông tin hóa đơn
function updateInvoice() {
    if (!cart || cart.length === 0) {
        invoiceSection.innerHTML = "<p>Không có sản phẩm nào trong giỏ hàng.</p>";
        return;
    }
    total = 0;
    const invoiceHTML = cart.map((item, index) => { // Thêm index từ map
        const cleanPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        total += item.quantity * cleanPrice;

        return `
            <div class="invoice-card">
                <div class="invoice-card-header">
                    <strong>${item.name}</strong>
                </div>
                <div class="invoice-card-body">
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                    <span class="item-price">${(item.quantity * cleanPrice).toLocaleString("vi-VN")} VND</span>
                </div>
            </div>
        `;
    }).join("");

    invoiceSection.innerHTML = `
        <div class="invoice-container">
            ${invoiceHTML}
        </div>
    `;

    const totalSection = document.getElementById("total-section");
    totalSection.innerHTML = `
        <div class="invoice-total">
            <strong>Tổng cộng:</strong>
            <span>${total.toLocaleString("vi-VN")} VND</span>
        </div>
    `;

    // Gắn sự kiện cho nút tăng/giảm số lượng
    document.querySelectorAll(".increase-quantity").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            updateQuantity(index, 1);
        });
    });

    document.querySelectorAll(".decrease-quantity").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            updateQuantity(index, -1);
        });
    });
}

// Hàm cập nhật số lượng sản phẩm
function updateQuantity(index, delta) {
    const product = cart[index];
    product.quantity = Math.max(1, product.quantity + delta); // Không cho phép số lượng < 1
    localStorage.setItem("cart", JSON.stringify(cart)); // Lưu lại giỏ hàng
    updateInvoice(); // Cập nhật lại hóa đơn
}

// Tải giỏ hàng từ LocalStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = savedCart; // Đồng bộ biến `cart`
    updateInvoice();  // Hiển thị hóa đơn
});

async function generateQRCode() {
    try {
        // Gửi yêu cầu tới server Node.js
        const response = await fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: total }), // Gửi tổng cộng làm `amount`
        })
        const data = await response.json();

        if (data.payUrl) {
            // Chuyển hướng người dùng tới liên kết payUrl
            window.location.href = data.payUrl;
        } else {
            alert('Không thể tạo thanh toán, vui lòng thử lại!');
        }
    } catch (error) {
        console.error('Lỗi khi tạo giao dịch MoMo:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử cần sử dụng
    const payButton = document.getElementById("btn-pay");
    const popup = document.getElementById("success-popup");

    // Hàm hiển thị popup
    function showPopup() {
        popup.classList.add("show"); // Thêm lớp 'show' để hiển thị popup
        setTimeout(() => {
            hidePopup();
        }, 3000); // Tự động ẩn popup sau 3 giây
    }

    // Hàm ẩn popup
    function hidePopup() {
        popup.classList.remove("show"); // Loại bỏ lớp 'show'
    }

    // Xử lý sự kiện khi nhấn nút "Thanh toán"
    payButton.addEventListener("click", function () {
        // Lấy phương thức thanh toán được chọn
        const selectedMethod = document.querySelector(
            'input[name="payment-method"]:checked'
        ).value;

        if (selectedMethod === "cod") {
            // Hiển thị popup nếu chọn COD
            console.log("COD selected: Showing popup...");
            showPopup();
        } else if (selectedMethod === "e-wallet") {
            // Gọi hàm generateQRCode nếu chọn E-Wallet
            console.log("E-Wallet selected: Calling generateQRCode...");
            generateQRCode();
        }
    });
});