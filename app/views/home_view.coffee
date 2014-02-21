View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template


$(document).ready ->
  distance = 10
  maxIterations = 8
  angle = Math.PI/2
  startingString =  "FX"
  rules = [
    {input:'X', output:'XrYFr'}
    {input:'Y', output:'lFXlY'}
  ]
  t = new Turtle(angle, 0, distance, 2, rules, startingString)
  t.findPoints()
  t.resizeCanvas()
  t.draw()

  $('button').on 'click', ->
    t.iterations++
    t.resetCanvas()
    t = new Turtle(angle, 0, distance, t.iterations, rules, startingString)
    t.findPoints()
    #t.xBox(0,0,t.canvas.width, t.canvas.height)
    t.resizeCanvas()
    t.draw()
    console.log 'iterations: ' + t.iterations

  customTimeInterval 2000, ->
    if t.iterations < maxIterations
      t.iterations++
    else
      console.log 'no more!'
    t.resetCanvas()
    t = new Turtle(angle, 0, distance, t.iterations, rules, startingString)
    t.findPoints()
    #t.xBox(0,0,t.canvas.width, t.canvas.height)
    t.resizeCanvas()
    t.draw()

#custom delay function
customTimeInterval = (ms, func) -> setInterval func, ms

class Turtle

  constructor: (@d_radians, @d_distance, @distance, @iterations, @rules, @startingString) ->
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.radians = 0
    this.startingString = startingString
    this.string = startingString
    this.rules = rules
    this.maxX = 0
    this.maxY = 0
    this.minX = 0
    this.minY = 0
    this.lastTrans = {x:0, y: 0}
    this.lastScaler = 1

    this.d_radians = d_radians
    this.distance = distance
    this.iterations = iterations
    this.pos = { x: 0, y: 0 }
    this.points = [$.extend( true, {}, this.pos )]

  generateString: ->
    num = @iterations

    while num -= 1
      ruleInputs = this.rules.map (x) -> x.input
      console.log ruleInputs
      old = this.string
      this.string = new String
      for letter in old
        console.log letter
        if letter in ruleInputs
          for rule in this.rules
            console.log rule.input==letter
            if letter == rule.input
              this.string = this.string.concat rule.output
              console.log 'applied rule'
        else
          this.string = this.string.concat letter
          console.log 'added letter'

    console.log 'finished: ' + this.string

  goForward: ->
    newX = this.distance * Math.cos(this.radians) + this.pos.x
    newY = this.distance * Math.sin(this.radians) + this.pos.y

    this.points.push({x: newX, y: newY})

    this.maxX = newX if newX > this.maxX
    this.maxY = newY if newY > this.maxY
    this.minX = newX if newX < this.minX
    this.minY = newY if newY < this.minY
    this.pos.x = newX
    this.pos.y = newY

  turn: (direction) ->
    if direction == 'r'
      this.radians = this.radians - this.d_radians
    else if direction == 'l'
      this.radians = this.radians + this.d_radians

  findPoints: ->
    this.generateString()
    for letter in this.string
      if /[F]/.test letter
        this.goForward()
      else if letter == 'l'
        this.turn 'l'
      else if letter == 'r'
        this.turn 'r'
  draw: ->
    ctx = this.context
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for point in this.points
      newX = point.x
      newY = point.y
      ctx.lineTo(newX,newY)
    ctx.stroke()

  resetCanvas: ->
    console.log('resetting canvas...')
    this.context.translate(-this.lastTrans.x,-this.lastTrans.y)
    this.context.scale(1/this.lastScaler, 1/this.lastScaler)
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
    #console.log 'drawing cross'
    #this.xBox(0,0,this.canvas.width, this.canvas.height)

  resizeCanvas: ->
    #guide
    #

    width = this.maxX - this.minX
    height = this.maxY - this.minY

    widthRatio = this.canvas.width/width
    heightRatio = this.canvas.height/height
    #console.log widthRatio, heightRatio

    per = 1

    centerx = this.minX + width/2
    centery = this.minY + height/2
    scaler = Math.min.apply(null,[widthRatio, heightRatio])*0.9
    this.lastScaler = scaler
    rulesString = this.rules.map (z) ->
      return "#{z.input}->#{z.output}"
    rulesString = rulesString.join(", ")
    this.context.font="15px Georgia"
    this.context.fillText(
      "#{scaler.toFixed(2)}x,
      iteration:#{this.iterations},
      segments:#{this.points.length},
      angle:#{( this.d_radians * 180/Math.PI ).toFixed(1)},
      rules:#{rulesString}",
      10,
      20
    )

    dx = -1*(centerx - this.canvas.width/(2*scaler))
    dy = -1*(centery - this.canvas.height/(2*scaler))
    this.context.scale(scaler,scaler)
    this.lastTrans.x = dx
    this.lastTrans.y = dy
    this.context.translate(dx, dy)

  xBox: (x1,y1,x2,y2) ->
    ctx = this.context
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
