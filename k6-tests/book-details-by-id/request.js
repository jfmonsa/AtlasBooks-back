import http from "k6/http";
import { check, sleep } from "k6";

export default function getBookById() {
  const res = http.get("http://localhost:3000/api/v1/book/VOxg");

  check(res, {
    "status is 200": r => r.status === 200,
    "duration was <= 200ms": r => r.timings.duration < 200,
  });

  sleep(1);
}
