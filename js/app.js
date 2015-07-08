
//declare global variables we will need
var lives,
    score,
    crossing,
    allEnemies = [],
    allStaticPrizes = [],
    allObstacles = [];

// Enemies our player must avoid
var Enemy = function(enemyIndex) {

    this.sprite = Images.enemy[enemyIndex].url;

    this.height = Images.enemy[enemyIndex].height;
    this.width = Images.enemy[enemyIndex].width;
    
    this.row = getRandomInt(2,5);
    this.x = -1 * this.width;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.rightBound = blockWidth*blockColumns - blockWidth/2 - this.width/2;
    
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
    if(this.x > blockWidth * blockColumns)
        this.toRemove = true;
    },
    // Draw the enemy on the screen, required method for game
    render: function(gameOver) {
    if(!gameOver)
        ctx.drawImage(Resources.get(this.sprite,'app'), this.x, this.y);
    },
    reset: function() {
        for(var enemy in allEnemies) {
            allEnemies(enemy).toRemove=true;
            console.log("all enemies set to remove");
        }

    }
};

StaticPrize = function(prizeIndex) {
    this.height = Images.staticModifiers[prizeIndex].height;
    this.width = Images.staticModifiers[prizeIndex].width;
    this.sprite = Images.staticModifiers[prizeIndex].url;
    this.points = Images.staticModifiers[prizeIndex].points;

    this.row = getRandomInt(2,5);
    this.column = getRandomInt(1,6);

    this.x = blockWidth*this.column - blockWidth/2 - this.width/2;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.blink = true;
    this.timeCreated = Date.now();
    this.timeStamp = Date.now();
    this.toRemove = false;
};

StaticPrize.prototype = {
    update: function() {
        if(Date.now()-this.timeStamp>150) {
            this.blink = !this.blink;
            this.timeStamp = Date.now();
        }
        if(getRandomInt(0,700)<2)
            allStaticPrizes.splice(this);
    },
    render: function() {
        if(this.blink)
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    reset: function() {

    },
    status: function() {
        //put in a blink function
        
    }
};

Obstacle = function(obstacleIndex) {
    this.height = Images.obstacles[obstacleIndex].height;
    this.width = Images.obstacles[obstacleIndex].width;
    this.sprite = Images.obstacles[obstacleIndex].url;

    this.row = getRandomInt(2,5);
    this.column = getRandomInt(1,6);

    this.x = blockWidth*this.column - blockWidth/2 - this.width/2;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.timeCreated = Date.now();
    this.timeStamp = Date.now();
    this.toRemove = false;
};

Obstacle.prototype = {
    update: function() {
        if(getRandomInt(0,1000)<2)
            allObstacles.splice(this);
    },
    render: function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    reset: function() {

    },
    status: function() {
        
    }
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
Player = function(avatarIndex) {
    this.height = Images.avatar[avatarIndex].height;
    this.width = Images.avatar[avatarIndex].width;
    
    this.sprite = Images.avatar[avatarIndex].url;
    this.row = 5;
    //set the start co-ordinates to the middle of the square. Assign a random column
    this.x = blockWidth*3 - blockWidth/2 - this.width/2;
    this.y = blockHeight*5 - blockHeight/2 - this.height/2;

    this.upperBound = blockHeight*2 - blockHeight/2 - this.height/2;
    this.lowerBound = blockHeight*3 - blockHeight/2 - this.height/2;
    this.leftBound = blockWidth - blockWidth/2 - this.width/2;
    this.rightBound = blockWidth*blockColumns - blockWidth/2 - this.width/2;

    this.Index = avatarIndex;
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
                    score += 20;
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
        createPlayer(this.Index);
    }
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Instantiate Enemny object and place all enemy objects in an array called allEnemies

var enemies = function() {
    if(getRandomInt(1,1000)<20)
        allEnemies.push(new Enemy(getRandomInt(0,Images.enemy.length)));
};

//function to instantiate Player object in a variable called player
var createPlayer = function(index) {
    player = new Player(index);
};

var staticPrizes = function() {
    if(getRandomInt(1,1000)<6)
        allStaticPrizes.push(new StaticPrize(getRandomInt(0,Images.staticModifiers.length)));
};

var obstacles = function() {
    if(getRandomInt(1,1000)<5)
        allObstacles.push(new Obstacle(getRandomInt(0,Images.obstacles.length)));
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
    player.handleInput(allowedKeys[e.keyCode]);
});
