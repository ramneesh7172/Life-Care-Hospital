const posts = [{
        id: 1,
        cat: "heart",
        icon: "❤️",
        title: "5 Early Warning Signs of Heart Disease You Shouldn't Ignore",
        date: "2024-11-12",
        author: "Dr. Ananya Sharma",
        excerpt: "Chest discomfort, unusual fatigue and shortness of breath can be early indicators. Learn when to seek help.",
        content: "<p>Heart disease remains one of the leading causes of mortality worldwide. Recognizing early signs can make a life-saving difference.</p><p><strong>1. Chest discomfort</strong> – Pressure, tightness or pain that may radiate to the arm, jaw or back.</p><p><strong>2. Unusual fatigue</strong> – Feeling exhausted after routine activities.</p><p><strong>3. Shortness of breath</strong> – Especially when lying flat or during mild exertion.</p><p><strong>4. Swelling in legs</strong> – Can indicate fluid retention related to heart function.</p><p><strong>5. Irregular heartbeat</strong> – Palpitations or skipped beats that persist.</p><p>If you experience any of these symptoms, consult a cardiologist promptly. At Life Care Hospital our cardiac team is available for timely evaluation.</p>"
    },
    {
        id: 2,
        cat: "nutrition",
        icon: "🥗",
        title: "Building a Heart-Healthy Plate: Simple Daily Choices",
        date: "2024-10-28",
        author: "Dietician Priya Mehta",
        excerpt: "Small changes in your daily diet can significantly reduce cardiovascular risk.",
        content: "<p>A balanced plate does not require extreme restriction. Focus on colour, fibre and portion awareness.</p><p>Include plenty of vegetables, whole grains, lean proteins and healthy fats such as nuts and seeds. Limit processed foods, excess salt and sugary beverages.</p><p>Our nutrition team offers personalised counselling as part of several health packages.</p>"
    },
    {
        id: 3,
        cat: "wellness",
        icon: "🧘",
        title: "Managing Stress for Better Immunity and Sleep",
        date: "2024-10-05",
        author: "Dr. Rajesh Kapoor",
        excerpt: "Chronic stress affects immunity, blood pressure and sleep quality. Practical techniques that work.",
        content: "<p>Stress is inevitable, but chronic stress takes a measurable toll on the body. Simple practices such as deep breathing, short walks, consistent sleep schedule and limiting screen time before bed can improve resilience.</p><p>If stress feels overwhelming, speak with a counsellor or your physician. Mental health is an integral part of overall wellness.</p>"
    },
    {
        id: 4,
        cat: "news",
        icon: "🏥",
        title: "Life Care Hospital Inaugurates New Modular Operation Theatre",
        date: "2024-09-18",
        author: "Hospital Admin",
        excerpt: "State-of-the-art OT complex expands our capacity for complex surgeries with enhanced infection control.",
        content: "<p>We are proud to announce the inauguration of our new modular operation theatre complex. The facility features laminar airflow, advanced monitoring and integrated imaging support.</p><p>This addition strengthens our surgical capabilities across orthopaedics, neurosurgery, oncology and general surgery.</p>"
    },
    {
        id: 5,
        cat: "heart",
        icon: "🏃",
        title: "How Much Exercise Is Enough for Heart Health?",
        date: "2024-08-22",
        author: "Dr. Ananya Sharma",
        excerpt: "Guidelines recommend 150 minutes of moderate activity per week — here's how to make it realistic.",
        content: "<p>Aim for at least 150 minutes of moderate-intensity aerobic activity (brisk walking, cycling) or 75 minutes of vigorous activity each week, plus muscle-strengthening exercises twice a week.</p><p>Start gradually if you have been inactive, and consult your doctor before beginning a new programme, especially if you have existing heart conditions.</p>"
    },
    {
        id: 6,
        cat: "wellness",
        icon: "💉",
        title: "Why Adult Vaccination Still Matters",
        date: "2024-07-30",
        author: "Dr. Neha Patel",
        excerpt: "Vaccines are not just for children. Adults benefit from protection against flu, pneumonia, shingles and more.",
        content: "<p>Immunity can wane over time. Recommended adult vaccines include annual influenza, pneumococcal (especially for seniors and those with chronic illness), Tdap, and shingles vaccine for eligible age groups.</p><p>Speak with your physician about a personalised vaccination plan during your next visit.</p>"
    },
    {
        id: 7,
        cat: "nutrition",
        icon: "💧",
        title: "Hydration Myths: How Much Water Do You Really Need?",
        date: "2024-07-10",
        author: "Dietician Priya Mehta",
        excerpt: "The '8 glasses a day' rule is a guideline, not a strict law. Individual needs vary.",
        content: "<p>Fluid needs depend on climate, activity level, age and health status. A practical approach is to drink when thirsty and observe urine colour (pale yellow is a good sign).</p><p>Include water-rich foods such as fruits and vegetables. Limit sugary drinks and excessive caffeine.</p>"
    },
    {
        id: 8,
        cat: "news",
        icon: "🤝",
        title: "Free Health Camp Reaches 800+ Residents",
        date: "2024-06-15",
        author: "Hospital Admin",
        excerpt: "Our recent community health camp offered free screenings for diabetes, hypertension and basic labs.",
        content: "<p>In partnership with local organisations, Life Care Hospital conducted a multi-day health camp that served over 800 residents. Free blood pressure, blood sugar and basic consultations were provided, with referrals for those needing further care.</p><p>Community outreach remains a core part of our mission.</p>"
    }
];

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function renderPosts(list) {
    const grid = document.getElementById("blogGrid");
    if (!grid) return;

    if (!list.length) {
        grid.innerHTML = `<div class="no-posts">No articles found.</div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="card blog-card" data-id="${p.id}">
            <div class="blog-thumb">${p.icon}</div>
            <div class="blog-meta">${formatDate(p.date)} · ${p.author}</div>
            <h3>${p.title}</h3>
            <p>${p.excerpt}</p>
            <span class="blog-read">Read more →</span>
        </div>
    `).join("");

    grid.querySelectorAll(".blog-card").forEach(card => {
        card.addEventListener("click", () => openPost(parseInt(card.dataset.id, 10)));
    });
}

function openPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById("blogModalBody").innerHTML = `
        <h2>${post.title}</h2>
        <div class="meta">${formatDate(post.date)} · ${post.author}</div>
        <div class="content">${post.content}</div>
    `;
    document.getElementById("blogModal").classList.add("open");
    document.getElementById("blogModal").setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closePost() {
    document.getElementById("blogModal").classList.remove("open");
    document.getElementById("blogModal").setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function filterPosts() {
    const q = (document.getElementById("blogSearch").value || "").toLowerCase().trim();
    const cat = document.querySelector(".blog-cat.active").dataset.cat || "all";

    let filtered = posts;
    if (cat !== "all") filtered = filtered.filter(p => p.cat === cat);
    if (q) {
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.author.toLowerCase().includes(q)
        );
    }
    renderPosts(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
    renderPosts(posts);

    document.getElementById("blogSearch").addEventListener("input", filterPosts);

    document.querySelectorAll(".blog-cat").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".blog-cat").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            filterPosts();
        });
    });

    document.getElementById("blogModalClose").addEventListener("click", closePost);
    document.getElementById("blogModal").addEventListener("click", (e) => {
        if (e.target.id === "blogModal") closePost();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePost();
    });
});