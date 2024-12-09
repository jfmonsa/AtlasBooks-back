import { Client } from "@elastic/elasticsearch";

export const client = new Client({
  cloud: {
    id: process.env.ElASTICSEARCH_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});
