(function() {

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
                width:50,
                height:50,
                url:'images/Star.png',
                points: 100
            },
            {
                name:'heart',
                width:49,
                height:50,
                url:'images/Heart.png',
                points: 50
            },
            {
                name:'key',
                width:30,
                height:50,
                url:'images/Key.png',
                points: 35
            }
        ],
        'dynamicModifiers': [
            {
                name:'selector',//Make move like enemy but get points
                width:101,
                height:171,
                url:'images/Selector.png',
                points: 200
            }
        ],
        'obstacles': [
            {
                name:'rock',
                width:80,
                height:80,
                url:'images/Rock.png',
                points: 40
            }
        ]
    };

    function loadImages() {
    var allImages=[];
    for(var pics in images){
        for(var i = 0; i < images[pics].length; i++) {
            allImages.push(images[pics][i].url);
        }
    }
    return allImages;
    }

    window.Images = { //Resources object JSON
        loadImages: loadImages //load function
    };
})();