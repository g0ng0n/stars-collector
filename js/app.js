/** @constant
 @type {int}
 @default
 */
var TILE_WIDTH = 101;

/** @constant
 @type {int}
 @default
 */
var TILE_HEIGHT = 83;

/** @constant
 @type {int}
 @default
 */
var INITIAL_LIVES = 2;

/** @constant
 @type {string}
 @default
 */
var BUG_SPRITE='images/enemy-bug.png';

/** @constant
 @type {string}
 @default
 */
var HERO_SPRITE='images/char-boy.png';

/** @constant
 @type {string}
 @default
 */
var STAR_SPRITE='images/Star.png';

/**
 * Represents the Game Itself.
 * With all the Enemies and our Hero
 * @constructor
 */
var Game = function() {
    this.allEnemies = [];
    this.ended = false;
    this.player = {};
    this.star = {};
};

/**
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.endGame = function() {
    var r = confirm('Loooser!, Want to try it again?');
    if (r === true) {
        this.continueTheGame();
    } else {
        this.finishTheGame();
    }
};

/**
 * this function is used to create a new bud Enemy
 * to add it into the allEnemies array
 * @returns a new enemy to add into the allEnemys Array
 */
Game.prototype.addAnEnemy = function(yRow) {

    var enemy = new Enemy(yRow, Math.random() * (500 - 100) + 100);
    enemy.prototype= Object.create(Character.prototype);
    enemy.prototype.constructor = Enemy;

    return enemy;
};

/**
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.finishTheGame = function() {
    this.allEnemies = [];
    this.ended = true;
    this.player.visible = false;
    this.star.visible = false;
    document.getElementById('lives').style.display = 'none';
    document.getElementById('stars').style.display = 'none';
    document.getElementsByClassName('title')[0].innerHTML = 'Please Press F5 to restart the Game';
};

/**
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.continueTheGame = function() {
    this.player.stars = 0;
    this.player.lives = 2;
    document.getElementsByClassName('stars')[0].innerHTML = 'Stars: ' + this.player.stars;
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + this.player.lives;
    this.player.reset();
};

/**
 * this function is used to end the game or continue
 * after losing all the lives
 */
Game.prototype.start = function() {
    this.allEnemies.push(game.addAnEnemy(72));
    this.allEnemies.push(game.addAnEnemy(155));
    this.allEnemies.push(game.addAnEnemy(238));
    this.allEnemies.push(game.addAnEnemy(321));
    this.player = new Hero(303, 404);
    this.player.prototype= Object.create(Character.prototype);
    this.player.prototype.constructor = Hero;
    this.star = new Star(0,0);
    this.star.reset();
    this.star.prototype= Object.create(Character.prototype);
    this.star.prototype.constructor = Star;
};


/**
 * Represents the Character Constructor.
 * The superClass of all of the Characters of the Game
 * @constructor
 * @param {number} y - The Y position in the Board
 * @param {number} speed - The Initial Speed that we want to asign to the Enemy
 */
var Character = function(x, y, sprite, visible) {
    this.x = x;
    this.y = y;
    this.visible = visible;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
};

/**
 * Function that draw the sprite for the character in the canvas
 * using its sprite
 *
 */
Character.prototype.render = function(sprite,x,y) {
    ctx.drawImage(Resources.get(sprite), x, y);
};


/**
 * Represents the Enemy  for the Enemy Where its supperclass is Character.
 * @constructor
 * @param {number} speed - The Initial Speed that we want to asign to the Enemy
 */
var Enemy = function(y, speed) {
    this.speed = speed;
    Character.call(this,-150,y,BUG_SPRITE,true);
};

/**
 * Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 750) {
        this.reset();
    }
};

/**
 * Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
 */

/**
 * sets the speed of the Enemy in a "random way"
 */
Enemy.prototype.randomSpeed = function() {
    this.speed = 100 * Math.floor(Math.random() * 5 + 1);
};

/**
 * reset the enemy location and speed
 */
Enemy.prototype.reset = function() {
    this.randomSpeed();
    this.x = -150;
};

/**
 * Represents the Hero Constructor.
 * @constructor
 * @param {number} y - The Y position in the Board
 * @param {number} speed - The Initial Speed that we want to asign to the Enemy
 */
var Hero = function(x, y) {

    // Give the player 3 lives to start
    this.lives = INITIAL_LIVES;
    // has star
    this.hasStar = false;
    this.stars = 0;

    Character.call(this,x,y,HERO_SPRITE,true);
};

/**
 * Handle keyboard input during gameplay.
 * 'IF' statements verify movement will not allow the player outside the
 * canvas boundaries before the movement is calculated.
 * @param {String} key, the keyCode from the key pressed
 */
Hero.prototype.handleInput = function(key) {
    switch (key) {
        case 'up':
            if (this.y > -12) {
                this.y -= TILE_HEIGHT;
            }
            break;
        case 'down':
            if (this.y < 404) {
                this.y += TILE_HEIGHT;
            }
            break;
        case 'left':
            if (this.x > 0) {
                this.x -= TILE_WIDTH;
            }
            break;
        case 'right':
            if (this.x < 606) {
                this.x += TILE_WIDTH;
            }
            break;
    }

    if (this.y <= -12) {
        if (game.player.hasStar === true) {
            this.countStar();
            this.reset();
        } else {
            this.y = -11;
        }


    }
    //logging the player current position in the console
    logPlayerPosition();
};

/**
 *  Function that reset the player location
 */
Hero.prototype.reset = function() {
    if (this.visible === true) {
        this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
        this.y = 404;
    }
};

/**
 *  Function that counts the Stars
 *
 */
Hero.prototype.countStar = function() {

    if (this.hasStar === true) {
        this.stars = this.stars + 1;
        document.getElementsByClassName('stars')[0].innerHTML = 'Stars: ' + this.stars;
        this.hasStar = false;
        game.star.reset();
    }
};

/**
 * Function that handle the lives when a bug kills the player
 * and then updates the player attribute and the html in the page that shows the lives
 */
Hero.prototype.liveLost = function() {
    game.player.lives = game.player.lives - 1;
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives: ' + game.player.lives;
};

/**
 * Function that handle the pickup functionality
 * when the player pickup a star
 *
 */
Hero.prototype.pickup = function() {
    // Set parameters for objects
    this.hasStar = true;
    // Hide item off screen (to be reused on reset)
    game.star.x = -TILE_WIDTH;
    game.star.y = -TILE_WIDTH;
    game.star.visible = false;

};

/**
 *  this function render the player

Hero.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
 */

/**
 * Represents the Star Constructor where the superClass is Character.
 * @constructor
 * @param {number} y - The Y position in the Board
 * @param {number} x - The X position in the Board
 */
var Star = function(x, y) {
    Character.call(this,x,y,STAR_SPRITE,true);
};

/**
 * Function that handle when the player is killed by a bug
 * and drop the star
 */
Star.prototype.drop = function() {
    this.visible = true;
    game.player.hasStar = false;
    this.x = game.player.x;
    this.y = game.player.y;
};

/**
 *  Function that reset the star location and visibility
 */
Star.prototype.reset = function() {
    this.x = Math.floor(Math.random() * 5) * TILE_WIDTH;
    this.y = Math.ceil(Math.random() * 4) * TILE_HEIGHT - 11;
    this.visible = true;
};

/** Now instantiate your objects.
 * Place all enemy objects in an array called allEnemies
 * Place the player object in a variable called player
 */

var game = new Game();
game.start();


/**
 *  This listens for key presses and sends the keys to your
 *  Hero.handleInput() method. You don't need to modify this.
 *  @listens the keys in order to move the Hero
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});

/** helper Function to log the player position and information*/
var logPlayerPosition = function() {
    console.log('>>> PLAYER - X: ' + game.player.x + ' Y: ' + game.player.y +
        "number of stars that the player has " + game.player.stars +
        "log if the player has an star at the moment " + game.player.hasStar);
};