import Moment from "moment";

class Timer {
  constructor(options) {
    this.options = options;
    this.options.onStart = this.options.onStart.bind(this);
    this.options.onTick = this.options.onTick.bind(this);
    this.options.onFinish = this.options.onFinish.bind(this);
    this.miliseconds =
      (60 * 60 * options.hours + 60 * options.min + options.seconds) * 1000;

    this.start = this.start.bind(this);
    this.tick = this.tick.bind(this);
  }
  start() {
    if (this.running) {
      return;
    }
    this.startTime = Date.now();
    this.intervalID = setInterval(this.tick, 900);
    this.remain = Moment(this.miliseconds).format(this.options.format);
    this.options.onStart();
    this.running = true;
  }
  tick() {
    let elapsed = Date.now() - this.startTime;

    let remain = this.miliseconds - elapsed;
    if (remain > 1000) {
      this.remain = Moment(remain).format(this.options.format);
      this.options.onTick();
    } else {
      clearInterval(this.intervalID);
      this.running = false;
      this.options.onFinish();
    }
  }
}

export default Timer;
