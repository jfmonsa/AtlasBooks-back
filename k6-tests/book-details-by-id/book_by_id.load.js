/** @file load test for book by id endpoint */

import getBookById from "./request.js";

export const options = {
  vus: 10,
  duration: "5m",
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

export default function () {
  getBookById();
}
