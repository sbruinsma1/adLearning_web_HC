jsPsych.plugins['blank'] = (function () {
  var plugin = {};

  plugin.info = {
    name: 'blank',
    description: '',
    parameters: {
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.',
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: 200,
        description: 'How long the trial is (in milliseconds).',
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    show_circle();

    function show_circle() {
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

      document.querySelector('#picker').style.display = 'block';
      document.querySelector('#h').style.display = 'block';
      document.querySelector('#v').style.display = 'block';
      document.querySelector('#shield').style.display = 'block';

      const fullTime = jsPsych.data.get().select('prediction').count();
      const shield_m = jsPsych.data.get().select('prediction').values[fullTime - 1];

      document.querySelector('#picker').style.transform = 'rotate(' + shield_m + 'deg)';
      document.querySelector('#shield').style.transform =
        'rotate(' + (shield_m + 20) + 'deg) skewX(-50deg)';

      jsPsych.pluginAPI.setTimeout(function () {
        after_response();
      }, 200);
    }

    function end_trial() {
      jsPsych.pluginAPI.clearAllTimeouts();
      display_element.innerHTML = '';
      jsPsych.finishTrial();
    }

    function after_response() {
      if (trial.response_ends_trial) {
        end_trial();
      }
    }
  };

  return plugin;
})();
