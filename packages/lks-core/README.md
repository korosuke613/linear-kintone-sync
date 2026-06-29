# lks-core
Core package for Linear-kintone-sync.

[![CI](https://github.com/korosuke613/linear-kintone-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/korosuke613/linear-kintone-sync/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/korosuke613/linear-kintone-sync/branch/main/graph/badge.svg?token=FKTPW2L774)](https://codecov.io/gh/korosuke613/linear-kintone-sync)

## Verifying webhook signatures

Linear signs each webhook request. Verify the `Linear-Signature` header against
the **raw** request body using your webhook signing secret before processing it.
`verifyWebhook` also checks the payload's `webhookTimestamp` to reject replays
(tolerance: 60 seconds).

```ts
import { verifyWebhook } from "linear-kintone-sync/lib";

// rawBody must be the exact request body string (not re-serialized JSON).
const result = verifyWebhook(
  rawBody,
  headers["linear-signature"],
  process.env.LINEAR_WEBHOOK_SECRET ?? "",
);

if (!result.valid) {
  console.error(`Invalid Linear webhook: ${result.reason}`);
  // respond with 401 and do not process the payload
}
```

## Support webhook types
All webhook types are [here](https://github.com/korosuke613/linear-webhook/blob/main/src/Interfaces.ts#L298).

- [x] CreateIssueWebhook 
- [x] UpdateIssueWebhook
- [x] RemoveIssueWebhook
- [x] CreateCommentWebhook
- [x] UpdateCommentWebhook
- [x] RemoveCommentWebhook
- [x] CreateIssueLabelWebhook
- [x] UpdateIssueLabelWebhook
- [x] RemoveIssueLabelWebhook
- [ ] CreateReactionWebhook
- [ ] UpdateCycleWebhook
- [x] CreateProjectWebhook
- [x] UpdateProjectWebhook
- [x] RemoveProjectWebhook
- [ ] UnknownWebhook
