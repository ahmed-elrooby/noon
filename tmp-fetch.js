import fetch from "node-fetch";
const url = "http://localhost:3000/api-docs";
const res = await fetch(url);
console.log("status", res.status);
console.log("content-type", res.headers.get("content-type"));
const text = await res.text();
console.log("body-start", text.slice(0, 400));
