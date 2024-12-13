// Đường dẫn file JSON
const jsonPath = "products.json";

// Lấy container để render sản phẩm
const productGrid = document.getElementById("product-grid");

// Hàm tải dữ liệu JSON và render sản phẩm
async function loadProducts() {
    const response = await fetch(jsonPath);
    const products = await response.json();

    products.forEach((product) => {
        // Tạo thẻ HTML cho từng sản phẩm
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-name">${product.name}</div>
            <div class="product-id">Mã: ${product.id}</div>
            <div class="product-price">Giá: ${product.price}</div>
            <button class="add-to-cart">+</button>
        `;

        // Thêm sản phẩm vào lưới
        productGrid.appendChild(productCard);
    });
}

// Gọi hàm loadProducts khi tải trang
document.addEventListener("DOMContentLoaded", loadProducts);
