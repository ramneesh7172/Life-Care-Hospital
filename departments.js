const departments = [
    { name: "Cardiology", icon: "❤️", category: "clinical", desc: "Advanced heart care including angioplasty, pacemaker implantation, and cardiac rehabilitation.", beds: "ICU 12", doctors: 8 },
    { name: "Neurology & Neurosurgery", icon: "🧠", category: "surgical", desc: "Stroke management, epilepsy care, spine surgery and advanced neuro diagnostics.", beds: "Neuro ICU 8", doctors: 6 },
    { name: "Orthopedics & Joint Replacement", icon: "🦴", category: "surgical", desc: "Trauma, arthroscopy, total knee/hip replacement and sports injury treatment.", beds: "Ortho 40", doctors: 7 },
    { name: "Pediatrics & Neonatology", icon: "👶", category: "clinical", desc: "NICU, PICU, vaccination, growth monitoring and child specialty clinics.", beds: "NICU 10", doctors: 9 },
    { name: "Obstetrics & Gynecology", icon: "👩", category: "surgical", desc: "Maternity, high-risk pregnancy, fertility services and laparoscopic gynecology.", beds: "Maternity 25", doctors: 8 },
    { name: "General & Laparoscopic Surgery", icon: "🔪", category: "surgical", desc: "Hernia, gallbladder, appendix, bariatric and advanced minimally invasive procedures.", beds: "Surgical 30", doctors: 6 },
    { name: "Oncology", icon: "🎗️", category: "clinical", desc: "Medical oncology, chemotherapy day care, cancer screening and palliative support.", beds: "Day Care 12", doctors: 4 },
    { name: "Nephrology & Dialysis", icon: "🩸", category: "clinical", desc: "Hemodialysis, CAPD, kidney care and transplant evaluation support.", beds: "Dialysis 18", doctors: 3 },
    { name: "Gastroenterology", icon: "🫁", category: "clinical", desc: "Endoscopy, colonoscopy, liver clinic and digestive disorder management.", beds: "Ward 20", doctors: 4 },
    { name: "Pulmonology", icon: "😮‍💨", category: "clinical", desc: "Asthma, COPD, sleep study, interventional pulmonology and critical respiratory care.", beds: "Resp ICU 6", doctors: 3 },
    { name: "Emergency & Trauma", icon: "🚨", category: "clinical", desc: "24/7 Level-1 trauma, rapid response, ventilator support and critical care.", beds: "ER 15", doctors: 10 },
    { name: "Radiology & Imaging", icon: "📷", category: "diagnostic", desc: "MRI, CT, Digital X-Ray, Ultrasound, Mammography and interventional radiology.", beds: "—", doctors: 5 },
    { name: "Pathology & Laboratory", icon: "🔬", category: "diagnostic", desc: "NABL-accredited lab with biochemistry, hematology, microbiology and rapid reporting.", beds: "—", doctors: 4 },
    { name: "Physiotherapy & Rehab", icon: "🏃", category: "support", desc: "Post-surgical rehab, sports physio, pain management and mobility training.", beds: "OPD", doctors: 5 },
    { name: "Anesthesiology", icon: "💉", category: "support", desc: "Safe anesthesia for all surgeries, pain clinic and critical care support.", beds: "—", doctors: 7 },
    { name: "Dermatology", icon: "✨", category: "clinical", desc: "Skin, hair, cosmetic dermatology, laser procedures and allergy clinic.", beds: "OPD", doctors: 3 },
    { name: "ENT", icon: "👂", category: "surgical", desc: "Ear, nose, throat surgery, hearing assessment and sinus care.", beds: "Ward 10", doctors: 3 },
    { name: "Ophthalmology", icon: "👁️", category: "surgical", desc: "Cataract, glaucoma, retina, refractive surgery and pediatric eye care.", beds: "Day Care", doctors: 4 }
];

function renderDepartments(list) {
    const grid = document.getElementById("departmentsGrid");
    if (!grid) return;

    if (!list.length) {
        grid.innerHTML = `<div class="no-results"><p>No departments match your search.</p></div>`;
        return;
    }

    grid.innerHTML = list.map(d => `
        <div class="card dept-card" data-category="${d.category}">
            <div class="dept-icon">${d.icon}</div>
            <h3>${d.name}</h3>
            <p>${d.desc}</p>
            <div class="dept-meta">
                <span class="dept-tag">${d.doctors} Doctors</span>
                <span class="dept-tag">${d.beds}</span>
            </div>
            <a href="appointment.html" class="dept-link">Book with this dept →</a>
        </div>
    `).join("");
}

function filterDepartments() {
    const q = (document.getElementById("deptSearch") && document.getElementById("deptSearch").value || "").toLowerCase().trim();
    const activeFilter = document.querySelector(".filter-btn.active") && document.querySelector(".filter-btn.active").dataset.filter || "all";

    let filtered = departments;

    if (activeFilter !== "all") {
        filtered = filtered.filter(d => d.category === activeFilter);
    }
    if (q) {
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(q) ||
            d.desc.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q)
        );
    }
    renderDepartments(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderDepartments(departments);

    document.getElementById("deptSearch") && document.addEventListener("input", filterDepartments);

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterDepartments();
        });
    });
});