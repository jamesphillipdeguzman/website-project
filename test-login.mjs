// test-login.mjs
import { handler } from "./netlify/functions/login.js";

const event = {
  httpMethod: "POST",
  body: JSON.stringify({
    email: "jamesphillipd@yahoo.com",
    password: "@ldsPjay138ad",
  }),
};

handler(event)
  .then((response) => {
    console.log("✅ Function returned:", response);
  })
  .catch((err) => {
    console.error("❌ Function error:", err);
  });
