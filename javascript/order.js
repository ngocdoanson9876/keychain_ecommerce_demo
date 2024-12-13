const invoiceSection = document.getElementById("invoice-details");
const shippingForm = document.getElementById("shipping-form");

// Giả lập dữ liệu giỏ hàng
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Hiển thị thông tin hóa đơn
function displayInvoice() {
    if (cart.length === 0) {
        invoiceSection.innerHTML = "<p>Không có sản phẩm nào trong giỏ hàng.</p>";
        return;
    }

    let total = 0;
    const invoiceHTML = cart.map((item) => {
        total += item.quantity * parseFloat(item.price.replace(",", ""));
        return `
            <div>
                <strong>${item.name}</strong> (x${item.quantity}) - ${item.price}
            </div>
        `;
    }).join("");

    invoiceSection.innerHTML = `
        <div>
            ${invoiceHTML}
            <hr>
            <strong>Tổng cộng: ${total.toLocaleString("vi-VN")} VND</strong>
        </div>
    `;
}

// Xử lý khi xác nhận thông tin giao hàng
shippingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(shippingForm);
    const shippingInfo = Object.fromEntries(formData.entries());

    console.log("Thông tin giao hàng:", shippingInfo);
    alert("Thông tin giao hàng đã được xác nhận!");
});

// Hiển thị hóa đơn khi tải trang
displayInvoice();
