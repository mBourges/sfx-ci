const CommandStream = require('../lib/command-stream');

function push({ alias }, cmdOptions) {
  const loggerOptions = { ...cmdOptions, message: `Push sources to ${alias}`};

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:source:push', '--json', '-u', alias, '-w', '60'],
      loggerOptions
    );

    child.on('done', result => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { push }
