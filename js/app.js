
//declare global variables we will need
var lives,
    score,
    crossing,
    allEnemies = [],
    allStaticPrizes = [],
    allObstacles = [];

// Enemies our player must avoid
var Enemy = function(enemyIndex) {

    this.sprite = images.enemy[enemyIndex].url;

    this.height = images.enemy[enemyIndex].height;
    this.width = images.enemy[enemyIndex].width;
    
    this.row = getRandomInt(2,5);
    this.x = -1 * this.width;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.rightBound = blockWidth*blockColumns - blockWidth/2 - this.width/2;
    
    //adjust speed based on number of times the player has reached the other side
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
    if(this.x > blockWidth * blockColumns) {
        this.toRemove = true;
    }
    },
    // Draw the enemy on the screen if the gameOver is false
    render: function(gameOver) {
    if(!gameOver) {
        ctx.drawImage(Resources.get(this.sprite,'app'), this.x, this.y);
    }
    }
};

//object constructor class for the static prizes
var StaticPrize = function(prizeIndex) {
    this.height = images.staticModifiers[prizeIndex].height;
    this.width = images.staticModifiers[prizeIndex].width;
    this.sprite = images.staticModifiers[prizeIndex].url;
    this.points = images.staticModifiers[prizeIndex].points;

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
    //set the blink property of the prize
    update: function() {
        if(Date.now()-this.timeStamp>120) {
            this.blink = !this.blink;
            this.timeStamp = Date.now();
        }
        //randomly remove prizes
        if(getRandomInt(0,700)<2) {
            allStaticPrizes.splice(this);
        }
    },
    render: function(gameOver) {
        //only draw if the blink property is true, creating a twinkling effect
        if(this.blink && !gameOver) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
};

//object constructor class for the obstacles
var Obstacle = function(obstacleIndex, row, col) {
    this.height = images.obstacles[obstacleIndex].height;
    this.width = images.obstacles[obstacleIndex].width;
    this.sprite = images.obstacles[obstacleIndex].url;
    this.row = row;
    this.column = col;

    this.x = blockWidth*this.column - blockWidth/2 - this.width/2;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.timeCreated = Date.now();
    this.timeStamp = Date.now();
    this.toRemove = false;
};

Obstacle.prototype = {
    update: function() {
        if(getRandomInt(0, 1000) < 2) {
            allObstacles.splice(this);
        }
    },
    render: function() {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Player constructor class
var Player = function(avatarIndex) {
    this.index = avatarIndex;
    
    this.height = images.avatar[this.index].height;
    this.width = images.avatar[this.index].width;
    
    this.sprite = images.avatar[this.index].url;
    this.row = 5;
    this.column = 3;

    //set the start co-ordinates to the middle of the square. Assign a random column
    this.x = blockWidth*this.column - blockWidth/2 - this.width/2;
    this.y = blockHeight*this.row - blockHeight/2 - this.height/2;

    this.upperRow = 2;
    this.lowerRow = 3;
    this.leftColumn = 1;
    this.rightColumn = 5;

    
};

Player.prototype = {
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },
    handleInput: function(key) {
        //always perform check to see wheher the player will be moving out of bounds or into a rock
        switch(key) {
            case 'left':
                if(this.column !== this.leftColumn && !this.blocked(this.row, this.column-1)) {
                    this.x -= blockWidth;//left command code
                    this.column--;
                }
                break;
            case 'right':
                if(this.column !== this.rightColumn && !this.blocked(this.row, this.column+1)) {
                    this.x += blockWidth;
                    this.column++;
                }
                break;
            case 'up':
                if(this.row <= this.upperRow) {
                    score += 20;
                    crossing +=1;
                    setTimeout(function() {
                        player.reset();
                    }, 100);
                }
                 else if(!this.blocked(this.row-1, this.column)) {
                    this.y -= blockHeight;//up command code
                    this.row--;
                }
                break;
            case 'down':
                //does not allow player to step back onto the grass
                if(this.row <= this.lowerRow && !this.blocked(this.row+1, this.column)) {
                    this.y += blockHeight;//down command code
                    this.row++;
                }
                break;
            default:
                break;
        }
    },
    //called for collision or successful crossing
    reset: function() {
        createPlayer(this.index);
    },
    //Assess whether there is an obstacle in the way of the player and return true or false
    blocked: function(playerRow, playerCol) {
        var obstruction = false;
        for(var obstacle in allObstacles) {
            if(playerRow === allObstacles[obstacle].row && playerCol === allObstacles[obstacle].column) {
                obstruction = true;
            }
        }
        return obstruction;
    }
};

//generates a random integer based on the range provided
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Instantiate Enemy object and place all enemy objects in an array called allEnemies
var enemies = function() {
    if(getRandomInt(1,1000) < 20) {
        allEnemies.push(new Enemy(getRandomInt(0,images.enemy.length)));
    }
};

//function to instantiate Player object in a variable called player
var createPlayer = function(index) {
    player = new Player(index);
};

//Instantiate static prize object and place all enemy objects in an array called allEnemies
var staticPrizes = function() {
    if(getRandomInt(1,1000) < 6) {
        allStaticPrizes.push(new StaticPrize(getRandomInt(0,images.staticModifiers.length)));
    }
};

//Instantiate obstacle object and place all enemy objects in an array called allEnemies
var obstacles = function() {
    var row,
        col;
    //the row and column are only set if the new object is not placed in teh same square as the player
    do {
        var collide = false;
        row = getRandomInt(2, 5);
        col = getRandomInt(1, 6);
        if(row === player.row && col === player.column) {
            collide = true;
        }
    }
    while (collide);
    if(getRandomInt(1,1000) < 5) {
        allObstacles.push(new Obstacle(getRandomInt(0,images.obstacles.length),row,col));
    }
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
