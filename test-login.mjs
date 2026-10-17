// test-login.mjs
import handler from "./api/login.js";

const req = {
  method: "POST",
  body: {
    email: "jamesphillipd@yahoo.com",
    password: "@ldsPjay138ad",
  },
};

const res = {
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log(`✅ [Status ${this.statusCode}] Function returned JSON:`, data);
    return this;
  },
  send(data) {
    console.log(`✅ [Status ${this.statusCode}] Function returned:`, data);
    return this;
  },
};

handler(req, res).catch((err) => {
  console.error("❌ Function error:", err);
});
