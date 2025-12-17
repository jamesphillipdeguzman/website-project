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

// ---------- Visitor Type ----------
function getVisitorContext() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return { visitor_type: "guest" };
    }

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

  // Optional: skip admin traffic entirely
  // if (payload.visitor_type === "admin") return;

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

// ---------- Expose global GTM-like API ----------
window.analytics = {
  track: trackEvent,
};
