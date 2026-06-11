(function () {

  const style = document.createElement("style");
  style.innerHTML = `
    #autoLoader {
      position: fixed;
      inset: 0;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      transition: opacity 0.5s ease;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 6px solid #e5e7eb;
      border-top: 6px solid #000;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  const loader = document.createElement("div");
  loader.id = "autoLoader";
  loader.innerHTML = `<div class="spinner"></div>`;
  document.body.appendChild(loader);

  window.addEventListener("DOMContentLoaded", () => {
    document.body.style.visibility = "visible";
    setTimeout(() => {

      loader.style.opacity = "0";

      setTimeout(() => {
        loader.remove();

        // TEXT ROTATION
        const texts = ["Software Engineer!", "Web Developer!", "Game Developer!"];
        let i = 0;

        const el = document.querySelector(".section_text_p2");

        if (el) {
        setInterval(() => {

            gsap.to(el, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {

                i = (i + 1) % texts.length;
                el.textContent = texts[i];

                gsap.to(el, {
                opacity: 1,
                duration: 0.3
                });

            }
            });

        }, 3000);
        }

        // GSAP CHECK
        if (window.gsap) {
          gsap.to("#profile .title", {
            duration: 2,
            scrambleText: "LpSion"
          });
        }

      }, 500);

    }, 3000);

  });

})();

// ==========================================
// 2. GLOBAL SCROLLTRIGGER FOR ALL SECTIONS
// (About, Experience, Projects, Contact)
// ==========================================
gsap.registerPlugin(ScrollTrigger);

// Kita senaraikan semua ID section yang kamu mahu letak animasi
const sections = ["#about", "#experience", "#projects", "#contact"];

sections.forEach((sectionId) => {
  
  // A. Animasi untuk Teks Tajuk (p1 dan title) bagi setiap section
  gsap.from(`${sectionId} .section_text_p1, ${sectionId} .title`, {
    scrollTrigger: {
      trigger: sectionId,
      start: "top 80%",           // Mula animasi bila section cecah 80% screen
      end: "bottom 20%",          // Batas akhir section
      toggleActions: "play reverse play reverse" // "reverse" akan buatkan dia fade out/patah balik bila user scroll keluar!
    },
    y: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // B. Animasi untuk Kotak Kandungan/Kad di dalam setiap section
  gsap.from(`${sectionId} .details-container, ${sectionId} .content-experience, ${sectionId} .contact-info-upper-container`, {
    scrollTrigger: {
      trigger: sectionId,
      start: "top 75%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse" // Play masa masuk, reverse (fade out) masa keluar
    },
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
  });
});


// ==========================================
// 3. HOVER INTERACTION (HANYA UNTUK KAD PROJEK)
// ==========================================
const projectCards = document.querySelectorAll('#projects .details-container');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            y: -10,
            scale: 1.02,
            boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0px 0px 0px rgba(0,0,0,0)",
            duration: 0.3,
            ease: "power2.out"
        });
    });
});


// ==========================================
// 4. HAMBURGER MENU FUNCTION
// ==========================================
function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}


// ==========================================
// 5. GSAP POPUP MODAL DENGAN MULTI-IMAGE SLIDER
// ==========================================
const modal = document.querySelector('#project-modal');
const modalContent = document.querySelector('#modal-content');
const modalClose = document.querySelector('#modal-close');

const modalImg = document.querySelector('#modal-img');
const modalTitle = document.querySelector('#modal-title');
const modalSubtitle = document.querySelector('#modal-subtitle');
const modalText = document.querySelector('#modal-text');
const modalTech = document.querySelector('#modal-tech');
const modalBody = document.querySelector('#modal-body');

const modalVideo = document.querySelector('#modal-video');
const modalLink = document.querySelector('#modal-web-link');
// const modalImg = document.querySelector('#modal-img');

const btnPrev = document.querySelector('#slider-prev');
const btnNext = document.querySelector('#slider-next');

let currentImages = []; // Array untuk simpan senarai gambar projek aktif
let currentImgIndex = 0; // Penanda aras gambar mana yang sedang dipaparkan

// Fungsi Tukar Gambar di Slider dengan Animasi GSAP Smooth Fade
// function changeImage(index) {
//     currentImgIndex = index;
    
//     // Animasi keluar (Fade Out sebentar sebelum tukar gambar)
//     gsap.to(modalImg, {
//         opacity: 0,
//         duration: 0.15,
//         onComplete: () => {
//             // Tukar src imej selepas imej hilang dari pandangan
//             modalImg.src = currentImages[currentImgIndex].trim();
            
//             // Animasi masuk (Fade In imej baharu)
//             gsap.to(modalImg, { opacity: 1, duration: 0.25 });
//         }
//     });
// }

function renderMedia(url) {
    url = url.trim();
    const isVideo = url.endsWith('.mp4');

    // reset dulu
    modalVideo.pause();
    modalVideo.currentTime = 0;

    if (isVideo) {
        modalImg.style.display = 'none';
        modalVideo.style.display = 'block';

        modalVideo.src = url;

        modalVideo.play().catch(err => {
            console.log("Autoplay blocked:", err);
        });

    } else {
        modalVideo.style.display = 'none';
        modalImg.style.display = 'block';
        modalImg.src = url;
    }
}

function changeImage(index) {
    currentImgIndex = index;

    gsap.to([modalImg, modalVideo], {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {

            if (modalVideo) {
                modalVideo.pause();
                modalVideo.currentTime = 0;
                modalVideo.src = "";
                modalVideo.load();
            }

            // tukar media baru
            renderMedia(currentImages[currentImgIndex]);

            gsap.to([modalImg, modalVideo], {
                opacity: 1,
                duration: 0.25
            });
        }
    });
}

// Pasang Event Listener klik pada setiap kad projek
projectCards.forEach(card => {
    const readMoreBtn = card.querySelector('.read-more-btn');
    
    
    readMoreBtn.addEventListener('click', () => {
        // 1. Ambil data teks & pecahkan string data-preview menjadi array gambar
        const rawImages = card.getAttribute('data-preview');
        currentImages = rawImages.split(','); // Tukar teks koma-koma tadi menjadi Array []
        currentImgIndex = 0; // Set balik start dari gambar pertama

        const detailsText = card.getAttribute('data-details');
        const titleText = card.querySelector('.project-title').textContent;
        const techText = card.getAttribute('data-tech');
        const linkUrl = card.getAttribute('data-link');
        const subtitleText = card.querySelector('p').textContent;

        // 2. Set kandungan modal
        // modalImg.src = currentImages[0].trim();
        renderMedia(currentImages[0]);
        modalTitle.textContent = titleText;
        modalSubtitle.textContent = subtitleText;
        modalText.textContent = detailsText;
        modalTech.textContent = techText;
        modalLink.href = linkUrl;

        if (!linkUrl || linkUrl === "#") {
            modalLink.style.display = "none";
        } else {
            modalLink.style.display = "inline-block";
            modalLink.href = linkUrl;
        }

        // Sorok butang navigasi jika gambar projek cuma ada 1 sahaja
        if (currentImages.length <= 1) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        } else {
            btnPrev.style.display = 'block';
            btnNext.style.display = 'block';
        }

        // 3. Tampilkan Modal dengan animasi bertenaga GSAP
        gsap.to(modal, { autoAlpha: 1, duration: 0.3 });
        gsap.to(modalContent, { scale: 1, duration: 0.4, ease: "back.out(1.5)", delay: 0.05 });
        document.body.style.overflow = 'hidden';
    });
});

// Event Listener untuk Butang Next
btnNext.addEventListener('click', () => {
    let nextIndex = currentImgIndex + 1;
    // Jika dah hujung array gambar, pusing balik pergi gambar pertama (Looping)
    if (nextIndex >= currentImages.length) nextIndex = 0;
    changeImage(nextIndex);
});

// Event Listener untuk Butang Prev
btnPrev.addEventListener('click', () => {
    let prevIndex = currentImgIndex - 1;
    // Jika terkurang daripada 0, pusing pergi gambar paling terakhir
    if (prevIndex < 0) prevIndex = currentImages.length - 1;
    changeImage(prevIndex);
});

// Fungsi Tutup Modal
function closeModal() {
    gsap.to(modalContent, { scale: 0.85, duration: 0.3, ease: "power2.in" });
    gsap.to(modal, { autoAlpha: 0, duration: 0.3, delay: 0.05 });

    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
        modalVideo.src = "";
    }

    document.body.style.overflow = '';
    modalBody.scrollTop = 0;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
