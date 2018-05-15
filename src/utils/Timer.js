import dateFormat from "dateformat";

class Timer {
  constructor(options) {
    this.options = options;
    this.miliseconds =
      (60 * 60 * options.hours + 60 * options.min + options.seconds) * 1000;
  }
  start = () => {
    if (this.running) {
      return;
    }
    this.startTime = Date.now();
    this.intervalID = setInterval(this.tick.bind(this), 900);
    this.remain = dateFormat(this.miliseconds, this.options.format);
    this.options.onStart.bind(this)();
    this.running = true;
  };
  tick = () => {
    let elapsed = Date.now() - this.startTime;

    let remain = this.miliseconds - elapsed;
    if (remain > 1000) {
      this.remain = dateFormat(remain, this.options.format);
      this.options.onTick.bind(this)();
    } else {
      clearInterval(this.intervalID);
      this.running = false;
      this.options.onFinish();
    }
  };
}

export default Timer;
