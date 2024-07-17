/*

  Circle plugin
  ----------------------

  Copyright (C) 2019 Jinrui Wei

 */
import $ from 'jquery';
//
import * as Math from 'mathjs';
import { ParameterType } from 'jspsych';
import { rtDeadline } from './blocksetting123';
import { images } from '../lib/utils';
// var Click = (function (jspsych) {
// "use strict";

const info = {
  // define the name of the plugin:
  name: 'Click',
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

class Click {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
  }
  trial(display_element, trial) {
    var startTime = performance.now();

    // store response
    var response = {
      rt: null,
      delay: null,
      prediction: null,
    };

    // check if go over deadline in real time
    this.jsPsych.pluginAPI.setTimeout(() => {
      // console.log('timeout complete');
      info.rt = null;
      info.delay = null;
      info.prediction = null;
      after_response(info);
    }, rtDeadline);

    const show_circle = () => {
      // define html for bomb image that gets placed within the circle
      let bomb_div = '<div id="bomb" style="absolute"><img src=' + images['bomb_4.png'];
      bomb_div += ' id="bomb_img" style="position: absolute; top: 50%; left: 50%; ';
      bomb_div += 'height: 40px; width: 40px; transform: translate(-65%, -62%)"></div>';

      // circle, shield, bomb, picker, picker-prediction
      var new_html = '<div id="circle">';
      new_html += '<div id="shield"></div>';
      new_html += '<div id="circle-in"></div>';
      new_html += '<div id="center-circle"></div>';
      new_html += '<div id="picker">';
      new_html += '<div id="picker-prediction">';
      new_html += '<div id="h"></div><div id="v"></div></div></div>';
      new_html += '</div>';
      new_html += '<div id="counter"></div>';
      new_html += bomb_div;

      display_element.innerHTML = new_html;

      var circle = document.getElementById('circle'),
        bomb = document.getElementById('bomb'),
        picker = document.getElementById('picker'),
        shield = document.getElementById('shield'),
        circle_rect = circle.getBoundingClientRect(),
        center = {
          x: circle_rect.left + circle_rect.width / 2,
          y: circle_rect.top + circle_rect.height / 2,
        },
        bomb_rect = bomb.getBoundingClientRect(),
        bomb_origin = {
          x: bomb_rect.left + bomb_rect.width / 2,
          y: bomb_rect.top + bomb_rect.height / 2,
        },
        bomb_dist_from_center = 0;
      const bomb_pos_radius = 132;
      const bomb_min_dist_from_center = 100;

      function center_bomb_on_mouse(event) {
        // default
        let pointer_x = event.clientX;
        let pointer_y = event.clientY;
        let dx = pointer_x - bomb_origin.x;
        let dy = pointer_y - bomb_origin.y;
        // if outside the circle, move to edge of circle
        let x = pointer_x - center.x;
        let y = pointer_y - center.y;
        bomb_dist_from_center = (x ** 2 + y ** 2) ** 0.5;
        if (bomb_dist_from_center > bomb_pos_radius) {
          // rescale pointer coordinates to edge of circle
          dx = (bomb_pos_radius / bomb_dist_from_center) * x + center.x - bomb_origin.x;
          dy = (bomb_pos_radius / bomb_dist_from_center) * y + center.y - bomb_origin.y;
        }
        bomb.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      }

      function mousedown_callback(event) {
        event.preventDefault();
        center_bomb_on_mouse(event);
        // must be added to the document to prevent weird behavior if/when
        // the drag operation goes out of bounds
        document.addEventListener('mousemove', drag_callback);
        document.addEventListener('mouseup', mouseup_callback);
        bomb.removeEventListener('mousedown', mousedown_callback);
      }

      function drag_callback(event) {
        event.preventDefault();
        $('#bomb').toggle(true);
        center_bomb_on_mouse(event);
      }

      function finalize_bomb_position(x, y) {
        // get prediction position angle
        // NB: y increases going downward in the client window, so a positive
        // angle reflects a clockwise deviation relative to the positive x-axis
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        // convert domain from [-180, 180]->[0, 360]
        angle = Math.mod(angle, 360);

        // update shield and picker positions
        $('#picker').toggle(true);
        $('#h').toggle(true);
        $('#v').toggle(true);
        $('#shield').toggle(true);
        shield.style.transform = 'rotate(' + (angle + 30) + 'deg) skewX(331deg)';
        picker.style.transform = 'rotate(' + angle + 'deg)';

        // clear listeners
        document.removeEventListener('mousemove', drag_callback);
        document.removeEventListener('mouseup', mouseup_callback);

        // set data fields and initiate end of response
        var info = {};
        info.rt = performance.now() - startTime;
        info.delay = startTime;
        info.prediction = angle;
        after_response(info);
      }

      function mouseup_callback(event) {
        event.preventDefault();
        let dx = 0;
        let dy = 0;
        let x = event.clientX - center.x;
        let y = event.clientY - center.y;
        // if close enough to the circle where zombies arrive, snap to the edge
        // of circle and get final position, otherwise, snap to center and
        // start over
        if (bomb_dist_from_center > bomb_min_dist_from_center) {
          // rescale pointer coordinates to edge of circle
          dx = (bomb_pos_radius / bomb_dist_from_center) * x + center.x - bomb_origin.x;
          dy = (bomb_pos_radius / bomb_dist_from_center) * y + center.y - bomb_origin.y;
          bomb.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
          finalize_bomb_position(x, y);
        } else {
          // return to origin
          bomb.style.transform = 'translate(0, 0)';
          document.removeEventListener('mousemove', drag_callback);
          document.removeEventListener('mouseup', mouseup_callback);
          bomb.addEventListener('mousedown', mousedown_callback);
        }
      }

      // ENABLE STARTING THE CLICK IN THE BLACK CIRCLE
      bomb.addEventListener('mousedown', mousedown_callback);
    };

    show_circle();

    const end_trial = () => {
      // kill any remaining setTimeout handlers
      this.jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        delay: response.delay,
        prediction: response.prediction,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      this.jsPsych.finishTrial(trial_data);
      // console.log(trial_data);
    };

    // function to handle responses by the subject
    const after_response = (info) => {
      if (response.rt == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        this.jsPsych.pluginAPI.setTimeout(function () {
          // after wait is over
          end_trial();
        }, trial.trial_duration);
      }
    };
  }
}
Click.info = info;

// return Click;
// })(jsPsychModule);

// export {Click}
export default Click;
