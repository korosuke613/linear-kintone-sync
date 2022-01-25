import { UpdateIssueWebhook } from "linear-webhook";

export const updateIssueWithAddIssueLabel: UpdateIssueWebhook = {
  action: "update",
  createdAt: "2022-01-25T10:35:50.570Z",
  data: {
    id: "0d69dbdd-xxxx-xxxx-xxxx-ae377ce0db02",
    createdAt: "2021-04-17T09:02:47.183Z",
    updatedAt: "2022-01-25T10:35:50.570Z",
    number: 57,
    title: "aaaa",
    priority: 0,
    boardOrder: -4216.72,
    sortOrder: -4216.72,
    startedAt: "2021-04-17T09:02:47.204Z",
    teamId: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
    cycleId: "7ad73f6d-xxxx-xxxx-xxxx-581c67a609b5",
    previousIdentifiers: [],
    creatorId: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
    stateId: "76984209-xxxx-xxxx-xxxx-78eb458a7cbe",
    priorityLabel: "No priority",
    subscriberIds: ["80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39"],
    labelIds: [
      "80a1fec2-xxxx-xxxx-xxxx-0ad8b5e394e8",
      "80a1fec2-xxxx-xxxx-xxxx-0ad8b5e394eb",
    ],
    cycle: {
      id: "7ad73f6d-xxxx-xxxx-xxxx-581c67a609b5",
      number: 25,
      startsAt: "2022-01-23T15:00:00.000Z",
      endsAt: "2022-02-06T15:00:00.000Z",
    },
    state: {
      id: "76984209-xxxx-xxxx-xxxx-78eb458a7cbe",
      name: "In Review",
      color: "#0f783c",
      type: "started",
    },
    team: {
      id: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
      name: "korosuke613",
      key: "KOR",
    },
    labels: [
      {
        id: "80a1fec2-xxxx-xxxx-xxxx-0ad8b5e394e8",
        name: "Improvement",
        color: "#4EA7FC",
      },
    ],
  },
  updatedFrom: {
    updatedAt: "2022-01-23T14:58:11.258Z",
    archivedAt: "2022-01-23T14:58:11.258Z",
  },
  url: "https://linear.app/hogehoge/issue/KOR-57/aaaa",
  type: "Issue",
};
