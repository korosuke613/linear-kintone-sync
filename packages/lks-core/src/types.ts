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

export type KintoneAppTypes = "Issue" | "Project";

export type RecordForParameter = {
  [fieldCode: string]: {
    value: unknown;
  };
};
