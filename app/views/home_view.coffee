View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

$(document).ready ->
  #TODO connect with form
  options = plant
  t = new Turtle(options)

  $(window).on 'keypress', (e)->
    if e.charCode == 110
      t.drawNextIteration()

  $('button').on 'click', ->
    t.drawNextIteration()

    #t.iterations++
    #t.resetCanvas()
    #options.iterations++
    #t = new Turtle(options)

  #customTimeInterval 1000, ->
    #maxIterations = 5
    #if t.iterations < maxIterations
      #t.drawNextIteration()

class Turtle
  constructor: (options) ->
    @distance = 5
    @distanceMultiplier = options.distanceMultiplier || 1
    @d_radians = options.angle
    @iterations = options.iterations
    @rules = options.rules
    @startingString = options.startingString
    @canvas = document.getElementById('canvas')
    @context = @canvas.getContext('2d')
    @radians = 0 #starting angle of t.... (east)
    @string = options.startingString
    @popList = []

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
    customTimer(this.draw, 'drawAnimate', this)
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
    @distance = @distance * @distanceMultiplier
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
  popIn: ->
    # save current angle and position to popList
    @popList.push {
      radians: @radians
      pos: {
        x: @pos.x
        y: @pos.y
      }
      node:true
    }

  popOut: ->
    # restore angle and position from popList
    r = @popList.pop()
    @pos = r.pos
    @radians = r.radians
    console.log 'node'

  findPoints: ->
    for letter in @string
      if letter == 'F'
        this.goForward()
      else if letter == "["
        this.popIn()
      else if letter == "]"
        this.popOut()
      else if letter == 'l'
        this.turn 'l'
      else if letter == 'r'
        this.turn 'r'

  draw: ->
    ctx = @context
    ctx.lineWidth = 0.3/@scaler
    ctx.lineJoin = 'round'
    ctx.beginPath()

    changeColor = (color, ctx)->
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(newPoint.x,newPoint.y)
      ctx.strokeStyle = color

    for point,i in @points
      newPoint = point
      ctx.lineTo(newPoint.x,newPoint.y)
      if point.node
        console.log 'node'
      if i == 0*Math.round @points.length/3
        changeColor('white', ctx)
      if i == 1*Math.round @points.length/3
        changeColor('white', ctx)
      else if i == 2*Math.round @points.length/3
        changeColor('white', ctx)
      else

    ctx.stroke()
  resetCanvas: ->
    # undo the transformations that you made when
    # plotting... this way everything is ready
    # for next iteration
    @context.translate(-@lastTrans.x,-@lastTrans.y)
    @context.scale(1/@scaler, 1/@scaler)
    @context.clearRect(0,0,@canvas.width,@canvas.height)

    #reset variables for next iteration...
    @string = this.startingString
    @max = {x:0, y:0}
    @min = {x:0, y:0}
    @lastTrans = {x:0, y: 0}
    @scaler = 1
    @pos = { x: 0, y: 0 } #turtles initial position
    @points = [$.extend( true, {}, @pos )]

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
  drawNextIteration: ->
    this.resetCanvas()

    @iterations++
    @radians = @radians
    customTimer(this.generateString, 'generate string', this)
    customTimer(this.findPoints, 'find points', this) #gets an array of points that make up the shape
    this.resizeCanvas()  #resize the canvas to fit shape
    customTimer(this.draw, 'draw', this)

#-- Custom Functions
customTimeInterval = (ms, func) -> setInterval func, ms

Number.prototype.toDegrees =  ->
  ( this * 180/Math.PI ).toFixed(1)

customTimer = (func, desc, context) ->
  t1 = Date.now()
  func.apply(context)
  t2 = Date.now()
  console.log desc + ": " + ( t2-t1 )/ 1000 + ' sec'

sierpinksiTriangle =
  startingString: 'FA'
  rules:[
    {input:'A', output:'BlFAlFB'}
    {input:'B', output:'ArFBrFA'}
  ]
  iterations: 2
  angle: Math.PI/3
dragon =
  startingString:  "FX"
  rules: [
    {input:'X', output:'XlYFl'}
    {input:'Y', output:'rFXrY'}
  ]
  iterations: 2
  angle: Math.PI/2
  #distanceMultiplier: 1.0005
plant =
  startingString: 'FX'
  rules:[
    {input:'X', output:'Fr[[X]lX]lF[lFX]rX'}
    {input:'F', output:'FF'}
  ]
  iterations: 2
  angle: Math.PI/6
