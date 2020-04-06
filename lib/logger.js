const LOG_SYMBOLS = require('./log-symbols');

module.exports = class Logger {
  isVerbose = false;

  constructor({ verbose }) {
    this.isVerbose = verbose;
  }

  write(symbol, message) {
    if (this.isVerbose) {
      process.stdout.write(`${symbol} ${message}\n`);
    }
  }

  success(message) {
    this.write(LOG_SYMBOLS.success, message);
  }

  info(message) {
    this.write(LOG_SYMBOLS.info, message);
  }

  warning(message) {
    this.write(LOG_SYMBOLS.warning, message);
  }

  error(message) {
    this.write(LOG_SYMBOLS.error, message);
  }
};