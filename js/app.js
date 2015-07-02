
//declare global variables we will need
var blockWidth = 101;
var blockHeight = 83;
    
// Enemies our player must avoid
var Enemy = function(loc) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    this.sprite = 'images/enemy-bug.png';

    this.height = 77;
    this.width = 99;
    
    this.x = -1 * this.width;
    this.y = blockHeight*getRandomInt(2,5) - blockHeight/2 - this.height/2;;
    
    this.speed = getRandomInt(100,600);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > blockWidth*5)
        this.reset;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite,'app'), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.height = 88;
    this.width = 67;
    
    this.sprite = 'images/char-boy.png';
    
    //set the start co-ordinates to teh middle of the square. Assign a random column
    this.x = blockWidth*getRandomInt(1,6) - blockWidth/2 - this.width/2;
    this.y = blockHeight*5 - blockHeight/2 - this.height/2;

    //define the playing area based on size of sprite
    this.upperBound = blockHeight*2 - blockHeight/2 - this.height/2;
    this.lowerBound = blockHeight*4 - blockHeight/2 - this.height/2;
    this.leftBound = blockWidth*1 - blockWidth/2 - this.width/2;
    this.rightBound = blockWidth*5 - blockWidth/2 - this.width/2;
}

Player.prototype = {
    update: function() {
    },
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    handleInput: function(key) {
        switch(key) {
            case 'left':
                if(this.x !== this.leftBound) 
                    this.x -= blockWidth;//left command code
                break;
            case 'right':
                if(this.x !== this.rightBound)
                    this.x += blockWidth;//right command code
                break;
            case 'up':
                if(this.y !== this.upperBound)
                    this.y -= blockHeight;//up command code
                break;
            case 'down':
                if(this.y !== this.lowerBound)
                    this.y += blockHeight;//down command code
                break;
            default:
        }
    console.log('x:' + this.x + '; y:' + this.y)
    }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemies = function(dt) {
    if(dt>0.09)
        //allEnemies.push(new Enemy([-20,100]));
}
enemies();
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
