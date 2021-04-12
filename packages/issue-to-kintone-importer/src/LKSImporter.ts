import { getLinearClient } from "./libs";
import { Issue, IssueConnection, LinearDocument } from "@linear/sdk";
import { createObjectCsvWriter } from "csv-writer";

const sleep = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

export class LKSImporter {
  private linear = getLinearClient();

  /**
   * Get all issues
   * @private
   */
  private async getIssues() {
    let allIssues = new Array<Issue>();
    let issues: IssueConnection | undefined;

    process.stdout.write("fetching Issues");
    do {
      process.stdout.write(".");
      issues = await this.linear.issues({
        orderBy: LinearDocument.PaginationOrderBy.CreatedAt,
        includeArchived: true,
        after: issues?.pageInfo?.endCursor,
        first: 10,
      });
      if (issues?.nodes === undefined) {
        break;
      }

      allIssues = allIssues.concat(issues.nodes);

      await sleep(1000);
    } while (issues?.pageInfo !== undefined && issues.pageInfo.hasNextPage);

    return allIssues;
  }

  private transformDateOfIssue(issues: Issue[]) {
    return issues.map((issue) => {
      const objectArrays = Object.entries(issue).map((param) => {
        if (param[0].endsWith("At")) {
          // Set the date to ISOString
          const time: Date = param[1];
          if (time === undefined) return { [param[0]]: undefined };
          return { [param[0]]: time.toISOString() };
        }
        if (param[0] === "url") {
          // Use only ascii code for URLs.
          const url: string = param[1];
          if (url === undefined) return { [param[0]]: url };
          const splitUrl = url.split("/");
          const simpleUrl = url.replace(splitUrl[splitUrl.length - 1], "");
          return { [param[0]]: simpleUrl };
        }
        return { [param[0]]: param[1] };
      });

      let returnIssues = {};
      objectArrays.forEach((obj) => {
        returnIssues = { ...returnIssues, ...obj };
      });
      return returnIssues;
    });
  }

  /**
   * export issues to CSV for kintone app
   */
  async exportIssueToCSV() {
    const issues = await this.getIssues();
    if (issues === undefined) {
      throw new Error("Issue is not found!");
    }

    const transformedIssue = this.transformDateOfIssue(issues);

    const headerKeys = Object.keys(issues[0]).filter(
      // _ is skipped because it will not be registered in the kintone application.
      // description is skipped because it contains a line feed code.
      (param) => param.startsWith("_") === false && param !== "description"
    );

    const headers = headerKeys.map((key) => {
      return {
        id: key,
        title: key,
      };
    });

    await createObjectCsvWriter({
      path: "./export.csv",
      header: headers,
      alwaysQuote: true,
    }).writeRecords(transformedIssue.reverse()); // Reverse to output in record number order
  }
}
