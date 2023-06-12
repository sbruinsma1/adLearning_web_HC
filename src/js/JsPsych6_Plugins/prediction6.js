/*

  Circle plugin
  ----------------------

  Copyright (C) 2019 Jinrui Wei

 */

jsPsych.plugins['click'] = (function () {
  var plugin = {};

  plugin.info = {
    // define the name of the plugin:
    name: 'click',
    // give a description what the plugin does:
    description: '',
    // define the parameters:
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
        default: 1000,
        description: 'How long the trial is (in milliseconds).',
      },
    },
  };

  // the trial method is responsible for running a single trial
  plugin.trial = function (display_element, trial) {
    var startTime = performance.now();

    show_circle();

    function show_circle() {
      // circle , shield, picker, picker-prediction
      var new_html = '<div id="circle">';
      new_html += '<div id="shield"></div>';
      new_html += '<div id="circle-in"></div>';
      new_html += '<div id="center-circle"></div>';
      new_html += '<div id="picker">';
      new_html += '<div id="picker-prediction">';
      new_html += '<div id="h"></div><div id="v"></div></div></div>';
      new_html += '</div>';
      new_html += '<div id="counter"></div>';

      //new_html += '<div "class=circle-in"></div>';
      display_element.innerHTML = new_html;

      var circle = document.getElementById('circle'), //回一个匹配特定 ID的元素
        picker = document.getElementById('picker'),
        shield = document.getElementById('shield'),
        pickerCircle = picker.firstElementChild, //picker position
        rect = circle.getBoundingClientRect();
      (center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }),
        (transform = (function () {
          // 查找css style
          var prefs = ['t', 'WebkitT', 'MozT', 'msT', 'OT'],
            style = document.documentElement.style,
            p;
          for (var i = 0, len = prefs.length; i < len; i++) {
            if ((p = prefs[i] + 'ransform') in style) return p;
          }

          alert('your browser doesnt support css transforms!');
        })()),
        (rotate = function (x, y) {
          //x,y 转化成度数？
          var deltaX = x - center.x,
            deltaY = y - center.y,
            // The atan2 method returns a numeric value between -pi and pi representing the angle theta of an (x,y) point.
            // This is the counterclockwise angle, measured in radians, between the positive X axis, and the point (x,y).
            // Note that the arguments to this function pass the y-coordinate first and the x-coordinate second.
            // atan2 is passed separate x and y arguments, and atan is passed the ratio of those two arguments.
            // * from Mozilla's MDN

            // Basically you give it an [y, x] difference of two points and it give you back an angle
            // The 0 point of the angle is left (the initial position of the picker is also left)

            angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

          // Math.atan2(deltaY, deltaX) => [-PI +PI]
          // We must convert it to deg so...
          // / Math.PI => [-1 +1]
          // * 180 => [-180 +180]

          return angle;
        }),
        (shieldRotate = function (x, y) {
          // 红色阴影的度数？？为什么不是上下两个呢
          return rotate(x, y) + 20;
        }),
        (clickTime = []),
        // DRAGSTART
        (mousedown = function (event) {
          //event.preventDefault()
          mousemove(event);
          document.addEventListener('mousemove.drag', mousemove);
          document.addEventListener('mouseup', mouseup);
        }),
        // DRAG
        (mousemove = function (event) {
          $('#picker').toggle(true); //删掉picker
          $('#h').toggle(true);
          $('#v').toggle(true);
          $('#shield').toggle(true);
          shield.style[transform] =
            'rotate(' + shieldRotate(event.pageX, event.pageY) + 'deg) skewX(-50deg)';
          picker.style[transform] = 'rotate(' + rotate(event.pageX, event.pageY) + 'deg)';
          var getClickTime = performance.now();
          clickTime.push(getClickTime);
        }),
        // DRAGEND
        (mouseup = function (event) {
          var data = PickerData();
          $('#h').toggle(true);
          $('#v').toggle(true);
          document.removeEventListener('mouseup', mouseup);
          document.removeEventListener('mousemove.drag', mousemove);
          var info = {};
          info.rt = clickTime - startTime;
          info.delay = startTime;
          info.prediction = data;
          after_response(info);
        });

      var PickerData = function () {
        var rotate = $('#picker').css('transform');
        var a = rotate.indexOf('(');
        var b = rotate.indexOf(',');
        var c = rotate.indexOf(',', 20);
        var pickerCos = rotate.slice(a + 1, b);
        var pickerSin = rotate.slice(b + 1, c);
        var pickerTan = pickerSin / pickerCos;
        var pickerAngle = (Math.atan(pickerTan) / Math.PI) * 180;
        if (pickerCos < 0 && pickerSin < 0) {
          pickerAngle = pickerAngle + 180;
        } else if (pickerCos < 0 && pickerSin > 0) {
          pickerAngle = pickerAngle + 180;
        } else if (pickerCos > 0 && pickerSin < 0) {
          pickerAngle = pickerAngle + 360;
        } else if (pickerCos === 1 && pickerSin === 0) {
          pickerAngle = 0;
        }
        return pickerAngle;
      };

      // DRAG START
      pickerCircle.addEventListener('mousedown', mousedown);
      pickerCircle.addEventListener('mousemove.drag', mousemove);
      document.addEventListener('mousemove.drag', mousemove);

      // ENABLE STARTING THE DRAG IN THE BLACK CIRCLE
      circle.addEventListener('mousedown', function (event) {
        if (event.target == this) mousedown(event);
      });
    }

    // store response
    var response = {
      rt: null,
      delay: null,
      prediction: null,
    };

    var end_trial = function () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        delay: response.delay,
        prediction: response.prediction,
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function (info) {
      // only record the first response
      if (response.rt == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        jsPsych.pluginAPI.setTimeout(function () {
          // after wait is over
          end_trial();
        }, trial.trial_duration);
      }
    };
  };
  // the plugin object is returned at the end of the module
  return plugin;
})();
