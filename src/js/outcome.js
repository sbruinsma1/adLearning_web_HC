/*

  Position plugin
  ----------------------

  Copyright (C) 2019  Jinrui Wei

 */

import $ from 'jquery';
import { ParameterType } from 'jspsych';
// var Position = (function (jspsych) {
// //   "use strict";

const info = {
  name: 'Position',
  // give a description what the plugin does:
  description: '',
  // define the parameters:
  parameters: {
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: 'Response ends trial',
      default: true,
      description: 'If true, trial will end when subject makes a response.',
    },
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: 'Fixation duration',
      default: 1000,
      description: 'How long the trial is (in milliseconds).',
    },
  },
};

class Position {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    const show_circle = () => {
      var new_html = '<div id="circle">';
      new_html += '<div id="shield"></div>';
      new_html += '<div id="circle-in"></div>';
      new_html +=
        '<div id="picker"><div id="picker-prediction"><div id="h"></div><div id="v"></div></div></div>';
      new_html += '<div id="pickerOutcome">';
      new_html += '<div id="picker-circle"></div></div></div>';
      new_html += '<div id="counter"></div>';
      display_element.innerHTML = new_html;
      $('#picker').toggle(true);
      $('#h').toggle(true);
      $('#v').toggle(true);

      this.jsPsych.pluginAPI.setTimeout(function () {
        // after wait is over</div>';
        after_response();
      }, 1000);
    };

    // function to end trial when it is time
    show_circle();
    const end_trial = () => {
      // kill any remaining setTimeout handlers
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      this.jsPsych.finishTrial();
    };
    // function to handle responses by the subject
    const after_response = () => {
      // only record the first response

      if (trial.response_ends_trial) {
        // after wait is over
        end_trial();
      }
    };
  }
}

Position.info = info;

//   return Position;
// })();

export default Position;
