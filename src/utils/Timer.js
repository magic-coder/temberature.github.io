class Timer {
  constructor(options) {
    this.options = options;
    this.miliseconds =
      (60 * 60 * options.hours + 60 * options.min + options.seconds) * 1000;
    this.startTime = Date.now();
    this.remain = this.miliseconds;
    this.start();
  }
  start = () => {
    this.intervalID = setInterval(this.tick.bind(this), 1000);
  };
  tick = () => {
    let elapsed = Date.now() - this.startTime;

    let remain = this.miliseconds - elapsed;
    if (remain > 0) {
      this.remain = remain;
      this.options.onTick.bind(this)();
    } else {
      this.options.onFinish();
      clearInterval(this.intervalID);
    }
  };
}

export default Timer;
