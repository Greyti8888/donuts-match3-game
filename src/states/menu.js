export default class Menu extends Phaser.State {
  preload() {
    this.add.sprite(0, 0, 'background')
  }
  create() {
    // Music
    this.music = this.add.audio('bg-music', 0.5, true)
    this.music.play()
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
    this.playBtnSound = this.add.audio('select-1', 0.5)
    this.playBtn.setDownSound(this.playBtnSound)
    this.in('bottom', this.playBtn) 
    // Rules
    let rulesBtnStyle = {font: '55px Fredoka One', fill: '#FFFFFF', stroke:'#E85656', strokeThickness: 22, wordWrap: true, wordWrapWidth: 450}
    this.rulesBtn = this.add.text(this.world.centerX, this.world.height - 85, 'How to Play', rulesBtnStyle)
    this.rulesBtn.anchor.set(0.5)
    this.rulesBtn.inputEnabled = true
    this.rulesBtn.events.onInputDown.add(() => this.rules())
    this.in('bottom', this.rulesBtn)  

    this.rulesBg = this.add.sprite(0, 0, 'background')
    this.rulesBg.visible = false
    this.rulesBg.inputEnabled = false
    this.rulesBg.events.onInputDown.add(() => this.returnToMenu())

    let rules = `
Goal:
Score as many points as you can, before time runs out

Scoring:
Line up 3 or more of the same donut to score points
You get 100 points for each donut
Matching more than 3 donuts, will give you extra 100 points for 4-th and further donuts

Controls:
You can swap any two donuts that are adjacent horizontally or vertically
Swap by clicking on them or by swiping in direction you want to swap
`
    let rulesStyle = {font: '35px Fredoka One', fill: '#FFFFFF', stroke: '#E85656', strokeThickness: 12, wordWrap: true, wordWrapWidth: this.world.width - 40}
    this.rulesText = this.add.text(15, 0, rules, rulesStyle)
    this.rulesText.visible = false
  }
  rules() {
    this.music.stop()
    this.rulesBg.visible = true
    this.rulesBg.inputEnabled = true
    this.rulesText.visible = true
  }
  returnToMenu() {
    this.music.play()
    this.rulesBg.visible = false
    this.rulesBg.inputEnabled = false
    this.rulesText.visible = false
  }
  in(from, object) {
    let tween = this.add.tween(object)
    let x = object.x
    let y = from == 'top' ? 0 - object.y - object.height : this.world.height + object.y + object.height
    tween.from({x: x, y: y }, 750, Phaser.Easing.Linear.None, true)
    .onComplete.add(()=> this.soundBtn.visible = true)
  }
  startGame() {
    this.music.stop()  
    this.out('top', this.logo)
    this.out('bottom', this.rulesBtn)
    this.out('bottom', this.playBtn, true)
    
  }

  out(to, object, start) {
    this.soundBtn.visible = false
    let tween = this.add.tween(object)
    let x = object.x
    let y = to == 'top' ? 0 - object.y - object.height : this.world.height + object.y + object.height
    tween.to({x: x, y: y }, 375, Phaser.Easing.Linear.None, true)
    tween.onComplete.add(() => start ? this.state.start('Play'): '')
  }

  handleSound() {
    if (this.sound.mute) this.soundBtn.tint = 0xFFFFFF
    else this.soundBtn.tint = 0x808080
    this.sound.mute = !this.sound.mute
  }
}