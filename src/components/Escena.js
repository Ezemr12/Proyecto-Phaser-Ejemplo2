import Phaser from "phaser";

class Escena extends Phaser.Scene{

    plataforms = null;
    player = null;
    cursors = null;
    estrella = null;
    score = 0;
    scoreText = null;

    preload(){
        this.load.image('fondo', 'img/sky.png');
        this.load.image('suelo', 'img/platform.png');
        this.load.image('estrella', 'img/star.png');
        this.load.image('bomba', 'img/bomb.png');
        this.load.spritesheet('player', 
        'img/dude.png',
        {frameWidth: 32, frameHeight: 48});

    }

    create(){

        //Creamos el fondo.
        this.add.image(400,300, 'fondo');

        //Crearemos las plataformas en distintas posiciones.
        this.plataforms = this.physics.add.staticGroup();

        this.plataforms.create(400, 568, 'suelo').setScale(2).refreshBody();

        this.plataforms.create(600, 400, 'suelo');
        this.plataforms.create(50, 250, 'suelo');
        this.plataforms.create(750, 220, 'suelo');

        //Aqui agregaremos al player y a las estrellas.
        //al personaje le asignaremos un sprite.
        this.player = this.physics.add.sprite(200, 250, 'player');

        //Le setearemos el coche y rebote con los limites del canva.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //Aqui crearemos los movimientos que se utilizaran en el update.
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player',{start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: 'player', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player',{start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //Agregaremos las estrellas.
        this.estrella = this.physics.add.group({
            key: 'estrella',
            repeat: 15,
            setXY: {x: 12, y: 0, stepX: 60}
        });

        //Esto es para hacer que las estrellas reboten.
        this.estrella.children.iterate(function (child){
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });


        //Agregamos el texto.
        this.scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});


        //Agregado de rebote contra el suelo.
        this.physics.add.collider(this.player, this.plataforms);
        this.physics.add.collider(this.estrella, this.plataforms);
 
        this.cursors = this.input.keyboard.createCursorKeys();

        //Haremos que las estrellas choquen con el player.
        this.physics.add.overlap(this.player, this.estrella, this.collectarEstrella, null, this);

    }

    update(){

        if (this.gameOver)
    {
        return;
    }

        //asignaremos los movimientos segun las teclas presionadas.
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocity(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    collectarEstrella(player, estrella){

        estrella.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('score: ' + this.score);

        if (this.estrella.countActive(true) === 0) {
            this.estrella.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        }
    }
}

export default Escena;