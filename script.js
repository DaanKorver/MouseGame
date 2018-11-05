var screen = document.getElementById("screen");
var box = document.getElementById("box");
var startbtn = document.getElementById("startButton");
var start = document.getElementById("start");
var countdown = document.getElementById("countdown");
var time = document.getElementById("time");
var result = document.getElementById("result");
var enemies = [];
var playerLocation = new Vector2(0, 0);
var enemyWidth = 100;
var score = 0;
var deltatime = 0;
var lastUpdate = Date.now();
var count = 20;
var timerValue = 0.2;
var timer = timerValue;
var running = true;




startbtn.addEventListener('click', ()=>{
	var embd = document.createElement('embed');
	embd.setAttribute('src', 'music.mp3');
	embd.setAttribute('width', '180');
	embd.setAttribute('height', '90');
	embd.setAttribute('loop', 'false');
	embd.setAttribute('autostart', 'false');
	embd.setAttribute('hidden', 'true');
	embd.setAttribute('volume', '60');
	document.body.appendChild(embd);
	setTimeout(()=>{
		start.style.opacity = "0";
		setTimeout(()=>{
			start.style.display = "none";
			setTimeout(()=>{
				startGame();
			},100)
		},500)
	}, 50)
})

	function Vector2(x, y){
		this.x = x;
		this.y = y;
	}

	function Enemy(location, weight) {
		this.location = location;
		this.weight = weight;
		this.object = document.createElement("div");
		this.object.style.position = "absolute"
		this.object.style.width = "100px";
		this.object.style.height = "100px";
		//this.object.style.backgroundImage = "url('https://www.catster.com/wp-content/uploads/2018/05/A-gray-cat-crying-looking-upset.jpg')";
		//this.object.style.backgroundSize = "cover";
		this.object.style.left = this.location.x + "px";
		this.object.style.top = (this.location.y) + "px";
		this.object.style.backgroundColor = "green";
		this.dead = false;
		screen.appendChild(this.object);
	}
	
	Enemy.prototype.update = function() {
		this.location.y += 9 * this.weight * deltatime;
		this.object.style.left = this.location.x + "px";
		this.object.style.top = (this.location.y) + "px";
		if(this.location.y > window.innerHeight){
			this.dead = true;
		}
		
	}

		function showCoords(evt){
		var xpos = playerLocation.x;
		var ypos = playerLocation.y;
		var fps = Math.round(1 / deltatime);
		var coords = "X Position: " + xpos + "<br>" + "Y Position: " + ypos + "<br>" + fps + "FPS" + "<br>" + "Score: " + score ;
		document.getElementById("coords").innerHTML = coords;
		
		
	}

function startGame() {
	//document.body.style.cursor = "none";
	countdown.style.display = "block";
		setTimeout(()=>{
			countdown.innerHTML = "3"
			setTimeout(()=>{
				countdown.innerHTML = "2"
			setTimeout(()=>{
				countdown.innerHTML = "1"
				setTimeout(()=>{
					countdown.style.display = "none";
					box.style.display = "block";
					coords.style.display = "block";
					time.style.display = "block";
					setTimeout(()=>{
						init();
					}, 300)
					}, 1000)
				}, 1000)
			}, 1000)
		}, 1000)
}

function init() {
	
	lastUpdate = Date.now();
	var counter = setInterval(gametimer, 1000);
	function gametimer(){
  count=count-1;
  if (count <= 0){
     clearInterval(counter);
	 time.innerHTML = "Time left: " + "0" + " seconds";
     running = false;
     return;
  }
	time.innerHTML = "Time left: " + count + " seconds";
}

	function moveBox(evt) {
		var xpos = Math.min(evt.clientX, window.innerWidth - 100);
		var ypos = Math.min(evt.clientY, window.innerHeight - 100);
		
		box.style.left = xpos + "px";
		box.style.top = ypos + "px";
		
		playerLocation.x = xpos;
		playerLocation.y = ypos;
	}
	

	screen.addEventListener('mousemove', (event)=>{
		showCoords(event);
		moveBox(event);
	})
	
	gameLoop();


}

function isColliding(pos1, w1, h1, pos2, w2, h2) {
	return (
	pos1.x < pos2.x + w2 &&
	pos1.x + w1 > pos2.x &&
	pos1.y < pos2.y + h2 &&
	pos1.y + h1 > pos2.y
	);
}

function gameLoop(){
	deltatime = (Date.now() - lastUpdate) / 1000;
	lastUpdate = Date.now();
	for(var i = 0; i < enemies.length; i++){
		var enemy = enemies[i];
		enemy.update();
		if(isColliding(enemy.location, 100, 100, playerLocation, 100, 100)){
			enemy.dead = true;
			score++;
		}
		if(enemy.dead){
			enemy.object.remove();
			enemies.splice(i,1);
			i--;
		}
	}
	timer -= deltatime;
	if(timer <= 0){
		timer = timerValue;
		enemies.push(new Enemy(new Vector2(Math.floor(Math.random() * (window.innerWidth - enemyWidth)), 0), 100));
	}
	showCoords();
	if(running){
		requestAnimationFrame(gameLoop);
	} else {
		for(var i = 0; i < enemies.length; i++){
			var enemy = enemies[i];
			enemy.object.remove();
		}
		box.remove();
		
		if(score < 80){
			result.style.display = "block";
			result.innerHTML = "Oei, je bent niet zo goed in spelletjes he!";
		}else if(score >= 93){
			result.style.display = "block";
			result.innerHTML = "OMG, JE BENT EEN BEEST";
		} else {
			result.style.display = "block";
			result.innerHTML = "Je bent gemiddeld, klik <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>hier</a> voor een leuk prijsje"
		}
	}
}
