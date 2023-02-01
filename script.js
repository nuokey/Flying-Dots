const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById("title");

const score = document.getElementById("score");

let animationId;
let pastTime;

let wind = 0.5;
let gravity = 1;

let x = 0;
let y = 0;

let objects = []

let spawnTick = 30;
let tick = 0;

for (let i = 0; i < 50; i++) {
    objects.push([getRandomArbitrary(0, canvas.width), getRandomArbitrary(0, canvas.height), getRandomArbitrary(0, 1), getRandomArbitrary(-0.5, 0.5)]);
}


window.onload = startAnimation;


function startAnimation() {
	frame();
	pastTime = 0;
}

function frame() {
	animationId = requestAnimationFrame(frame);

	let time = Date.now();
	let delta = time - pastTime;
	let fps = Math.floor(1000 / delta);

	if (fps <= 60) {
		draw();
		pastTime = Date.now();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tick += 1;

    if (tick >= spawnTick) {
        objects.push([getRandomArbitrary(0, canvas.width), getRandomArbitrary(0, canvas.height), getRandomArbitrary(0, 1), getRandomArbitrary(-0.5, 0.5)]);
        tick = 0;
    }

    
    objects.forEach(o => {
        o[0] += o[2];
        o[1] += o[3];
        ctx.fillStyle = "white";
        ctx.fillRect(o[0], o[1], 4, 4);

        if (Math.sqrt((o[0] - x)**2 + (o[1] - y)**2) < 150) {
            ctx.strokeStyle = `rgba(255,255,255,${1 / Math.sqrt((o[0] - x)**2 + (o[1] - y)**2) * 50})`;
            ctx.beginPath();
            ctx.moveTo(o[0], o[1]);
            ctx.lineTo(x, y);

            ctx.stroke();
        }

        objects.forEach(s => {
            if (Math.sqrt((o[0] - s[0])**2 + (o[1] - s[1])**2) < 150) {
                ctx.strokeStyle = `rgba(255,255,255,${1 / Math.sqrt((o[0] - s[0])**2 + (o[1] - s[1])**2) * 50})`;
                ctx.beginPath();
                ctx.moveTo(o[0], o[1]);
                ctx.lineTo(s[0], s[1]);

                ctx.stroke();
            }
        });
    });
}

canvas.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
});

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    if (event.buttons == 1) {
        objects.push([x, y, getRandomArbitrary(0, 1), getRandomArbitrary(-0.5, 0.5)]);
    }
    else if (event.buttons == 2) {
        
        objects.forEach(e => {
            distance = Math.sqrt((e[0] - x)**2 + (e[1] - y)**2);
            force = 10000 / (distance ** 2)

            sin = (e[1] - y) / distance;
            cos = (e[0] - x) / distance;
            e[3] += sin * force;
            e[2] += cos * force;
        });
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowUp") {
        gravity -= 0.1;
    }
    if (event.key == "ArrowDown") {
        gravity += 0.1;
    }
    if (event.key == "ArrowRight") {
        wind += 0.1;
    }
    if (event.key == "ArrowLeft") {
        wind -= 0.1;
    }
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }