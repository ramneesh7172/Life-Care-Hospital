const galleryItems = [
    { id: 1, category: "infrastructure", icon: "🏥", title: "Hospital Main Entrance" },
    { id: 2, category: "infrastructure", icon: "🏢", title: "Reception & Lobby" },
    { id: 3, category: "wards", icon: "🛏️", title: "General Ward" },
    { id: 4, category: "wards", icon: "🏨", title: "Private Room" },
    { id: 5, category: "wards", icon: "🚨", title: "Intensive Care Unit" },
    { id: 6, category: "wards", icon: "👶", title: "Neonatal ICU" },
    { id: 7, category: "ot", icon: "🔪", title: "Modular Operation Theatre" },
    { id: 8, category: "ot", icon: "🫀", title: "Cardiac Catheterization Lab" },
    { id: 9, category: "infrastructure", icon: "🔬", title: "Pathology Laboratory" },
    { id: 10, category: "infrastructure", icon: "📷", title: "Radiology & MRI Suite" },
    { id: 11, category: "events", icon: "🎉", title: "Health Camp 2024" },
    { id: 12, category: "events", icon: "🩺", title: "World Heart Day Awareness" },
    { id: 13, category: "team", icon: "👨‍⚕️", title: "Our Specialist Doctors" },
    { id: 14, category: "team", icon: "👩‍⚕️", title: "Nursing Team" },
    { id: 15, category: "infrastructure", icon: "💊", title: "In-House Pharmacy" },
    { id: 16, category: "events", icon: "🤝", title: "Blood Donation Drive" }
];

let currentFilter = "all";
let currentIndex = 0;
let visibleItems = [...galleryItems];

function renderGallery(list) {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    visibleItems = list;

    grid.innerHTML = list.map((item, idx) => `
        <div class="gal-item" data-index="${idx}" data-id="${item.id}">
            <div class="gal-placeholder">
                ${item.icon}
                <span>${item.title}</span>
            </div>
            <div class="gal-overlay">
                <p>${item.title}</p>
            </div>
        </div>
    `).join("");

    grid.querySelectorAll(".gal-item").forEach(el => {
        el.addEventListener("click", () => openLightbox(parseInt(el.dataset.index, 10)));
    });
}

function openLightbox(index) {
    currentIndex = index;
    const item = visibleItems[index];
    if (!item) return;

    document.getElementById("lightboxImg").textContent = item.icon;
    document.getElementById("lightboxCaption").textContent = item.title;
    document.getElementById("lightbox").classList.add("open");
    document.getElementById("lightbox").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
    document.getElementById("lightbox").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function showNext(dir) {
    currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
}

document.addEventListener("DOMContentLoaded", () => {
    renderGallery(galleryItems);

    document.querySelectorAll(".gal-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".gal-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            const filtered = currentFilter === "all" ?
                galleryItems :
                galleryItems.filter(i => i.category === currentFilter);
            renderGallery(filtered);
        });
    });

    document.getElementById("lightboxClose") && document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxPrev") && document.getElementById("lightboxPrev").addEventListener("click", () => showNext(-1));
    document.getElementById("lightboxNext") && document.getElementById("lightboxNext").addEventListener("click", () => showNext(1));

    document.getElementById("lightbox") && document.getElementById("lightbox").addEventListener("click", (e) => {
        if (e.target.id === "lightbox") closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (!document.getElementById("lightbox") || !document.getElementById("lightbox").classList.contains("open")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showNext(-1);
        if (e.key === "ArrowRight") showNext(1);
    });
});