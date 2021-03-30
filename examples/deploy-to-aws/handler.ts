import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  SQSEvent,
  SQSRecord,
  // eslint-disable-next-line node/no-missing-import
} from "aws-lambda";
import "source-map-support/register";
import { SQS } from "aws-sdk";
import { Webhook } from "linear-webhook";
// eslint-disable-next-line node/no-unpublished-import
import { LinearKintoneSync } from "../../packages/lks-core/src/LinearKintoneSync";

const isObject = (x: unknown): x is Record<string, unknown> =>
  x !== null && (typeof x === "object" || typeof x === "function");

export const webhook: APIGatewayProxyHandler = async (event, _context) => {
  let response: APIGatewayProxyResult = {
    statusCode: 500,
    body: "",
  };

  if (event.body === undefined) {
    // 不正なリクエストならエラーを返す
    console.error("ERROR\n" + event);
    return response;
  }

  const accountId = process.env.ACCOUNT_ID;
  const queueUrl = `https://sqs.${process.env.REGION}.amazonaws.com/${accountId}/${process.env.QUEUE_NAME}`;

  console.log(
    isObject(event.body) ? JSON.stringify(event.body, null, 2) : event.body!
  );

  const body: Webhook = isObject(event.body)
    ? event.body
    : JSON.parse(event.body!);
  console.log(body.type);
  const messageGroupId = body.data.id;

  const sendMessageRequest: SQS.Types.SendMessageRequest = {
    MessageBody: JSON.stringify(body, null, 2),
    QueueUrl: queueUrl,
    MessageGroupId: messageGroupId,
  };

  console.log(JSON.stringify(sendMessageRequest, null, 2));
  const sqs = new SQS();
  await sqs
    .sendMessage(sendMessageRequest)
    .promise()
    .then((data) => {
      response = {
        statusCode: 200,
        body: JSON.stringify(data, null, 2),
      };
      console.log("Send result\n" + JSON.stringify(data, null, 2));
    })
    .catch((err) => {
      response.body = err;
      throw err;
    });

  return response;
};

export const execLKS = async (event: SQSEvent) => {
  console.info("Popping data\n" + JSON.stringify(event, null, 2));
  const records: SQSRecord[] = event.Records;

  for (const record of records) {
    const linearWebhookEvent = {
      body: JSON.parse(unescape(record.body)),
    };
    console.info(
      "Linear webhook event\n" + JSON.stringify(linearWebhookEvent, null, 2)
    );

    const lks = new LinearKintoneSync();
    const result = await lks.handle(linearWebhookEvent.body);

    console.info("Operation\n" + JSON.stringify(result));
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "OK",
      },
      null,
      2
    ),
  };
};
