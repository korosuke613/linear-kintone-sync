export interface KintoneAppConfig {
  id: string;
  token: string;
  fieldCodeOfPrimaryKey: string;
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
