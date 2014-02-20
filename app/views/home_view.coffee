View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template


$(document).ready ->
  t = new Turtle(Math.PI/3, 0, 2, 7, "F")
  t.findPoints()
  t.resizeCanvas()
  t.draw()

class Turtle
  constructor: (@d_radians, @d_distance, @distance, @iterations, @startingString) ->
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.radians = 0
    this.maxX = 0
    this.maxY = 0
    this.minX = 0
    this.minY = 0

    this.startingString = startingString
    this.d_radians = d_radians
    this.distance = distance
    this.iterations = iterations
    this.string = this.generateString()
    this.pos = { x: 0, y: 0 }
    this.points = [$.extend( true, {}, this.pos )]

  generateString: ->
    string = "AB"
    num = @iterations
    while num -= 1
      string = string.replace(/A/g, 'BlAlB')
      string = string.replace(/B/g, 'ArBrA')
    string

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
    for letter in this.string
      if letter == 'A'
        this.goForward()
      else if letter == 'B'
        this.goForward()
      else if letter == 'l'
        this.turn 'l'
      else if letter == 'r'
        this.turn 'r'
  draw: ->
    ctx = this.context
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    for point in this.points
      newX = point.x
      newY = point.y
      ctx.lineTo(newX,newY)
    ctx.lineWidth = 1
    ctx.stroke()

  resizeCanvas: ->
    #guide
    #

    width = this.maxX - this.minX
    height = this.maxY - this.minY

    widthRatio = this.canvas.width/width
    heightRatio = this.canvas.height/height
    console.log widthRatio, heightRatio

    per = 1

    centerx = this.minX + width/2
    centery = this.minY + height/2
    scaler = Math.min.apply(null,[widthRatio, heightRatio])*0.9
    this.context.font="20px Georgia"
    this.context.fillText("#{scaler.toFixed(2)} times",10,30)
    console.log scaler

    dx = centerx - this.canvas.width/(2*scaler)
    dy = centery - this.canvas.height/(2*scaler)
    this.context.scale(scaler,scaler)
    this.context.translate(-dx, -dy)

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

