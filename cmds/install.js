const line = require('readline');
const { SfdxException } = require('../lib/sfdx-exception');
const { install, reportInstallation } = require('../utils/package');

async function waitForDelay(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, millis);
  })
}

module.exports = async (args) => {
  const options = {
    targetOrg: args.org || args.o,
    packageVersionId:  args.id || args.i
  }

  const result = await install(options);

  if (result.status === 1) {
    throw new SfdxException(result);
  }


  const { Id } = result.result;
  let counter = 1;
  let reportResult = await reportInstallation({ targetOrg: options.targetOrg, requestId: Id});


  while(reportResult.result.Status !== 'SUCCESS' && reportResult.result.Status !== 'ERROR') {
    process.stdout.write(`Waiting for retry #${counter}`)
    await waitForDelay(10000);
    line.clearLine(process.stdout, 0)
    line.cursorTo(process.stdout, 0)
    reportResult = await reportInstallation({ targetOrg: options.targetOrg, requestId: Id});
    counter += 1;
  }

  console.log(reportResult);
}