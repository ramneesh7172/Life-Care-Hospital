const events = [{
        id: 1,
        title: "World Heart Day Free Screening Camp",
        date: "2026-09-29",
        time: "9:00 AM – 2:00 PM",
        location: "Hospital Campus, Block A",
        status: "upcoming",
        desc: "Free BP, ECG and basic cardiac risk assessment. Walk-in welcome. Limited slots for echo screening."
    },
    {
        id: 2,
        title: "Diabetes Awareness & Foot Care Workshop",
        date: "2026-10-15",
        time: "10:00 AM – 1:00 PM",
        location: "Conference Hall, 2nd Floor",
        status: "upcoming",
        desc: "Interactive session with endocrinologist and podiatrist. Free sugar check and diet counselling."
    },
    {
        id: 3,
        title: "Cancer Screening Camp for Women",
        date: "2026-11-08",
        time: "9:00 AM – 3:00 PM",
        location: "Hospital Campus",
        status: "upcoming",
        desc: "Breast examination, Pap smear counselling and awareness talks. Prior registration recommended."
    },
    {
        id: 4,
        title: "Blood Donation Drive",
        date: "2026-08-20",
        time: "9:00 AM – 4:00 PM",
        location: "Main Lobby",
        status: "upcoming",
        desc: "Partnered with local blood bank. Donors receive complimentary health check and certificate."
    },
    {
        id: 5,
        title: "Senior Citizen Health Camp",
        date: "2025-12-12",
        time: "9:00 AM – 1:00 PM",
        location: "Community Hall, Sector 12",
        status: "past",
        desc: "Over 300 seniors screened for BP, sugar, vision and basic mobility. Follow-up clinics arranged."
    },
    {
        id: 6,
        title: "World Health Day Mega Camp",
        date: "2025-04-07",
        time: "8:00 AM – 4:00 PM",
        location: "Hospital Grounds",
        status: "past",
        desc: "Multi-specialty free OPD, lab discounts and health talks. More than 1,200 beneficiaries."
    },
    {
        id: 7,
        title: "School Health Programme – Phase 2",
        date: "2025-02-18",
        time: "Full Day",
        location: "Partner Schools",
        status: "past",
        desc: "Anthropometry, vision, dental and deworming support for students across five schools."
    },
    {
        id: 8,
        title: "CPR & First-Aid Training for Public",
        date: "2024-11-30",
        time: "2:00 PM – 5:00 PM",
        location: "Training Centre",
        status: "past",
        desc: "Hands-on CPR certification session conducted by our emergency medicine team."
    }
];

function formatEventDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return {
        day: d.getDate(),
        month: d.toLocaleDateString("en-IN", { month: "short" })
    };
}

function renderEvents(status) {
    const grid = document.getElementById("eventsGrid");
    if (!grid) return;

    const list = events.filter(e => e.status === status);

    if (!list.length) {
        grid.innerHTML = `<div class="evt-empty">No ${status} events at the moment.</div>`;
        return;
    }

    // Sort upcoming ascending, past descending
    list.sort((a, b) => {
        const da = new Date(a.date),
            db = new Date(b.date);
        return status === "upcoming" ? da - db : db - da;
    });

    grid.innerHTML = list.map(e => {
        const { day, month } = formatEventDate(e.date);
        return `
            <div class="card evt-card">
                <div class="evt-date-box">
                    <div class="day">${day}</div>
                    <div class="month">${month}</div>
                </div>
                <div class="evt-body">
                    <h3>${e.title}</h3>
                    <div class="evt-meta">
                        <span>🕒 ${e.time}</span>
                        <span>📍 ${e.location}</span>
                    </div>
                    <p>${e.desc}</p>
                    <span class="evt-status ${e.status}">${e.status === "upcoming" ? "Upcoming" : "Completed"}</span>
                </div>
            </div>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    renderEvents("upcoming");

    document.querySelectorAll(".evt-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".evt-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderEvents(btn.dataset.tab);
        });
    });
});