(function() {
  var root = this;

  var Countdown = function(duration, onTick, onComplete) {
    if (isNaN(duration) || duration < 1) {
      throw new Error("duration must be greater than 0");
    }
    if (!onTick && !onComplete) {
      throw new Error("lack all callback means nothing");
    }
    var secondsLeft = Math.round(duration),
      tick = function() {
        if (secondsLeft > 0) {
          onTick(secondsLeft);
          secondsLeft -= 1;
        } else {
          clearInterval(interval);
          onComplete && onComplete();
        }
      },
      // Setting the interval, by call tick and passing through this via a self-calling function wrap.
      interval = setInterval(
        (function(self) {
          return function() {
            tick.call(self);
          };
        })(this),
        1000
      );

    // First tick.
    tick.call(this);

    return {
      abort: function() {
        clearInterval(interval);
      },

      getRemainingTime: function() {
        return secondsLeft;
      }
    };
  };

  if (typeof exports !== "undefined") module.exports = exports = Countdown;
  else root.Countdown = Countdown;
}.call(this));
