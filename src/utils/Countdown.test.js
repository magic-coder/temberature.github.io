import Countdown from './Countdown';

test('invalid input', () => {

   try {
    new Countdown();
    new Countdown(
      '5',
    );
   } catch(e) {
    //  console.log(e);
   }

  new Countdown(
    1,
    function(seconds) {
      console.log(seconds);
    },
  );
  new Countdown(
    '5',
    function(seconds) {
      console.log(seconds);
    },
    function() {
      console.log('complete');
    }
  );
});
