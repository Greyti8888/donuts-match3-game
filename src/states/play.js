export default class Play extends Phaser.State {
	create() {
		this.background = this.add.sprite(0, 0, 'background')
		// Music
		this.music = this.add.audio('bg-music', 0.5)
		this.music.play()
		// Bottom bg
		this.bgBottom = this.add.graphics(0, 0)
		this.bgBottom.beginFill(0xf6e787)
		this.bgBottom.drawRect(0, this.world.height - 200, this.world.width, 200)
		this.bgBottom.endFill()
		//Score
		this.score = 0
		this.scoreText = this.add.text(0, -15, '', {font: '70px Fredoka One', fill: 'white'})
		this.scoreText.anchor.set(0.5)
		this.bgScore = this.add.sprite(this.world.centerX + 20, this.world.height - 80, 'bg-score')
		this.bgScore.addChild(this.scoreText)
		this.bgScore.anchor.set(0.5)
		this.bgScore.inputEnabled = true
		this.scoreSound = this.add.audio('score-sound', 0.5)
		// Timer
		this.timeLeft = 45
		this.bgTimer = this.add.graphics(0, 0)
		this.bgTimer.beginFill(0x777777);
		this.bgTimer.lineStyle(5, 0xbbf6f6)
		this.bgTimer.drawCircle(100, this.world.height - 96, 160)
		this.bgTimer.endFill()
		this.timerText = this.add.text(102, this.world.height - 90, this.timeLeft, {font: '90px Fredoka One', fill: 'white'})
		this.timerText.anchor.set(0.5)
		// Countdown
		this.timer = this.game.time.create();
		this.timer.loop(Phaser.Timer.SECOND, this.updateTimer, this);
		this.timer.start();
		// Menu button
		this.menu = this.add.graphics(0, 0)
		this.menu.beginFill(0xD81414);
		this.menu.drawRoundedRect(this.world.width - 160, this.world.height - 95, 140, 70, 10)
		this.menu.endFill()
		this.menu.inputEnabled = true
		this.menu.events.onInputDown.add(()=>this.gameOver())
		this.menuText = this.add.text(this.world.width - 130, this.world.height - 85, 'END', {font: '40px Fredoka One', fill: 'white'})
		// Sound button
		this.soundBtn = this.add.button(this.world.width - 130, this.world.height - 190, 'btn-sfx', this.handleSound, this)
		if (this.sound.mute) this.soundBtn.tint = 0x808080
		this.soundBtn.scale.set(0.6)
		// Tiles
		this.tiles = []
		this.collums = 6
		this.rows = 9
		this.fillBoard()
		this.onSelectModificator = 1.2
		// Selected tiles
		this.selected
		this.selected2
		this.drag = false

	}
	update() {
		// Drag swap
		if (this.drag && this.selected && this.input.activePointer.isUp) {
			if (this.selected != this.selected2) this.trySwap()
			this.drag = false
		}
	}
	updateTimer() {
		this.timeLeft--
		if (this.timeLeft == 0) {
			this.gameOver()
		} else this.timerText.setText(this.timeLeft)
	}
	handleSound() {
    if (this.sound.mute) this.soundBtn.tint = 0xFFFFFF
    else this.soundBtn.tint = 0x808080
    this.sound.mute = !this.sound.mute
  }
	fillBoard() {
		for (let col = 0; col < this.collums; col++) {
			let currColRows = []
			for (let row = 0; row < this.rows * 2; row++) {
				currColRows.push(this.createTile(col, row, 750, currColRows, true))
			}
			this.tiles.push(currColRows)
		}
	}
	createTile(col, row, tweenSpeed, currColRows, noMatch, easing = Phaser.Easing.Linear.None) {
		let size = this.world.width / this.collums
		let colors = ['gem-01', 'gem-02', 'gem-03', 'gem-04', 'gem-05', 'gem-06']
		// Check for 3 in a row
		if (noMatch) {
			if (col > 1) {
				let x1 = this.tiles[col-1][row]['key']
				let x2 = this.tiles[col-2][row]['key']
				if (x1 == x2) colors = colors.filter((key) => key != x1)
			}
			if (row > 1) {
				let y1 = currColRows[row - 1]['key']
				let y2 = currColRows[row - 2]['key']
				if (y1 == y2) colors = colors.filter((key) => key != y1)
			}
		}
		let color = this.rnd.pick(colors)
		// Create tile
		let x = size * col + size / 2	
		let y = this.world.height - this.bgBottom.height - size - size * row + size / 2
		let tile = this.add.sprite(x, y, color)
		tile.addChild(this.make.sprite(6, 6, 'gem-shadow'))
		tile.addChild(this.make.sprite(0, 0, color))
		tile.anchor.setTo(0.5)
		tile.children.forEach(c => c.anchor.set(0.5))
		tile.width = size 
		tile.height = size
		tile.col = col
		tile.row = row
		tile.inputEnabled = true
		//// Events
		tile.events.onInputDown.add(tile => {
			this.select(tile)
			this.drag = true
		})
		tile.events.onInputOver.add(tile => this.selected2 = tile)
		tile.events.onDestroy.add(tile => this.handleDestroy(tile))
		//// Tween
		this.add.tween(tile)
		.from({x: x, y: 0 - size - size * row}, tweenSpeed, easing, true)
		return tile
	}

	select(tile) {
		let size = this.onSelectModificator
		if (!this.selected) {
			this.selected = tile
			this.selected.height = this.selected.height * size
			this.selected.width = this.selected.width * size
		}
		else {
			this.drag = false
			this.trySwap()
		}
	}

	deselect() {
		let size = this.onSelectModificator
		this.selected.height = this.selected.height / size
		this.selected.width = this.selected.width / size
		this.selected = false
	}

	trySwap() {
		let t1 = this.selected
		let t2 = this.selected2
		if (this.drag) {
			let c = t2.col
			let r = t2.row
			// Adjust in case of loose drag
			if (Math.abs(t1.row - t2.row) > Math.abs(t1.col - t2.col)) {
				t1.row > t2.row ? r = t1.row - 1 : r = t1.row + 1
				c = t1.col
			} else {
				t1.col > t2.col ? c = t1.col - 1 : c = t1.col + 1
				r = t1.row
			}
			t2 = this.tiles[c][r]
			this.drag = false
		}
		// Same collums
		if (t2.col == t1.col - 1 || t2.col == t1.col + 1) {
			if (t2.row == t1.row) {
				this.compare(t1, t2)
			}
		}
		// Same rows
		else if (t2.row == t1.row - 1 || t2.row == t1.row + 1) {
			if (t2.col == t1.col) {
				this.compare(t1, t2)
			}
		}
		this.deselect()
	}

	compare(tile1, tile2) {
		if (tile1.row >= this.rows) return
		let arr = this.deepCopy(this.tiles)
		let t1 = arr[tile1.col][tile1.row]
		let t2 = tile2 ? arr[tile2.col][tile2.row] : ''
		let origT1 = this.tiles[t1.col][t1.row]
		let origT2 = tile2 ? this.tiles[t2.col][t2.row] : ''
		let c
		let r
		let matched = []
		let tempMatch = []
		if (tile2) {[t1.key, t2.key] = [t2.key, t1.key]}
		// Check first tile for matches
		//// rows
		c = t1.col
		r = t1.row
		for (let n = 1; r + n < this.rows; n++) {
			if (t1.key != arr[c][r + n].key) break
			tempMatch.push(this.tiles[c][r + n])
		}
		for (let n = 1; r - n >= 0; n++) {
			if (t1.key != arr[c][r - n].key) break
			tempMatch.push(this.tiles[c][r - n])
		}
		if (tempMatch.length > 1) matched = matched.concat(tempMatch) 
		//// collums
		tempMatch = []
		for (let n = 1; c + n < this.collums; n++) {
			if (t1.key != arr[c + n][r].key) break
			tempMatch.push(this.tiles[c + n][r])
		}
		for (let n = 1; c - n >= 0; n++) {
			if (t1.key != arr[c - n][r].key) break
			tempMatch.push(this.tiles[c - n][r])
		}
		if (tempMatch.length > 1) matched = matched.concat(tempMatch)
		if (matched.length > 0 ) {
			tile2 ? matched.push(origT2) : matched.push(origT1)	
		}
		// If no second tile
		if (!tile2) {
			if (matched.length == 0) return
			this.destroyMatched(matched)
			return
		}
		// Check second tile for matches
		//// rows
		tempMatch = []
		c = t2.col
		r = t2.row
		for (let n = 1; r + n < this.rows; n++) {
			if (t2.key != arr[c][r + n].key) break
			tempMatch.push(this.tiles[c][r + n])
		}
		for (let n = 1; r - n >= 0; n++) {
			if (t2.key != arr[c][r - n].key) break
			tempMatch.push(this.tiles[c][r - n])
		}
		if (tempMatch.length > 1) matched = matched.concat(tempMatch)
		//// collums
		tempMatch = []
		for (let n = 1; c + n < this.collums; n++) {
			if (t2.key != arr[c + n][r].key) break
			tempMatch.push(this.tiles[c + n][r])
		}
		for (let n = 1; c - n >= 0; n++) {
			if (t2.key != arr[c - n][r].key) break
			tempMatch.push(this.tiles[c - n][r])
		}
		if (tempMatch.length > 1) matched = matched.concat(tempMatch)
		if (matched.length > 0 ) matched.push(origT1)
		// If no matched
		// if (matched.length == 0) return
		// Swap and destroy matched
		;[this.tiles[t1.col][t1.row], this.tiles[t2.col][t2.row]] = [this.tiles[t2.col][t2.row], this.tiles[t1.col][t1.row]]
		;[origT1.col, origT2.col] = [origT2.col, origT1.col]
		;[origT1.row, origT2.row] = [origT2.row, origT1.row]

		this.add.tween(origT1).to({x: origT2.x, y: origT2.y}, 150, Phaser.Easing.Linear.None, true)
		this.add.tween(origT2).to({x: origT1.x, y: origT1.y}, 150, Phaser.Easing.Linear.None, true)
		.onComplete.add(() => this.destroyMatched(matched))
	}

	deepCopy(arr) {
		let copy = [];
		arr.forEach(elem => {
			if(Array.isArray(elem)){
				copy.push(this.deepCopy(elem))
			}else{
				if (typeof elem === 'object' && elem != null) {
					copy.push(this.copyObject(elem))
			} else {
					copy.push(elem)
				}
			}
		})
		return copy;
	}

	copyObject(obj) {
		let tempObj = {};
		for (let [key, value] of Object.entries(obj)) {
			tempObj[key] = value
		}
		return tempObj;
	}
	destroyMatched(matched) {
		// Increse score
		this.addToScore(matched.length)
		// Destroy
		for (let tile of matched) {
			this.add.tween(tile.scale)
				.to({x: 0, y: 0}, 200, Phaser.Easing.Linear.None, true)
				.onComplete.add(() => tile.destroy())
		}
	}
	addToScore(matched) {
		if (matched == 0) return
		this.scoreSound.play()
		let bonus = matched - 3
		this.score += 100 * matched + 100 * bonus
		this.scoreText.setText(this.score)
	}

	handleDestroy(tile) {
		let speed = 300
		let b = {col: tile.col, row: tile.row}
		// Delete from array
		this.tiles[b.col].splice(b.row, 1)
		// Create new tile and add to array
		let newTile = this.createTile(b.col, this.tiles[b.col].length - 1, speed)
		this.tiles[b.col].push(newTile)
		// Rearrange in array and on board
		for (let i = 0; i < this.tiles[b.col].length; i++) {
			let currB = this.tiles[b.col][i]
			currB.row = i
			let newY = this.world.height - this.bgBottom.height - currB.height - currB.height * i + currB.height / 2
			this.add.tween(currB).to({y: newY}, speed, undefined, true)
				.onComplete.addOnce((tile) => this.compare(tile))
		}
	}
	gameOver() {
		this.music.stop()
		this.world.removeAll()
		this.state.start('GameOver', true, false, this.score)
	}
}
