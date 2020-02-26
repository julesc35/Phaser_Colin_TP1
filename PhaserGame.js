var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;

function init(){
 	var platforms;
	var player;
	var cursors; 
	var stars;
	var scoreText;
	var bomb;
}

function preload(){
	this.load.image('background','assets/background.png');	
	this.load.image('fond','assets/fond.png');
	this.load.image('etoile','assets/coin.png');
	this.load.image('sol','assets/tiles.png');
	this.load.image('lifebar','assets/lifebar.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/run.png',{frameWidth: 150, frameHeight: 150});
}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,598,'sol').setScale(2,0.15).refreshBody();
	platforms.create(250,500,'sol').setScale(0.15).refreshBody();
	platforms.create(170,350,'sol').setScale(0.25,0.15).refreshBody();
	platforms.create(370,220,'sol').setScale(0.15).refreshBody();
	platforms.create(560,200,'sol').setScale(0.15).refreshBody();
	platforms.create(600,400,'sol').setScale(0.15).refreshBody();
	platforms.create(50,250,'sol').setScale(0.15).refreshBody();
	
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.setScale(0.30);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 18}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setScale: {x: 0.13, y: 0.13},
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);

	        this.timeLeft = gameOptions.initialTime;

        let lifeBar = this.add.sprite( "lifebar");
 
        this.lifeMask = this.add.sprite(lifeBar.x, lifeBar.y, "lifebar");
 
        this.lifeMask.visible = false;

        lifeBar.mask = new Phaser.Display.Masks.BitmapMask(this, this.lifeMask);
.
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: function(){
                this.timeLeft --;
			 let stepWidth = this.lifeMask.displayWidth / gameOptions.initialTime;

                this.lifeMask.x -= stepWidth;
                if(this.timeLeft == 0){
                    this.scene.start("PlayGame")
                }
            },
            callbackScope: this,
            loop: false
        });
    
}



function update(){
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 
	
}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setScale(0.30);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}