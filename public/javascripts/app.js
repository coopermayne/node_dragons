(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var Application;

Application = {
  initialize: function() {
    var HomeView, Router;
    HomeView = require('views/home_view');
    Router = require('lib/router');
    this.homeView = new HomeView();
    this.router = new Router();
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  }
};

module.exports = Application;

});

;require.register("initialize", function(exports, require, module) {
var application;

application = require('application');

$(function() {
  application.initialize();
  return Backbone.history.start();
});

});

;require.register("lib/router", function(exports, require, module) {
var Router, application,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

application = require('application');

module.exports = Router = (function(_super) {

  __extends(Router, _super);

  function Router() {
    return Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    '': 'home'
  };

  Router.prototype.home = function() {
    return $('body').html(application.homeView.render().el);
  };

  return Router;

})(Backbone.Router);

});

;require.register("lib/view_helper", function(exports, require, module) {



});

;require.register("models/collection", function(exports, require, module) {
var Collection,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {

  __extends(Collection, _super);

  function Collection() {
    return Collection.__super__.constructor.apply(this, arguments);
  }

  return Collection;

})(Backbone.Collection);

});

;require.register("models/model", function(exports, require, module) {
var Model,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {

  __extends(Model, _super);

  function Model() {
    return Model.__super__.constructor.apply(this, arguments);
  }

  return Model;

})(Backbone.Model);

});

;require.register("views/home_view", function(exports, require, module) {
var HomeView, Turtle, View, customTimeInterval, customTimer, dragon, formToOptions, kochCurve, oOptionsToForm, plant, setUpControlPanel, sierpinksiTriangle, template, validateAndCleanForm,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

View = require('./view');

template = require('./templates/home');

module.exports = HomeView = (function(_super) {

  __extends(HomeView, _super);

  function HomeView() {
    return HomeView.__super__.constructor.apply(this, arguments);
  }

  HomeView.prototype.id = 'home-view';

  HomeView.prototype.template = template;

  return HomeView;

})(View);

$(document).ready(function() {
  var t;
  t = new Turtle(plant);
  return setUpControlPanel();
});

formToOptions = function(formData) {
  var f, formHash, options, param, _i, _len;
  options = {
    startingString: null,
    iterations: null,
    angle: null,
    rules: []
  };
  f = $('form').serializeArray();
  formHash = {};
  for (_i = 0, _len = f.length; _i < _len; _i++) {
    param = f[_i];
    formHash[param.name] = param.value;
  }
  formHash = validateAndCleanForm(formHash);
  console.log(formHash);
  options.startingString = formHash.startingString;
  options.iterations = formHash.iterations;
  options.angle = formHash.angle;
  options.rules[0] = {
    input: formHash.r1_input,
    output: formHash.r1_output
  };
  options.rules[1] = {
    input: formHash.r2_input,
    output: formHash.r2_output
  };
  options.rules[2] = {
    input: formHash.r3_input,
    output: formHash.r3_output
  };
  return options;
};

oOptionsToForm = function(options) {};

setUpControlPanel = function() {
  $('#help').on('click', function(e) {
    alert('no help for you!');
    return e.preventDefault();
  });
  $('button#deg-add').on('click', function(e) {
    var v;
    v = $('input#angle').val();
    $('input#angle').val(++v);
    return e.preventDefault();
  });
  $('button#deg-minus').on('click', function(e) {
    var v;
    v = $('input#angle').val();
    $('input#angle').val(--v);
    return e.preventDefault();
  });
  $('button#it-add').on('click', function(e) {
    var v;
    v = $('input#iterations').val();
    $('input#iterations').val(++v);
    return e.preventDefault();
  });
  $('button#it-minus').on('click', function(e) {
    var v;
    v = $('input#iterations').val();
    $('input#iterations').val(--v);
    return e.preventDefault();
  });
  $('#toggleControls').on('click', function(e) {
    $('#controlPanel').slideToggle();
    return e.preventDefault();
  });
  return $('form').on('submit', function(e) {
    var options, t;
    options = formToOptions();
    t = new Turtle(options);
    $('#controlPanel').slideUp();
    return e.preventDefault();
  });
};

Turtle = (function() {

  function Turtle(options) {
    this.startingString = options.startingString;
    this.rules = options.rules;
    this.iterations = options.iterations;
    this.d_radians = options.angle * (2 * Math.PI / 360);
    this.distance = 5;
    this.distanceMultiplier = options.distanceMultiplier || 1;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.radians = 0;
    this.string = options.startingString;
    this.popList = [];
    this.max = {
      x: 0,
      y: 0
    };
    this.min = {
      x: 0,
      y: 0
    };
    this.lastTrans = {
      x: 0,
      y: 0
    };
    this.scaler = 1;
    this.pos = {
      x: 0,
      y: 0
    };
    this.points = [$.extend(true, {}, this.pos)];
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.generateString();
    this.readString();
    this.resizeCanvas();
    this.draw();
  }

  Turtle.prototype.generateString = function() {
    var letter, num, old, rule, ruleInputs, _results;
    num = this.iterations;
    _results = [];
    while (num -= 1) {
      ruleInputs = this.rules.map(function(x) {
        return x.input;
      });
      old = this.string;
      this.string = new String;
      _results.push((function() {
        var _i, _len, _results1;
        _results1 = [];
        for (_i = 0, _len = old.length; _i < _len; _i++) {
          letter = old[_i];
          if (__indexOf.call(ruleInputs, letter) >= 0) {
            _results1.push((function() {
              var _j, _len1, _ref, _results2;
              _ref = this.rules;
              _results2 = [];
              for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                rule = _ref[_j];
                if (letter === rule.input) {
                  _results2.push(this.string = this.string.concat(rule.output));
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            }).call(this));
          } else {
            _results1.push(this.string = this.string.concat(letter));
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Turtle.prototype.goForward = function() {
    this.pos.x += this.distance * Math.cos(this.radians);
    this.pos.y += this.distance * Math.sin(this.radians);
    this.points.push({
      x: this.pos.x,
      y: this.pos.y
    });
    if (this.pos.x > this.max.x) {
      this.max.x = this.pos.x;
    }
    if (this.pos.y > this.max.y) {
      this.max.y = this.pos.y;
    }
    if (this.pos.x < this.min.x) {
      this.min.x = this.pos.x;
    }
    if (this.pos.y < this.min.y) {
      return this.min.y = this.pos.y;
    }
  };

  Turtle.prototype.turn = function(direction) {
    if (direction === 'r') {
      return this.radians = this.radians - this.d_radians;
    } else if (direction === 'l') {
      return this.radians = this.radians + this.d_radians;
    }
  };

  Turtle.prototype.popIn = function() {
    return this.popList.push({
      radians: this.radians,
      pos: {
        x: this.pos.x,
        y: this.pos.y
      }
    });
  };

  Turtle.prototype.popOut = function() {
    var r;
    r = this.popList.pop();
    this.pos = r.pos;
    this.radians = r.radians;
    return this.points.push({
      x: this.pos.x,
      y: this.pos.y,
      isNode: true
    });
  };

  Turtle.prototype.readString = function() {
    var letter, _i, _len, _ref, _results;
    _ref = this.string;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      letter = _ref[_i];
      switch (letter) {
        case 'F':
          _results.push(this.goForward());
          break;
        case "[":
          _results.push(this.popIn());
          break;
        case "]":
          _results.push(this.popOut());
          break;
        case 'l':
          _results.push(this.turn('l'));
          break;
        case 'r':
          _results.push(this.turn('r'));
          break;
        default:
          _results.push(void 0);
      }
    }
    return _results;
  };

  Turtle.prototype.draw = function() {
    var ctx, i, point, _i, _len, _ref;
    ctx = this.context;
    ctx.lineWidth = 0.5 / this.scaler;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    _ref = this.points;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      if (point.isNode) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }
    ctx.stroke();
    return this.resetTurtle();
  };

  Turtle.prototype.resetCanvas = function() {
    this.context.translate(-this.lastTrans.x, -this.lastTrans.y);
    return this.context.scale(1 / this.scaler, 1 / this.scaler);
  };

  Turtle.prototype.resetTurtle = function() {
    this.resetCanvas();
    this.string = this.startingString;
    this.max = {
      x: 0,
      y: 0
    };
    this.min = {
      x: 0,
      y: 0
    };
    this.lastTrans = {
      x: 0,
      y: 0
    };
    this.scaler = 1;
    this.pos = {
      x: 0,
      y: 0
    };
    return this.points = [$.extend(true, {}, this.pos)];
  };

  Turtle.prototype.resizeCanvas = function() {
    var center, dx, dy, height, heightRatio, rulesString, text, width, widthRatio;
    width = this.max.x - this.min.x;
    height = this.max.y - this.min.y;
    center = {
      x: this.min.x + width / 2,
      y: this.min.y + height / 2
    };
    widthRatio = this.canvas.width / width;
    heightRatio = this.canvas.height / height;
    this.scaler = Math.min.apply(null, [widthRatio, heightRatio, 15]) * 0.9;
    rulesString = this.rules.map(function(z) {
      return "" + z.input + "->" + z.output;
    });
    rulesString = rulesString.join(", ");
    text = "iterations:  " + this.iterations + ",      scale:     " + (this.scaler.toFixed(2)) + ",      segments:   " + this.points.length;
    $('#info span:first-child').text(text);
    dx = -1 * (center.x - this.canvas.width / (2 * this.scaler));
    dy = -1 * (center.y - this.canvas.height / (2 * this.scaler));
    this.context.scale(this.scaler, this.scaler);
    this.lastTrans.x = dx;
    this.lastTrans.y = dy;
    return this.context.translate(dx, dy);
  };

  Turtle.prototype.drawNextIteration = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.iterations++;
    customTimer(this.generateString, 'generate string', this);
    customTimer(this.readString, 'find points', this);
    this.resizeCanvas();
    return customTimer(this.draw, 'draw', this);
  };

  return Turtle;

})();

customTimeInterval = function(ms, func) {
  return setInterval(func, ms);
};

Number.prototype.toDegrees = function() {
  return (this * 180 / Math.PI).toFixed(1);
};

customTimer = function(func, desc, context) {
  var t1, t2;
  t1 = Date.now();
  func.apply(context);
  return t2 = Date.now();
};

sierpinksiTriangle = {
  startingString: 'FA',
  rules: [
    {
      input: 'A',
      output: 'BlFAlFB'
    }, {
      input: 'B',
      output: 'ArFBrFA'
    }
  ],
  iterations: 2,
  angle: 60
};

dragon = {
  startingString: "FX",
  rules: [
    {
      input: 'X',
      output: 'XlYFl'
    }, {
      input: 'Y',
      output: 'rFXrY'
    }
  ],
  iterations: 2,
  angle: 90
};

plant = {
  startingString: 'FX',
  rules: [
    {
      input: 'X',
      output: 'Fr[[X]lX]lF[lFX]rX'
    }, {
      input: 'F',
      output: 'FF'
    }
  ],
  iterations: 7,
  angle: 30
};

kochCurve = {
  startingString: 'FrrFrrF',
  rules: [
    {
      input: 'F',
      output: 'FlFrrFlF'
    }
  ],
  iterations: 1,
  angle: 60 + 25.8
};

validateAndCleanForm = function(formData) {
  return formData;
};

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"content\">\n\n  <div id='controlPanel'>\n    <form id='params'>\n      <h3>Parameters<span id='help'>help</span></h3>\n      <table>\n\n        <tr>\n          <td>Favorites:</td>\n          <td><select name=\"preDefined\" id=\"preDefined\">\n            <option value=\"sierpinksiTriangle\">sierpinksi triangle</option>\n            <option value=\"dragon\">dragon</option>\n            <option value=\"plant\">plant</option>\n            <option value=\"kochCurve\">koch curve</option>\n        </select></td>\n        </tr>\n\n        <tr>\n          <td>Angle: </td>\n          <td>\n            <input type=\"text\" name=\"angle\" value=\"30\" id=\"angle\">\n            <select>\n              <option value=\"degrees\">deg</option>\n              <option value=\"radians\">rad</option>\n            </select> \n            <span>\n              <button id='deg-add'>+</button>\n              <button id='deg-minus'>-</button>\n            </span>\n          </td>\n        </tr>\n\n        <tr>\n          <td>Iterations: </td>\n          <td>\n            <input type=\"text\" name=\"iterations\" value=\"5\" id=\"iterations\">\n            <span>\n              <button id='it-add'>+</button>\n              <button id='it-minus'>-</button>\n            </span>\n          </td>\n        </tr>\n        \n        <tr>\n          <td>Initial string: </td>\n          <td>\n            <input type=\"text\" name=\"startingString\" value=\"FX\" id=\"startingString\">\n          </td>\n        </tr>\n\n        <tr>\n          <td>Rule 1: </td>\n          <td>\n            <input class='input' type=\"text\" name=\"r1_input\" value=\"X\" id=\"r1_input\">\n            &rarr;\n            <input class='output' type=\"text\" name=\"r1_output\" value=\"Fr[[X]lX]lF[lFX]rX\" id=\"r1_output\">\n          </td>\n        </tr>\n        \n        <tr>\n          <td>Rule 2: </td>\n          <td>\n            <input class='input' type=\"text\" name=\"r2_input\" value=\"F\" id=\"r2_input\">\n            &rarr;\n            <input class='output' type=\"text\" name=\"r2_output\" value=\"FF\" id=\"r2_output\">\n          </td>\n        </tr>\n        \n        <tr>\n          <td>Rule 3: </td>\n          <td>\n            <input class='input' type=\"text\" name=\"r3_input\" value=\"\" id=\"r3_input\">\n            &rarr;\n            <input class='output' type=\"text\" name=\"r3_output\" value=\"\" id=\"r3_output\">\n          </td>\n        </tr>\n\n\n      </table>\n      <button id='submit'>\n        Draw\n          <span class=\"black-pencil\"></span>\n      </button>\n    </form>\n\n  </div>\n\n  <div id='info'>\n    <span>generating...</span>\n    <!--<span id='prevIteration' class=\"icon-settings\"></span>-->\n    <!--<span id='nextIteration' class=\"icon-settings\"></span>-->\n    <span id='toggleControls' class=\"icon-settings\"></span>\n  </div>\n\n  <canvas id=\"canvas\" width=\"700\" height=\"700\"></canvas>\n\n</div>\n";});
});

;require.register("views/view", function(exports, require, module) {
var View,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

require('lib/view_helper');

module.exports = View = (function(_super) {

  __extends(View, _super);

  function View() {
    this.render = __bind(this.render, this);
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.template = function() {};

  View.prototype.getRenderData = function() {};

  View.prototype.render = function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  };

  View.prototype.afterRender = function() {};

  return View;

})(Backbone.View);

});

;
//# sourceMappingURL=app.js.map