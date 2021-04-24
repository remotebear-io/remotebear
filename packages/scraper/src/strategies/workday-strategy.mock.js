/* eslint-disable */
const response1 = require("./workday-mock/response-1.json");
const response2 = require("./workday-mock/response-2.json");
const response3 = require("./workday-mock/response-3.json");
const response4 = require("./workday-mock/response-4.json");
const response5 = require("./workday-mock/response-5.json");
const response6 = require("./workday-mock/response-6.json");
const response7 = require("./workday-mock/response-7.json");
const results = require("./workday-mock/results.json");

exports.input = [
  [JSON.stringify(response1), { status: 200 }],
  [JSON.stringify(response2), { status: 200 }],
  [JSON.stringify(response3), { status: 200 }],
  [JSON.stringify(response4), { status: 200 }],
  [JSON.stringify(response5), { status: 200 }],
  [JSON.stringify(response6), { status: 200 }],
  [JSON.stringify(response7), { status: 200 }],
  ["", { status: 404 }],
];
exports.output = results;
