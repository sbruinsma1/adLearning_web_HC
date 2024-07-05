/*
some required definition in the task
 */
//pseudo random color
//3 colors version

import { initJsPsych } from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery';
import * as Math from 'mathjs';

// js-template but does not wokr
import Click from '../js/prediction';
import Blank from '../js/blank';
import Position from '../js/outcome';
import jsPsychHtmlbuttonResponse from '@jspsych/plugin-html-button-response';

import { images } from '../lib/utils';

// design
const n_TrialPerBlock = 200;
const n_TrialPractice = 5; //30
const n_SamePosition = 7;
const n_MaxJitter = 4; // 7-11, avg of 9
const rtDeadline = 15000;
// colorblind-friendly colors from Seaborn: ['#0173b2', '#de8f05', '#029e73', '#d55e00', '#cc78bc', '#ca9161', '#fbafe4', '#949494', '#ece133', '#56b4e9']
const all_colors = ['#0173b2', '#de8f05', '#029e73', '#cc78bc', '#000000', '#ece133']; // doesn't include practice block colors

//Generate Jitter
function GenerateJitter(TrialPerBlock, MaxJitter) {
  let jitters = [];
  jitters.length = TrialPerBlock + 1;
  for (let t = 0; t < TrialPerBlock; t++) {
    jitters[t] = Math.floor(Math.random() * (MaxJitter + 1));
  }
  return jitters;
}

// shuffle all colors (even across blocks)
const colors = jsPsych.randomization.shuffle(all_colors);

//colors for practice block
let colorP1 = '#029e73'; // change color choosing so not same as in main blocks?
const colorsP2 = ['#0173b2', '#de8f05'];
let colorP2 = colorsP2;
for (let h = 0; h < n_TrialPractice; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colorsP2);
  colorP2 = colorP2.concat(colorRepeat);
}

// colors for block 1
let color1 = colors[0]; // note: all trials have the same color

// colors for block 2
const colors2 = colors.slice(1, 3);
// const colors2 = ["#ffa4f1","#b0ff64"];
let color2 = colors2;
let n_trialsPerColor = Math.ceil(n_TrialPerBlock / 2);
for (let h = 0; h < n_trialsPerColor; h++) {
  //h<100
  let colorRepeat = jsPsych.randomization.shuffle(colors2);
  //     let a = color2.slice(color2.length-2); // a: first color
  //     if (colorRepeat.toString() !== a.toString() && colorRepeat[0] !== color2[color2.length-1]){
  //
  //           color2 = color2.concat(colorRepeat)
  //     }  else h--;
  color2 = color2.concat(colorRepeat);
}

// colors for block 3
const colors3 = colors.slice(3, 6);
n_trialsPerColor = Math.ceil(n_TrialPerBlock / 3);
let color3 = colors3;
for (let h = 0; h < n_trialsPerColor; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colors3);
  let b = color3.slice(color3.length - 3);
  if (colorRepeat.toString() !== b.toString() && colorRepeat[0] !== color3[color3.length - 1]) {
    color3 = color3.concat(colorRepeat);
  } else h--;
}

//define normal distribution functions
let spareRandom = null;
function normalRandom() {
  let val, u, v, s, mul;

  if (spareRandom !== null) {
    val = spareRandom;
    spareRandom = null;
  } else {
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;

      s = u * u + v * v;
    } while (s === 0 || s >= 1);

    mul = Math.sqrt((-2 * Math.log(s)) / s);

    val = u * mul;
    spareRandom = v * mul;
  }
  return val;
}
function normalRandomScaled(mean, stddev) {
  let r = normalRandom();

  r = r * stddev + mean;
  return r;
}
// make pseudo random position
const nums1 = angle_array();
const nums2_1 = angle_array();
const nums2_2 = angle_array();
const nums3_1 = angle_array();
const nums3_2 = angle_array();
const nums3_3 = angle_array();

function angle_array() {
  let nums = [];
  nums.length = n_TrialPerBlock + 1;
  for (let i = 1; i < nums.length; i++) {
    nums[i] = Math.floor(Math.random() * 359);
    for (let j = 0; j < i; j++) {
      while (nums[i] === nums[j]) {
        i--;
      }
    }
  }
  return nums;
}

// evaluate performance (cumulative across non-practice blocks)
function assessPerformance(prediction, outcome) {
  let pred_err = prediction - outcome;
  // convert to NaN to prevent unexpected math operations
  if (prediction == null) {
    pred_err = NaN;
  }
  // min distance around the circle in degrees
  let pred_err_min = Math.min(Math.mod(pred_err, 360), Math.mod(-pred_err, 360));
  let hit = 0;
  if (pred_err_min <= 20) {
    console.log('hit');
    hit = 1;
    //jsPsych.data.addDataToLastTrial({ score });
  } else {
    console.log('miss');
  }
  console.log(prediction, outcome);
  return hit;
}

/***
 *define blocks
 ***/

/***
 *practice block n < n_TrialPractice + 1
 */
function practice_block1(timeline, jsPsych) {
  let counterP_1 = 0;
  let c1 = 0;
  let jitters_1 = GenerateJitter(n_TrialPractice, n_MaxJitter);
  let trial_type_label = 'practice';

  for (let n = 1; n < n_TrialPractice + 1; n++) {
    const colorStyleP = colorP1;
    var x1;
    let prediction;
    let outcome;
    let mean;
      counterP_1++;
      if (counterP_1 <= n_SamePosition + jitters_1[c1]) {
        // counterP_1 = counterP_1;
      }
      if (counterP_1 > n_SamePosition + jitters_1[c1]) {
        counterP_1 = Math.mod(counterP_1, n_SamePosition + jitters_1[c1]);
        c1++;
      }
      if (counterP_1 === 1) {
        x1 = nums2_1[n];
      }
      if (counterP_1 !== 1) {
        // x1 = x1
      }
      // make task slightly easier for practicing with lower noise stdev -- CHANGED SO NOT TRUE (REALISTIC TO TASK)
      outcome = Math.mod(normalRandomScaled(x1, 20), 360);
      mean = x1;
      console.log(colorStyleP);
      console.log(mean);
      console.log(c1);
      console.log(jitters_1[c1]);
      console.log(outcome);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var practice = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(practice);
  }
}
function practice_block2(timeline, jsPsych) {
  let counterP_1 = 0;
  let counterP_2 = 0;
  let c1 = 0;
  let c2 = 0;
  let jitters_1 = GenerateJitter(n_TrialPractice, n_MaxJitter);
  let jitters_2 = GenerateJitter(n_TrialPractice, n_MaxJitter); // async changepoints for 2nd color
  let trial_type_label = 'practice';

  for (let n = 1; n < n_TrialPractice + 1; n++) {
    const colorStyleP = colorP2[n - 1];
    var x1;
    var x2;
    let prediction;
    let outcome;
    let mean;
    if (colorStyleP === colorsP2[0]) {
      counterP_1++;
      if (counterP_1 <= n_SamePosition + jitters_1[c1]) {
        // counterP_1 = counterP_1;
      }
      if (counterP_1 > n_SamePosition + jitters_1[c1]) {
        counterP_1 = Math.mod(counterP_1, n_SamePosition + jitters_1[c1]);
        c1++;
      }
      if (counterP_1 === 1) {
        x1 = nums2_1[n];
      }
      if (counterP_1 !== 1) {
        // x1 = x1
      }
      // make task slightly easier for practicing with lower noise stdev -- CHANGED SO NOT TRUE (REALISTIC TO TASK)
      outcome = Math.mod(normalRandomScaled(x1, 20), 360);
      mean = x1;
      console.log(colorStyleP);
      console.log(mean);
      console.log(c1);
      console.log(jitters_1[c1]);
    }
    if (colorStyleP === colorsP2[1]) {
      counterP_2++;
      if (counterP_2 < n_SamePosition + jitters_2[c2]) {
        // counterP_2 = counterP_2;
      }
      if (counterP_2 > n_SamePosition + jitters_2[c2]) {
        counterP_2 = Math.mod(counterP_2, n_SamePosition + jitters_2[c2]);
        c2++;
      }
      if (counterP_2 === 1) {
        x2 = nums2_2[n];
      }
      if (counterP_2 !== 1) {
        // x2 = x2
      }
      // make task slightly easier for practicing with lower noise stdev -- CHANGED SO NOT TRUE (REALISTIC TO TASK)
      outcome = Math.mod(normalRandomScaled(x2, 20), 360);
      mean = x2;
      console.log(colorStyleP);
      console.log(mean);
      console.log(c2);
      console.log(jitters_2[c2]);
    }
    console.log(outcome);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPractice + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(n_TrialPractice + 1 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var practice = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(practice);
  }
}

/*****
1color block n < n_TrialPerBlock + 1
 *****/
function block1(timeline, jsPsych) {
  var block1_intro = {
    type: jsPsychHtmlbuttonResponse,
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face one group of zombies.</p></div>`,
    choices: ['Start'],
  };
  timeline.push(block1_intro);

  let counter1 = 0;
  let jitters = GenerateJitter(n_TrialPerBlock, n_MaxJitter);
  let trial_type_label = 'block1';
  let c = 0;
  for (let n = 1; n < n_TrialPerBlock + 1; n++) {
    const colorStyle = color1;
    counter1++;
    var x;
    let prediction;
    if (counter1 <= n_SamePosition + jitters[c]) {
      // counter1 = counter1;
    } else if (counter1 > n_SamePosition + jitters[c]) {
      counter1 = Math.mod(counter1, n_SamePosition + jitters[c]);
      c++;
    }
    if (counter1 === 1) {
      x = nums1[n];
    }
    //   if (counter1 !== 1) {
    //     continue;
    //   }
    const outcome = Math.mod(normalRandomScaled(x, 20), 360);
    const mean = x;

    //   console.log(mean);
    //   console.log(jitters[c]);

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#center-circle').css('background-color', colorStyle);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#picker-circle').css('background-color', colorStyle);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var block1 = {
      timeline: [make_prediction, blank, observe_outcome],
    };
    timeline.push(block1);
  }
}

/*** 
//2 colors block n < n_TrialPerBlock + 1
 ***/
function block2(timeline, jsPsych, sync_cp = true) {
  var block2_intro = {
    type: jsPsychHtmlbuttonResponse,
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face two groups of zombies.</p></div>`,
    choices: ['Start'],
  };
  timeline.push(block2_intro);

  let counter2_1 = 0;
  let counter2_2 = 0;
  let c1 = 0;
  let c2 = 0;
  let jitters_1 = GenerateJitter(n_TrialPerBlock, n_MaxJitter);
  let jitters_2 = GenerateJitter(n_TrialPerBlock, n_MaxJitter); // async changepoints for 2nd color

  // sync changepoints if applicable
  let trial_type_label = 'block2_async_cp';
  if (sync_cp) {
    jitters_2 = jitters_1;
    trial_type_label = 'block2_sync_cp';
  }

  for (let n = 1; n < n_TrialPerBlock + 1; n++) {
    const colorStyle2 = color2[n - 1];
    var x1;
    var x2;
    let prediction;
    let outcome;
    let mean;
    if (colorStyle2 === colors2[0]) {
      counter2_1++;
      if (counter2_1 <= n_SamePosition + jitters_1[c1]) {
        // counter2_1 = counter2_1;
      }
      if (counter2_1 > n_SamePosition + jitters_1[c1]) {
        counter2_1 = Math.mod(counter2_1, n_SamePosition + jitters_1[c1]);
        c1++;
      }
      if (counter2_1 === 1) {
        x1 = nums2_1[n];
      }
      if (counter2_1 !== 1) {
        // x1 = x1
      }
      outcome = Math.mod(normalRandomScaled(x1, 20), 360);
      mean = x1;
    }
    if (colorStyle2 === colors2[1]) {
      counter2_2++;
      if (counter2_2 < n_SamePosition + jitters_2[c2]) {
        // counter2_2 = counter2_2;
      }
      if (counter2_2 > n_SamePosition + jitters_2[c2]) {
        counter2_2 = Math.mod(counter2_2, n_SamePosition + jitters_2[c2]);
        c2++;
      }
      if (counter2_2 === 1) {
        x2 = nums2_2[n];
      }
      if (counter2_2 !== 1) {
        // x2 = x2
      }
      outcome = Math.mod(normalRandomScaled(x2, 20), 360);
      mean = x2;
    }

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#center-circle').css('background-color', colorStyle2);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank2 = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#picker-circle').css('background-color', colorStyle2);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle2;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var block2 = {
      timeline: [make_prediction, blank2, observe_outcome],
    };
    timeline.push(block2);
  }
}

/****
3 colors block
 ****/
function block3(timeline, jsPsych, sync_cp = true) {
  var block3_intro = {
    type: jsPsychHtmlbuttonResponse,
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face three groups of zombies.</p></div>`,

    choices: ['Start'],
  };
  timeline.push(block3_intro);

  let counter3_1 = 0;
  let counter3_2 = 0;
  let counter3_3 = 0;
  let jitters_1 = GenerateJitter(n_TrialPerBlock, n_MaxJitter);
  let jitters_2 = GenerateJitter(n_TrialPerBlock, n_MaxJitter); // async changepoints for 2nd color
  let jitters_3 = GenerateJitter(n_TrialPerBlock, n_MaxJitter); // async changepoints for 3rd color

  // sync changepoints if applicable
  let trial_type_label = 'block3_async_cp';
  if (sync_cp) {
    jitters_2 = jitters_1;
    jitters_3 = jitters_1;
    trial_type_label = 'block3_sync_cp';
  }

  let c1 = 0;
  let c2 = 0;
  let c3 = 0;
  for (let n = 1; n < n_TrialPerBlock + 1; n++) {
    const colorStyle3 = color3[n - 1];
    var y1;
    var y2;
    var y3;
    let prediction;
    let outcome;
    let mean;
    if (colorStyle3 === colors3[0]) {
      counter3_1++;
      if (counter3_1 <= n_SamePosition + jitters_1[c1]) {
        // counter3_1 = counter3_1;
      }
      if (counter3_1 > n_SamePosition + jitters_1[c1]) {
        counter3_1 = Math.mod(counter3_1, n_SamePosition + jitters_1[c1]);
        c1++;
      }
      if (counter3_1 === 1) {
        y1 = nums3_1[n];
      }
      if (counter3_1 !== 1) {
        // y1 = y1
      }
      outcome = Math.mod(normalRandomScaled(y1, 20), 360);
      mean = y1;
    }

    if (colorStyle3 === colors3[1]) {
      counter3_2++;
      if (counter3_2 < n_SamePosition + jitters_2[c2]) {
        // counter3_2 = counter3_2;
      }
      if (counter3_2 > n_SamePosition + jitters_2[c2]) {
        counter3_2 = Math.mod(counter3_2, n_SamePosition + jitters_2[c2]);
        c2++;
      }
      if (counter3_2 === 1) {
        y2 = nums3_2[n];
      }
      if (counter3_2 !== 1) {
        // y2 = y2
      }
      outcome = Math.mod(normalRandomScaled(y2, 20), 360);
      mean = y2;
    }

    if (colorStyle3 === colors3[2]) {
      counter3_3++;
      if (counter3_3 < n_SamePosition + jitters_3[c3]) {
        // counter3_3 = counter3_3;
      }
      if (counter3_3 > n_SamePosition + jitters_3[c3]) {
        counter3_3 = Math.mod(counter3_3, n_SamePosition + jitters_3[c3]);
        c3++;
      }
      if (counter3_3 === 1) {
        y3 = nums3_3[n];
      }
      if (counter3_3 !== 1) {
        // y3 = y3
      }
      outcome = Math.mod(normalRandomScaled(y3, 20), 360);
      mean = y3;
    }

    var make_prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#center-circle').css('background-color', colorStyle3);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function () {
        let pred_idx = jsPsych.data.get().select('prediction').count();
        prediction = jsPsych.data.get().select('prediction').values[pred_idx - 1];
      },
    };

    var blank3 = {
      type: Blank,
      on_load: function () {
        $('#counter').text(n_TrialPerBlock + 1 - n);
      },
    };

    var observe_outcome = {
      type: Position,
      data: { type: trial_type_label },
      on_load: function () {
        $('#shield').toggle(true);
        $('#picker').css('transform', 'rotate(' + prediction + 'deg)');
        $('#shield').css('transform', 'rotate(' + (prediction + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(n_TrialPerBlock + 1 - n);
        $('#picker-circle').css('background-color', colorStyle3);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle3;
        data.score = assessPerformance(prediction, outcome);
      },
    };
    var block3 = {
      timeline: [make_prediction, blank3, observe_outcome],
    };
    timeline.push(block3);
  }
}

export { practice_block1, practice_block2, block1, block2, block3, rtDeadline };
