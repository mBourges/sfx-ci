// uncomment if fallback is necessary.

// const isSupported = process.platform !== 'win32'
//   || process.env.CI
//   || process.env.TERM === 'xterm-256color';

const main = {
  info: '\u001b[34mℹ\u001b[0m',
  success: '\u001b[32m✔\u001b[0m',
  warning: '\u001b[33m⚠\u001b[0m',
  error: '\u001b[31m✖\u001b[0m'
};

// const fallbacks = {
// 	info: '\u001b[34mi\u001b[0m',
// 	success: '\u001b[32m√\u001b[0m',
// 	warning: '\u001b[33m‼\u001b[0m',
// 	error: '\u001b[31m×\u001b[0m'
// };

module.exports = main;
// module.exports = isSupported ? main : fallbacks;