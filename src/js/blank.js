// var Blank = (function (jspsych) {
//   "use strict";
import { ParameterType } from 'jspsych';

const info = {
  name: 'Blank',
  description: '',
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
      default: 200,
      description: 'How long the trial is (in milliseconds).',
    },
  },
};

/**
 * **blank in Jspsych7** //
 *
 * SHORT PLUGIN DESCRIPTION
 *
 * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
 */
class Blank {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    const show_circle = () => {
      // check if make prediction (determines what feedback receive)
      var predicExist = this.jsPsych.data.get().select('prediction').values.slice(-1)[0];

      var new_html =
        '<div id="circle">' +
        '<div id="shield"></div>' +
        '<div id="circle-in"></div>' +
        '<div id="picker">' +
        '<div id="picker-prediction">' +
        '<div id="h"></div><div id="v"></div></div></div>' +
        '</div>' +
        '<div id="counter"></div>';
      display_element.innerHTML = new_html;

      if (predicExist !== null) {
        document.querySelector('#picker').style.display = 'block';
        document.querySelector('#h').style.display = 'block';
        document.querySelector('#v').style.display = 'block';
        document.querySelector('#shield').style.display = 'block';
      }

      const fullTime = this.jsPsych.data.get().select('prediction').count();
      const shield_m = this.jsPsych.data.get().select('prediction').values[fullTime - 1];
      // console.log(shield_m);
      // console.log(this.jsPsych.data.get());

      document.querySelector('#picker').style.transform = 'rotate(' + shield_m + 'deg)';
      document.querySelector('#shield').style.transform =
        'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)';

      this.jsPsych.pluginAPI.setTimeout(function () {
        after_response();
      }, 200);
    };
    show_circle();
    const end_trial = () => {
      this.jsPsych.pluginAPI.clearAllTimeouts();
      display_element.innerHTML = '';
      this.jsPsych.finishTrial();
    };

    const after_response = () => {
      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // // data saving
    // var trial_data = {
    //   parameter_name: "parameter value",
    // };
    // // end trial
    // this.jsPsych.finishTrial(trial_data);
  }
}
Blank.info = info;

//   return BlankPlugin;
// })(jsPsychModule);

export default Blank;
