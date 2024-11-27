/** @file stress test for book by id endpoint */

import getBookById from "./request.js";

export const options = {
  vus: 10,
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
  stages: [
    // level 1
    { duration: "1m", target: 100 },
    { duration: "2m", target: 100 },
    // level 2
    { duration: "1m", target: 200 },
    { duration: "2m", target: 200 },
    // level 3
    { duration: "1m", target: 300 },
    { duration: "2m", target: 300 },
    // cool down
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  getBookById();
}
