// eslint-disable-next-line node/no-extraneous-import
import nock from "nock";
import { KintoneApps, LinearKintoneSync } from "../index";
import { createIssue } from "./data/createIssue";
import { CreateIssueWebhook } from "linear-webhook";
import { updateIssueForLabel } from "./data/updateIssue";
import { removeIssue } from "./data/removeIssue";

const dummyKintoneApps: KintoneApps = {
  baseUrl: "https://korosuke613.cybozu.com",
  issue: {
    id: "0",
    token: "token",
    fieldCodeOfPrimaryKey: "id",
  },
};

let lks: LinearKintoneSync;
beforeEach(() => {
  lks = new LinearKintoneSync(dummyKintoneApps);
  nock.cleanAll();
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
        stateId: {
          value: "c02edc3a-xxxx-xxxx-xxxx-85c349766a13",
        },
        subscriberIds: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
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

  describe("#handle UpdateIssue", () => {
    test("正常系", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get(
          "/k/v1/records.json?app=0&query=id%20%3D%20236e0fe8-xxxx-xxxx-xxxx-b2df06e33810"
        )
        .reply(200, { records: [{ hoge: "hoge" }] });
      nock(dummyKintoneApps.baseUrl)
        .put("/k/v1/record.json")
        .reply(200, { revision: 1 });

      const actual = await lks.handle(updateIssueForLabel);
      const expected = {
        app: "0",
        updateKey: {
          field: "id",
          value: "236e0fe8-xxxx-xxxx-xxxx-b2df06e33810",
        },
        record: {
          assigneeId: {
            value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
          },
          boardOrder: {
            value: "-86.81",
          },
          createdAt: {
            value: "2021-01-30T11:19:39.427Z",
          },
          labelIds: {
            value: "",
          },
          subscriberIds: {
            value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
          },
          previousIdentifiers: {
            value: "",
          },
          creatorId: {
            value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
          },
          cycleId: {
            value: "8becebd5-xxxx-xxxx-xxxx-5a4c46206590",
          },
          number: {
            value: "11",
          },
          priority: {
            value: "0",
          },
          priorityLabel: {
            value: "No priority",
          },
          stateId: {
            value: "e788ada6-xxxx-xxxx-xxxx-5717c26104ad",
          },
          teamId: {
            value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
          },
          title: {
            value: "webhook test",
          },
          updatedAt: {
            value: "2021-01-30T11:24:17.747Z",
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    test("存在しない fieldCodeOfPrimaryKey を使うとエラーになる", async () => {
      const invalidKintoneApps: KintoneApps = {
        baseUrl: "https://invalidKorosuke613.cybozu.com",
        issue: {
          id: "0",
          token: "token",
          fieldCodeOfPrimaryKey: "invalid",
        },
      };
      const invalidLks = new LinearKintoneSync(invalidKintoneApps);

      await expect(invalidLks.handle(updateIssueForLabel)).rejects.toThrow(
        "fieldCodeOfPrimaryKey is invalid: invalid"
      );
    });
    test("kintone rest apiのエラーをそのままthrowする", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get(
          "/k/v1/records.json?app=0&query=id%20%3D%20236e0fe8-xxxx-xxxx-xxxx-b2df06e33810"
        )
        .reply(520, {
          message: "エラーテスト",
          id: "123456",
          code: "ErrorCode",
        });
      await expect(lks.handle(updateIssueForLabel)).rejects.toThrow(
        "[520] [ErrorCode] エラーテスト (123456)"
      );
    });

    test("kintone rest apiのエラーをthrowした時にheadersの中身が空である", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get(
          "/k/v1/records.json?app=0&query=id%20%3D%20236e0fe8-xxxx-xxxx-xxxx-b2df06e33810"
        )
        .reply(520, {
          message: "エラーテスト",
          id: "123456",
          code: "ErrorCode",
        });
      try {
        await lks.handle(updateIssueForLabel);
      } catch (e) {
        expect(e.headers).toEqual({});
      }
    });

    test("issueレコードの存在確認時に複数のレコードが返ってきたらエラーを出す", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get(
          "/k/v1/records.json?app=0&query=id%20%3D%20236e0fe8-xxxx-xxxx-xxxx-b2df06e33810"
        )
        .reply(200, { records: [{ hoge: "hoge" }, { fuga: "fuga" }] });
      await expect(lks.handle(updateIssueForLabel)).rejects.toThrow(
        "id is not uniq field"
      );
    });

    test("issueのレコードがない場合、addIssueを呼び出す", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get(
          "/k/v1/records.json?app=0&query=id%20%3D%20236e0fe8-xxxx-xxxx-xxxx-b2df06e33810"
        )
        .reply(200, { records: [] });
      nock(dummyKintoneApps.baseUrl)
        .post("/k/v1/record.json")
        .reply(200, { id: 0, revision: 0 });
      nock(dummyKintoneApps.baseUrl)
        .put("/k/v1/record.json")
        .reply(200, { revision: 1 });

      await lks.handle(updateIssueForLabel);
    });
  });

  test("#handle RemoveIssue", async () => {
    nock(dummyKintoneApps.baseUrl)
      .get(
        "/k/v1/records.json?app=0&query=id%20%3D%20ac36bcc2-xxxx-xxxx-xxxx-3e13107f89be"
      )
      .reply(200, { records: [{ hoge: "hoge" }] });
    nock(dummyKintoneApps.baseUrl)
      .put("/k/v1/record.json")
      .reply(200, { revision: 1 });

    const actual = await lks.handle(removeIssue);
    const expected = {
      app: "0",
      updateKey: {
        field: "id",
        value: "ac36bcc2-xxxx-xxxx-xxxx-3e13107f89be",
      },
      record: {
        archivedAt: {
          value: "2021-01-30T11:48:48.707Z",
        },
        boardOrder: {
          value: "-40.42",
        },
        createdAt: {
          value: "2021-01-30T11:33:45.487Z",
        },
        labelIds: {
          value: "",
        },
        subscriberIds: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
        },
        previousIdentifiers: {
          value: "",
        },
        creatorId: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
        },
        number: {
          value: "12",
        },
        priority: {
          value: "0",
        },
        priorityLabel: {
          value: "No priority",
        },
        stateId: {
          value: "c02edc3a-xxxx-xxxx-xxxx-85c349766a13",
        },
        teamId: {
          value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
        },
        title: {
          value: "webhook test 2",
        },
        updatedAt: {
          value: "2021-01-30T11:33:45.487Z",
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
