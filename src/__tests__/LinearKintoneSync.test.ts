import nock from "nock";
import { KintoneApps, LinearKintoneSync } from "../index";
import { createIssue } from "./data/createIssue";
import { CreateIssueWebhook } from "linear-webhook";

const dummyKintoneApps: KintoneApps = {
  baseUrl: "https://korosuke613.cybozu.com",
  issue: {
    id: "0",
    token: "token",
  },
};

let lks: LinearKintoneSync;
beforeEach(() => {
  lks = new LinearKintoneSync(dummyKintoneApps);
});

describe(LinearKintoneSync, () => {
  test("#handle CreateIssue", async () => {
    nock(dummyKintoneApps.baseUrl)
      .post("/k/v1/record.json")
      .reply(200, { id: 0, revision: 0 });

    const actual = await lks.handle(createIssue);
    const expected = {
      app: "0",
      record: {
        boardOrder: {
          value: "-86.81",
        },
        createdAt: {
          value: "2021-01-30T11:19:39.427Z",
        },
        creatorId: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
        },
        id: {
          value: "236e0fe8-xxxx-xxxx-xxxx-b2df06e33810",
        },
        labelIds: {
          value: "",
        },
        number: {
          value: "11",
        },
        previousIdentifiers: {
          value: "",
        },
        priority: {
          value: "0",
        },
        priorityLabel: {
          value: "No priority",
        },
        state: {
          value: "[object Object]",
        },
        stateId: {
          value: "c02edc3a-xxxx-xxxx-xxxx-85c349766a13",
        },
        subscriberIds: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
        },
        team: {
          value: "[object Object]",
        },
        teamId: {
          value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
        },
        title: {
          value: "webhook test",
        },
        updatedAt: {
          value: "2021-01-30T11:19:39.427Z",
        },
      },
    };

    expect(actual).toEqual(expected);
  });

  test("#addCustomeCallback", async () => {
    lks.addCustomCallback<CreateIssueWebhook>(
      "CreateIssueWebhook",
      (webhook) => {
        return webhook.data.id;
      }
    );

    const actual = await lks.handle(createIssue);
    expect(actual).toEqual("236e0fe8-xxxx-xxxx-xxxx-b2df06e33810");
  });
});
