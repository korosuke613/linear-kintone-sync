import { createHmac } from "node:crypto";
import { verifyWebhook } from "../verifyWebhook";

const SECRET = "test-signing-secret";
const NOW = 1_700_000_000_000;

const sign = (rawBody: string, secret = SECRET) =>
  createHmac("sha256", secret).update(rawBody).digest("hex");

const makeBody = (webhookTimestamp: unknown = NOW) =>
  JSON.stringify({
    action: "create",
    type: "Issue",
    webhookTimestamp,
    data: { id: "abc" },
  });

test("returns valid for a correct signature within the timestamp tolerance", () => {
  const body = makeBody(NOW);
  expect(verifyWebhook(body, sign(body), SECRET, NOW)).toEqual({
    valid: true,
  });
});

test("rejects a signature computed with a different secret", () => {
  const body = makeBody(NOW);
  const wrongSignature = sign(body, "another-secret");
  expect(verifyWebhook(body, wrongSignature, SECRET, NOW)).toEqual({
    valid: false,
    reason: "signature mismatch",
  });
});

test("rejects a tampered body whose signature no longer matches", () => {
  const body = makeBody(NOW);
  const signature = sign(body);
  const tampered = makeBody(NOW).replace('"abc"', '"evil"');
  expect(verifyWebhook(tampered, signature, SECRET, NOW)).toEqual({
    valid: false,
    reason: "signature mismatch",
  });
});

test("rejects a missing signature", () => {
  const body = makeBody(NOW);
  expect(verifyWebhook(body, undefined, SECRET, NOW)).toEqual({
    valid: false,
    reason: "missing signature",
  });
});

test("rejects an empty secret", () => {
  const body = makeBody(NOW);
  expect(verifyWebhook(body, sign(body), "", NOW)).toEqual({
    valid: false,
    reason: "missing secret",
  });
});

test("rejects a timestamp outside the tolerance window", () => {
  const body = makeBody(NOW - 61_000);
  expect(verifyWebhook(body, sign(body), SECRET, NOW)).toEqual({
    valid: false,
    reason: "timestamp out of tolerance",
  });
});

test("rejects a payload without a webhookTimestamp", () => {
  const body = JSON.stringify({
    action: "create",
    type: "Issue",
    data: { id: "abc" },
  });
  expect(verifyWebhook(body, sign(body), SECRET, NOW)).toEqual({
    valid: false,
    reason: "missing webhookTimestamp",
  });
});

test("rejects a body that is not valid JSON", () => {
  const body = "not-json";
  expect(verifyWebhook(body, sign(body), SECRET, NOW)).toEqual({
    valid: false,
    reason: "invalid json",
  });
});
