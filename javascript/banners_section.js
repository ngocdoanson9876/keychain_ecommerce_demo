async function loadBanners() {
    try {
        console.log("Bắt đầu tải dữ liệu banners...");

        // Fetch dữ liệu từ JSON
        const response = await fetch("banners.json"); // Đảm bảo đường dẫn đúng
        if (!response.ok) {
            throw new Error(`Lỗi tải file JSON: ${response.statusText}`);
        }

        const bannersData = await response.json();

        // Log dữ liệu đã tải
        console.log("Dữ liệu banner nhận được:", bannersData);

        // Kiểm tra dữ liệu rỗng hoặc không đúng định dạng
        if (!Array.isArray(bannersData) || bannersData.length === 0) {
            console.error("Dữ liệu banner không hợp lệ hoặc rỗng.");
            document.getElementById("banner-carousel").innerHTML = `<p>Không có banner để hiển thị.</p>`;
            return;
        }

        // Hiển thị các banner
        const bannerCarousel = document.getElementById("banner-carousel");
        bannerCarousel.innerHTML = bannersData.map((banner, index) => {
            console.log(`Tải banner ${index + 1}:`, banner);
            return `
                <div class="banner">
                    <img src="${banner.src}" alt="Banner ${banner.id}" onerror="this.style.display='none'">
                </div>
            `;
        }).join("") + `
            <button class="carousel-btn prev-btn">❮</button>
            <button class="carousel-btn next-btn">❯</button>
        `;

        console.log("Tất cả banner đã được hiển thị.");
        initializeCarousel(); // Khởi động carousel
    } catch (error) {
        console.error("Lỗi khi tải banners:", error);
        document.getElementById("banner-carousel").innerHTML = `<p>Không thể tải banner.</p>`;
    }
}

function initializeCarousel() {
    const banners = document.querySelectorAll(".banner");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    let currentIndex = 0;
    let autoSlideInterval;

    // Hiển thị banner hiện tại và ẩn các banner khác
    function updateCarousel() {
        banners.forEach((banner, index) => {
            if (index === currentIndex) {
                banner.classList.add("active"); // Hiển thị banner hiện tại
            } else {
                banner.classList.remove("active"); // Ẩn các banner khác
            }
        });
    }

    // Chuyển đến banner tiếp theo
    function nextSlide() {
        currentIndex = (currentIndex + 1) % banners.length;
        updateCarousel();
    }

    // Chuyển đến banner trước đó
    function prevSlide() {
        currentIndex = (currentIndex - 1 + banners.length) % banners.length;
        updateCarousel();
    }

    // Bắt đầu auto-slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 3000); // Chuyển banner mỗi 5 giây
    }

    // Dừng auto-slide khi người dùng tương tác
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Gắn sự kiện cho nút điều hướng
    nextBtn.addEventListener("click", () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide(); // Khởi động lại auto-slide
    });

    prevBtn.addEventListener("click", () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide(); // Khởi động lại auto-slide
    });

    // Khởi động carousel
    updateCarousel();
    startAutoSlide(); // Bắt đầu tự động chạy
}

// Gọi hàm loadBanners khi trang tải xong
document.addEventListener("DOMContentLoaded", loadBanners);
