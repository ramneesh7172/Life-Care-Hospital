/* Life Care Hospital — Admin Panel JS */
(function() {
    "use strict";

    var SESSION_KEY = "lch_admin_ok";
    var currentTab = "appointments";

    var KEYS = {
        appointments: ["appointments_local"],
        ambulance: ["ambulance_local", "ambulanceRequests_local"],
        pharmacy: ["pharmacy_local", "pharmacyOrders_local"],
        contacts: ["contacts_local"],
        documents: ["documents_local"],
        payments: ["payments_local"]
    };

    var HEADERS = {
        appointments: ["Name", "Phone", "Department", "Date", "Time", "When", ""],
        ambulance: ["Name", "Phone", "Location / Pickup", "Emergency", "When", ""],
        pharmacy: ["Name", "Phone", "Medicine", "Qty", "Address", "When", ""],
        contacts: ["Name", "Email", "Subject", "Message", "When", ""]
    };

    var FIELDS = {
        appointments: ["name", "phone", "department", "date", "time", "createdAt"],
        ambulance: ["name", "phone", "location", "pickup", "emergency", "emergencyType", "createdAt"],
        pharmacy: ["name", "phone", "medicine", "qty", "quantity", "address", "createdAt"],
        contacts: ["name", "email", "subject", "message", "createdAt"]
    };

    function getCreds() {
        return {
            user: localStorage.getItem("hospitalAdminUsername") || "admin",
            pass: localStorage.getItem("hospitalAdminPassword") || "admin123"
        };
    }

    function getData(tab) {
        var keys = KEYS[tab] || [];
        var merged = [];
        var seen = {};
        keys.forEach(function(key) {
            try {
                var arr = JSON.parse(localStorage.getItem(key) || "[]");
                if (!Array.isArray(arr)) return;
                arr.forEach(function(r) {
                    var id = String(r.id || r.createdAt || Math.random());
                    if (!seen[id]) {
                        seen[id] = true;
                        merged.push(r);
                    }
                });
            } catch (e) {}
        });
        return merged;
    }

    function setData(tab, arr) {
        var keys = KEYS[tab] || [];
        if (!keys.length) return;
        localStorage.setItem(keys[0], JSON.stringify(arr));
        for (var i = 1; i < keys.length; i++) {
            localStorage.removeItem(keys[i]);
        }
    }

    function addRecord(tab, obj) {
        var list = getData(tab);
        obj.id = String(Date.now());
        obj.createdAt = new Date().toISOString();
        obj.status = obj.status || "pending";
        list.unshift(obj);
        setData(tab, list.slice(0, 200));
    }

    function deleteRecord(tab, id) {
        var list = getData(tab).filter(function(r) {
            return String(r.id) !== String(id);
        });
        setData(tab, list);
        refreshAll();
    }

    function isLoggedIn() {
        return sessionStorage.getItem(SESSION_KEY) === "1";
    }

    function showDashboard() {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        refreshAll();
    }

    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        document.getElementById("dashboard").style.display = "none";
        document.getElementById("loginScreen").style.display = "flex";
        var pw = document.getElementById("password");
        if (pw) pw.value = "";
        var err = document.getElementById("loginError");
        if (err) err.classList.remove("show");
    }

    function escapeHtml(v) {
        return String(v == null ? "" : v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function fmtDate(v) {
        if (!v) return "—";
        try {
            return new Date(v).toLocaleString("en-IN");
        } catch (e) {
            return String(v);
        }
    }

    function formatSize(bytes) {
        if (bytes == null) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function statusBadge(status) {
        var s = status || "pending";
        return '<span class="badge badge-' + escapeHtml(s) + '">' + escapeHtml(s) + "</span>";
    }

    function fieldVal(r, keys) {
        for (var i = 0; i < keys.length; i++) {
            if (r[keys[i]] != null && r[keys[i]] !== "") return r[keys[i]];
        }
        return "—";
    }

    /* ========== TABS ========== */
    function setTab(tab) {
        currentTab = tab;
        document.querySelectorAll(".tabs button").forEach(function(b) {
            b.classList.toggle("active", b.getAttribute("data-tab") === tab);
        });

        var isDocs = tab === "documents";
        var isPay = tab === "payments";
        var isRecords = !isDocs && !isPay;

        document.getElementById("recordsPanel").classList.toggle("active", isRecords);
        document.getElementById("documentsPanel").classList.toggle("active", isDocs);
        document.getElementById("paymentsPanel").classList.toggle("active", isPay);

        var btnAdd = document.getElementById("btnAdd");
        if (btnAdd) btnAdd.style.display = isRecords ? "inline-block" : "none";

        if (isDocs) {
            renderDocuments();
        } else if (isPay) {
            renderPayments();
        } else {
            var search = document.getElementById("searchBox");
            if (search) search.value = "";
            renderRecords();
        }
    }

    /* ========== RECORDS ========== */
    function renderRecords() {
        var headers = HEADERS[currentTab];
        var fields = FIELDS[currentTab];
        if (!headers) return;

        var rows = getData(currentTab);
        var q = (document.getElementById("searchBox").value || "").toLowerCase().trim();
        if (q) {
            rows = rows.filter(function(r) {
                return Object.keys(r).some(function(k) {
                    return String(r[k] || "").toLowerCase().indexOf(q) !== -1;
                });
            });
        }

        document.getElementById("thead").innerHTML =
            "<tr>" +
            headers
            .map(function(h) {
                return "<th>" + h + "</th>";
            })
            .join("") +
            "</tr>";

        var tbody = document.getElementById("tbody");
        if (!rows.length) {
            tbody.innerHTML =
                '<tr><td class="empty" colspan="' +
                headers.length +
                '">No records in this tab yet.</td></tr>';
            return;
        }

        tbody.innerHTML = rows
            .map(function(r) {
                var cells = "";
                if (currentTab === "appointments") {
                    cells =
                        "<td>" +
                        escapeHtml(r.name) +
                        "</td><td>" +
                        escapeHtml(r.phone) +
                        "</td><td>" +
                        escapeHtml(r.department) +
                        "</td><td>" +
                        escapeHtml(r.date) +
                        "</td><td>" +
                        escapeHtml(r.time) +
                        "</td><td>" +
                        fmtDate(r.createdAt) +
                        "</td>";
                } else if (currentTab === "ambulance") {
                    cells =
                        "<td>" +
                        escapeHtml(r.name) +
                        "</td><td>" +
                        escapeHtml(r.phone) +
                        "</td><td>" +
                        escapeHtml(fieldVal(r, ["location", "pickup", "pickupLocation"])) +
                        "</td><td>" +
                        escapeHtml(fieldVal(r, ["emergency", "emergencyType"])) +
                        "</td><td>" +
                        fmtDate(r.createdAt) +
                        "</td>";
                } else if (currentTab === "pharmacy") {
                    cells =
                        "<td>" +
                        escapeHtml(r.name) +
                        "</td><td>" +
                        escapeHtml(r.phone) +
                        "</td><td>" +
                        escapeHtml(r.medicine) +
                        "</td><td>" +
                        escapeHtml(fieldVal(r, ["qty", "quantity"])) +
                        "</td><td>" +
                        escapeHtml(r.address) +
                        "</td><td>" +
                        fmtDate(r.createdAt) +
                        "</td>";
                } else if (currentTab === "contacts") {
                    cells =
                        "<td>" +
                        escapeHtml(r.name) +
                        "</td><td>" +
                        escapeHtml(r.email) +
                        "</td><td>" +
                        escapeHtml(r.subject) +
                        "</td><td>" +
                        escapeHtml(r.message) +
                        "</td><td>" +
                        fmtDate(r.createdAt) +
                        "</td>";
                }
                cells +=
                    '<td><button type="button" class="btn btn-red btn-sm" data-del="' +
                    escapeHtml(r.id) +
                    '">Delete</button></td>';
                return "<tr>" + cells + "</tr>";
            })
            .join("");

        tbody.querySelectorAll("[data-del]").forEach(function(btn) {
            btn.addEventListener("click", function() {
                if (confirm("Delete this record?")) {
                    deleteRecord(currentTab, btn.getAttribute("data-del"));
                }
            });
        });
    }

    function clearTab() {
        if (!confirm("Clear all records in this tab?")) return;
        setData(currentTab, []);
        refreshAll();
    }

    /* ========== DOCUMENTS ========== */
    function renderDocuments() {
        var list = getData("documents");
        var q = (document.getElementById("docSearch").value || "").toLowerCase().trim();
        var st = document.getElementById("docStatus").value;
        var tp = document.getElementById("docTypeFilter").value;

        if (q) {
            list = list.filter(function(d) {
                return (
                    String(d.patientName || "").toLowerCase().indexOf(q) !== -1 ||
                    String(d.phone || "").toLowerCase().indexOf(q) !== -1 ||
                    String(d.patientId || "").toLowerCase().indexOf(q) !== -1 ||
                    String(d.notes || "").toLowerCase().indexOf(q) !== -1 ||
                    String(d.id || "").toLowerCase().indexOf(q) !== -1
                );
            });
        }
        if (st) list = list.filter(function(d) { return (d.status || "pending") === st; });
        if (tp) list = list.filter(function(d) { return d.docType === tp; });

        var wrap = document.getElementById("docList");
        if (!list.length) {
            wrap.innerHTML =
                '<p style="text-align:center;color:#64748b;padding:2rem;">No documents found.</p>';
            return;
        }

        wrap.innerHTML = list
            .map(function(d) {
                var files = Array.isArray(d.files) ? d.files : [];
                var chips = files
                    .map(function(f) {
                        return (
                            '<span class="file-chip">' +
                            escapeHtml(f.name || "file") +
                            (f.size ? " · " + formatSize(f.size) : "") +
                            "</span>"
                        );
                    })
                    .join("");
                return (
                    '<div class="doc-card">' +
                    '<div class="doc-header">' +
                    "<h3>" +
                    escapeHtml(d.patientName || "Unknown") +
                    "</h3>" +
                    statusBadge(d.status) +
                    "</div>" +
                    '<div class="doc-meta">' +
                    "<span><strong>ID:</strong> " +
                    escapeHtml(d.id) +
                    "</span>" +
                    "<span><strong>Phone:</strong> " +
                    escapeHtml(d.phone) +
                    "</span>" +
                    "<span><strong>UHID:</strong> " +
                    escapeHtml(d.patientId || "—") +
                    "</span>" +
                    "<span><strong>Type:</strong> " +
                    escapeHtml(d.docType) +
                    "</span>" +
                    "<span><strong>When:</strong> " +
                    fmtDate(d.createdAt) +
                    "</span>" +
                    "</div>" +
                    (d.notes ?
                        '<p style="font-size:0.85rem;color:#94a3b8;margin-bottom:0.5rem;">' +
                        escapeHtml(d.notes) +
                        "</p>" :
                        "") +
                    '<div class="file-chips">' +
                    (chips || '<span class="file-chip">No file meta</span>') +
                    "</div>" +
                    '<div class="card-actions">' +
                    '<button type="button" class="btn btn-sky btn-sm" data-view="' +
                    escapeHtml(d.id) +
                    '">View</button>' +
                    '<button type="button" class="btn btn-green btn-sm" data-status="' +
                    escapeHtml(d.id) +
                    '" data-to="reviewed">Mark reviewed</button>' +
                    '<button type="button" class="btn btn-slate btn-sm" data-status="' +
                    escapeHtml(d.id) +
                    '" data-to="archived">Archive</button>' +
                    '<button type="button" class="btn btn-red btn-sm" data-del-doc="' +
                    escapeHtml(d.id) +
                    '">Delete</button>' +
                    "</div></div>"
                );
            })
            .join("");

        wrap.querySelectorAll("[data-view]").forEach(function(btn) {
            btn.addEventListener("click", function() {
                openDocDetail(btn.getAttribute("data-view"));
            });
        });
        wrap.querySelectorAll("[data-status]").forEach(function(btn) {
            btn.addEventListener("click", function() {
                updateDocStatus(btn.getAttribute("data-status"), btn.getAttribute("data-to"));
            });
        });
        wrap.querySelectorAll("[data-del-doc]").forEach(function(btn) {
            btn.addEventListener("click", function() {
                if (confirm("Delete this document record?")) {
                    deleteRecord("documents", btn.getAttribute("data-del-doc"));
                }
            });
        });
    }

    function updateDocStatus(id, status) {
        var list = getData("documents");
        list.forEach(function(d) {
            if (String(d.id) === String(id)) d.status = status;
        });
        setData("documents", list);
        renderDocuments();
        updateStats();
    }

    function openDocDetail(id) {
        var d = getData("documents").find(function(x) {
            return String(x.id) === String(id);
        });
        if (!d) return;
        var files = Array.isArray(d.files) ? d.files : [];
        var body =
            "<p><strong>Reference</strong> " +
            escapeHtml(d.id) +
            "</p>" +
            "<p><strong>Patient</strong> " +
            escapeHtml(d.patientName) +
            "</p>" +
            "<p><strong>Phone</strong> " +
            escapeHtml(d.phone) +
            "</p>" +
            "<p><strong>Email</strong> " +
            escapeHtml(d.email || "—") +
            "</p>" +
            "<p><strong>UHID</strong> " +
            escapeHtml(d.patientId || "—") +
            "</p>" +
            "<p><strong>Type</strong> " +
            escapeHtml(d.docType) +
            "</p>" +
            "<p><strong>Status</strong> " +
            escapeHtml(d.status || "pending") +
            "</p>" +
            "<p><strong>Notes</strong> " +
            escapeHtml(d.notes || "—") +
            "</p>" +
            "<p><strong>Submitted</strong> " +
            fmtDate(d.createdAt) +
            "</p>" +
            "<p><strong>Files</strong></p><ul style='margin-left:1.2rem;font-size:0.88rem;'>";
        files.forEach(function(f) {
            body +=
                "<li>" +
                escapeHtml(f.name) +
                (f.size ? " (" + formatSize(f.size) + ")" : "") +
                (f.dataUrl ?
                    ' · <a href="' +
                    f.dataUrl +
                    '" download="' +
                    escapeHtml(f.name) +
                    '" target="_blank">Download</a>' :
                    "") +
                "</li>";
        });
        body += "</ul>";
        document.getElementById("modalBody").innerHTML = body;
        document.getElementById("detailModal").classList.add("show");
    }

    function closeDetailModal() {
        document.getElementById("detailModal").classList.remove("show");
    }

    /* ========== PAYMENTS ========== */
    function renderPayments() {
        var list = getData("payments");
        var q = (document.getElementById("paySearch").value || "").toLowerCase().trim();
        if (q) {
            list = list.filter(function(p) {
                return (
                    String(p.patientName || "").toLowerCase().indexOf(q) !== -1 ||
                    String(p.phone || "").toLowerCase().indexOf(q) !== -1 ||
                    String(p.id || "").toLowerCase().indexOf(q) !== -1 ||
                    String(p.purpose || "").toLowerCase().indexOf(q) !== -1
                );
            });
        }

        var wrap = document.getElementById("payList");
        if (!list.length) {
            wrap.innerHTML =
                '<p style="text-align:center;color:#64748b;padding:2rem;">No payments yet.</p>';
            return;
        }

        wrap.innerHTML = list
            .map(function(p) {
                return (
                    '<div class="pay-card">' +
                    '<div class="pay-header">' +
                    "<h3>" +
                    escapeHtml(p.patientName || "Unknown") +
                    " — ₹" +
                    escapeHtml(p.amount) +
                    "</h3>" +
                    statusBadge(p.status || "paid") +
                    "</div>" +
                    '<div class="pay-meta">' +
                    "<span><strong>Ref:</strong> " +
                    escapeHtml(p.id) +
                    "</span>" +
                    "<span><strong>Phone:</strong> " +
                    escapeHtml(p.phone) +
                    "</span>" +
                    "<span><strong>Purpose:</strong> " +
                    escapeHtml(p.purpose) +
                    "</span>" +
                    "<span><strong>Method:</strong> " +
                    escapeHtml((p.method || "").toUpperCase()) +
                    "</span>" +
                    "<span><strong>When:</strong> " +
                    fmtDate(p.createdAt) +
                    "</span>" +
                    "</div>" +
                    '<div class="card-actions">' +
                    '<button type="button" class="btn btn-red btn-sm" data-del-pay="' +
                    escapeHtml(p.id) +
                    '">Delete</button>' +
                    "</div></div>"
                );
            })
            .join("");

        wrap.querySelectorAll("[data-del-pay]").forEach(function(btn) {
            btn.addEventListener("click", function() {
                if (confirm("Delete this payment record?")) {
                    deleteRecord("payments", btn.getAttribute("data-del-pay"));
                }
            });
        });
    }

    function clearPayments() {
        if (!confirm("Clear all payment records?")) return;
        setData("payments", []);
        refreshAll();
    }

    function clearDocuments() {
        if (!confirm("Clear all document records?")) return;
        setData("documents", []);
        refreshAll();
    }

    /* ========== STATS ========== */
    function updateStats() {
        document.getElementById("cAppt").textContent = getData("appointments").length;
        document.getElementById("cAmb").textContent = getData("ambulance").length;
        document.getElementById("cPharm").textContent = getData("pharmacy").length;
        document.getElementById("cContact").textContent = getData("contacts").length;
        document.getElementById("cDocs").textContent = getData("documents").length;
        document.getElementById("cPay").textContent = getData("payments").length;
    }

    function refreshAll() {
        updateStats();
        if (currentTab === "documents") renderDocuments();
        else if (currentTab === "payments") renderPayments();
        else renderRecords();
    }

    /* ========== ADD MODAL ========== */
    function openAddModal() {
        document.getElementById("addModal").classList.add("show");
        updateAddFields();
    }

    function closeAddModal() {
        document.getElementById("addModal").classList.remove("show");
    }

    function updateAddFields() {
        var type = document.getElementById("addType").value;
        var html = "";
        if (type === "appointments") {
            html =
                '<label>Name</label><input id="f_name" required />' +
                '<label>Phone</label><input id="f_phone" required />' +
                '<label>Department</label><input id="f_department" />' +
                '<label>Date</label><input type="date" id="f_date" />' +
                '<label>Time</label><input id="f_time" placeholder="10:00 AM" />';
        } else if (type === "ambulance") {
            html =
                '<label>Name</label><input id="f_name" required />' +
                '<label>Phone</label><input id="f_phone" required />' +
                '<label>Pickup location</label><input id="f_location" />' +
                '<label>Emergency type</label><input id="f_emergency" />';
        } else if (type === "pharmacy") {
            html =
                '<label>Name</label><input id="f_name" required />' +
                '<label>Phone</label><input id="f_phone" required />' +
                '<label>Medicine</label><input id="f_medicine" />' +
                '<label>Quantity</label><input id="f_qty" />' +
                '<label>Address</label><input id="f_address" />';
        } else {
            html =
                '<label>Name</label><input id="f_name" required />' +
                '<label>Email</label><input id="f_email" type="email" />' +
                '<label>Subject</label><input id="f_subject" />' +
                '<label>Message</label><textarea id="f_message" rows="3"></textarea>';
        }
        document.getElementById("addFields").innerHTML = html;
    }

    /* ========== INIT ========== */
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("loginForm").addEventListener("submit", function(e) {
            e.preventDefault();
            var u = document.getElementById("username").value.trim();
            var p = document.getElementById("password").value;
            var creds = getCreds();
            var ok =
                (u === creds.user && p === creds.pass) ||
                (u === "sumandeep singh" && p === "2444720") ||
                (u === "2444708" && p === "2444720") ||
                (u === "ramneesh" && p === "2444708");

            if (ok) {
                sessionStorage.setItem(SESSION_KEY, "1");
                document.getElementById("loginError").classList.remove("show");
                showDashboard();
            } else {
                document.getElementById("loginError").classList.add("show");
            }
        });

        document.getElementById("addForm").addEventListener("submit", function(e) {
            e.preventDefault();
            var type = document.getElementById("addType").value;
            var obj = {};
            if (type === "appointments") {
                obj = {
                    name: document.getElementById("f_name").value.trim(),
                    phone: document.getElementById("f_phone").value.trim(),
                    department: document.getElementById("f_department").value.trim(),
                    date: document.getElementById("f_date").value,
                    time: document.getElementById("f_time").value.trim()
                };
            } else if (type === "ambulance") {
                obj = {
                    name: document.getElementById("f_name").value.trim(),
                    phone: document.getElementById("f_phone").value.trim(),
                    location: document.getElementById("f_location").value.trim(),
                    emergency: document.getElementById("f_emergency").value.trim()
                };
            } else if (type === "pharmacy") {
                obj = {
                    name: document.getElementById("f_name").value.trim(),
                    phone: document.getElementById("f_phone").value.trim(),
                    medicine: document.getElementById("f_medicine").value.trim(),
                    qty: document.getElementById("f_qty").value.trim(),
                    address: document.getElementById("f_address").value.trim()
                };
            } else {
                obj = {
                    name: document.getElementById("f_name").value.trim(),
                    email: document.getElementById("f_email").value.trim(),
                    subject: document.getElementById("f_subject").value.trim(),
                    message: document.getElementById("f_message").value.trim()
                };
            }
            addRecord(type, obj);
            closeAddModal();
            setTab(type);
            refreshAll();
        });

        if (isLoggedIn()) showDashboard();
    });

    // Expose for HTML onclick handlers
    window.setTab = setTab;
    window.refreshAll = refreshAll;
    window.clearTab = clearTab;
    window.clearDocuments = clearDocuments;
    window.clearPayments = clearPayments;
    window.logout = logout;
    window.openAddModal = openAddModal;
    window.closeAddModal = closeAddModal;
    window.updateAddFields = updateAddFields;
    window.closeDetailModal = closeDetailModal;
    window.renderDocuments = renderDocuments;
    window.renderPayments = renderPayments;
    window.renderRecords = renderRecords;
})();