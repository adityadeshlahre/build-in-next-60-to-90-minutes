
const fs = require("node:fs");

fs.writeFileSync("./timeRequestCount.log", numbers.join("\n"));

if (fs.existsSync("./timeRequestCount.log")) console.log("OK");


