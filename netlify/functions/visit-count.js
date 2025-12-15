// netlify/functions/visit-count.js
const { readFileSync, writeFileSync } = require("fs");
const path = "./visit-count.json";

exports.handler = async () => {
  let count = 1;

  try {
    const data = JSON.parse(readFileSync(path, "utf-8"));
    count = data.count + 1;
  } catch (err) {
    console.log("Creating new count file.");
  }

  writeFileSync(path, JSON.stringify({ count }));

  return {
    statusCode: 200,
    body: JSON.stringify({ count }),
  };
};
