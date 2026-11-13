import { request, jsonBody } from "./apiClient.js";

export const ambilTutorial = () => request("/api/tutorial");
export const lewatiTutorial = () => request("/api/tutorial/skip", { method: "POST" });
export const selesaiTutorial = (langkahSaatIni) =>
  request("/api/tutorial/selesai", jsonBody("POST", { langkahSaatIni }));
