// ==================================
// In-house Analytics (GTM-style)
// ==================================

const ANALYTICS_ENDPOINT = "/.netlify/functions/track-event";
const VISITOR_KEY = "analytics_visitor_id";

// ---------- Visitor ID ----------
function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

// ---------- Device Detection ----------
function getDeviceType() {
  const ua = navigator.userAgent;

  if (/iPhone|iPod/i.test(ua)) return "Mobile / iPhone";
  if (/iPad/i.test(ua)) return "Tablet / iPad";
  if (/Android/i.test(ua)) return "Mobile / Android";
  if (/Mobi/i.test(ua)) return "Mobile / Other";

  return "Desktop";
}

// ---------- Visitor Type ----------
function getVisitorContext() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) return { visitor_type: "guest" };

    // support object or array
    const users = Array.isArray(stored) ? stored : [stored];
    const adminUser = users.find((u) => u.user_type === "Admin");
    const user = adminUser || users[0];

    const type = user.user_type ? user.user_type.toLowerCase() : "client";

    return {
      visitor_type: type,
      name: user.name,
      email: user.email,
    };
  } catch {
    return { visitor_type: "guest" };
  }
}

// ---------- Base Payload ----------
function getBasePayload() {
  const trackAdminCheckbox = document.getElementById("trackAdmin");
  const trackAdmin = localStorage.getItem("trackAdmin") === "true";

  if (trackAdminCheckbox) {
    trackAdminCheckbox.checked = trackAdmin;
    trackAdminCheckbox.addEventListener("change", (e) => {
      localStorage.setItem("trackAdmin", e.target.checked);
      console.log("trackAdmin set to:", e.target.checked);
    });
  }

  const visitorContext = getVisitorContext();

  return {
    visitor_id: getVisitorId(),
    ...visitorContext,
    trackAdmin,
    page_url: location.href,
    page_title: document.title,
    referrer_url: document.referrer || null,
    user_agent: navigator.userAgent,
    device: getDeviceType(),
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

  // skip tracking admin if disabled
  if (payload.visitor_type === "admin" && !payload.trackAdmin) return;
  if (!payload.visitor_id) return;

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

// ---------- Global API ----------
window.analytics = { track: trackEvent };
