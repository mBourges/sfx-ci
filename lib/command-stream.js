const EventEmitter = require('events');
const { spawn } = require("child_process");
const Spinner = require('./spinner')

module.exports = class CommandStream extends EventEmitter {
  cmd = null;
  options = null;
  stdoutBuffer = Buffer.from([]);
  stderrBuffer = Buffer.from([]);
  spinner = null;

  constructor(cmd, options, message = '') {
    super();

    this.cmd = cmd;
    this.options = options;
    this.spinner = new Spinner(message);
  }

  get isError() {
    return this.stderrBuffer.length > 0;
  }


  execute() {
    this.spinner.start();

    const child = spawn(this.cmd, this.options, { shell: true });

    child.stdout.on("data", data => {
      this.stdoutBuffer = Buffer.concat([this.stdoutBuffer, data]);
    });

    child.stderr.on("data", data => {
      this.stderrBuffer = Buffer.concat([this.stderrBuffer, data]);
    });

    child.on("error", (code, signal) => {});

    child.on("exit", (code, signal) => {
      this.isError ? this.spinner.error() : this.spinner.success();

      const result = this.isError ? this.stderrBuffer : this.stdoutBuffer;
      const resultJson = JSON.parse(result.toString('utf8'));

      this.emit('done', resultJson);
    });
  }
}
