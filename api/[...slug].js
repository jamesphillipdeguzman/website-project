import {
  handleLogin,
  handleRegister,
  handleGetUser,
  handlePurgeBots,
} from "../src/server/auth.js";
import {
  handleTrackEvent,
  handleRecordEvent,
  handleGetAnalytics,
  handleClearAnalytics,
  handleIncrementVisit,
} from "../src/server/analytics.js";
import {
  handleGetPortfolios,
  handleCreatePortfolio,
  handleUpdatePortfolio,
  handleLastProject,
  handleIncrementPortfolioView,
} from "../src/server/portfolios.js";
import {
  handleSystemStatus,
  handleGetClients,
  handleNewLeads,
  handleQueryDb,
  handleReview,
  handleQuotes,
  handleRecordVisit,
  handleGetVisitCount,
} from "../src/server/system.js";

/**
 * Master dynamic catch-all API route handler for Vercel
 * Single Serverless Function supporting all previous /api/* endpoints
 */
export default async function handler(req, res) {
  // Extract path segments from req.query.slug or req.url
  const slugParts = Array.isArray(req.query?.slug)
    ? req.query.slug
    : typeof req.query?.slug === "string"
      ? [req.query.slug]
      : [];

  let pathname = "";
  try {
    const parsedUrl = new URL(req.url, "http://localhost");
    pathname = parsedUrl.pathname;
  } catch {
    pathname = req.url || "";
  }

  const urlSegments = pathname
    .replace(/^\/api\/?/, "")
    .split("/")
    .filter(Boolean);

  const segments = slugParts.length > 0 ? slugParts : urlSegments;
  const primaryRoute = (segments[0] || req.query?.action || "")
    .replace(/\.js$/, "")
    .trim()
    .toLowerCase();
  const subRoute = (segments[1] || "").replace(/\.js$/, "").trim().toLowerCase();

  switch (primaryRoute) {
    // ===== Auth Routes =====
    case "login":
      return handleLogin(req, res);

    case "register":
      return handleRegister(req, res);

    case "purge-bots":
    case "cleanup-bots":
      return handlePurgeBots(req, res);

    case "get-user":
      return handleGetUser(req, res);

    case "auth": {
      const action = subRoute || req.query?.action;
      if (action === "register") return handleRegister(req, res);
      if (action === "purge-bots" || action === "cleanup-bots") return handlePurgeBots(req, res);
      if (action === "user" || action === "get-user") return handleGetUser(req, res);
      return handleLogin(req, res);
    }

    // ===== Portfolio Routes =====
    case "get-portfolios":
      return handleGetPortfolios(req, res);

    case "createportfolio":
    case "create-portfolio":
      return handleCreatePortfolio(req, res);

    case "updateportfolio":
    case "update-portfolio":
    case "saveportfolio":
    case "save-portfolio":
      return handleUpdatePortfolio(req, res);

    case "last-project":
      return handleLastProject(req, res);

    case "increment-portfolio-view":
    case "portfolio-view":
      return handleIncrementPortfolioView(req, res);

    case "portfolios": {
      const action = subRoute || req.query?.action;
      if (action === "view" || action === "increment-view" || action === "increment-portfolio-view")
        return handleIncrementPortfolioView(req, res);
      if (action === "last" || action === "last-project") return handleLastProject(req, res);
      if (req.method === "POST" && (action === "view" || req.query?.action === "view"))
        return handleIncrementPortfolioView(req, res);
      if (req.method === "POST") return handleCreatePortfolio(req, res);
      if (req.method === "PUT") return handleUpdatePortfolio(req, res);
      return handleGetPortfolios(req, res);
    }

    // ===== Analytics & Visits Routes =====
    case "record-event":
    case "recordevent":
    case "track-event":
      return handleRecordEvent(req, res);

    case "get-analytics":
      return handleGetAnalytics(req, res);

    case "clear-analytics":
      return handleClearAnalytics(req, res);

    case "record-visit":
    case "recordvisit":
      return handleRecordVisit(req, res);

    case "get-visit-count":
    case "visit-count":
      return handleGetVisitCount(req, res);

    case "increment-visit":
      return handleIncrementVisit(req, res);

    case "analytics": {
      if (req.method === "DELETE") {
        return handleClearAnalytics(req, res);
      }
      const action = subRoute || req.query?.action;
      if (action === "clear" || action === "clear-analytics")
        return handleClearAnalytics(req, res);
      if (action === "visit-count" || action === "get-visit-count" || action === "count")
        return handleGetVisitCount(req, res);
      if (action === "increment-visit" || action === "increment")
        return handleIncrementVisit(req, res);
      if (action === "record-event" || action === "track" || action === "track-event" || req.method === "POST")
        return handleRecordEvent(req, res);
      return handleGetAnalytics(req, res);
    }

    // ===== System & Database Routes =====
    case "get-clients":
    case "clients":
      return handleGetClients(req, res);

    case "new-leads":
    case "leads":
      return handleNewLeads(req, res);

    case "system-status":
    case "status":
    case "health":
      return handleSystemStatus(req, res);

    case "query-db":
      return handleQueryDb(req, res);

    // ===== Review Routes =====
    case "reviews":
    case "review":
      return handleReview(req, res);

    // ===== Quote Routes =====
    case "quotes":
    case "quote":
      return handleQuotes(req, res);

    default:
      if (!primaryRoute) {
        return res.status(200).json({
          status: "operational",
          message: "Vercel serverless API router is online",
        });
      }
      return res.status(404).json({
        error: `Endpoint '/api/${primaryRoute}' not found`,
      });
  }
}
