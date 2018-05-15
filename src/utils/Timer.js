import dateFormat from 'dateformat';

class Timer {
  constructor(options) {
    this.options = options;
    this.miliseconds =
      (60 * 60 * options.hours + 60 * options.min + options.seconds) * 1000;

  }
  start = () => {
    this.startTime = Date.now();
    this.intervalID = setInterval(this.tick.bind(this), 900);
    this.remain = dateFormat(this.miliseconds, 's');
    this.options.onStart.bind(this)();
  };
  tick = () => {
    let elapsed = Date.now() - this.startTime;

    let remain = this.miliseconds - elapsed;
    if (remain > 1000) {
      this.remain = dateFormat(remain, 's') ;
      this.options.onTick.bind(this)();
    } else {
      this.options.onFinish();
      clearInterval(this.intervalID);
    }
  };
}

export default Timer;
