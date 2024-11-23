/**
 * @file soak test for book by id endpoint
 *
 * Objective: Check memory and CPU usage  for prolonged period of time
 */
import getBookById from "./request.js";

export const options = {
  vus: 10,
  duration: "30m",
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
  stages: [
    // warm up
    { duration: "1m", target: 200 },

    // sutained load over a long time
    { duration: "28m", target: 200 },

    // cool down
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  getBookById();
}
