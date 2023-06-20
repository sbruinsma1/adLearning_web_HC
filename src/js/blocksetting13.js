/*
some required definition in the task
 */
//pseudo random color
//3 colors version

import { initJsPsych } from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery';
import * as Math from 'mathjs';

import Click from '../js/prediction';
import Blank from '../js/blank';
import Position from '../js/outcome';
// import Click from '../js/template-js/prediction';
// import Blank from '../js/template-js/blank';
// import Position from '../js/template-js/outcome';


import jsPsychHtmlbuttonResponse from '@jspsych/plugin-html-button-response';

import { images } from '../lib/utils';

const colors3 = ['#3edcff', '#ff9800', '#fff43f'];
let color3 = jsPsych.randomization.shuffle(colors3);
for (let h = 0; h < 67; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colors3);
  let a = color3.slice(color3.length - 3);
  if (colorRepeat.toString() !== a.toString() && colorRepeat[0] !== color3[color3.length - 1]) {
    color3 = color3.concat(colorRepeat);
  } else h--;
}
//6 colors version
const colors6 = ['#3edcff', '#ff9800', '#fff43f', '#ffa4f1', '#b0ff64', '#8d5fff'];
let color6 = jsPsych.randomization.shuffle(colors6);
for (let h = 0; h < 35; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colors6);
  let b = color6.slice(color6.length - 6);
  if (colorRepeat.toString() !== b.toString() && colorRepeat[0] !== color6[color6.length - 1]) {
    color6 = color6.concat(colorRepeat);
  } else h--;
}

const colorsP = ['#ff9800', '#b0ff64'];
let colorP = colorsP;
for (let h = 0; h < 30; h++) {
  let colorRepeat = jsPsych.randomization.shuffle(colorsP);
  colorP = colorP.concat(colorRepeat);
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
const nums2 = angle_array();
const nums3 = angle_array();
const nums4 = angle_array();
const nums5 = angle_array();
const nums6 = angle_array();
const nums7 = angle_array();
const nums8 = angle_array();
const nums9 = angle_array();
const nums10 = angle_array();

function angle_array() {
  let nums = [];
  nums.length = 201;
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

//evaluate performance
const score_array = [];
let score;
let counter = 0;
function assessPerformance() {
  counter++;
  let outcome_data = jsPsych.data.get().select('outcome').values;
  let prediction_data = jsPsych.data.get().select('prediction').values;
  for (let i = 0; i < counter; i++) {
    i = counter - 1;
    if (outcome_data[i] <= prediction_data[i] + 20 && outcome_data[i] >= prediction_data[i] - 20) {
      score_array.push(1);
      score = Math.sum(score_array);
      jsPsych.data.addDataToLastTrial({ score });
    }
  }
}

const pr_score_array = [];
let pr_score;
let pr_counter = 0;
function assessPractice() {
  pr_counter++;
  let outcome_pr = jsPsych.data.get().select('outcome').values;
  let prediction_pr = jsPsych.data.get().select('prediction').values;
  for (let i = 0; i < pr_counter; i++) {
    i = pr_counter - 1;
    if (outcome_pr[i] <= prediction_pr[i] + 20 && outcome_pr[i] >= prediction_pr[i] - 20) {
      pr_score_array.push(1);
      pr_score = Math.sum(pr_score_array);
      jsPsych.data.addDataToLastTrial({ pr_score });
    }
  }
}

function scoreCheck() {
  return jsPsych.data.get().select('score').count();
}

function pr_scoreCheck() {
  return jsPsych.data.get().select('pr_score').count();
}

/***
 *define blocks
 ***/

/***
 *practice block
 */
function practice_block(timeline, jsPsych) {
  let counterP = 0;
  for (let n = 1; n < 3; n++) {
    const colorStyleP = colorP[n - 1];
    var x2;
    let outcome;
    let mean;

    if (colorStyleP === '#ff9800') {
      counterP++;
      if (counterP < 8) {
        x2 = 195;
      }
      if (counterP > 7) {
        x2 = 85;
      }
      outcome = Math.mod(normalRandomScaled(x2, 15), 360);
      mean = x2;
    }
    if (colorStyleP === '#b0ff64') {
      mean = 325;
      outcome = Math.mod(normalRandomScaled(325, 15), 360);
    }
    var prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(31 - n);
        $('#center-circle').css('background-color', colorStyleP);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function (data) {
        //  psiturk.recordTrialData(data);
        //  psiturk.saveData();
      },
    };
    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(31 - n);
      },
    };

    var position = {
      type: Position,
      data: { type: ['practice'] },
      on_load: function () {
        $('#shield').toggle(true);
        const fullTime = jsPsych.data.get().select('prediction').count();
        const shield_m = jsPsych.data.get().select('prediction').values[fullTime - 1];
        $('#picker').css('transform', 'rotate(' + shield_m + 'deg)');
        $('#shield').css('transform', 'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(31 - n);
        $('#picker-circle').css('background-color', colorStyleP);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyleP;
        assessPractice();
        // jsPsych.data.addDataToLastTrial ({outcome, mean});
        // psiturk.recordTrialData(data);
        // psiturk.saveData();
      },
    };

    var practice = {
      timeline: [prediction, blank, position],
    };
    timeline.push(practice);
  }

  return timeline;
}

// /*****
// 1color block
//  *****/
function block1(timeline, jsPsych) {
  var block1_intro = {
    type: jsPsychHtmlbuttonResponse,
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face one group of zombies.</p></div>`,

    choices: ['Start'],
  };
  timeline.push(block1_intro);
  let counter1 = 0;
  for (let n = 1; n < 5; n++) {
    const colorStyle = '#3edcff';
    counter1++;
    var x;
    if (counter1 < 5) {
      counter1 = counter1;
    } else if (counter1 > 5) {
      counter1 = Math.mod(counter1, 5);
    }
    if (counter1 === 1) {
      x = nums1[n];
    }
    if (counter1 !== 1) {
      x = x;
    }
    const outcome = Math.mod(normalRandomScaled(x, 20), 360);
    const mean = x;

    var prediction = {
      type: Click,
      on_load: function () {
        $('#counter').text(201 - n);
        $('#center-circle').css('background-color', colorStyle);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function (data) {
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };

    var blank = {
      type: Blank,
      on_load: function () {
        $('#counter').text(201 - n);
      },
    };

    var position = {
      type: Position,
      data: { type: ['block1'] },
      on_load: function () {
        $('#shield').toggle(true);
        const fullTime = jsPsych.data.get().select('prediction').count();
        const shield_m = jsPsych.data.get().select('prediction').values[fullTime - 1];
        $('#picker').css('transform', 'rotate(' + shield_m + 'deg)');
        $('#shield').css('transform', 'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(201 - n);
        $('#picker-circle').css('background-color', colorStyle);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        assessPerformance();
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };
    var block1 = {
      timeline: [prediction, blank, position],
    };
    timeline.push(block1);
  }
  return timeline;
}

// /***
// //3 colors block
//  ***/
function block3(timeline, jsPsych) {
  var block3_intro = {
    type: jsPsychHtmlbuttonResponse,

    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face three groups of zombies.</p></div>`,

    choices: ['Start'],
  };
  timeline.push(block3_intro);
  let counter3_1 = 0;
  let counter3_2 = 0;
  let counter3_3 = 0;
  for (let n = 1; n < 5; n++) {
    const colorStyle3 = color3[n - 1];
    var x1;
    var x2;
    var x3;
    let outcome;
    let mean;
    if (colorStyle3 === '#3edcff') {
      counter3_1++;
      if (counter3_1 < 4) {
        counter3_1 = counter3_1;
      }
      if (counter3_1 > 4) {
        counter3_1 = Math.mod(counter3_1, 4);
      }
      if (counter3_1 === 1) {
        x1 = nums2[n];
      }
      if (counter3_1 !== 1) {
        x1 = x1;
      }
      outcome = Math.mod(normalRandomScaled(x1, 20), 360);
      mean = x1;
    }
    if (colorStyle3 === '#ff9800') {
      counter3_2++;
      if (counter3_2 < 5) {
        counter3_2 = counter3_2;
      }
      if (counter3_2 > 5) {
        counter3_2 = Math.mod(counter3_2, 5);
      }
      if (counter3_2 === 1) {
        x2 = nums3[n];
      }
      if (counter3_2 !== 1) {
        x2 = x2;
      }
      outcome = Math.mod(normalRandomScaled(x2, 20), 360);
      mean = x2;
    }
    if (colorStyle3 === '#fff43f') {
      counter3_3++;
      if (counter3_3 < 7) {
        counter3_3 = counter3_3;
      }
      if (counter3_3 > 7) {
        counter3_3 = Math.mod(counter3_3, 7);
      }
      if (counter3_3 === 1) {
        x3 = nums4[n];
      }
      if (counter3_3 !== 1) {
        x3 = x3;
      }
      outcome = Math.mod(normalRandomScaled(x3, 20), 360);
      mean = x3;
    }

    var prediction3 = {
      type: Click,
      on_load: function () {
        $('#counter').text(201 - n);
        $('#center-circle').css('background-color', colorStyle3);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function (data) {
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };

    var blank3 = {
      type: Blank,
      on_load: function () {
        $('#counter').text(201 - n);
      },
    };

    var position3 = {
      type: Position,
      data: { type: ['block3'] },
      on_load: function () {
        $('#shield').toggle(true);
        const fullTime = jsPsych.data.get().select('prediction').count();
        const shield_m = jsPsych.data.get().select('prediction').values[fullTime - 1];
        $('#picker').css('transform', 'rotate(' + shield_m + 'deg)');
        $('#shield').css('transform', 'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(201 - n);
        $('#picker-circle').css('background-color', colorStyle3);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle3;
        assessPerformance();
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };
    var block3 = {
      timeline: [prediction3, blank3, position3],
    };
    timeline.push(block3);
  }
}

/****
6 colors block
 ****/
function block6() {
  var block6_intro = {
    type: 'html-button-response',
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><p>In this block, you will face six groups of zombies.</p></div>`,
    choices: ['Start'],
  };
  timeline.push(block6_intro);
  let counter6_1 = 0,
    counter6_2 = 0,
    counter6_3 = 0,
    counter6_4 = 0,
    counter6_5 = 0,
    counter6_6 = 0;
  for (let n = 1; n < 201; n++) {
    const colorStyle6 = color6[n - 1];
    var y1;
    var y2;
    var y3;
    var y4;
    var y5;
    var y6;
    let outcome;
    let mean;
    if (colorStyle6 === '#3edcff') {
      counter6_1++;
      if (counter6_1 < 3) {
        counter6_1 = counter6_1;
      }
      if (counter6_1 > 3) {
        counter6_1 = Math.mod(counter6_1, 3);
      }
      if (counter6_1 === 1) {
        y1 = nums5[n];
      }
      if (counter6_1 !== 1) {
        y1 = y1;
      }
      outcome = Math.mod(normalRandomScaled(y1, 20), 360);
      mean = y1;
    }

    if (colorStyle6 === '#ff9800') {
      counter6_2++;
      if (counter6_2 < 4) {
        counter6_2 = counter6_2;
      }
      if (counter6_2 > 4) {
        counter6_2 = Math.mod(counter6_2, 4);
      }
      if (counter6_2 === 1) {
        y2 = nums6[n];
      }
      if (counter6_2 !== 1) {
        y2 = y2;
      }
      outcome = Math.mod(normalRandomScaled(y2, 20), 360);
      mean = y2;
    }

    if (colorStyle6 === '#fff43f') {
      counter6_3++;
      if (counter6_3 < 5) {
        counter6_3 = counter6_3;
      }
      if (counter6_3 > 5) {
        counter6_3 = Math.mod(counter6_3, 5);
      }
      if (counter6_3 === 1) {
        y3 = nums7[n];
      }
      if (counter6_3 !== 1) {
        y3 = y3;
      }
      outcome = Math.mod(normalRandomScaled(y3, 20), 360);
      mean = y3;
    }

    if (colorStyle6 === '#ffa4f1') {
      counter6_4++;
      if (counter6_4 < 6) {
        counter6_4 = counter6_4;
      }
      if (counter6_4 > 6) {
        counter6_4 = Math.mod(counter6_4, 6);
      }
      if (counter6_4 === 1) {
        y4 = nums8[n];
      }
      if (counter6_4 !== 1) {
        y4 = y4;
      }
      outcome = Math.mod(normalRandomScaled(y4, 20), 360);
      mean = y4;
    }
    if (colorStyle6 === '#b0ff64') {
      counter6_5++;
      if (counter6_5 < 10) {
        counter6_5 = counter6_5;
      }
      if (counter6_5 > 10) {
        counter6_5 = Math.mod(counter6_5, 10);
      }
      if (counter6_5 === 1) {
        y5 = nums9[n];
      }
      if (counter6_5 !== 1) {
        y5 = y5;
      }
      outcome = Math.mod(normalRandomScaled(y5, 20), 360);
      mean = y5;
    }

    if (colorStyle6 === '#8d5fff') {
      counter6_6++;
      if (counter6_6 < 7) {
        counter6_6 = counter6_6;
      }
      if (counter6_6 > 7) {
        counter6_6 = Math.mod(counter6_6, 7);
      }
      if (counter6_6 === 1) {
        y6 = nums10[n];
      }
      if (counter6_6 !== 1) {
        y6 = y6;
      }
      outcome = Math.mod(normalRandomScaled(y6, 20), 360);
      mean = y6;
    }

    var prediction6 = {
      type: 'click',
      on_load: function () {
        $('#counter').text(201 - n);
        $('#center-circle').css('background-color', colorStyle6);
        $('#circle').on('click', function (event) {
          if (event.target == this) {
            $('#center-circle').css('background-color', '#A9A9A9');
          }
        });
      },
      on_finish: function (data) {
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };

    var blank6 = {
      type: 'blank',
      on_load: function () {
        $('#counter').text(201 - n);
      },
    };

    var position6 = {
      type: 'position',
      data: { type: ['block6'] },
      on_load: function () {
        $('#shield').toggle(true);
        const fullTime = jsPsych.data.get().select('prediction').count();
        const shield_m = jsPsych.data.get().select('prediction').values[fullTime - 1];
        $('#picker').css('transform', 'rotate(' + shield_m + 'deg)');
        $('#shield').css('transform', 'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)');
        $('#counter').text(201 - n);
        $('#picker-circle').css('background-color', colorStyle6);
        $('#pickerOutcome').css('transform', 'rotate(' + outcome + 'deg)');
      },
      on_finish: function (data) {
        data.outcome = outcome;
        data.mean = mean;
        data.color = colorStyle6;
        assessPerformance();
        // psiturk.recordTrialData([data]);
        // psiturk.saveData();
      },
    };
    var block6 = {
      timeline: [prediction6, blank6, position6],
    };
    timeline.push(block6);
  }
}

export { practice_block, block1, block3 };
