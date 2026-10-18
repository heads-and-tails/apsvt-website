import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/feedback/route.ts";

const valid = {
  name: "Тестова особа", email: "test@example.org", subject: "Перевірка",
  message: "Перевірка форми зворотного зв’язку.", consent: true, website: "",
};

test("feedback rejects invalid input without contacting the mail provider", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error("must not send"); };
  try {
    const response = await POST(new Request("http://localhost/api/feedback", { method: "POST", body: JSON.stringify({ ...valid, consent: false }) }));
    assert.equal(response.status, 400);
  } finally { globalThis.fetch = originalFetch; }
});

test("feedback sends validated content and reports provider failures honestly", async () => {
  const originalFetch = globalThis.fetch;
  let forwarded;
  try {
    globalThis.fetch = async (url, options) => {
      forwarded = { url, payload: JSON.parse(options.body) };
      return new Response(JSON.stringify({ success: "true" }), { status: 200 });
    };
    const request = new Request("http://localhost/api/feedback", { method: "POST", body: JSON.stringify(valid) });
    assert.equal((await POST(request)).status, 200);
    assert.equal(forwarded.url, "https://formsubmit.co/ajax/info@socosvita.kiev.ua");
    assert.equal(forwarded.payload.Email, valid.email);
    assert.equal(forwarded.payload.Повідомлення, valid.message);

    globalThis.fetch = async () => new Response(JSON.stringify({ success: "false" }), { status: 200 });
    const failed = await POST(new Request("http://localhost/api/feedback", { method: "POST", body: JSON.stringify(valid) }));
    assert.equal(failed.status, 502);
  } finally { globalThis.fetch = originalFetch; }
});
