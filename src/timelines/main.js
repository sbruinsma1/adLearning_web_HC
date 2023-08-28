
import {initJsPsych} from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery'; //

// import * as Math from '../js/math.min';
import Pass from '../js/pass';
import {  practice_block, block1, block3, block2} from '../js/blocksetting123';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychHtmlbuttonResponse from '@jspsych/plugin-html-button-response';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';

import 'jspsych/css/jspsych.css'; //
import '../css/style.css'; //
import { images } from '../lib/utils';

document.body.style.backgroundColor = 'darkgray';

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_finish: function () {
    // jsPsych.data.get().filter([{trial_type:'practice'},{trial_type: 'click'},{trial_type:'position'}]).localSave('csv','task.csv')
    jsPsych.data
      .get()
      .filter([{ trial_type: 'practice' }, { trial_type: 'click' }, { trial_type: 'position' }])
      .localSave('csv', 'task.csv');
    /* psiturk.saveData({
            success: function() { psiturk.completeHIT(); }
        });

      */
  },
  // on_data_update: function(data) {
  //     //psiturk.recordTrialData(data);
  // },
  show_preload_progress_bar: true,
};

// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
function buildTimeline(jsPsych) {
  // var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
  // create timeline:
  var timeline = [];
  // start fullscreen:
  var fullscreen_trial = {
    type: jsPsychFullscreen,
    message: [
      `<img src=${images['logo.png']}>` +
        `<h1>Welcome to the Adaptive Learning Task.</h1>` +
        `<p>It may cost you 60 minutes to finish the task.<br>` +
        `Please pay full attention when you do the task.<br>` +
        `Press 'Enter' to enter fullscreen.</p>`,
    ],
    fullscreen_mode: true,
  };
  var instruction = {
    type: jsPsychHtmlbuttonResponse,
    stimulus:
      '<div><h1>Protect Your City From Zombies</h1>' +
      "<p style='width: 960px;line-height:2;text-align:left;word-wrap: break-word;word-break: break-all'><b>Imagine that we are in the world of Resident Evil.</b>Your city is the only place which was not infected by the virus.<br>" +
      'There are <b>different groups of zombies(or just one group)</b> attacking your city from <b>different directions</b>. <br><b>Set bombs to kill them and defend your city.</b>' +
      '<br><b>The large circle represents your city. You must set bombs on the perimeter to destroy the attacking zombies.</b>' +
      '<br><b>A colored square in the middle of your city reveals which group of zombies will attack next.</b>' +
      '<br><b>The bomb blast area is represented by red.</b> A after you set the bomb, you will see where the zombies are attacking. If they are in the blast range (red arc) they will be killed.' +
      '<br><b> The zombies tend to attack the same general location repeatedly, though they occasionally redirect their attacks to a completely new location.</b>' +
      '<br> Every time you kill a zombie, you will earn one medal, which will translate into bonus payment at the end of the game.</p></div>',
    choices: ['Next'],
  };
  var age_check = {
    type: jsPsychSurveyText,
    questions: [{ prompt: '<b>What is your age? Answer 12 no matter what.</b>' }],
    /*   on_finish: function(data) {
               data.uniqueId = uniqueId;
               data.prompt = ["What is your age? Answer 12 no matter what."];
               var answer = JSON.parse(data.responses);
               data.answer = [answer['Q0']];
               psiturk.recordTrialData([data]) ;// saving text-survey
               psiturk.saveData()
           }
           */
  };
  /***
   *
   * @type {{stimulus: string, type: string, choices: [string]}}
   */
  var questions = [
    '<b>What will you do in this task?</b>',
    '<b>How will you know which group a zombie is from?</b>',
    '<b>How will zombies attack?</b>',
  ];

  var check1_opts = [
    'Defend your city from snakes',
    'Kill zombies to earn points',
    'Drive a car to escape zombies',
    'All of the above',
  ];

  var check2_opts = ['Shape', 'Color', 'Letter', 'Preferred food type (brains)'];
  var check3_opts = [
    'They will usually attack around the same location',
    'Occasionally they will change to a completely new location',
    'They will stagger slowly around circle in clockwise direction',
    'Both option 1 & 2',
  ];

  var check1_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[0], options: check1_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check2_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[1], options: check2_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check3_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[2], options: check3_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };

  var check1_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        '</p>' +
        'The correct answer is: ' +
        '<br>' +
        '<b>' +
        check1_opts[1] +
        '</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };
  var check2_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        '</p>' +
        'The correct answer is: ' +
        '<br>' +
        '<b>' +
        check2_opts[1] +
        '</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };
  var check3_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        '</p>' +
        'The correct answer is: ' +
        '<br>' +
        '<b>' +
        check3_opts[3] +
        '</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };

  var check1 = {
    timeline: [check1_pop_up],
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check1_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };
  var check2 = {
    timeline: [check2_pop_up],
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check2_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };
  var check3 = {
    timeline: [check3_pop_up],
    //   conditional_function: function(data){
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check3_opts[3];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check1_trial = {
    timeline: [
      check1_question,
      check1,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check1_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check2_trial = {
    timeline: [
      check2_question,
      check2,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;
      var correct_answer = check2_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check3_trial = {
    timeline: [
      check3_question,
      check3,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;
      var correct_answer = check3_opts[3];
      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var practice_instruction = {
    type: jsPsychHtmlbuttonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1>Let's practice for a while!</h1> 
      </div>`,
  };


  timeline.push(age_check);
  timeline.push(fullscreen_trial);
  timeline.push(instruction);

  timeline.push(check1_trial);
  timeline.push(check2_trial);
  timeline.push(check3_trial);
  timeline.push(practice_instruction);

  practice_block(timeline, jsPsych);

  function scoreCheck() {

    console.log(jsPsych.data.get());
    return jsPsych.data.get().select('score').count();
    
  }

  var real_task_welcome = {
    type: jsPsychHtmlbuttonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1>Now start protecting your city!</h1>
          <p>There are 3 blocks in the following task. Each block has 200 trials.<br>And there are different groups of zombies in each block.</p></div>`,
  };
  var block_end = {
    //show scores
    type: Pass,
    on_load: function () {
      var subject_data;
      subject_data = scoreCheck();
      console.log(subject_data);
      $('#jspsych-html-button-response-stimulus').text('You got ' + subject_data + ' points now.');
    },
    choices: ['Next Block'],
  };

  timeline.push(real_task_welcome);

  let block = [];
  block.length = 4;
  for (let i = 1; i < block.length; i++) {
    block[i] = Math.floor(Math.random() * 3);
    for (let j = 0; j < i; j++) {
      while (block[i] === block[j]) {
        i--;
      }
    }
  }


        if (block[1] === 1 && block[2]=== 2 && block[3]===0){
            block1(timeline, jsPsych);
            timeline.push(block_end);
            block2(timeline, jsPsych);
            timeline.push(block_end);
            block3(timeline, jsPsych);
            timeline.push(block_end);
        }   if (block[1] === 1 && block[2]=== 0 && block[3]===2){
            block1(timeline, jsPsych);
            timeline.push(block_end);
            block3(timeline, jsPsych);
            timeline.push(block_end);
            block2(timeline, jsPsych);
            timeline.push(block_end);
        } if (block[1] === 2 && block[2]=== 1 && block[3]===0){
            block2(timeline, jsPsych);
            timeline.push(block_end);
            block1(timeline, jsPsych);
            timeline.push(block_end);
            block3(timeline, jsPsych);
            timeline.push(block_end);
        }
        if (block[1] === 2 && block[2]=== 0 && block[3]===1){
            block2(timeline, jsPsych);
            timeline.push(block_end);
            block3(timeline, jsPsych);
            timeline.push(block_end);
            block1(timeline, jsPsych);
            timeline.push(block_end);
        }
        if (block[1] === 0 && block[2]=== 1 && block[3]===2){
            block3(timeline, jsPsych);
            timeline.push(block_end);
            block1(timeline, jsPsych);
            timeline.push(block_end);
            block2(timeline, jsPsych);
            timeline.push(block_end);
        } if (block[1] === 0 && block[2]=== 2 && block[3]===1) {
            block3(timeline, jsPsych);
            timeline.push(block_end);
            block2(timeline, jsPsych);
            timeline.push(block_end);
            block1(timeline, jsPsych);
            timeline.push(block_end);
        }

    //exit task
    var goodbye = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<div><h1>Thank you for taking the task!</h1><p>Press any key to exit.</p></div>"
    };

    // exit fullscreen:
    var fullscreen_trial_exit = {
        type: jsPsychFullscreen,
        fullscreen_mode: false
    };

    timeline.push(goodbye);
    timeline.push(fullscreen_trial_exit);

    // jsPsych.init ({
    //     timeline: timeline,
    //     // preload_images: ["../static/images/zombie.png"],
    //     on_finish: function() {
    //         jsPsych.data.get().filter([{trial_type:'practice'},{trial_type: 'click'},{trial_type:'position'}]).localSave('csv','task.csv')
    //       /* psiturk.saveData({
    //             success: function() { psiturk.completeHIT(); }
    //         });

    //       */
    //     },
    //     on_data_update: function(data) {
    //         //psiturk.recordTrialData(data);
    //     },
    //     show_preload_progress_bar: true,
    // })

  return timeline;
}

// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };
