const faqs = [
    { cat: "appointment", q: "How do I book an appointment?", a: "You can book online through our Appointment page, call reception at +91-85448-53114, or visit the hospital front desk. Online booking is available 24/7." },
    { cat: "appointment", q: "Can I cancel or reschedule my appointment?", a: "Yes. Please call us at least 4 hours before your scheduled time or use the contact form. We will help you reschedule at the earliest available slot." },
    { cat: "appointment", q: "Do I need a referral to see a specialist?", a: "A referral is not mandatory for most specialties. However, for certain insurance claims or complex cases, a referral letter may be helpful." },
    { cat: "admission", q: "What documents are required for admission?", a: "Please bring a valid photo ID (Aadhaar/Passport/Driving Licence), previous medical records, insurance card (if any), and the treating doctor's advice/prescription." },
    { cat: "admission", q: "Is advance payment required for admission?", a: "For cash admissions an estimated deposit is collected. For cashless insurance cases, pre-authorization is processed first. Our billing team will guide you." },
    { cat: "admission", q: "What are the room categories available?", a: "We offer General Ward, Semi-Private, Private, Deluxe and ICU/HDU beds. Room choice depends on availability and clinical need." },
    { cat: "insurance", q: "Which insurance companies are empanelled?", a: "We are empanelled with major insurers and TPAs including Star Health, ICICI Lombard, HDFC ERGO, Medi Assist, Ayushman Bharat, CGHS and more. See the Empanelments page for the full list." },
    { cat: "insurance", q: "How does cashless hospitalization work?", a: "Present your insurance card and ID at the Insurance Desk. We submit pre-authorization to the TPA/insurer. Once approved, treatment proceeds cashless as per policy terms. Any non-payable items are settled by the patient." },
    { cat: "insurance", q: "What if my pre-authorization is delayed?", a: "Our insurance coordinators follow up actively. In urgent cases treatment is not delayed; temporary deposits can be adjusted later against the approved amount." },
    { cat: "visiting", q: "What are the visiting hours?", a: "General wards: 4:00 PM – 6:00 PM & 10:00 AM – 11:00 AM. ICU: 11:00 AM – 11:30 AM & 5:00 PM – 5:30 PM (only two visitors at a time). Please follow infection-control guidelines." },
    { cat: "visiting", q: "Can children visit patients?", a: "Children under 12 are generally not allowed in ICU and restricted in wards for infection-control reasons. Exceptions may be made in special circumstances with permission." },
    { cat: "general", q: "Is emergency care available 24/7?", a: "Yes. Our Emergency Department and Ambulance services operate round the clock. Call 108 or our emergency number +91-78377-45429." },
    { cat: "general", q: "Do you have a pharmacy and diagnostic facilities?", a: "Yes. We have a 24/7 in-house pharmacy and a full-fledged NABL-accredited laboratory and imaging centre (X-Ray, CT, MRI, Ultrasound)." },
    { cat: "general", q: "How can I obtain medical records or reports?", a: "Reports are available at the respective departments. For discharge summaries and past records, contact the Medical Records Department with patient ID and authorization." },
    { cat: "general", q: "Is parking available?", a: "Yes, free parking is available for patients and visitors within the hospital campus. Valet assistance may be available during peak hours." }
];

function renderFaqs(list) {
    const container = document.getElementById("faqList");
    if (!container) return;

    if (!list.length) {
        container.innerHTML = `<div class="faq-empty">No questions match your search.</div>`;
        return;
    }

    container.innerHTML = list.map((f, i) => `
        <div class="faq-item" data-index="${i}">
            <button class="faq-question" aria-expanded="false">
                <span>${f.q}</span>
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-inner">${f.a}</div>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".faq-item").forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            container.querySelectorAll(".faq-item").forEach(el => {
                el.classList.remove("open");
                el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
            });
            if (!isOpen) {
                item.classList.add("open");
                btn.setAttribute("aria-expanded", "true");
            }
        });
    });
}

function filterFaqs() {
    const q = (document.getElementById("faqSearch").value || "").toLowerCase().trim();
    const cat = document.querySelector(".faq-cat.active").dataset.cat || "all";

    let filtered = faqs;
    if (cat !== "all") filtered = filtered.filter(f => f.cat === cat);
    if (q) {
        filtered = filtered.filter(f =>
            f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
        );
    }
    renderFaqs(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderFaqs(faqs);

    document.getElementById("faqSearch").addEventListener("input", filterFaqs);

    document.querySelectorAll(".faq-cat").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".faq-cat").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterFaqs();
        });
    });
});