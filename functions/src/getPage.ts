import { onRequest } from "firebase-functions/v2/https";

export const getPage = onRequest(async (_req, res) => {
  res.status(200).send("It works?");
});
