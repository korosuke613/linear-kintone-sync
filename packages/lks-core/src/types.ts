export interface KintoneAppConfig {
  id: string;
  token: string | string[];
  fieldCodeOfPrimaryKey: string;
}

export interface KintoneApps {
  baseUrl: string;
  issue: KintoneAppConfig;
  project: KintoneAppConfig;
  comment: KintoneAppConfig;
  issueLabel: KintoneAppConfig;
}

export type KintoneAppTypes = "issue" | "project" | "comment" | "issueLabel";

export type RecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};
