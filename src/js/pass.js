import { ParameterType } from 'jspsych';
import { images } from '../lib/utils';

const info = {
  name: 'pass',
  description: '',
  parameters: {
    choices: {
      type: ParameterType.STRING,
      pretty_name: 'Choices',
      default: undefined,
      array: true,
      description: 'The labels for the buttons.',
    },
    button_html: {
      type: ParameterType.STRING,
      pretty_name: 'Button HTML',
      default: '<button class="jspsych-btn">%choice%</button>',
      array: true,
      description: 'The html of the button. Can create own style.',
    },
    prompt: {
      type: ParameterType.STRING,
      pretty_name: 'Prompt',
      default: null,
      description: 'Any content here will be displayed under the button.',
    },
    stimulus_duration: {
      type: ParameterType.INT,
      pretty_name: 'Stimulus duration',
      default: null,
      description: 'How long to hide the stimulus.',
    },
    trial_duration: {
      type: ParameterType.INT,
      pretty_name: 'Trial duration',
      default: null,
      description: 'How long to show the trial.',
    },
    margin_vertical: {
      type: ParameterType.STRING,
      pretty_name: 'Margin vertical',
      default: '0px',
      description: 'The vertical margin of the button.',
    },
    margin_horizontal: {
      type: ParameterType.STRING,
      pretty_name: 'Margin horizontal',
      default: '8px',
      description: 'The horizontal margin of the button.',
    },
    response_ends_trial: {
      type: ParameterType.BOOL,
      pretty_name: 'Response ends trial',
      default: true,
      description: 'If true, then trial will end when user responds.',
    },
  },
};
class Pass {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    // display
    var html = `<div><img src=${images['zombie.png']}  style="height:300px;width: 300px"></div>`;
    html += `<div id="jspsych-html-button-response-stimulus"></div>`;

    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error(
          'Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array'
        );
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-button-response-btngroup"><br>';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html +=
        '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:' +
        trial.margin_vertical +
        ' ' +
        trial.margin_horizontal +
        '" id="jspsych-html-button-response-button-' +
        i +
        '" data-choice="' +
        i +
        '">' +
        str +
        '</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    display_element.innerHTML = html;

    // start time
    var start_time = performance.now();

    // add event listeners to buttons
    for (var i = 0; i < trial.choices.length; i++) {
      display_element
        .querySelector('#jspsych-html-button-response-button-' + i)
        .addEventListener('click', function (e) {
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
          after_response(choice);
        });
    }

    // store response
    var response = {
      rt: null,
      button: null,
    };

    // function to handle responses by the subject
    const after_response = (choice) => {
      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-stimulus').className +=
        ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for (var i = 0; i < btns.length; i++) {
        // btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    const end_trial = () => {
      // kill any remaining setTimeout handlers
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        button_pressed: response.button,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      this.jsPsych.finishTrial(trial_data);
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility =
          'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      this.jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    }
  }
}
Pass.info = info;
export default Pass;
