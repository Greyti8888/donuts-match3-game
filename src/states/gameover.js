export default class GameOver extends Phaser.State {
  init(score) {
    this.score = score
  }
  create() {
    this.background = this.add.sprite(0, 0, 'background')
    //Score
    this.scoreText = this.add.text(0, -15, this.score, {font: '70px Fredoka One', fill: 'white'})
		this.scoreText.anchor.set(0.5)
		this.bgScore = this.add.sprite(this.world.centerX, this.world.height * 0.4, 'bg-score')
		this.bgScore.addChild(this.scoreText)
    this.bgScore.anchor.set(0.5)
    //Time up
    this.timeup = this.add.sprite(this.world.centerX, this.world.height * 0.55, 'timeup')
    this.timeup.anchor.set(0.5)
    // Restart
    this.restartText = this.add.text(this.world.centerX, this.world.height * 0.80, 'Again ?', {font: '70px Fredoka One', fill: '#E85656'})
    this.restartText.anchor.set(0.5)
    this.restartText.stroke = '#4C6598'
    this.restartText.strokeThickness = 25
    this.restartText.addChild(this.make.text(0, -5, 'Again ?', {font: '70px Fredoka One', fill: '#E85656'}))
    this.restartText.children[0].anchor.set(0.5)
    this.restartText.children[0].stroke = '#FFFFFF'
    this.restartText.children[0].strokeThickness = 25

    this.restartBtn = this.add.button(this.world.centerX, this.world.height * 0.90, 'btn-play')
    this.restartBtn.anchor.set(0.5)
    this.restartBtn.scale.set(0.7)

    this.restartBtnSound = this.add.audio('select-1', 0.5)
    this.restartBtn.setDownSound(this.restartBtnSound)

    this.restart = false

    this.input.onDown.add(() => {
      this.restartBtn.input.pointerOver()
      ? this.startGame()
      : this.state.start('Menu')
    })
  }
  startGame() {
    this.out('top', this.bgScore)
    this.out('top', this.timeup)
    this.out('bottom', this.restartText)
    this.out('bottom', this.restartBtn, true)
  }

  out(to, object, start) {
    let tween = this.add.tween(object)
    let x = object.x
    let y = to == 'top' ? 0 - object.y - object.height : this.world.height + object.y + object.height
    tween.to({x: x, y: y }, 375, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(() => start ? this.state.start('Play') : '')
  }
}