export interface KintoneAppConfig {
  id: string;
  token: string;
  fieldCodeOfPrimaryKey: string;
}

export interface KintoneApps {
  baseUrl: string;
  issue: KintoneAppConfig;
  project: KintoneAppConfig;
}

export type KintoneAppTypes = "issue" | "project";

export type RecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};
