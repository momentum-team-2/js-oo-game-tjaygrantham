class Game {
  constructor() {
    let canvas = document.getElementById('canvas')
    let screen = canvas.getContext('2d')
    let gameSize = { x: canvas.width, y: canvas.height }
    this.timer = 0
    this.score = 0
    this.bodies = []
    this.player = new Player(this, gameSize)
    this.coin = new Coin(this, gameSize)
    this.bodies.push(this.coin)
    this.bodies.push(this.player)
    let tick = () => {
      if(this.timer === 60)
        this.timer = 0
      this.timer++
      this.update(gameSize)
      this.draw(screen, gameSize)
      requestAnimationFrame(tick)
    }

    tick()
  }

  update(gameSize){
    if(colliding(this.player, this.coin)){
      this.score++
      this.coin.needsNewPos = true
      console.log(this.score)
    }
    for(let body of this.bodies){
      body.update(gameSize)
    }
  }

  draw(screen, gameSize){
    screen.clearRect(0, 0, gameSize.x, gameSize.y)
    drawGrid(screen)
    for(let body of this.bodies){
      drawRect(screen, body)
    }
  }

}

class Player {
  constructor(game, gameSize) {
    this.keyboarder = new Keyboarder()
    window.addEventListener('keydown', event => this.keyboarder.keyState[event.code] = true)
    window.addEventListener('keyup', event => this.keyboarder.keyState[event.code] = false)
    this.size = { x: 60, y: 60}
    this.center = { x: gameSize.x / 2, y: gameSize.y / 2 }
    this.direction
    this.frames = 0
  }

  update(gameSize){
    let canvas = document.getElementById('canvas')
    if(this.frames === 0){
      this.direction = undefined
      if(this.keyboarder.isDown('ArrowLeft') && game.player.center.x != 300){
        this.direction = 'left'
      }
      else if(this.keyboarder.isDown('ArrowRight') && game.player.center.x != 500){
        this.direction = 'right'
      }
      else if(this.keyboarder.isDown('ArrowDown') && game.player.center.y != 500){
        this.direction = 'down'
      }
      else if(this.keyboarder.isDown('ArrowUp') && game.player.center.y != 300){
        this.direction = 'up'
      }
      if(this.direction)
        this.frames = 10
    }
    if(this.frames > 0){
      if(this.direction === 'left')
        this.center.x -= 10
      if(this.direction === 'right')
        this.center.x += 10
      if(this.direction === 'down')
        this.center.y += 10
      if(this.direction === 'up')
        this.center.y -= 10
      this.frames -= 1
    }
  }
}

class Coin {
  constructor(game, gameSize){
    this.size = { x: 30, y: 30 }
    this.needsNewPos = false
    this.center = { x: 300, y: 300 }
  }

  update(gameSize){
    if(this.needsNewPos){
      let oldPos = this.center
      let possibleCoords = [ 300, 400, 500 ]
      //while(Math.abs(this.center.x - oldPos.x) < 200 && Math.abs(this.center.y - oldPos.y) < 200)
      while(this.center === oldPos)
        this.center = { x: possibleCoords[Math.floor(Math.random()*3)], y: possibleCoords[Math.floor(Math.random()*3)] }
      this.needsNewPos = false
    }
  }
}

function drawRect (screen, body) {
  if(body instanceof Coin)
    screen.fillStyle = "yellow"
  else
    screen.fillStyle = "red"
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
    body.size.x, body.size.y)
}

function colliding (b1, b2) {
  return !(
    b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2
  )
}

function drawGrid (screen) {
  screen.fillStyle = "black"
  screen.fillRect(250, 250, 300, 300)
  screen.fillStyle = "gray"
  screen.fillRect(245, 245, 10, 310)
  screen.fillRect(245, 245, 310, 10)
  screen.fillRect(545, 250, 10, 305)
  screen.fillRect(250, 545, 305, 10)
  screen.fillRect(345, 250, 10, 300)
  screen.fillRect(445, 250, 10, 300)
  screen.fillRect(250, 345, 300, 10)
  screen.fillRect(250, 445, 300, 10)
}

let game = new Game()