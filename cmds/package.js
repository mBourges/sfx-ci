const line = require('readline');
const { SfdxException } = require('../lib/sfdx-exception');
const { create, report } = require('../utils/package');

async function waitForDelay(millis) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, millis);
  })
}

module.exports = async (args) => {
  const options = {
    devhub: args.devhub || args.b,
    name:  args.name || args.n
  }

  const result = await create(options);

  if (result.status === 1) {
    throw new SfdxException(result);
  }

  const { Id } = result.result;
  let counter = 1;
  let reportResult = await report({ devhub: options.devhub, requestId: Id});

  while(reportResult.result[0].Status !== 'Success' && reportResult.result[0].Status !== 'Error') {
    process.stdout.write(`Waiting for retry #${counter}`)
    await waitForDelay(5000);
    line.clearLine(process.stdout, 0)
    line.cursorTo(process.stdout, 0)
    reportResult = await report({ devhub: options.devhub, requestId: Id});
    counter += 1;
  }

  console.log(reportResult)
}