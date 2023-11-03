var musicBtn = document.getElementById("musicBtn");
var musicBtnGame = document.getElementById("musicBtnGame");
var playBtn = document.getElementById("playBtn");
var resBtn = document.getElementById("resBtn");
var startArea = document.getElementById("startMenu");
var gameArea = document.getElementById("gameArea");
var gameOverArea = document.getElementById("gemeOver");
var weatherStatus = document.getElementById("weatherStatus");
var temp = document.getElementById("temp");
var nextBtn = document.getElementById("nextLevelBtn");
var nextLevelArea = document.getElementById("nextLevelArea1");
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey === true) {
        event.preventDefault();
    }
}, { passive: false });


var isParkAreaVisible = true;
var parkArea;
var isClicked = false;
var isDamage = false;
var counter = false;

const apiKey = "8498860c634368ab50cedb1b1be42b86";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=baku";

async function checkWeather() {
    const response = await fetch(apiUrl + `&appid=${apiKey}`);
    var data = await response.json();

    temp.innerHTML = Math.round(data.main.temp) + "°C";

    if (data.weather[0].main == "Clouds") {
        weatherStatus.src = "images/clouds.png";
    }
    else if (data.weather[0].main == "Clear") {
        weatherStatus.src = "images/clear.png";
    }
    else if (data.weather[0].main == "Rain") {
        weatherStatus.src = "images/rain.png";
    }
    else if (data.weather[0].main == "Drizzle") {
        weatherStatus.src = "images/drizzle.png";
    }
    else if (data.weather[0].main == "Mist") {
        weatherStatus.src = "images/mist.png";
    }
}

checkWeather();


function playMusic(musicButton) {
    if (!isClicked) {
        musicButton.style.background = `url("images/sound_icon.png") no-repeat`;
        musicButton.style.backgroundSize = `100%`;
        document.getElementById("sounds").play();
    }
    else {
        musicButton.style.background = `url("images/mute_icon.png") no-repeat`;
        musicButton.style.backgroundSize = `100%`;
        document.getElementById("sounds").pause();
    }
    isClicked = !isClicked;
}

musicBtnGame.addEventListener("click", () => {
    playMusic(musicBtnGame);
})

musicBtn.addEventListener("click", () => {
    playMusic(musicBtn);
})

nextBtn.addEventListener("click", () => {
    location.reload();
    //nextLevelArea.style.display=`none`;
    //cleanGame();
});



var game = new Phaser.Game(900, 695, Phaser.AUTO, 'game-canvas', { preload: preload, create: create, update: update });

var cursors;
var velocity = 0;
var downKey;
var car1;
var bins;
var bg;

function preload() {
    game.load.image('map', 'images/Levell.jpg');
    game.load.image('car1', 'car.png');
    game.load.image('bins', 'images/Bin.jpg');
    game.load.image('parkAreaImage', 'images/parkArea.jpg')
}

function cleanGame() {
    car1.kill();
    game.load.image('map', 'images/Levell2.jpg');


}
function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);

    bg = game.add.sprite(0, 0, 'map');
    bg.width = game.width;
    bg.height = game.height;

    parkArea = game.add.sprite(435, 70, 'parkAreaImage')
    car1 = game.add.sprite(100, 500, 'car1');
    bins = game.add.sprite(635, 655, 'bins');

    car1.scale.setTo(0.28, 0.28);
    bins.scale.setTo(1.3, 1.3);

    game.physics.p2.enable(car1);
    game.physics.p2.enable(bins);


    bins.body.kinematic = true;

    car1.body.angle = 90;

    cursors = game.input.keyboard.createCursorKeys();
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    var carMaterial = game.physics.p2.createMaterial('carMaterial', car1.body);
    var binMaterial = game.physics.p2.createMaterial('binMaterial', bins.body);

    var contactMaterial = game.physics.p2.createContactMaterial(carMaterial, binMaterial);
    contactMaterial.friction = 0.3;
    contactMaterial.restitution = 0.8;

    game.physics.p2.world.on("beginContact", contactHandler);
}

function toggleParkArea() {
    if (isParkAreaVisible) {
        parkArea.alpha = 0;
        isParkAreaVisible = false;
    } else {
        parkArea.alpha = 1;
        isParkAreaVisible = true;
    }
}
setInterval(toggleParkArea, 500);

let isParking = false;

function update() {

    if (!isParking) {

        if (cursors.up.isDown && velocity <= 400) {
            document.getElementById("carSound").play();
            velocity += 7;
        } else {
            if (velocity >= 7) velocity -= 7;
            document.getElementById("carSound").pause();
        }
        if (downKey.isDown && velocity >= -400) {
            document.getElementById("ReverseCarSound").play();
            velocity -= 7;
        } else {
            document.getElementById("ReverseCarSound").pause();
            if (velocity <= -7) velocity += 7;
        }
    }

    car1.body.velocity.x = velocity * Math.cos((car1.angle - 90) * 0.01745);
    car1.body.velocity.y = velocity * Math.sin((car1.angle - 90) * 0.01745);

    if (cursors.left.isDown)
        car1.body.angularVelocity = -5 * (velocity / 1000);
    else if (cursors.right.isDown)
        car1.body.angularVelocity = 5 * (velocity / 1000);
    else {
        car1.body.angularVelocity = 0;
    }

    xW = car1.width / 2;
    yH = car1.height / 2;
    if (car1.x - xW > 425 && car1.x + xW < 513 && car1.y - yH > 0 && car1.y + yH < 215) {
        setTimeout(() => {
            if (velocity == 0) {
                isParking=true;
                nextLevel();
            }
        }, 1000);
    }
}

function nextLevel() {
    nextLevelArea.style.display = `block`;
}

function contactHandler(body1, body2) {
    var hearts = document.getElementsByClassName("heart");
    if (hearts.length > 1) {
        var collisionImage = document.createElement("img");
        collisionImage.src = "images/baloon_mc.png";
        collisionImage.style.position = "absolute";
        collisionImage.style.left = car1.x + 500 + "px";
        collisionImage.style.top = car1.y + 70 + "px";
        collisionImage.style.width = "100px";
        collisionImage.style.height = "100px";
        document.body.appendChild(collisionImage);
        setTimeout(function () {
            document.body.removeChild(collisionImage);
        }, 500);
        hearts[0].remove();
    } else {
        hearts[0].remove();
        gameOverArea.style.display = `block`;
    }
}

playBtn.addEventListener("click", () => {
    startArea.style.display = `none`;
    gameArea.style.display = `block`;
});

$(document).ready(function () {

    var imageCount = 3;

    for (var i = 1; i <= imageCount; i++) {
        var imgSrc = "images/myHeart.png";
        var imgTag = '<img id="h' + i + '" class="heart" src="' + imgSrc + '" alt="Resim">';
        $("#hearts").append(imgTag);
    }

});

resBtn.addEventListener("click", () => {
    location.reload();
});



