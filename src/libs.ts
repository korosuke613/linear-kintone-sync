import { Env } from "@humanwhocodes/env";

export interface KintoneAppConfig {
  id: string;
  token: string;
}

export interface KintoneApps {
  baseUrl: string;
  issue: KintoneAppConfig;
}

export type RecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};

export const getKintoneAppsFromEnv = (): KintoneApps => {
  const env = new Env();

  const baseUrl = env.require("KINTONE_BASE_URL");
  const issue: KintoneAppConfig = {
    id: env.require("KINTONE_ISSUE_APP_ID"),
    token: env.require("KINTONE_ISSUE_APP_TOKEN"),
  };

  return {
    baseUrl,
    issue,
  };
};
