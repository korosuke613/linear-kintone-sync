import { Webhook, WebhookEventsUnion, WebhookHandler } from "linear-webhook";
import { KintoneRestAPIError } from "@kintone/rest-api-client";
import { getKintoneAppsFromEnv } from "./libs";
import {
  addComment,
  addProject,
  createIssueLabel,
  updateComment,
  updateIssue,
  updateIssueLabel,
  updateProject,
} from "./callbacks";
import { KintoneApps } from "./types";

export class LinearKintoneSync {
  private handler: WebhookHandler;
  private readonly apps: KintoneApps;

  constructor(kintoneApps?: KintoneApps) {
    this.handler = new WebhookHandler();
    this.apps =
      kintoneApps === undefined ? getKintoneAppsFromEnv() : kintoneApps;
    if (this.apps.issue.fieldCodeOfPrimaryKey !== "$id") {
      throw new Error("Needs issue.fieldCodeOfPrimaryKey is $id");
    }
    this.addCallbacks();
  }

  async handle(webhook: Webhook) {
    let result;
    console.log("--- Call handle() ---");
    try {
      result = await this.handler.execCallback(webhook, this.apps);
    } catch (e) {
      if (e instanceof KintoneRestAPIError) {
        e.headers = {};
      }
      throw e;
    }
    console.log("--- Finish ---");
    return result;
  }

  private addCallbacks() {
    this.handler.addCallback("CreateIssueWebhook", updateIssue);
    this.handler.addCallback("UpdateIssueWebhook", updateIssue);
    this.handler.addCallback("RemoveIssueWebhook", updateIssue);
    this.handler.addCallback("CreateProjectWebhook", addProject);
    this.handler.addCallback("UpdateProjectWebhook", updateProject);
    this.handler.addCallback("RemoveProjectWebhook", updateProject);
    this.handler.addCallback("CreateCommentWebhook", addComment);
    this.handler.addCallback("UpdateCommentWebhook", updateComment);
    this.handler.addCallback("RemoveCommentWebhook", updateComment);
    this.handler.addCallback("CreateIssueLabelWebhook", createIssueLabel);
    this.handler.addCallback("UpdateIssueLabelWebhook", updateIssueLabel);
    this.handler.addCallback("RemoveIssueLabelWebhook", updateIssueLabel);
  }

  addCustomCallback<T extends Webhook>(
    webhookEvent: WebhookEventsUnion,
    callback: (webhook: Webhook, param?: any) => any
  ) {
    this.handler.addCallback<T>(webhookEvent, callback);
  }
}
