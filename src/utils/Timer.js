class Timer {
  constructor(options) {
    this.options = options;
    this.miliseconds = (60 * 60 * options.hours + 60 * options.min + options.seconds) * 1000;
    this.startTime = Date.now();
    this.count = 0;
    this.remain = this.seconds * 1000;
    this.start();
  }
  start = () => {
    this.intervalID = setInterval(this.tick.bind(this), 100);
  }
  tick = () => {
    let elapsed = Date.now() - this.startTime;

    let remain = this.seconds * 1000 - elapsed;
    if (this.remain - remain > 1000) {
      this.remain = remain;
      this.onSecond();
    } else {
      this.options.onFinish();
      clearInterval(this.intervalID);
    }

    if (this.remain <= 0) {

    }
  }
  onSecond () {
  }
  onFinish () {

  }
}

export default Timer;
