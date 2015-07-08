/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        blockWidth = 101,
        blockHeight = 83,
        blockColumns = 5,
        isGameOver,
        gameStart,
        playerIndex;

    

    canvas.width = blockWidth*(blockColumns+1);
    canvas.height = 548;
    $('#canvas').append(canvas);//add to DOM

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        removeEntities();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allObstacles.forEach(function(obstacle) {
            obstacle.update();
        });
        obstacles();

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        enemies();
        
        allStaticPrizes.forEach(function(prize) {
            prize.update();
        });
        staticPrizes();
    }

    //loop through allEnemies and remove the objects that have been marked left the canvas
    function removeEntities() {
        for(var enemy in allEnemies) {
            if (allEnemies[enemy].toRemove) {
                allEnemies.splice(enemy,1);
            }
        }
    }

    function checkCollisions() {
        var collision = false;
        //collisions with enemies
        for(var enemy in allEnemies) {
            if(allEnemies[enemy].row === player.row) {
                collision = boxCollides(allEnemies[enemy].x, allEnemies[enemy].width, player.x, player.width);
                if(collision) {
                    lives--;
                    allEnemies.splice(enemy,1);
                    gameOver(lives);
                }
            }

        }
        //collisions with prizes
        for(var prizes in allStaticPrizes) {
            if(allStaticPrizes[prizes].row === player.row) {
                collision = boxCollides(allStaticPrizes[prizes].x, allStaticPrizes[prizes].width, player.x, player.width);
                if(collision) {
                    score += allStaticPrizes[prizes].points;
                    allStaticPrizes.splice(prizes,1);
                }
            }

        }
    }

    function collides(x, r, x2, r2) {
    return ((r >= x2 && r < r2)||(x >= x2 && x < r2));
    }

    function boxCollides(x1, w1, x2, w2) {
        return collides(x1, x1 + w1, x2, x2 + w2);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */

        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < blockColumns; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * blockWidth, row * blockHeight);
            }
        }
        
        renderEntities();
        renderCanvasText();
        ctx.fillStyle = 'white';
        ctx.fillRect(blockWidth*blockColumns,0, blockWidth, canvas.height);
        for(var i = 0; i < Images.staticModifiers.length; i++) {
            ctx.drawImage(Resources.get(Images.staticModifiers[i].url), canvas.width - blockWidth/2 - Images.staticModifiers[i].width/2, (i+1) * blockHeight + Images.staticModifiers[i].height/2);
            ctx.font = '100 26px Orbitron';
            ctx.fillStyle='rgba(0,0,0,.65)';
            ctx.fillText(Images.staticModifiers[i].points + 'pts', canvas.width - blockWidth/2 - ctx.measureText(Images.staticModifiers[i].points+'pts').width/2, (i+1) * blockHeight + blockHeight/2+15);
        }
        
    }

    function renderCanvasText() {
        var scoreText = 'Score: ' + score;
        var livesText = 'Lives: ' + lives;
        var instructionText = 'Move player with arrows';
        
        ctx.font = '900 40px Orbitron';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        
        ctx.fillText(scoreText, 5, blockHeight/2 + 40/2);
        if(lives===1)
            ctx.fillStyle = 'rgba(196, 30, 0, 0.5)';
        ctx.fillText('Lives: ' + lives, 318, blockHeight/2 + 40/2);

        if(isGameOver){
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0,0,blockWidth * blockColumns,canvas.height);
            ctx.font = '900 120px Orbitron';
            ctx.fillStyle = '#fff';
            ctx.fillText('GAME',blockWidth*blockColumns/2 - ctx.measureText('GAME').width/2, canvas.height - canvas.height/1.5);
            ctx.fillText('OVER',blockWidth*blockColumns/2 - ctx.measureText('OVER').width/2, canvas.height - canvas.height/2.3);
        }
        else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.font = '100 30px Orbitron';
            ctx.fillText(instructionText,blockWidth*blockColumns/2 - ctx.measureText(instructionText).width/2, canvas.height - 15);
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        if(!isGameOver) {
            allStaticPrizes.forEach(function(prize) {
                prize.render();
            });

            player.render();

            allObstacles.forEach(function(obstacle) {
                obstacle.render();
            });
            //loop through allEnemies and render each enemy object in the array
            allEnemies.forEach(function(enemy) {
                enemy.render(isGameOver);
            });
        }
    }

    function gameOver(remainingLives) {
        if(remainingLives===0) {
            document.getElementById('game-over').style.display = 'block';
            isGameOver = true;
        }
        renderTransition();
        player.reset(player.index);
    }

    function renderTransition() {

    }

    function setToRemove() {
        for(var enemy in allEnemies) {
            allEnemies[enemy].toRemove = true;
        }
    }
    //Handle game reset states
    //It's only called once by the init() method.
    function reset() {
        document.getElementById('game-over').style.display = 'none';
        createPlayer(getRandomInt(0,Images.avatar.length));
        setToRemove();
        removeEntities();
        isGameOver = false;
        enemies();
        score = 0;
        lives = 3;
        crossing = 0;
    }

    //Pre-loads all the images required for the game.
    //The load function is called from the resources file.
    //sends the array to the function in resources.js
    Resources.load(Images.loadImages());
        
    Resources.onReady(init);

    document.getElementById('play-again').addEventListener('click', function() {
            reset();
        });

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.blockWidth = blockWidth;
    global.blockHeight = blockHeight;
    global.blockColumns = blockColumns;
    
})(this);
