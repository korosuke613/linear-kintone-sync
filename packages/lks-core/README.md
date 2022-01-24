# lks-core
Core package for Linear-kintone-sync.

[![CI](https://github.com/korosuke613/linear-kintone-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/korosuke613/linear-kintone-sync/actions/workflows/ci.yml) [![codecov](https://codecov.io/gh/korosuke613/linear-kintone-sync/branch/main/graph/badge.svg?token=FKTPW2L774)](https://codecov.io/gh/korosuke613/linear-kintone-sync)

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
