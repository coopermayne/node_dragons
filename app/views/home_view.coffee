View = require './view'
template = require './templates/home'

module.exports = class HomeView extends View
  id: 'home-view'
  template: template

$(document).ready ->
  #TODO connect with form
  t = new Turtle(plant)
  setUpControlPanel()

formToOptions = (formData) ->
  #takes in the form data and returns options ready for turtle
  options =
    startingString: null
    iterations: null
    angle: null
    rules: [
    ]
  f = $('form').serializeArray()
  formHash = {}
  for param in f
    formHash[param.name] = param.value
  formHash = validateAndCleanForm(formHash)
  if formHash == false
    return alert 'bad params son!'

  options.startingString = formHash.startingString
  options.iterations = formHash.iterations
  options.angle = formHash.angle
  options.rules[0] = {input: formHash.r1_input, output: formHash.r1_output}
  options.rules[1] = {input: formHash.r2_input, output: formHash.r2_output}
  options.rules[2] = {input: formHash.r3_input, output: formHash.r3_output}

  options

selectToForm = (preSetSel) ->
  #takes in options and inserts them into for fields...
  opt = preSettingsArray[preSetSel]
  $('input#angle').val(opt.angle)
  $('input#iterations').val(opt.iterations)
  $('input#startingString').val(opt.startingString)
  $('#r1_input').val(opt.rules[0].input)
  $('#r1_output').val(opt.rules[0].output)
  $('#r2_input').val(opt.rules[1].input)
  $('#r2_output').val(opt.rules[1].output)
  $('#r3_input').val(opt.rules[2].input)
  $('#r3_output').val(opt.rules[2].output)

setUpControlPanel = ->
  #show control panel
  $('#toggleControls').on 'click', (e)->
    $('#controlPanel').slideToggle()
    e.preventDefault()

  $('form').on 'submit', (e) ->
    options = formToOptions()
    t = new Turtle(options)
    $('#controlPanel').slideUp()
    e.preventDefault()

  #set up preset param choices events
  $('#preDefined').on 'change', (e)->
    preSettingSel = $('#preDefined').val()
    selectToForm(preSettingSel) unless preSettingSel=='custom'
    e.preventDefault()

  #set up form click events
  $('#help').on 'click', (e) ->
    alert 'no help for you!'
    e.preventDefault()
  $('button#deg-add').on 'click', (e) ->
    v = $('input#angle').val()
    $('input#angle').val(++v)
    e.preventDefault()
  $('button#deg-minus').on 'click', (e) ->
    v = $('input#angle').val()
    $('input#angle').val(--v)
    e.preventDefault()
  $('button#it-add').on 'click', (e) ->
    v = $('input#iterations').val()
    $('input#iterations').val(++v)
    e.preventDefault()
  $('button#it-minus').on 'click', (e) ->
    v = $('input#iterations').val()
    $('input#iterations').val(--v)
    e.preventDefault()

class Turtle
  constructor: (options) ->
    @startingString = options.startingString
    @rules = options.rules
    @iterations = options.iterations
    @d_radians = options.angle * (2*Math.PI/360)
    @distance = 5
    @distanceMultiplier = options.distanceMultiplier || 1
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
    @context.clearRect(0,0,@canvas.width,@canvas.height)
    this.generateString()
    this.readString() #gets an array of points that make up the shape
    this.resizeCanvas()  #resize the canvas to fit shape
    this.draw()
  generateString: ->
    num = @iterations

    while num -= 1
      ruleInputs = @rules.map (x) -> x.input
      old = @string
      # making a new string each time might be a bit slow
      # refactor to alter the same string object.... TODO
      @string = new String
      for letter in old
        if letter in ruleInputs
          for rule in @rules
            if letter == rule.input
              @string = @string.concat rule.output
        else
          @string = @string.concat letter

  goForward: ->
    @pos.x += @distance * Math.cos(@radians)
    @pos.y += @distance * Math.sin(@radians)

    @points.push {
      x: @pos.x
      y: @pos.y
    }

    @max.x = @pos.x if @pos.x > @max.x
    @max.y = @pos.y if @pos.y > @max.y
    @min.x = @pos.x if @pos.x < @min.x
    @min.y = @pos.y if @pos.y < @min.y

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
    }

  popOut: ->
    # restore angle and position from popList
    r = @popList.pop()
    @pos = r.pos
    @radians = r.radians
    @points.push {
      x: @pos.x
      y: @pos.y
      isNode: true
    }

  readString: ->
    for letter in @string
      switch letter
        when 'F' then this.goForward()
        when "[" then this.popIn()
        when "]" then this.popOut()
        when 'l' then this.turn 'l'
        when 'r' then this.turn 'r'

  draw: ->
    ctx = @context
    ctx.lineWidth = 0.5/@scaler
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'white'
    ctx.beginPath()

    for point,i in @points

      if point.isNode
        ctx.moveTo(point.x, point.y)
      else
        ctx.lineTo(point.x,point.y)

    ctx.stroke()
    
    this.resetTurtle()

  resetCanvas: ->
    # undo the transformations that you made when
    # plotting... this way everything is ready
    # for next iteration
    @context.translate(-@lastTrans.x,-@lastTrans.y)
    @context.scale(1/@scaler, 1/@scaler)

  resetTurtle: ->
    this.resetCanvas()
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
      "iterations:  #{@iterations},
      scale:     #{@scaler.toFixed(2)},
      segments:   #{@points.length}"
    $('#info span:first-child').text(text)

    dx = -1*(center.x - @canvas.width/(2*@scaler))
    dy = -1*(center.y- @canvas.height/(2*@scaler))
    @context.scale(@scaler,@scaler)
    @lastTrans.x = dx
    @lastTrans.y = dy
    @context.translate(dx, dy)
  drawNextIteration: ->
    @context.clearRect(0,0,@canvas.width,@canvas.height)

    @iterations++
    customTimer(this.generateString, 'generate string', this)
    customTimer(this.readString, 'find points', this) #gets an array of points that make up the shape
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
  #console.log desc + ": " + ( t2-t1 )/ 1000 + ' sec'

sierpinksiTriangle =
  startingString: 'FA'
  rules:[
    {input:'A', output:'BlFAlFB'}
    {input:'B', output:'ArFBrFA'}
    {input: null, output: null}
  ]
  iterations: 6
  angle: 60
dragon =
  startingString:  "FX"
  rules: [
    {input:'X', output:'XlYFl'}
    {input:'Y', output:'rFXrY'}
    {input: null, output: null}
  ]
  iterations: 9
  angle: 90
  #distanceMultiplier: 1.0005
plant =
  startingString: 'FX'
  rules:[
    {input:'X', output:'Fr[[X]lX]lF[lFX]rX'}
    {input:'F', output:'FF'}
    {input: null, output: null}
  ]
  iterations: 7
  angle: 30

kochCurve =
  startingString: 'FrrFrrF'
  rules: [
    {input:'F', output:'FlFrrFlF'}
    {input: null, output: null}
    {input: null, output: null}
  ]
  iterations: 8
  angle: 60 + 25.8

preSettingsArray =
  'dragon': dragon
  'sierpinksiTriangle': sierpinksiTriangle
  'plant': plant
  'kochCurve': kochCurve

# color option (for curiosity's sake
#changeColor = (color, ctx)->
  #ctx.stroke()
  #ctx.beginPath()
  #ctx.moveTo(point.x,point.y)
  #ctx.strokeStyle = color

#if i == 0*Math.round @points.length/3
  #changeColor('white', ctx)
#if i == 1*Math.round @points.length/3
  #changeColor('white', ctx)
#else if i == 2*Math.round @points.length/3
  #changeColor('white', ctx)

validateAndCleanForm = (formData)->
  # turn strings to numbers
  cleanedFormData = {}
  formData.angle = parseInt formData.angle
  formData.iterations = parseInt formData.iterations

  if (typeof formData.angle)=='number'
    cleanedFormData.angle = formData.angle
  else
    return false
  if (typeof formData.iterations)=='number' and formData.iterations > 0 and formData.iterations < 15
    cleanedFormData.iterations = formData.iterations
  else
    return false

  cleanedFormData.startingString = formData.startingString.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r1_input = formData.r1_input.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r2_input = formData.r2_input.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r3_input = formData.r3_input.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r1_output = formData.r1_output.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r2_output = formData.r2_output.replace /[^FXYlr\[\]]/, ''
  cleanedFormData.r3_output = formData.r3_output.replace /[^FXYlr\[\]]/, ''

  cleanedFormData
