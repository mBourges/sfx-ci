const line = require('readline');
const LOG_SYMBOLS = require('./log-symbols');

const characters = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

module.exports = class Spinner {
  intervalId = null;
  message = null;

  constructor(message = '') {
    this.message = message;
  }

  start() {
    let index = 0;
    process.stdout.write('\x1B[?25l');
    process.stdout.write('  ' + this.message);

    this.intervalId = setInterval(() => {
      let char = characters[index];

      line.cursorTo(process.stdout, 0);
      process.stdout.write(char);
      index = index >= characters.length - 1 ? 0 : index + 1;
    }, 80);
  }

  success() {
    line.cursorTo(process.stdout, 0);
    process.stdout.write(LOG_SYMBOLS.success);
    this.stop();
  }

  error() {
    line.cursorTo(process.stdout, 0);
    process.stdout.write(LOG_SYMBOLS.error);
    this.stop();
  }

  stop() {
    clearInterval(this.intervalId);
    line.cursorTo(process.stdout, this.message.length + 1);
    process.stdout.write('\n');
    process.stdout.write('\x1B[?25h');
    this.intervalId = null;
  }
}
