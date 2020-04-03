const CommandStream = require('../lib/command-stream');

function push({ alias }) {
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:source:push', '--json', '-u', alias, '-w', '60'],
      `Push sources to ${alias}`
    );

    child.on('done', result => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { push }
