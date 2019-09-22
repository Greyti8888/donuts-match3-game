export default class Boot extends Phaser.State {
  preload() {
    this.stage.backgroundColor = '#f6e787'
    //this.load.image('background', './images/backgrounds/background.jpg')
    this.load.image('background', './images/backgrounds/background2-2.jpg')
  }
  create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true
    //this.scale.setScreenSize = true

    this.add.sprite(0, 0, 'background')
    
    this.state.start('Preload')
  }
}