const Application = PIXI.Application, loader = PIXI.Loader.shared, resources = PIXI.Loader.shared.resources, Sprite = PIXI.Sprite;

const app = new PIXI.Application({width: 800, height: 800, antialias: true, transparent: false, resolution: 1});
let type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

objects = []

document.body.appendChild(app.view);

PIXI.Loader.shared
  .add(["dot.png"])
  .load(setup);

function createObject(sprite, x, y, speedX, speedY) {
	elem = new PIXI.Sprite(PIXI.Loader.shared.resources[sprite].texture)
	elem.y = y;
	elem.x = x;
	elem.speedX = speedX;
	elem.speedY = speedY;
	elem.width = 5;
	elem.height = 5;
	elem.rotationSpeed = 0;
	elem.anchor.set(0.5);

    elem.links = [];
	
	app.stage.addChild(elem);
	objects.push(elem);

	console.log("Setup done");
}


function setup() {
    createObject("dot.png", getRandomInt(0, 800), getRandomInt(0, 800), getRandomInt(0.1, 1), getRandomInt(-0.1, 0.1));
}

document.addEventListener("mousemove", (e) => {
    x = e.offsetX;
    y = e.offsetY;
})

document.addEventListener("click", (e) => {
    createObject("dot.png", x, y, getRandomInt(1, 2), getRandomInt(-1, 1));
})

function gameLoop() {
    requestAnimationFrame(gameLoop);
 
    objects.forEach(e => {
        e.x += e.speedX;
        e.y += e.speedY;

        objects.forEach(o => {
            if (e != o && Math.sqrt((e.x - o.x)**2 + (e.y - o.y)**2) < 100 && !e.links.includes(o)) {
                const line = new PIXI.Graphics();
                line.lineStyle(1, 0xd5402b, 1);
                line.x = e.x;
                line.y = e.y;
                line.moveTo(0, 0);
                line.lineTo(o.x, o.y);

                app.stage.addChild(line);

                e.links.push(line)
            }
        });
    });
}



gameLoop();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function clipInput(k, arr) {
    if (k < 0) k = 0;
    if (k > arr.length - 1) k = arr.length - 1;
    return arr[k];
}

function getTangent(k, factor, array) {
    return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor) {
    if (tangentFactor == null) tangentFactor = 1;

    const k = Math.floor(t);
    const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
    const p = [clipInput(k, array), clipInput(k + 1, array)];
    t -= k;
    const t2 = t * t;
    const t3 = t * t2;
    return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}
