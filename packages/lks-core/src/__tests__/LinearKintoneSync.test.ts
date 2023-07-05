// eslint-disable-next-line node/no-extraneous-import
import nock from "nock";
import { KintoneApps, LinearKintoneSync } from "../index";
import { createIssue } from "./data/createIssue";
import { CreateIssueWebhook } from "linear-webhook";
import { updateIssueForLabel } from "./data/updateIssue";
import { removeIssue } from "./data/removeIssue";
import { createIssueLabel } from "./data/createIssueLabel";
import { updateIssueLabel } from "./data/updateIssueLabel";
import { updateIssueWithAddIssueLabel } from "./data/updateIssueWithAddIssueLabel";

const dummyKintoneApps: KintoneApps = {
  baseUrl: "https://korosuke613.cybozu.com",
  issue: {
    id: "0",
    token: "token",
    fieldCodeOfPrimaryKey: "$id",
  },
  project: {
    id: "0",
    token: "token",
    fieldCodeOfPrimaryKey: "id",
  },
  comment: {
    id: "0",
    token: "token",
    fieldCodeOfPrimaryKey: "id",
  },
  issueLabel: {
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
      .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2270%22")
      .once()
      .reply(200, { records: [] });
    nock(dummyKintoneApps.baseUrl)
      .post("/k/v1/record.json")
      .reply(200, { id: 0, revision: 0 });
    nock(dummyKintoneApps.baseUrl)
      .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2270%22")
      .once()
      .reply(200, { records: [{ id: { value: "" } }] });
    nock(dummyKintoneApps.baseUrl)
      .put("/k/v1/record.json")
      .reply(200, { revision: 1 });

    const actual = await lks.handle(createIssue);
    const expected = {
      id: 70,
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
          value: "70",
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
        Url: {
          value: "https://linear.app/korosuke613/issue/KOR-11/webhook-test",
        },
      },
    };

    expect(actual).toEqual(expected);
  });

  describe("#handle UpdateIssue", () => {
    test("正常系", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
        .reply(200, { records: [{ hoge: "hoge" }] });
      nock(dummyKintoneApps.baseUrl)
        .put("/k/v1/record.json")
        .reply(200, { revision: 1 });

      const actual = await lks.handle(updateIssueForLabel);
      const expected = {
        app: "0",
        id: 11,
        record: {
          id: {
            value: "236e0fe8-xxxx-xxxx-xxxx-b2df06e33810",
          },
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
          Url: {
            value: "https://linear.app/korosuke613/issue/KOR-11/webhook-test",
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    test("正常系（issueLabel付き）", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2257%22")
        .reply(200, { records: [{ hoge: "hoge" }] });
      nock(dummyKintoneApps.baseUrl)
        .put("/k/v1/record.json")
        .reply(200, { revision: 1 });

      const actual = await lks.handle(updateIssueWithAddIssueLabel);
      const expected = {
        app: "0",
        id: 57,
        record: {
          LabelIdsTable: {
            value: [
              {
                value: {
                  labelId: {
                    value: "80a1fec2-xxxx-xxxx-xxxx-0ad8b5e394e8",
                  },
                },
              },
              {
                value: {
                  labelId: {
                    value: "80a1fec2-xxxx-xxxx-xxxx-0ad8b5e394eb",
                  },
                },
              },
            ],
          },
          id: {
            value: "0d69dbdd-xxxx-xxxx-xxxx-ae377ce0db02",
          },
          boardOrder: {
            value: "-4216.72",
          },
          createdAt: {
            value: "2021-04-17T09:02:47.183Z",
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
            value: "7ad73f6d-xxxx-xxxx-xxxx-581c67a609b5",
          },
          number: {
            value: "57",
          },
          priority: {
            value: "0",
          },
          priorityLabel: {
            value: "No priority",
          },
          stateId: {
            value: "76984209-xxxx-xxxx-xxxx-78eb458a7cbe",
          },
          teamId: {
            value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
          },
          title: {
            value: "aaaa",
          },
          updatedAt: {
            value: "2022-01-25T10:35:50.570Z",
          },
          Url: {
            value: "https://linear.app/hogehoge/issue/KOR-57/aaaa",
          },
          sortOrder: {
            value: "-4216.72",
          },
          startedAt: {
            value: "2021-04-17T09:02:47.204Z",
          },
        },
      };

      expect(actual).toEqual(expected);
    });

    test("issue の fieldCodeOfPrimaryKey で $id を使わないとエラーになる", async () => {
      const invalidKintoneApps: KintoneApps = {
        baseUrl: "https://invalidKorosuke613.cybozu.com",
        issue: {
          id: "0",
          token: "token",
          fieldCodeOfPrimaryKey: "invalid",
        },
        project: {
          id: "0",
          token: "token",
          fieldCodeOfPrimaryKey: "invalid",
        },
        comment: {
          id: "0",
          token: "token",
          fieldCodeOfPrimaryKey: "invalid",
        },
        issueLabel: {
          id: "0",
          token: "token",
          fieldCodeOfPrimaryKey: "invalid",
        },
      };

      await expect(() => {
        new LinearKintoneSync(invalidKintoneApps);
      }).toThrow("Needs issue.fieldCodeOfPrimaryKey is $id");
    });

    test("kintone rest apiのエラーをそのままthrowする", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
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
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
        .reply(520, {
          message: "エラーテスト",
          id: "123456",
          code: "ErrorCode",
        });
      try {
        await lks.handle(updateIssueForLabel);
      } catch (e: any) {
        expect(e.headers).toEqual({});
      }
    });

    test("issueレコードの存在確認時に複数のレコードが返ってきたらエラーを出す", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
        .reply(200, { records: [{ hoge: "hoge" }, { fuga: "fuga" }] });
      await expect(lks.handle(updateIssueForLabel)).rejects.toThrow(
        "id is not uniq field"
      );
    });

    test("issueのレコードがない場合、addIssueを呼び出す", async () => {
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
        .reply(200, { records: [] });
      nock(dummyKintoneApps.baseUrl)
        .post("/k/v1/record.json")
        .reply(200, { id: 0, revision: 0 });
      nock(dummyKintoneApps.baseUrl)
        .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2211%22")
        .reply(200, { records: [{ id: { value: 0 } }] });
      nock(dummyKintoneApps.baseUrl)
        .put("/k/v1/record.json")
        .reply(200, { revision: 1 });

      await lks.handle(updateIssueForLabel);
    });
  });

  test("#handle RemoveIssue", async () => {
    nock(dummyKintoneApps.baseUrl)
      .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2212%22")
      .reply(200, { records: [{ hoge: "hoge" }] });
    nock(dummyKintoneApps.baseUrl)
      .put("/k/v1/record.json")
      .reply(200, { revision: 1 });

    const actual = await lks.handle(removeIssue);
    const expected = {
      app: "0",
      id: 12,
      record: {
        id: {
          value: "ac36bcc2-xxxx-xxxx-xxxx-3e13107f89be",
        },
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

  test("#handle CreateIssueLabel", async () => {
    nock(dummyKintoneApps.baseUrl)
      .get("/k/v1/records.json?app=0&query=%24id%20%3D%20%2212%22")
      .reply(200, { records: [{ hoge: "hoge" }] });
    nock(dummyKintoneApps.baseUrl)
      .post("/k/v1/record.json")
      .reply(200, { id: 0, revision: 1 });

    const actual = await lks.handle(createIssueLabel);
    const expected = {
      param: {
        app: "0",
        record: {
          id: {
            value: "13aa50db-xxxx-xxxx-xxxx-1cdd26695e65",
          },
          createdAt: {
            value: "2021-02-07T09:17:51.393Z",
          },
          creatorId: {
            value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
          },
          color: {
            value: "#5a450d",
          },
          teamId: {
            value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
          },
          name: {
            value: "new label",
          },
          updatedAt: {
            value: "2021-02-07T09:17:51.393Z",
          },
        },
      },
      result: {
        id: 0,
        revision: 1,
      },
    };

    expect(actual).toEqual(expected);
  });

  test("#handle UpdateIssueLabel", async () => {
    nock(dummyKintoneApps.baseUrl)
      .get(
        "/k/v1/records.json?app=0&query=id%20%3D%20%2213aa50db-xxxx-xxxx-xxxx-1cdd26695e65%22"
      )
      .reply(200, { records: [{ hoge: "hoge" }] });
    nock(dummyKintoneApps.baseUrl)
      .put("/k/v1/record.json")
      .reply(200, { revision: 1 });

    const actual = await lks.handle(updateIssueLabel);
    const expected = {
      app: "0",
      record: {
        createdAt: {
          value: "2021-02-07T09:17:51.393Z",
        },
        creatorId: {
          value: "80e102b0-xxxx-xxxx-xxxx-044bcfb4cd39",
        },
        color: {
          value: "#5a450d",
        },
        teamId: {
          value: "eeaa0cbd-xxxx-xxxx-xxxx-1c701c3485f1",
        },
        name: {
          value: "update new label",
        },
        updatedAt: {
          value: "2021-02-07T09:33:32.156Z",
        },
      },
      updateKey: {
        field: "id",
        value: "13aa50db-xxxx-xxxx-xxxx-1cdd26695e65",
      },
    };

    expect(actual).toEqual(expected);
  });
});
