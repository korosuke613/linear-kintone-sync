import { createHmac, timingSafeEqual } from "node:crypto";

/** Linear が webhookTimestamp で許容するリプレイ猶予（ミリ秒）。 */
const TIMESTAMP_TOLERANCE_MS = 60 * 1000;

export type VerifyWebhookResult =
  | { valid: true }
  | { valid: false; reason: string };

/**
 * Linear Webhook の署名（Linear-Signature ヘッダ）と webhookTimestamp を検証する。
 *
 * @param rawBody Linear が送信した生のリクエストボディ文字列（再シリアライズ前）
 * @param signature Linear-Signature ヘッダの値（hex）
 * @param secret Webhook signing secret
 * @param now 現在時刻(ms)。テスト容易性のため注入可能（既定 Date.now()）
 */
export const verifyWebhook = (
  rawBody: string,
  signature: string | undefined,
  secret: string,
  now: number = Date.now(),
): VerifyWebhookResult => {
  if (!signature) {
    return { valid: false, reason: "missing signature" };
  }
  if (!secret) {
    return { valid: false, reason: "missing secret" };
  }

  // HMAC-SHA256 を生ボディに対して計算し、定数時間で比較する。
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const signatureBuf = Buffer.from(signature, "hex");
  const expectedBuf = Buffer.from(expected, "hex");
  if (
    signatureBuf.length !== expectedBuf.length ||
    !timingSafeEqual(signatureBuf, expectedBuf)
  ) {
    return { valid: false, reason: "signature mismatch" };
  }

  // リプレイ対策: webhookTimestamp が現在時刻から許容範囲内か検証する。
  // ※ webhookTimestamp は linear-webhook の型に無いため自前で parse する。
  let payload: { webhookTimestamp?: unknown };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { valid: false, reason: "invalid json" };
  }

  const timestamp = payload.webhookTimestamp;
  if (typeof timestamp !== "number") {
    return { valid: false, reason: "missing webhookTimestamp" };
  }
  if (Math.abs(now - timestamp) > TIMESTAMP_TOLERANCE_MS) {
    return { valid: false, reason: "timestamp out of tolerance" };
  }

  return { valid: true };
};
