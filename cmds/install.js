const line = require("readline");
const { SfdxException } = require("../lib/sfdx-exception");
const { install, reportInstallation } = require("../utils/package");
const { query } = require("../utils/data");

async function waitForDelay(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

module.exports = async (args) => {
  const cmdOptions = { verbose: args.verbose || false };
  const options = {
    devhub: args.devhub || args.v,
    targetOrg: args.alias || args.a,
    name: args.name || args.n,
    tag: args.tag || args.t,
  };

  const queryString = `SELECT Id,SubscriberPackageVersionId FROM Package2Version WHERE Package2.Name = '${options.name}' AND tag = '${options.tag}' LIMIT 1`;
  let queryResult = await query(
    { queryString, targetOrg: options.devhub },
    cmdOptions
  );
  const packageVersionId =
    queryResult.result.records[0].SubscriberPackageVersionId;
  const result = await install({ packageVersionId, ...options }, cmdOptions);

  if (result.status === 1) {
    throw new SfdxException(result);
  }

  const { Id } = result.result;
  let counter = 1;
  let reportResult = await reportInstallation(
    { targetOrg: options.targetOrg, requestId: Id },
    cmdOptions
  );

  while (
    reportResult.result.Status !== "SUCCESS" &&
    reportResult.result.Status !== "ERROR"
  ) {
    process.stdout.write(`Waiting for retry #${counter}`);
    await waitForDelay(10000);
    line.clearLine(process.stdout, 0);
    line.cursorTo(process.stdout, 0);
    reportResult = await reportInstallation(
      { targetOrg: options.targetOrg, requestId: Id },
      cmdOptions
    );
    counter += 1;
  }

  process.stdout.write(JSON.stringify(reportResult));
};
