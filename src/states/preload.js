export default class Preload extends Phaser.State {
  preload() {
    this.add.text(0, 0, '', {font: '1px Fredoka One', fill: '#f6e787'})
    
    this.load.image('logo', './images/donuts_logo.png')
    this.load.image('btn-play', './images/btn-play.png')
    this.load.image('btn-sfx', './images/btn-sfx.png')

    this.load.image('gem-01', './images/game/gem-01.png')
    this.load.image('gem-02', './images/game/gem-02.png')
    this.load.image('gem-03', './images/game/gem-03.png')
    this.load.image('gem-04', './images/game/gem-04.png')
    this.load.image('gem-05', './images/game/gem-05.png')
    this.load.image('gem-06', './images/game/gem-06.png')
    this.load.image('gem-shadow', './images/game/shadow.png')

    this.load.image('bg-score', './images/bg-score.png')
    this.load.image('timeup', './images/text-timeup.png')

    this.load.audio('bg-music', './audio/background.mp3')
    this.load.audio('select-1', './audio/select-1.mp3')
    this.load.audio('score-sound', './audio/kill.mp3')

  }
  create() {
    this.state.start('Menu')
  }
}