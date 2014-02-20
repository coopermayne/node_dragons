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
var HomeView, Turtle, View, template,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  t = new Turtle(Math.PI / 3, 0, 2, 7, "F");
  t.findPoints();
  t.resizeCanvas();
  return t.draw();
});

Turtle = (function() {

  function Turtle(d_radians, d_distance, distance, iterations, startingString) {
    this.d_radians = d_radians;
    this.d_distance = d_distance;
    this.distance = distance;
    this.iterations = iterations;
    this.startingString = startingString;
    this.canvas = document.getElementById('canvas');
    this.context = this.canvas.getContext('2d');
    this.radians = 0;
    this.maxX = 0;
    this.maxY = 0;
    this.minX = 0;
    this.minY = 0;
    this.startingString = startingString;
    this.d_radians = d_radians;
    this.distance = distance;
    this.iterations = iterations;
    this.string = this.generateString();
    this.pos = {
      x: 0,
      y: 0
    };
    this.points = [$.extend(true, {}, this.pos)];
  }

  Turtle.prototype.generateString = function() {
    var num, string;
    string = "AB";
    num = this.iterations;
    while (num -= 1) {
      string = string.replace(/A/g, 'BlAlB');
      string = string.replace(/B/g, 'ArBrA');
    }
    return string;
  };

  Turtle.prototype.goForward = function() {
    var newX, newY;
    newX = this.distance * Math.cos(this.radians) + this.pos.x;
    newY = this.distance * Math.sin(this.radians) + this.pos.y;
    this.points.push({
      x: newX,
      y: newY
    });
    if (newX > this.maxX) {
      this.maxX = newX;
    }
    if (newY > this.maxY) {
      this.maxY = newY;
    }
    if (newX < this.minX) {
      this.minX = newX;
    }
    if (newY < this.minY) {
      this.minY = newY;
    }
    this.pos.x = newX;
    return this.pos.y = newY;
  };

  Turtle.prototype.turn = function(direction) {
    if (direction === 'r') {
      return this.radians = this.radians - this.d_radians;
    } else if (direction === 'l') {
      return this.radians = this.radians + this.d_radians;
    }
  };

  Turtle.prototype.findPoints = function() {
    var letter, _i, _len, _ref, _results;
    _ref = this.string;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      letter = _ref[_i];
      if (letter === 'A') {
        _results.push(this.goForward());
      } else if (letter === 'B') {
        _results.push(this.goForward());
      } else if (letter === 'l') {
        _results.push(this.turn('l'));
      } else if (letter === 'r') {
        _results.push(this.turn('r'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Turtle.prototype.draw = function() {
    var ctx, newX, newY, point, _i, _len, _ref;
    ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    _ref = this.points;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      newX = point.x;
      newY = point.y;
      ctx.lineTo(newX, newY);
    }
    ctx.lineWidth = 1;
    return ctx.stroke();
  };

  Turtle.prototype.resizeCanvas = function() {
    var centerx, centery, dx, dy, height, heightRatio, per, scaler, width, widthRatio;
    width = this.maxX - this.minX;
    height = this.maxY - this.minY;
    widthRatio = this.canvas.width / width;
    heightRatio = this.canvas.height / height;
    console.log(widthRatio, heightRatio);
    per = 1;
    centerx = this.minX + width / 2;
    centery = this.minY + height / 2;
    scaler = Math.min.apply(null, [widthRatio, heightRatio]) * 0.9;
    this.context.font = "20px Georgia";
    this.context.fillText("" + (scaler.toFixed(2)) + " times", 10, 30);
    console.log(scaler);
    dx = centerx - this.canvas.width / (2 * scaler);
    dy = centery - this.canvas.height / (2 * scaler);
    this.context.scale(scaler, scaler);
    return this.context.translate(-dx, -dy);
  };

  Turtle.prototype.xBox = function(x1, y1, x2, y2) {
    var ctx;
    ctx = this.context;
    ctx.beginPath();
    ctx.moveTo(x1, y2);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x2, y1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    return ctx.stroke();
  };

  return Turtle;

})();

});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"content\">\n  <canvas id=\"canvas\" width=\"512\" height=\"512\"></canvas>\n</div>\n";});
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