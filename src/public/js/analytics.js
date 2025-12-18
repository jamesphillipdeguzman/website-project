// js/analytics.js

// ==================================
// In-house Analytics (GTM-style)
// ==================================
const ANALYTICS_ENDPOINT = "/.netlify/functions/track-event";
const VISITOR_KEY = "analytics_visitor_id";
const TRACK_ADMIN_KEY = "trackAdmin";

// ---------- Visitor ID ----------
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// ---------- Visitor Type ----------
function getVisitorContext() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return { visitor_type: "guest" };

    if (user.user_type === "Admin") {
      return {
        visitor_type: "admin",
        email: user.email,
        name: user.name,
      };
    }

    return {
      visitor_type: "client",
      email: user.email,
      name: user.name,
    };
  } catch {
    return { visitor_type: "guest" };
  }
}

// ---------- Base Payload ----------
function getBasePayload() {
  return {
    visitor_id: getVisitorId(),
    ...getVisitorContext(),
    page_url: location.href,
    page_title: document.title,
    referrer_url: document.referrer || null,
    user_agent: navigator.userAgent,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
    language: navigator.language,
  };
}

// ---------- Send Event ----------
function trackEvent(event_type, data = {}) {
  const payload = {
    event_type,
    ...getBasePayload(),
    event_payload: data,
  };

  // Skip admin events if checkbox says false
  const trackAdmin = localStorage.getItem(TRACK_ADMIN_KEY) === "true";
  if (payload.visitor_type === "admin" && !trackAdmin) return;

  fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// ---------- Auto Page View ----------
document.addEventListener("DOMContentLoaded", () => {
  trackEvent("pageview");
});

// ---------- Auto Click Tracking ----------
document.addEventListener("click", (e) => {
  const el = e.target.closest("button, a");
  if (!el) return;

  trackEvent("click", {
    tag: el.tagName,
    id: el.id || null,
    classes: el.className || null,
    text: el.innerText?.slice(0, 100) || null,
    href: el.href || null,
  });
});

// ---------- Admin Tracking Toggle ----------
function initAdminTrackingCheckbox() {
  const checkbox = document.getElementById("trackAdmin");
  if (!checkbox) return;

  // Set checkbox state from localStorage
  checkbox.checked = localStorage.getItem(TRACK_ADMIN_KEY) !== "false";

  // Listen for changes
  checkbox.addEventListener("change", () => {
    localStorage.setItem(TRACK_ADMIN_KEY, checkbox.checked ? "true" : "false");
  });
}

// ---------- Clear Analytics ----------
async function clearAnalyticsData() {
  if (
    !confirm(
      "Are you sure you want to wipe all analytics data? This cannot be undone.",
    )
  ) {
    return;
  }

  try {
    const res = await fetch("/.netlify/functions/clear-analytics", {
      method: "POST",
    });

    const result = await res.json();
    if (res.ok) {
      alert("Analytics data cleared successfully.");
      // Optionally refresh the page or analytics dashboard
      location.reload();
    } else {
      alert("Failed to clear analytics: " + (result.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Error clearing analytics data.");
  }
}

// ---------- Bind Clear Button ----------
document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clearAnalyticsBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAnalyticsData);
  }

  // Init the admin tracking checkbox
  initAdminTrackingCheckbox();
});

// ---------- Initialize ----------
document.addEventListener("DOMContentLoaded", () => {
  initAdminTrackingCheckbox();
});

// ---------- Expose global GTM-like API ----------
window.analytics = { track: trackEvent };
