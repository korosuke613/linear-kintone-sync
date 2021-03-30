// eslint-disable-next-line node/no-unpublished-import
import { AWS } from "@serverless/typescript";

const ACCOUNT_ID = process.env.ACCOUNT_ID!;
const REGION = "ap-northeast-1";
const QUEUE_NAME = "linear-webhook.fifo";
const SUBNET_INTRA = process.env.SUBNET_INTRA!;
const SECURITY_GROUP_ID = process.env.SECURITY_GROUP_ID!;
const KINTONE_BASE_URL = process.env.KINTONE_BASE_URL!;
const KINTONE_ISSUE_APP_TOKEN = process.env.KINTONE_ISSUE_APP_TOKEN!;
const KINTONE_ISSUE_APP_ID = process.env.KINTONE_ISSUE_APP_ID!;
const KINTONE_PROJECT_APP_TOKEN = process.env.KINTONE_PROJECT_APP_TOKEN!;
const KINTONE_PROJECT_APP_ID = process.env.KINTONE_PROJECT_APP_ID!;

const QUEUE_ARN = `arn:aws:sqs:${REGION}:${ACCOUNT_ID}:${QUEUE_NAME}`;

const serverlessConfiguration: AWS = {
  service: {
    name: "linear-kintone-sync",
  },
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    region: REGION,
    runtime: "nodejs12.x",
    // eslint-disable-next-line no-template-curly-in-string
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      QUEUE_NAME: QUEUE_NAME,
      ACCOUNT_ID: ACCOUNT_ID,
      REGION: REGION,
      KINTONE_BASE_URL: KINTONE_BASE_URL,
      KINTONE_ISSUE_APP_ID: KINTONE_ISSUE_APP_ID,
      KINTONE_ISSUE_APP_TOKEN: KINTONE_ISSUE_APP_TOKEN,
      KINTONE_PROJECT_APP_ID: KINTONE_PROJECT_APP_ID,
      KINTONE_PROJECT_APP_TOKEN: KINTONE_PROJECT_APP_TOKEN,
    },
    logRetentionInDays: 30,
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["sqs:*"],
        Resource: QUEUE_ARN,
      },
    ],
  },
  functions: {
    webhook: {
      handler: "handler.webhook",
      timeout: 60,
      events: [
        {
          http: {
            method: "post",
            path: "webhook",
          },
        },
        {
          http: {
            method: "head",
            path: "webhook",
          },
        },
      ],
    },

    execLKS: {
      handler: "handler.execLKS",
      events: [
        {
          sqs: {
            arn: QUEUE_ARN,
          },
        },
      ],
      vpc: {
        securityGroupIds: [SECURITY_GROUP_ID],
        subnetIds: [SUBNET_INTRA],
      },
    },
  },
  resources: {
    Resources: {
      LinearWebhooksQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: QUEUE_NAME,
          FifoQueue: true,
          ContentBasedDeduplication: true,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
