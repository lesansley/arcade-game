
//declare global variables we will need
var blockWidth = 101;
var blockHeight = 83;
var playerIndex;
    
// Enemies our player must avoid
var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';

    this.height = 77;
    this.width = 99;
    
    this.row = getRandomInt(2,5);
    this.x = -1 * this.width;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;
    
    this.speed = getRandomInt(100,600);
    this.toRemove = false;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype = {
    update: function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    //if the entitiy has moved off the screen then change the toRemove property to true
    if(this.x > blockWidth * 5)
        this.toRemove = true;
    },
    // Draw the enemy on the screen, required method for game
    render: function() {
    if(!isGameOver)
        ctx.drawImage(Resources.get(this.sprite,'app'), this.x, this.y);
    },
    reset: function() {
        for(var enemy in allEnemies) {
            allEnemies(enemy).toRemove=true;
            console.log("all enemies set to remove");
        }

    }
};

var avatar = [
    {
        name:'boy',
        width:67,
        height:88,
        url:'images/char-boy.png'
    },
    {
        name:'princess',
        width:75,
        height:99,
        url:'images/char-princess-girl.png'
    },
    {
        name:'horn-girl',
        width:77,
        height:90,
        url:'images/char-horn-girl.png'
    },
    {
        name:'cat-girl',
        width:68,
        height:90,
        url:'images/char-cat-girl.png'
    },
    {
        name:'pink-girl',
        width:76,
        height:89,
        url:'images/char-pink-girl.png'
    }
];

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
Player = function(avatarIndex) {
    this.height = avatar[avatarIndex].height;
    this.width = avatar[avatarIndex].width;
    
    this.sprite = avatar[avatarIndex].url;
    this.row = 5;
    //set the start co-ordinates to the middle of the square. Assign a random column
    this.x = blockWidth*3 - blockWidth/2 - this.width/2;
    this.y = blockHeight*5 - blockHeight/2 - this.height/2;

    //define the playing area based on size of sprite
    this.upperBound = blockHeight*2 - blockHeight/2 - this.height/2;
    this.lowerBound = blockHeight*3 - blockHeight/2 - this.height/2;
    this.leftBound = blockWidth*1 - blockWidth/2 - this.width/2;
    this.rightBound = blockWidth*5 - blockWidth/2 - this.width/2;
}

Player.prototype = {
    update: function() {
        scoreHTML.innerHTML = score;
        livesHTML.innerHTML = lives;
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
                if(this.y !== this.upperBound) {
                    this.y -= blockHeight;//up command code
                    this.row--;
                }
                else {
                    score += 100;
                    player.reset('success');
                }
                break;
            case 'down':
                if(this.y <= this.lowerBound) {
                    this.y += blockHeight;//down command code
                    this.row++;
                }
                break;
            default:
        }
    },
    reset: function(outcome) {//called when collision or success happens
        createPlayer();
    }
};

var gameTime = 0;
var isGameOver;

//The game status
var lives = 3;
var score = 0;

if(lives >=0) {
    var scoreHTML = document.getElementById('score');
    var livesHTML = document.getElementById('lives');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var enemies = function() {
    if(getRandomInt(1,1000)<20)
        allEnemies.push(new Enemy([-20,100]));
}

var createPlayer = function() {
    player = new Player(playerIndex);
}

var createPlayerIndex = function() {
    playerIndex = getRandomInt(0,5);
}

//createPlayer();

if(!isGameOver)
    enemies();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(!isGameOver)
        player.handleInput(allowedKeys[e.keyCode]);
});
