
//declare global variables we will need
var blockWidth = 101;
var blockHeight = 83;
var playerIndex;
var lives;
var score;
var crossing;
var isGameOver;
var allEnemies = [];
var allImages = [];

var images = {
    'avatar':[
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
    ],
    'background': [
        {
            name:'stone-block',
            width:101,
            height:123,
            url:'images/stone-block.png'
        },
        {
            name:'grass-block',
            width:101,
            height:131,
            url:'images/grass-block.png'
        },
        {
            name:'water-block',
            width:101,
            height:120,
            url:'images/water-block.png'
        }
    ],
    'enemy': [
        {
            name:'enemy-bug',
            width:99,
            height:77,
            url:'images/enemy-bug.png'
        }
    ],
    'staticModifiers': [
        {
            name:'star',
            width:100,
            height:100,
            url:'images/Star.png'
        },
        {
            name:'rock',
            width:98,
            height:98,
            url:'images/Rock.png'
        },
        {
            name:'heart',
            width:89,
            height:90,
            url:'images/Heart.png'
        },
        {
            name:'key',
            width:58,
            height:98,
            url:'images/Key.png'
        }
    ],
    'dynamicModifiers': [
        {
            name:'selector',//Make move like enemy but get points
            width:101,
            height:171,
            url:'images/Selector.png'
        }
    ]
};

// Enemies our player must avoid
var Enemy = function(enemyIndex) {

    this.sprite = images.enemy[enemyIndex].url;

    this.height = images.enemy[enemyIndex].height;
    this.width = images.enemy[enemyIndex].width;
    
    this.row = getRandomInt(2,5);
    this.x = -1 * this.width;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;
    
    //*****STILL NEED TO ADJUST SPEED BASED ON LEVEL*******
    var lowerSpeed = 100 * Math.pow(crossing+1, 0.3);
    var upperSpeed = 300 * Math.pow(crossing+1, 0.4);

    this.speed = getRandomInt(lowerSpeed,upperSpeed);
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

var loadImages = function() {
    for(var pics in images){
        for(var i = 0; i < images[pics].length; i++) {
            allImages.push(images[pics][i].url);
        }
    }
    return allImages;
    console.log(allImages);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
Player = function(avatarIndex) {
    this.height = images.avatar[avatarIndex].height;
    this.width = images.avatar[avatarIndex].width;
    
    this.sprite = images.avatar[avatarIndex].url;
    this.row = 5;
    //set the start co-ordinates to the middle of the square. Assign a random column
    this.x = blockWidth*3 - blockWidth/2 - this.width/2;
    this.y = blockHeight*5 - blockHeight/2 - this.height/2;

    //define the playing area based on size of sprite
    this.upperBound = blockHeight*2 - blockHeight/2 - this.height/2;
    this.lowerBound = blockHeight*3 - blockHeight/2 - this.height/2;
    this.leftBound = blockWidth*1 - blockWidth/2 - this.width/2;
    this.rightBound = blockWidth*5 - blockWidth/2 - this.width/2;
};

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
                if(this.y !== this.upperBound) {
                    this.y -= blockHeight;//up command code
                    this.row--;
                }
                else {
                    score += 100;
                    crossing +=1;
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Instantiate Enemny object and place all enemy objects in an array called allEnemies

var enemies = function() {
    if(getRandomInt(1,1000)<20)
        allEnemies.push(new Enemy(0,images.enemy.length));
};

//function to instantiate Player object in a variable called player
var createPlayer = function() {
    player = new Player(playerIndex);
};

//Randomise the Player avatar
var createPlayerIndex = function() {
    playerIndex = getRandomInt(0,images.avatar.length);
};

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
