document.addEventListener("DOMContentLoaded", () => {
  // Tạo IntersectionObserver để theo dõi khi các phần tử xuất hiện trong khung nhìn
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Nếu phần tử xuất hiện trong viewport, thêm class "show" để kích hoạt hiệu ứng
          entry.target.classList.add("show");
        } else {
          // Nếu phần tử không còn trong viewport, xóa class "show" để tắt hiệu ứng
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px", // Kích hoạt sớm hơn 50px
    }
  );

  // Xử lý hiệu ứng vẽ đường path cho SVG
  const welcomePath = document.querySelector("#welcome_path");
  if (welcomePath) {
    // Lấy tổng chiều dài của đường path trong SVG
    const pathLength = welcomePath.getTotalLength();
    // Thiết lập strokeDasharray và strokeDashoffset để tạo hiệu ứng vẽ dần đường path
    welcomePath.style.strokeDasharray = pathLength;
    welcomePath.style.strokeDashoffset = pathLength;
    observer.observe(welcomePath);
  }

  // Hiệu ứng xuất hiện từng từ trong văn bản
  const words = document.querySelectorAll(".word");
  words.forEach((word, index) => {
    // Thêm độ trễ cho mỗi từ
    word.style.animationDelay = `${index * 0.07}s`;
    observer.observe(word);
  });

  const elementsToObserve = [
    ...document.querySelectorAll(".project"), // Tất cả các phần tử có class "project"
    ...document.querySelectorAll(".skill-fill"), // Tất cả các thanh kỹ năng
    document.querySelector(".info-form-wrapper"), // Form liên hệ
    document.querySelector(".footer-profile"), // Phần profile trong footer
    document.querySelector(".footer-philosophy"), // Phần triết lý trong footer
    document.querySelector(".footer-section"), // Phần section trong footer
    document.querySelector(".footer-contact"), // Phần liên hệ trong footer
  ];

  // Áp dụng observer cho từng phần tử trong danh sách
  elementsToObserve.forEach((element) => {
    if (element) {
      // Chỉ theo dõi nếu phần tử tồn tại để tránh lỗi
      observer.observe(element);
    }
  });

  // Hiệu ứng gõ chữ cho phần tử 
  const text = "A collection of projects I've worked on.";
  const el = document.querySelector(".typewriter");
  let index = 0;
  let isDeleting = false;
  const speed = 100; // Tốc độ gõ 
  const deleteSpeed = 50; // Tốc độ xóa 
  const delayAfterTyping = 1500; // Thời gian chờ sau khi gõ hết văn bản
  const delayAfterDeleting = 500; // Thời gian chờ sau khi xóa hết văn bản

  function typeLoop() {
    if (!isDeleting && index <= text.length) {
      // Nếu đang gõ và chưa hết văn bản
      el.textContent = text.substring(0, index); // Hiển thị từ đầu đến ký tự hiện tại
      index++;
      if (index > text.length) {
        // Nếu đã gõ hết văn bản, chờ một chút rồi bắt đầu xóa
        setTimeout(() => {
          isDeleting = true;
          typeLoop();
        }, delayAfterTyping);
        return;
      }
      // Tiếp tục gõ ký tự tiếp theo sau khoảng thời gian
      setTimeout(typeLoop, speed);
    } else if (isDeleting && index >= 0) {
      // Nếu đang xóa và còn ký tự để xóa
      el.textContent = text.substring(0, index); // Hiển thị từ đầu đến ký tự hiện tại
      index--;
      if (index < 0) {
        // Nếu đã xóa hết văn bản, chờ một chút rồi bắt đầu gõ lại
        setTimeout(() => {
          isDeleting = false;
          typeLoop();
        }, delayAfterDeleting);
        return;
      }
      // Tiếp tục xóa ký tự tiếp theo sau khoảng thời gian `deleteSpeed`
      setTimeout(typeLoop, deleteSpeed);
    }
  }

  // Bắt đầu hiệu ứng gõ chữ
  typeLoop();

  // Hiệu ứng nhấp nháy
  const blinkText = document.querySelectorAll(".blink-text");
  const observerBlink = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("blink-text-animation");
        } else {
          entry.target.classList.remove("blink-text-animation");
        }
      });
    },
    { threshold: 0.5 }
  );

  blinkText.forEach((element) => {
    let chars = element.textContent.split("");
    chars = chars.map(
      (char, i) =>
        `<span style="animation-delay:${0.05 * i}s;">${char}</span>`
    );
    element.innerHTML = chars.join("");
    observerBlink.observe(element);
  });

  // Gán giá trị data-level cho các thanh kỹ năng
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    // Lấy giá trị --skill-level từ CSS
    const level = bar.style.getPropertyValue("--skill-level");
    const fill = bar.querySelector(".skill-fill");
    if (fill && level) {
      // Gán giá trị --skill-level cho phần tử .skill-fill
      fill.style.setProperty("--skill-level", level);
      // Gán giá trị data-level để hiển thị phần trăm trên thanh kỹ năng
      fill.setAttribute("data-level", level.trim());
    }
  });

  // Hiệu ứng hiển thị ảnh lớn khi nhấp vào ảnh dự án
  document.querySelectorAll(".project-img").forEach((item) => {
    item.addEventListener("click", function () {
      // Lấy URL của ảnh từ background-image
      const bg = this.style.backgroundImage;
      const match = bg.match(/url\((?:'|"|)?(.+?)(?:'|"|)?\)/);
      if (match && match[1]) {
        const modal = document.getElementById("imgModal");
        const modalImage = document.getElementById("modalImage");
        if (modal && modalImage) {
          // Gán URL ảnh vào modal và hiển thị modal
          modalImage.src = match[1];
          modal.classList.add("show");
          modal.style.display = "flex";
        } else {
          console.error("Không tìm thấy phần tử modal hoặc modal image.");
        }
      }
    });
  });

  // Đóng modal khi nhấp vào nền hoặc nút đóng
  const modal = document.getElementById("imgModal");
  const closeModalBtn = document.getElementById("closeModal");
  if (modal) {
    modal.addEventListener("click", function (event) {
      // Chỉ đóng modal nếu nhấp vào nền hoặc nút đóng
      if (event.target === modal || event.target === closeModalBtn) {
        modal.classList.remove("show");
        // Ẩn modal sau khi hiệu ứng hoàn tất 
        setTimeout(() => {
          modal.style.display = "none";
        }, 400);
      }
    });
  }
});

// Hiệu ứng khi nhấn menu ở màn hình mobile
document.querySelector('.hamburger').addEventListener('click', function () {
  this.classList.toggle('active');
  document.querySelector('.mobile-menu-list').classList.toggle('active');
});