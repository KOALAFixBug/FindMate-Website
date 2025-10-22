// Biến toàn cục cho slideshow, vì nó được gọi bởi onclick trong HTML
let slideIndex = 1;

// Hàm xử lý slideshow (để ở phạm vi toàn cục)
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("hero-slide");
    // Nếu không có slide (ví dụ ở trang con), thì không làm gì cả
    if (slides.length === 0) return;
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slides[slideIndex-1].style.display = "block";
}

// Hàm cập nhật ngôn ngữ (để ở phạm vi toàn cục để script.js của các trang con có thể gọi)
function updateLang(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    
    // Ẩn/hiện các span [lang="vi"] và [lang="en"]
    document.querySelectorAll('[lang="vi"]').forEach(el => {
        // Xác định kiểu hiển thị (block cho các thẻ li, p, h, label, button)
        const displayType = (el.tagName === 'LI' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'LABEL' || el.tagName === 'BUTTON') ? 'block' : 'inline-block';
        el.style.display = (lang === 'vi') ? displayType : 'none';
    });
    document.querySelectorAll('[lang="en"]').forEach(el => {
        const displayType = (el.tagName === 'LI' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' || el.tagName === 'H4' || el.tagName === 'LABEL' || el.tagName === 'BUTTON') ? 'block' : 'inline-block';
        el.style.display = (lang === 'en') ? displayType : 'none';
    });

    // Cập nhật text nút
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) langToggle.textContent = (lang === 'vi') ? 'EN' : 'VI';

    // Xử lý các input (vì chúng không dùng span)
    // 1. Input của Newsletter
    const newsletterInputVi = document.querySelector('.newsletter-form input[lang="vi"]');
    const newsletterInputEn = document.querySelector('.newsletter-form input[lang="en"]');
    if (newsletterInputVi) newsletterInputVi.style.display = (lang === 'vi') ? 'block' : 'none';
    if (newsletterInputEn) newsletterInputEn.style.display = (lang === 'en') ? 'block' : 'none';
    
    // 2. Nút của Newsletter
    const newsletterBtnVi = document.querySelector('.newsletter-form button[lang="vi"]');
    const newsletterBtnEn = document.querySelector('.newsletter-form button[lang="en"]');
    if (newsletterBtnVi) newsletterBtnVi.style.display = (lang === 'vi') ? 'inline-block' : 'none';
    if (newsletterBtnEn) newsletterBtnEn.style.display = (lang === 'en') ? 'inline-block' : 'none';

    // 3. Input của Search Bar
    const searchInputVi = document.getElementById('search-bar');
    const searchInputEn = document.getElementById('search-bar-en');
    if (searchInputVi) searchInputVi.style.display = (lang === 'vi') ? 'block' : 'none';
    if (searchInputEn) searchInputEn.style.display = (lang === 'en') ? 'block' : 'none';
    
    // Xử lý riêng các thẻ P, H1, H2, H3, H4, LABEL, BUTTON (nếu chúng không có span con)
    // Điều này rất quan trọng cho các trang con (faq, contact...)
    document.querySelectorAll('p[lang], h1[lang], h2[lang], h3[lang], h4[lang], label[lang], button[lang]').forEach(el => {
        // Kiểm tra xem nó có span con không
        if (!el.querySelector('span[lang]')) {
            el.style.display = (el.getAttribute('lang') === lang) ? 'block' : 'none';
        }
    });
}


// Chạy tất cả logic sau khi trang đã tải
document.addEventListener('DOMContentLoaded', () => {
    
    const html = document.documentElement;
    
    // --- 1. Dark Mode Toggle ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeIcon = darkModeToggle.querySelector('i');
    
    // Kiểm tra theme đã lưu
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        html.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        if (html.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    // --- 2. Language Toggle ---
    const langToggle = document.getElementById('lang-toggle');
    
    // Kiểm tra ngôn ngữ đã lưu
    let currentLang = localStorage.getItem('lang') || 'vi'; // Mặc định là 'vi'
    updateLang(currentLang); // Cập nhật ngôn ngữ khi tải trang

    langToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'vi') ? 'en' : 'vi';
        localStorage.setItem('lang', currentLang);
        updateLang(currentLang);
        
        // Đồng bộ hóa thanh tìm kiếm (nếu có) khi đổi ngôn ngữ
        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
            const searchBarEn = document.getElementById('search-bar-en');
            if (currentLang === 'vi') {
                searchBar.value = searchBarEn.value;
            } else {
                searchBarEn.value = searchBar.value;
            }
            // Kích hoạt lại bộ lọc sau khi đổi ngôn ngữ
            searchBar.dispatchEvent(new Event('keyup'));
        }
    });
    
    // --- 3. Mobile Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Đóng menu khi click vào 1 link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Chỉ đóng menu nếu click vào link anchor (#) trên cùng trang
            if (link.getAttribute('href').startsWith('#')) {
                navLinks.classList.remove('active');
            }
            // Nếu link đến trang khác (ví dụ faq.html), không cần làm gì, trang sẽ tự tải lại
        });
    });

    // --- 4. Back to Top Button ---
    const backToTopButton = document.getElementById("back-to-top");

    if (backToTopButton) { // Chỉ chạy nếu nút này tồn tại
        window.onscroll = function() {
            scrollFunction();
        };

        function scrollFunction() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                backToTopButton.style.display = "block";
            } else {
                backToTopButton.style.display = "none";
            }
        }

        backToTopButton.addEventListener('click', () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }
    
    // --- 5. Hero Slideshow (Khởi chạy) ---
    // Gọi hàm này để hiển thị slide đầu tiên khi trang tải xong
    showSlides(slideIndex);
    
    // --- 6. Filter and Search Logic (cho trang groups.html) ---
    const searchBar = document.getElementById('search-bar');
    // Chỉ chạy code này nếu tìm thấy thanh tìm kiếm (chỉ có trên groups.html)
    if (searchBar) {
        
        const searchBarEn = document.getElementById('search-bar-en');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const groupCards = document.querySelectorAll('#groups-list .group-card');
        let currentFilter = 'all'; // Bộ lọc mặc định

        // Hàm lọc và tìm kiếm
        function filterAndSearch() {
            // Lấy giá trị tìm kiếm (chuyển sang chữ thường)
            const searchText = (document.documentElement.lang === 'vi' ? searchBar.value : searchBarEn.value).toLowerCase();

            groupCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardText = card.textContent.toLowerCase();

                // Kiểm tra 2 điều kiện
                const categoryMatch = (currentFilter === 'all' || cardCategory === currentFilter);
                const textMatch = (cardText.includes(searchText));

                if (categoryMatch && textMatch) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        }

        // 1. Gán sự kiện cho các nút Lọc
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Xóa class 'active' khỏi nút cũ
                document.querySelector('.filter-btn.active').classList.remove('active');
                // Thêm class 'active' cho nút mới
                button.classList.add('active');
                // Cập nhật bộ lọc hiện tại
                currentFilter = button.getAttribute('data-filter');
                // Chạy lại hàm lọc
                filterAndSearch();
            });
        });

        // 2. Gán sự kiện cho thanh Tìm kiếm (cả 2 ngôn ngữ)
        searchBar.addEventListener('keyup', filterAndSearch);
        searchBarEn.addEventListener('keyup', filterAndSearch);
    }
    
}); // --- KẾT THÚC DOMContentLoaded ---