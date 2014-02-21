View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

$(document).ready ->

  options =
    rules: [
      {input:'X', output:'XlYFl'}
      {input:'Y', output:'rFXrY'}
    ]
    iterations: 2
    angle: Math.PI/2
    startingString:  "FX"

  t = new Turtle(options)

  $('button').on 'click', ->
    t.iterations++
    t.resetCanvas()
    options.iterations++
    t = new Turtle(options)

  customTimeInterval 1000, ->
    maxIterations = 8
    if t.iterations < maxIterations
      t.iterations++
      t.resetCanvas()
      options.iterations++
      t = new Turtle(options)

class Turtle

  constructor: (options) ->
    @d_radians = options.angle
    @iterations = options.iterations
    @rules = options.rules
    @startingString = options.startingString
    @canvas = document.getElementById('canvas')
    @context = @canvas.getContext('2d')
    @radians = 0
    @string = options.startingString
    @distance = 5

    @max = {x:0, y:0}
    @min = {x:0, y:0}

    @lastTrans = {x:0, y: 0}
    @scaler = 1

    @pos = { x: 0, y: 0 } #turtles position (starts at origin...)
    @points = [$.extend( true, {}, @pos )]

    #now we actually draw the thing
    customTimer(this.generateString, 'generate string', this)
    customTimer(this.findPoints, 'find points', this) #gets an array of points that make up the shape
    this.resizeCanvas()  #resize the canvas to fit shape
    customTimer(this.draw, 'draw', this)

  generateString: ->
    num = @iterations

    while num -= 1
      ruleInputs = @rules.map (x) -> x.input
      old = @string
      @string = new String
      for letter in old
        if letter in ruleInputs
          for rule in @rules
            if letter == rule.input
              @string = @string.concat rule.output
        else
          @string = @string.concat letter

  goForward: ->
    newX = @distance * Math.cos(@radians) + @pos.x
    newY = @distance * Math.sin(@radians) + @pos.y

    @points.push({x: newX, y: newY})

    @max.x = newX if newX > @max.x
    @max.y = newY if newY > @max.y
    @min.x = newX if newX < @min.x
    @min.y = newY if newY < @min.y
    @pos.x = newX
    @pos.y = newY

  turn: (direction) ->
    if direction == 'r'
      @radians = @radians - @d_radians
    else if direction == 'l'
      @radians = @radians + @d_radians

  findPoints: ->

    for letter in @string
      if /[ABF]/.test letter
        @goForward()
      else if letter == 'l'
        @turn 'l'
      else if letter == 'r'
        @turn 'r'

  draw: ->
    ctx = @context
    ctx.lineWidth = 1
    ctx.strokeStyle= 'white'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(@points[0].x, @points[0].y)
    for point in @points
      newX = point.x
      newY = point.y
      ctx.lineTo(newX,newY)
    ctx.stroke()

  resetCanvas: ->
    @context.translate(-@lastTrans.x,-@lastTrans.y)
    @context.scale(1/@scaler, 1/@scaler)
    @context.clearRect(0,0,@canvas.width,@canvas.height)

  resizeCanvas: ->
    width = @max.x - @min.x
    height = @max.y - @min.y
    center =
      x: @min.x + width/2
      y: @min.y + height/2

    widthRatio = @canvas.width/width
    heightRatio = @canvas.height/height

    @scaler = Math.min.apply(null,[widthRatio, heightRatio, 15])*0.9

    rulesString = @rules.map (z) ->
      return "#{z.input}->#{z.output}"
    rulesString = rulesString.join(", ")

    text =
      "#{@scaler.toFixed(2)}x,
      iteration:  #{@iterations},
      segments:   #{@points.length},
      angle:      #{@d_radians.toDegrees()},
      rules:      #{rulesString}"
    $('#info span').text(text)

    dx = -1*(center.x - @canvas.width/(2*@scaler))
    dy = -1*(center.y- @canvas.height/(2*@scaler))
    @context.scale(@scaler,@scaler)
    @lastTrans.x = dx
    @lastTrans.y = dy
    @context.translate(dx, dy)

#-- Custom Functions
customTimeInterval = (ms, func) -> setInterval func, ms

Number.prototype.toDegrees =  ->
  ( this * 180/Math.PI ).toFixed(1)

customTimer = (func, desc, context) ->
  t1 = Date.now()
  func.apply(context)
  t2 = Date.now()
  console.log desc + ": " + ( t2-t1 )/ 1000 + ' sec'

# sierpinski triangle -- options = { angle: Math.PI/3, startingString: 'A', rules:[{input:'A', output:'BlAlB'},{input:'B', output:'ArBrA'}] }
# dragon -- options = { angle: Math.PI/2, startingString: 'FX', rules:[{input:'X', output:'XlYFl'},{input:'Y', output:'rFXrY'}] }

