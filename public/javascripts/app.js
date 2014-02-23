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
var HomeView, Turtle, View, customTimeInterval, customTimer, dragon, plant, sierpinksiTriangle, template,
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
  var options, t;
  options = plant;
  t = new Turtle(options);
  $(window).on('keypress', function(e) {
    if (e.charCode === 110) {
      return t.drawNextIteration();
    }
  });
  return $('button').on('click', function() {
    return t.drawNextIteration();
  });
});

Turtle = (function() {

  function Turtle(options) {
    this.distance = 5;
    this.distanceMultiplier = options.distanceMultiplier || 1;
    this.d_radians = options.angle;
    this.iterations = options.iterations;
    this.rules = options.rules;
    this.startingString = options.startingString;
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
    customTimer(this.generateString, 'generate string', this);
    console.log('STRING: ' + this.string);
    customTimer(this.readString, 'find points', this);
    console.log('POINTS: ' + this.points.length);
    console.log(this.points);
    this.resizeCanvas();
    customTimer(this.draw, 'drawAnimate', this);
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
    var changeColor, ctx, i, point, _i, _len, _ref;
    ctx = this.context;
    ctx.lineWidth = 0.3 / this.scaler;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    changeColor = function(color, ctx) {
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      return ctx.strokeStyle = color;
    };
    _ref = this.points;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      point = _ref[i];
      if (point.isNode) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
      if (i === 0 * Math.round(this.points.length / 3)) {
        changeColor('white', ctx);
      }
      if (i === 1 * Math.round(this.points.length / 3)) {
        changeColor('white', ctx);
      } else if (i === 2 * Math.round(this.points.length / 3)) {
        changeColor('white', ctx);
      }
    }
    return ctx.stroke();
  };

  Turtle.prototype.resetCanvas = function() {
    this.context.translate(-this.lastTrans.x, -this.lastTrans.y);
    this.context.scale(1 / this.scaler, 1 / this.scaler);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    text = "" + (this.scaler.toFixed(2)) + "x,      iteration:  " + this.iterations + ",      segments:   " + this.points.length + ",      angle:      " + (this.d_radians.toDegrees()) + ",      rules:      " + rulesString;
    $('#info span').text(text);
    dx = -1 * (center.x - this.canvas.width / (2 * this.scaler));
    dy = -1 * (center.y - this.canvas.height / (2 * this.scaler));
    this.context.scale(this.scaler, this.scaler);
    this.lastTrans.x = dx;
    this.lastTrans.y = dy;
    return this.context.translate(dx, dy);
  };

  Turtle.prototype.drawNextIteration = function() {
    this.resetCanvas();
    this.iterations++;
    this.radians = this.radians;
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
  t2 = Date.now();
  return console.log(desc + ": " + (t2 - t1) / 1000 + ' sec');
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
  angle: Math.PI / 3
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
  angle: Math.PI / 2
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
  iterations: 1,
  angle: Math.PI / 7
};

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"content\">\n\n  <form id='params'>\n\n    <label>angle</label>\n    <input type=\"text\" name=\"angle\" value=\"90\" id=\"angle\">\n\n    <label>iterations</label>\n    <input type=\"text\" name=\"iterations\" value=\"5\" id=\"iterations\">\n    \n    <label>string</label>\n    <input type=\"text\" name=\"startingString\" value=\"FX\" id=\"startingString\">\n\n    <label>r1</label>\n    <input type=\"text\" name=\"r1_input\" value=\"X\" id=\"r1_input\">\n    \n    <label>=></label>\n    <input class='output' type=\"text\" name=\"r1_output\" value=\"X\" id=\"r1_output\">\n\n    <label>r2</label>\n    <input type=\"text\" name=\"r2_input\" value=\"X\" id=\"r2_input\">\n\n    <label>=></label>\n    <input class='output' type=\"text\" name=\"r2_output\" value=\"X\" id=\"r2_output\">\n\n    <input type=\"submit\" value=\"Go\">\n  </form>\n\n  <div id='info'><span>generating...</span>\n    <button>+</button>\n  </div>\n\n  <canvas id=\"canvas\" width=\"700\" height=\"700\"></canvas>\n\n</div>\n";});
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