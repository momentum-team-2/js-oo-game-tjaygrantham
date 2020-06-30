class Keyboarder {
  constructor(){
    this.keyState = {}
    this.isDown = keyCode => this.keyState[keyCode] === true
  }
}
