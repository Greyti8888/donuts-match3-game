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
    
    this.timeup = this.add.sprite(this.world.width * 0.5, this.world.height * 0.55, 'timeup')
    this.timeup.anchor.set(0.5)
    this.input.onDown.add(() => {
      this.state.start('Menu')
    })
  }
}