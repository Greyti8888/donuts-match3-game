export default class Menu extends Phaser.State {
  preload() {
    this.add.sprite(0, 0, 'background')
  }
  create() {
    // Music
    this.music = this.add.audio('bg-music', 0.5, true)
    // Sound button
    this.soundBtn = this.add.button(this.world.width * 0.75, 50, 'btn-sfx', this.handleSound, this)
    if (this.sound.mute) this.soundBtn.tint = 0x808080
    this.soundBtn.visible = false
    // Logo
    this.logo = this.add.sprite(this.world.width * 0.5, this.world.height * 0.4, 'logo')
    this.logo.anchor.set(0.5)
    this.in('top', this.logo) 
    // Start
    this.playBtn = this.add.button(this.world.width * 0.5, this.world.height * 0.6, 'btn-play', this.startGame, this)
    this.playBtn.anchor.set(0.5)
    //this.playBtn.scale.setTo(0.5)
    this.playBtnSound = this.add.audio('select-1', 0.5)
    this.playBtn.setDownSound(this.playBtnSound)
    //this.in('bottom', this.playBtn)
  }

  in(from, object) {
    //console.log(this.startGame)
    let tween = this.add.tween(object)
    let x = object.x
    let y = from == 'top' ? 0 - object.height : this.world.height + object.height
    tween.from({x: x, y: y }, 750, Phaser.Easing.Linear.None, true)
    .onComplete.add(()=> this.soundBtn.visible = true)
  }
  startGame() {
    this.music.stop()  
    this.out('top', this.logo)
    this.out('bottom', this.playBtn)
  }

  out(to, object) {
    this.soundBtn.visible = false
    let tween = this.add.tween(object)
    let x = object.x
    let y = to == 'top' ? 0 - object.height : this.world.height + object.height
    tween.to({x: x, y: y }, 375, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(() => this.state.start('Play'))
  }

  handleSound() {
    if (this.sound.mute) this.soundBtn.tint = 0xFFFFFF
    else this.soundBtn.tint = 0x808080
    this.sound.mute = !this.sound.mute
  }
}