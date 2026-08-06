const packages = [{
        id: 1,
        name: "Basic Health Check",
        category: "basic",
        icon: "🩺",
        price: 999,
        badge: null,
        features: ["CBC", "Blood Sugar (F)", "Lipid Profile", "Urine Routine", "ECG", "Doctor Consultation"]
    },
    {
        id: 2,
        name: "Executive Health Check",
        category: "comprehensive",
        icon: "💼",
        price: 2999,
        badge: "Popular",
        features: ["Full Blood Panel", "Liver & Kidney Function", "Thyroid Profile", "ECG + Echo", "Chest X-Ray", "Ultrasound Abdomen", "Physician Consult"]
    },
    {
        id: 3,
        name: "Comprehensive Master",
        category: "comprehensive",
        icon: "⭐",
        price: 5499,
        badge: "Best Value",
        features: ["All Executive tests", "Vitamin D & B12", "HbA1c", "PSA / Pap Smear", "Treadmill Test", "Full Body Ultrasound", "Specialist Consults"]
    },
    {
        id: 4,
        name: "Senior Citizen Care",
        category: "senior",
        icon: "👴",
        price: 3999,
        badge: null,
        features: ["Geriatric Panel", "Bone Density (DEXA)", "ECG + Echo", "Eye & Hearing Check", "Physio Assessment", "Physician + Dietician"]
    },
    {
        id: 5,
        name: "Women's Wellness",
        category: "women",
        icon: "👩",
        price: 3499,
        badge: null,
        features: ["Complete Blood Work", "Hormonal Profile", "Pap Smear", "Mammography / USG Breast", "Bone Density", "Gynecologist Consult"]
    },
    {
        id: 6,
        name: "Cardiac Risk Package",
        category: "comprehensive",
        icon: "❤️",
        price: 4499,
        badge: null,
        features: ["Lipid + Hs-CRP", "ECG, Echo, TMT", "Coronary Calcium Score*", "Cardiologist Review", "Lifestyle Counselling"]
    },
    {
        id: 7,
        name: "Diabetes Care Package",
        category: "basic",
        icon: "🩸",
        price: 1799,
        badge: null,
        features: ["FBS, PPBS, HbA1c", "Kidney Function", "Lipid Profile", "Foot Examination", "Dietician Consult"]
    },
    {
        id: 8,
        name: "Corporate Wellness",
        category: "corporate",
        icon: "🏢",
        price: 2499,
        badge: "Bulk Rates",
        features: ["Customizable Panel", "On-site / Hospital", "Detailed Reports", "Health Scorecard", "Follow-up Support"]
    },
    {
        id: 9,
        name: "Pre-Employment Check",
        category: "corporate",
        icon: "📋",
        price: 1299,
        badge: null,
        features: ["CBC, Urine, Blood Group", "Chest X-Ray", "ECG", "Vision Test", "Fitness Certificate"]
    }
];

function renderPackages(list) {
    const grid = document.getElementById("packagesGrid");
    if (!grid) return;

    grid.innerHTML = list.map(p => `
        <div class="card pkg-card" data-category="${p.category}">
            ${p.badge ? `<span class="pkg-badge">${p.badge}</span>` : ""}
            <div class="pkg-icon">${p.icon}</div>
            <h3>${p.name}</h3>
            <div class="pkg-price">₹${p.price.toLocaleString("en-IN")} <span>/ person</span></div>
            <ul class="pkg-features">
                ${p.features.map(f => `<li>${f}</li>`).join("")}
            </ul>
            <a href="appointment.html" class="btn btn-primary">Book Package</a>
        </div>
    `).join("");
}

function filterPackages(cat) {
    const filtered = cat === "all" ? packages : packages.filter(p => p.category === cat);
    renderPackages(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderPackages(packages);

    document.querySelectorAll(".pkg-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".pkg-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterPackages(btn.dataset.filter);
        });
    });
});