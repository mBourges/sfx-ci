const line = require("readline");
const { SfdxException } = require("../lib/sfdx-exception");
const { runTests, report } = require("../utils/apex");
const { query } = require("../utils/data");

async function waitForDelay(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

function createQuery(testRunId) {
  return `select Status from ApexTestRunResult where AsyncApexJobId = '${testRunId}'`;
}

module.exports = async (args) => {
  const cmdOptions = { verbose: args.verbose || false };
  let options = {
    targetOrg: args.alias || args.a,
    outputFolder: args.folder || args.f || "./test-results",
  };

  const result = await runTests(options, cmdOptions);
  const queryString = createQuery(result.result.testRunId);
  options = { ...options, testRunId: result.result.testRunId };
  let queryResult = await query({ queryString, ...options });
  let testStatus = queryResult.result.records[0].Status;

  while (
    testStatus !== "Completed" &&
    testStatus !== "Failed" &&
    testStatus !== "Aborted"
  ) {
    console.log("Waiting...");
    await waitForDelay(30000);
    queryResult = await query({ queryString, ...options }, cmdOptions);
    testStatus = queryResult.result.records[0].Status;
  }

  let allResults = {};

  if (testStatus === "Completed") {
    allResults = await report(options, cmdOptions);
  }

  process.stdout.write(JSON.stringify(allResults));
};
