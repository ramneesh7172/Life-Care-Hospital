const empanelments = [
    { name: "Star Health Insurance", type: "insurance", short: "SH", desc: "Cashless hospitalization across all specialties." },
    { name: "ICICI Lombard", type: "insurance", short: "IL", desc: "Wide network coverage with quick pre-auth." },
    { name: "HDFC ERGO", type: "insurance", short: "HE", desc: "Health and critical illness policies accepted." },
    { name: "Bajaj Allianz", type: "insurance", short: "BA", desc: "Cashless facility for planned & emergency admissions." },
    { name: "Max Bupa (Niva Bupa)", type: "insurance", short: "NB", desc: "Family floater and individual plans supported." },
    { name: "Religare / Care Health", type: "insurance", short: "CH", desc: "Comprehensive health insurance empanelment." },
    { name: "New India Assurance", type: "insurance", short: "NI", desc: "Public sector insurer – cashless available." },
    { name: "United India Insurance", type: "insurance", short: "UI", desc: "Government & individual policies accepted." },
    { name: "Oriental Insurance", type: "insurance", short: "OI", desc: "Cashless treatment as per policy terms." },
    { name: "National Insurance", type: "insurance", short: "NA", desc: "Empanelled for all major specialties." },
    { name: "Medi Assist", type: "tpa", short: "MA", desc: "Leading TPA – fast pre-authorization support." },
    { name: "Paramount Health Services", type: "tpa", short: "PH", desc: "Cashless coordination and claim support." },
    { name: "Vidal Health TPA", type: "tpa", short: "VH", desc: "Network hospital for Vidal members." },
    { name: "Health India TPA", type: "tpa", short: "HI", desc: "Empanelled TPA for multiple insurers." },
    { name: "MDIndia", type: "tpa", short: "MD", desc: "Cashless & reimbursement facilitation." },
    { name: "Raksha TPA", type: "tpa", short: "RK", desc: "Pre-auth and claim processing support." },
    { name: "Ayushman Bharat (PM-JAY)", type: "govt", short: "AB", desc: "Government scheme – eligible packages available." },
    { name: "CGHS", type: "govt", short: "CG", desc: "Central Government Health Scheme beneficiaries." },
    { name: "ECHS", type: "govt", short: "EC", desc: "Ex-Servicemen Contributory Health Scheme." },
    { name: "ESIC", type: "govt", short: "ES", desc: "Employees' State Insurance Corporation." }
];

function renderEmpanelments(list) {
    const grid = document.getElementById("empanelmentsGrid");
    if (!grid) return;

    if (!list.length) {
        grid.innerHTML = `<div class="no-results"><p>No matching empanelments found.</p></div>`;
        return;
    }

    grid.innerHTML = list.map(e => `
        <div class="card emp-card">
            <div class="emp-logo">${e.short}</div>
            <h3>${e.name}</h3>
            <div class="emp-type">${e.type === "tpa" ? "TPA" : e.type === "govt" ? "Govt Scheme" : "Insurance"}</div>
            <p>${e.desc}</p>
            <span class="emp-status">✓ Cashless Available</span>
        </div>
    `).join("");
}

function filterEmpanelments() {
    const q = (document.getElementById("empSearch") && document.getElementById("empSearch").value || "").toLowerCase().trim();
    const type = document.getElementById("empType") && document.getElementById("empType").value || "all";

    let filtered = empanelments;
    if (type !== "all") filtered = filtered.filter(e => e.type === type);
    if (q) {
        filtered = filtered.filter(e =>
            e.name.toLowerCase().includes(q) ||
            e.desc.toLowerCase().includes(q) ||
            e.type.toLowerCase().includes(q)
        );
    }
    renderEmpanelments(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderEmpanelments(empanelments);
    document.getElementById("empSearch") && document.getElementById("empSearch").addEventListener("input", filterEmpanelments);
    document.getElementById("empType") && document.addEventListener("change", filterEmpanelments);
});