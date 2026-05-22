import app from "../dist/server/index.js";

export const runtime = "nodejs";

export default {
  async fetch(request) {
    return app.fetch(request, {}, { waitUntil() {} });
  },
};
