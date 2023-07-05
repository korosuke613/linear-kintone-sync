import {
  generateKintoneRecordParam,
  getKintoneAppsFromEnv,
  LinearData,
} from "../libs";
import { KintoneApps } from "../types";

process.env.KINTONE_BASE_URL = "a";
process.env.KINTONE_ISSUE_APP_ID = "b";
process.env.KINTONE_ISSUE_APP_TOKEN = "c";
process.env.KINTONE_PROJECT_APP_ID = "b";
process.env.KINTONE_PROJECT_APP_TOKEN = "c";
process.env.KINTONE_STATE_APP_ID = "b";
process.env.KINTONE_STATE_APP_TOKEN = "c";
process.env.KINTONE_COMMENT_APP_ID = "d";
process.env.KINTONE_COMMENT_APP_TOKEN = "e";
process.env.KINTONE_ISSUE_LABEL_APP_ID = "f";
process.env.KINTONE_ISSUE_LABEL_APP_TOKEN = "t";

test("#getKintoneAppsFromEnv", () => {
  const actual = getKintoneAppsFromEnv();
  const expected: KintoneApps = {
    baseUrl: "a",
    issue: {
      id: "b",
      token: ["c", "c", "c", "t"],
      fieldCodeOfPrimaryKey: "$id",
    },
    project: {
      id: "b",
      token: "c",
      fieldCodeOfPrimaryKey: "id",
    },
    comment: {
      id: "d",
      token: ["e", "c"],
      fieldCodeOfPrimaryKey: "id",
    },
    issueLabel: {
      id: "f",
      token: ["t"],
      fieldCodeOfPrimaryKey: "id",
    },
  };

  expect(actual).toEqual(expected);
});

test("#generateKintoneRecordParam", () => {
  const data: LinearData = {
    id: "c319cc7b-9b71-45d1-a622-9d984dcad86e",
    createdAt: "2023-07-05T08:47:23.876Z",
    updatedAt: "2023-07-05T09:58:23.849Z",
    archivedAt: null,
    number: 3013,
    title:
      "Linekin を Node.js v18 対応する & Serverless Framework のバージョンを v3 にする",
    priority: 0,
    estimate: 0,
    boardOrder: 0,
    sortOrder: -115030.18,
    startedAt: "2023-07-05T09:47:41.769Z",
    completedAt: null,
    startedTriageAt: null,
    triagedAt: null,
    canceledAt: null,
    autoClosedAt: null,
    autoArchivedAt: null,
    dueDate: null,
    slaStartedAt: null,
    slaBreachesAt: null,
    trashed: null,
    snoozedUntilAt: null,
    teamId: "e2f11c88-b8f0-4471-b25f-0bc01696a841",
    cycleId: "c4f95561-1c77-4857-97a0-54add63e7c59",
    projectId: null,
    projectMilestoneId: null,
    previousIdentifiers: [],
    creatorId: "9c5bb5e4-3ad5-4b0f-8407-c822da1d440d",
    externalUserCreatorId: null,
    assigneeId: "9c5bb5e4-3ad5-4b0f-8407-c822da1d440d",
    snoozedById: null,
    stateId: "e6611723-ccf6-43c7-9a0b-3d69bd8ae4d4",
    subIssueSortOrder: 56,
    priorityLabel: "No priority",
    subscriberIds: ["9c5bb5e4-3ad5-4b0f-8407-c822da1d440d"],
    parentId: "c9de6516-84e1-463c-8b1e-57fce672f51e",
    labelIds: ["f561fefd-4f22-459a-b14c-1d3f7a9d9e3f"],
    assignee: {
      id: "9c5bb5e4-3ad5-4b0f-8407-c822da1d440d",
      name: "Futa Hirakoba a.k.a. Kiba",
    },
    cycle: {
      id: "c4f95561-1c77-4857-97a0-54add63e7c59",
      number: 131,
      startsAt: "2023-07-02T15:00:00.000Z",
      endsAt: "2023-07-09T15:00:00.000Z",
    },
    state: {
      id: "e6611723-ccf6-43c7-9a0b-3d69bd8ae4d4",
      color: "#f2c94c",
      name: "🤗 ひとりでやってるもん",
      type: "started",
    },
    team: {
      id: "e2f11c88-b8f0-4471-b25f-0bc01696a841",
      key: "EPT",
      name: "EPT",
    },
    labels: [
      {
        id: "f561fefd-4f22-459a-b14c-1d3f7a9d9e3f",
        color: "#0F783C",
        name: "ひとりでできるもん",
      },
    ],
    description:
      "### 実況スレ\n\n### やること\n\n* [X] node.js 18 に更新\n* [X] sls v3 に更新 \n\n \n\n### やらないこと\n\n* ",
    descriptionData:
      '{"type":"doc","content":[{"type":"heading","attrs":{"level":3},"content":[{"text":"実況スレ","type":"text"}]},{"type":"paragraph"},{"type":"heading","attrs":{"level":3},"content":[{"text":"やること","type":"text"}]},{"type":"todo_list","content":[{"type":"todo_item","attrs":{"done":true},"content":[{"type":"paragraph","content":[{"text":"node.js 18 に更新","type":"text"}]}]},{"type":"todo_item","attrs":{"done":true},"content":[{"type":"paragraph","content":[{"text":"sls v3 に更新 ","type":"text"}]}]}]},{"type":"paragraph","content":[{"text":" ","type":"text"}]},{"type":"heading","attrs":{"level":3},"content":[{"text":"やらないこと","type":"text"}]},{"type":"bullet_list","content":[{"type":"list_item","content":[{"type":"paragraph"}]}]},{"type":"paragraph"}]}',
  };

  const actual = generateKintoneRecordParam(data);
  console.log(actual);
});
