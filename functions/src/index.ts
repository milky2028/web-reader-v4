import { onCall } from "firebase-functions/v2/https";
import { getPage as getPageBase } from "./getPage";

export const getPage = onCall(getPageBase);
