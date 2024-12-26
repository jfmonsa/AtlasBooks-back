import cron from "node-cron";
import axios from "axios";

/**
 * This file is responsible for keeping the server awake on free deployment platforms (like render.com)
 * that shut down the server after a period of inactivity. It schedules a cron job
 * to run every nine minutes to prevent the server from going idle.
 */
const EACH_NINE_MINUTES = "*/9 * * * *";

cron.schedule(EACH_NINE_MINUTES, async () => {
  try {
    await axios.get(`${process.env.SERVER_URL}/ping`);
  } catch (error) {
    console.error("Error pinging /ping endpoint:", error);
  }
});
