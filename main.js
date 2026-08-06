// ===== Theme Toggle =====
(function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeButton(saved);
})();

function updateThemeButton(theme) {
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = theme === "light" ? "🌙" : "☀️";
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateThemeButton(next);
}

// ===== Mobile Menu =====
function toggleMenu() {
    const links = document.getElementById("navLinks");
    const btn = document.querySelector(".menu-toggle");
    if (links) {
        links.classList.toggle("open");
        if (btn) {
            const open = links.classList.contains("open");
            btn.textContent = open ? "✕" : "☰";
            btn.setAttribute("aria-expanded", open ? "true" : "false");
        }
    }
}

function closeMenu() {
    const links = document.getElementById("navLinks");
    const btn = document.querySelector(".menu-toggle");
    if (links) links.classList.remove("open");
    if (btn) {
        btn.textContent = "☰";
        btn.setAttribute("aria-expanded", "false");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#navLinks a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (e) => {
        const nav = document.querySelector(".navbar");
        const links = document.getElementById("navLinks");
        if (nav && links && links.classList.contains("open") && !nav.contains(e.target)) {
            closeMenu();
        }
    });

    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#navLinks a").forEach((a) => {
        const href = a.getAttribute("href");
        if (href === path || (path === "" && href === "index.html")) {
            a.classList.add("active");
        }
    });
});




// ===== Firebase Config =====
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

let db = null;
let firebaseReady = false;
let currentAdminTab = "appointments";

if (!localStorage.getItem("hospitalAdminUsername")) {
    localStorage.setItem("hospitalAdminUsername", "ramneesh");
}
if (!localStorage.getItem("hospitalAdminPassword")) {
    localStorage.setItem("hospitalAdminPassword", "ramneesh7172");
}
const adminTabsConfig = {
    appointments: {
        label: "Appointments",
        columns: ["Name", "Phone", "Email", "Department", "Doctor", "Date", "Time", "Status"],
    },
    ambulance: {
        label: "Ambulance",
        columns: ["Name", "Phone", "Pickup", "Drop", "Emergency Type", "Status"],
    },
    pharmacy: {
        label: "Pharmacy Orders",
        columns: ["Name", "Phone", "Medicine", "Quantity", "Address", "Status"],
    },
    contacts: {
        label: "Contact Messages",
        columns: ["Name", "Email", "Subject", "Message", "Status"],
    },
};

function escapeHtml(value) {
    return String(valu)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function initFirebase() {
    if (typeof firebase === "undefined") {
        console.warn("Firebase SDK not loaded. Using localStorage fallback.");
        return false;
    }
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("Firebase not configured. Using localStorage fallback.");
        return false;
    }
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        firebaseReady = true;
        console.log("Firebase connected.");
        return true;
    } catch (e) {
        console.error("Firebase init error:", e);
        return false;
    }
}

function saveToLocalEntries(collectionName, data) {
    const key = `${collectionName}_local`;
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const id = Date.now().toString();
    const entry = { id, ...data, createdAt: new Date().toISOString() };
    existing.unshift(entry);
    localStorage.setItem(key, JSON.stringify(existing.slice(0, 100)));
    return { id, source: "localStorage" };
}

async function saveToFirebase(collectionName, data) {
    if (firebaseReady && db) {
        const doc = {
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: data.status || "pending",
        };
        const ref = await db.collection(collectionName).add(doc);
        return { id: ref.id, source: "firebase" };
    }

    return saveToLocalEntries(collectionName, data);
}

function getStoredEntries(collectionName) {
    const key = `${collectionName}_local`;
    try {
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(existing) ? existing : [];
    } catch (error) {
        console.error("Unable to read stored entries:", error);
        return [];
    }
}


// ===== Form Handler =====
async function handleFormSubmit(e, collectionName, successMsg) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const statusEl = form.querySelector(".status") || form.parentElement.querySelector(".status");
    const originalText = btn ? btn.textContent : "";

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Submitting...";
    }

    const data = {};
    const formData = new FormData(form);
    formData.forEach((value, key) => {
        if (key !== "consent") data[key] = value;
    });
    if (data.medicine === "Other" && data.otherMedicine) {
        data.medicine = data.otherMedicine;
    }
    delete data.otherMedicine;
    data.status = "pending";

    try {
        const result = await saveToFirebase(collectionName, data);

        if (statusEl) {
            statusEl.className = "status success";
            statusEl.textContent =
                successMsg +
                (result.source === "localStorage" ? " (saved locally — configure Firebase for cloud storage)" : "");
            statusEl.style.display = "block";
        }

        if (collectionName === "appointments") {
            showAppointmentConfirmation(data);
        }

        form.reset();
    } catch (err) {
        console.error(err);
        if (statusEl) {
            statusEl.className = "status error";
            statusEl.textContent = "Something went wrong. Please try again or call +91-98765-43210.";
            statusEl.style.display = "block";
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}

function showAppointmentConfirmation(data) {
    const panel = document.getElementById("confirmationPanel");
    const formCard = document.getElementById("formCard");
    const sideInfo = document.getElementById("sideInfo");
    if (!panel) return;

    const summary = document.getElementById("confirmSummary");
    if (summary) {
        summary.innerHTML = `
      <p><strong>Patient:</strong> ${data.name || "—"} (${data.age || "—"} yrs, ${data.gender || "—"})</p>
      <p><strong>Phone:</strong> ${data.phone || "—"}</p>
      <p><strong>Type:</strong> ${data.appointmentType || "—"}</p>
      <p><strong>Department:</strong> ${data.department || "—"}</p>
      <p><strong>Doctor:</strong> ${data.doctor || "Any available"}</p>
      <p><strong>Date & Time:</strong> ${data.date || "—"} · ${data.time || "—"}</p>
    `;
    }

    if (formCard) formCard.style.display = "none";
    if (sideInfo) sideInfo.style.display = "none";
    panel.style.display = "block";
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bookAnotherAppointment() {
    const panel = document.getElementById("confirmationPanel");
    const formCard = document.getElementById("formCard");
    const sideInfo = document.getElementById("sideInfo");
    const statusEl = document.getElementById("formStatus");
    if (panel) panel.style.display = "none";
    if (formCard) formCard.style.display = "block";
    if (sideInfo) sideInfo.style.display = "block";
    if (statusEl) {
        statusEl.style.display = "none";
        statusEl.textContent = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

const doctorsByDept = {
    "General Medicine": ["Dr. Anita Sharma", "Dr. Rajesh Mehta", "Dr. Priya Nair"],
    Cardiology: ["Dr. Suresh Patel", "Dr. Meera Iyer"],
    Neurology: ["Dr. Vikram Singh", "Dr. Anjali Rao"],
    Orthopedics: ["Dr. Karan Malhotra", "Dr. Neha Gupta"],
    Pediatrics: ["Dr. Sunita Reddy", "Dr. Amit Joshi"],
    "Gynecology & Obstetrics": ["Dr. Kavita Desai", "Dr. Ritu Kapoor"],
    "General Surgery": ["Dr. Arjun Verma", "Dr. Farhan Ali"],
    Oncology: ["Dr. Deepa Krishnan"],
    "Nephrology / Dialysis": ["Dr. Mohan Das"],
    ENT: ["Dr. Leela Menon"],
    Dermatology: ["Dr. Sneha Bhat"],
    Ophthalmology: ["Dr. Rohit Saxena"],
    Dental: ["Dr. Pooja Shah"],
    Physiotherapy: ["Dr. Nikhil Bose (PT)"],
    Psychiatry: ["Dr. Ayesha Khan"],
    Other: ["Any available specialist"],
};

function updateDoctorList() {
    const deptSelect = document.getElementById("department");
    const doctorSelect = document.getElementById("doctor");
    if (!deptSelect || !doctorSelect) return;

    const dept = deptSelect.value;
    const doctors = doctorsByDept[dept] || [];

    doctorSelect.innerHTML = '<option value="">Any available doctor</option>';
    doctors.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d;
        opt.textContent = d;
        doctorSelect.appendChild(opt);
    });
}

// ===== Connect forms on page load =====
document.addEventListener("DOMContentLoaded", () => {
    initFirebase();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        if (isAdminAuthenticated()) {
            window.location.href = "admin.html";
            return;
        }
        loginForm.addEventListener("submit", handleAdminLogin);
        return;
    }

    const adminTable = document.getElementById("adminTable");
    if (adminTable) {
        if (!isAdminAuthenticated()) {
            window.location.href = "login.html";
            return;
        }
        initAdminPage();
    }

    const apptForm = document.getElementById("appointmentForm");
    if (apptForm) {
        apptForm.addEventListener("submit", (e) =>
            handleFormSubmit(
                e,
                "appointments",
                "Appointment request submitted! Our team will confirm shortly."
            )
        );

        const deptSelect = document.getElementById("department");
        if (deptSelect) deptSelect.addEventListener("change", updateDoctorList);

        const dateInput = document.getElementById("date");
        if (dateInput) {
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + 60);
            dateInput.min = today.toISOString().split("T")[0];
            dateInput.max = maxDate.toISOString().split("T")[0];
        }
    }

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) =>
            handleFormSubmit(
                e,
                "contacts",
                "Thank you! Your message has been sent. We will get back to you soon."
            )
        );
    }

    const pharmacyForm = document.getElementById("pharmacyForm");
    if (pharmacyForm) {
        pharmacyForm.addEventListener("submit", (e) =>
            handleFormSubmit(
                e,
                "pharmacyOrders",
                "Order placed successfully! Our pharmacist will contact you shortly."
            )
        );
    }

    const ambForm = document.getElementById("ambulanceForm");
    if (ambForm) {
        ambForm.addEventListener("submit", (e) =>
            handleFormSubmit(
                e,
                "ambulanceRequests",
                "Ambulance request received! Our dispatch team will call you immediately. For urgent cases also dial 108."
            )
        );
    }
});