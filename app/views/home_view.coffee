View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

$(document).ready ->
  # sierpinski triangle -- { angle: Math.PI/3, startingString: 'A', rules:[{input:'A', output:'BlAlB'},{input:'B', output:'ArBrA'}] }
  # dragon -- { angle: Math.PI/2, startingString: 'FX', rules:[{input:'X', output:'XlYFl'},{input:'Y', output:'rFXrY'}] }

  options = {
    iterations: 2
    angle: Math.PI/2
    startingString:  "FX"
    rules: [
      {input:'X', output:'XlYFl'}
      {input:'Y', output:'rFXrY'}
    ]
  }
  console.log options

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
    @lastScaler = 1

    @pos = { x: 0, y: 0 } #turtles position (starts at origin...)
    @points = [$.extend( true, {}, @pos )]

    #now we actually draw the thing
    this.findPoints() #gets an array of points that make up the shape
    this.resizeCanvas() #resize the canvas to fit shape
    this.draw()

  generateString: ->
    t1 = Date.now()
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

    #console.log 'finished: ' + @string
    t2 = Date.now()
    console.log 'generateString: ' + ( t2-t1 )/ 1000 + ' sec'

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
    this.generateString()
    t1 = Date.now()
    for letter in @string
      if /[ABF]/.test letter
        @goForward()
      else if letter == 'l'
        @turn 'l'
      else if letter == 'r'
        @turn 'r'
    t2 = Date.now()
    console.log 'findPoints: ' + ( t2-t1 )/ 1000 + ' sec'

  draw: ->

    t1 = Date.now()
    ctx = @context
    ctx.lineWidth = 1
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(@points[0].x, @points[0].y)
    for point in @points
      newX = point.x
      newY = point.y
      ctx.lineTo(newX,newY)
    ctx.stroke()
    t2 = Date.now()
    console.log 'draw: ' + ( t2-t1 )/ 1000 + ' sec'

  resetCanvas: ->
    console.log('resetting canvas...')
    @context.translate(-@lastTrans.x,-@lastTrans.y)
    @context.scale(1/@lastScaler, 1/@lastScaler)
    @context.clearRect(0,0,@canvas.width,@canvas.height)
    #console.log 'drawing cross'
    #@xBox(0,0,@canvas.width, @canvas.height)

  resizeCanvas: ->
    #guide
    #

    width = @max.x - @min.x
    height = @max.y - @min.y

    widthRatio = @canvas.width/width
    heightRatio = @canvas.height/height
    #console.log widthRatio, heightRatio

    per = 1

    centerx = @min.x + width/2
    centery = @min.y + height/2
    scaler = Math.min.apply(null,[widthRatio, heightRatio])*0.9
    @lastScaler = scaler
    rulesString = @rules.map (z) ->
      return "#{z.input}->#{z.output}"
    rulesString = rulesString.join(", ")
    @context.font="15px Georgia"
    @context.fillText(
      "#{scaler.toFixed(2)}x,
      iteration:#{@iterations},
      segments:#{@points.length},
      angle:#{( @d_radians * 180/Math.PI ).toFixed(1)},
      rules:#{rulesString}",
      10,
      20
    )

    dx = -1*(centerx - @canvas.width/(2*scaler))
    dy = -1*(centery - @canvas.height/(2*scaler))
    @context.scale(scaler,scaler)
    @lastTrans.x = dx
    @lastTrans.y = dy
    @context.translate(dx, dy)

  xBox: (x1,y1,x2,y2) ->
    ctx = @context
    ctx.beginPath()
    ctx.moveTo(x1, y2)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x2, y1)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x1, y2)
    ctx.lineTo(x2, y1)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)

    ctx.stroke()

#custom delay function
customTimeInterval = (ms, func) -> setInterval func, ms

