import Boot from 'states/boot'
import Preload from 'states/preload'
import Menu from 'states/menu'
import Play from 'states/play'
import GameOver from 'states/gameover'

class Game extends Phaser.Game {

	constructor() {
		//super(360, 640, Phaser.AUTO, 'content', null)
		super(720, 1280, Phaser.AUTO, 'content', null)
		this.state.add('Boot', Boot)
		this.state.add('Preload', Preload)
		this.state.add('Menu', Menu)
		this.state.add('Play', Play)
		this.state.add('GameOver', GameOver)	
		this.state.start('Boot')
	}

}

new Game()
