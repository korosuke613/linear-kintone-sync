import { Webhook, WebhookEventsUnion, WebhookHandler } from "linear-webhook";
import { KintoneRestAPIError } from "@kintone/rest-api-client";
import { getKintoneAppsFromEnv } from "./libs";
import { addIssue, updateIssue } from "./callbacks";
import { KintoneApps } from "./types";

export class LinearKintoneSync {
  private handler: WebhookHandler;
  private readonly apps: KintoneApps;

  constructor(kintoneApps?: KintoneApps) {
    this.handler = new WebhookHandler();
    this.apps =
      kintoneApps === undefined ? getKintoneAppsFromEnv() : kintoneApps;
    this.addCallbacks();
  }

  getApps() {
    return this.apps;
  }

  async handle(webhook: Webhook) {
    let result;
    try {
      result = await this.handler.execCallback(webhook, this.apps);
    } catch (e) {
      if (e instanceof KintoneRestAPIError) {
        e.headers = {};
      }
      throw e;
    }
    return result;
  }

  private addCallbacks() {
    this.handler.addCallback("CreateIssueWebhook", addIssue);
    this.handler.addCallback("UpdateIssueWebhook", updateIssue);
    this.handler.addCallback("RemoveIssueWebhook", updateIssue);
  }

  addCustomCallback<T extends Webhook>(
    webhookEvent: WebhookEventsUnion,
    callback: (webhook: Webhook, param?: any) => any
  ) {
    this.handler.addCallback<T>(webhookEvent, callback);
  }
}
