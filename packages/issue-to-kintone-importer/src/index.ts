import { LKSImporter } from "./LKSImporter";

(async () => {
  const lksImporter = new LKSImporter();
  console.log(await lksImporter.exportIssueToCSV());
})();
