const canvas = obj('canvas');
const ctx = canvas.getContext('2d');

class Button{
	constructor(x,y,w,h,callback,img){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.img = img;
		this.click = callback;
		this.visible = true;
	}
	draw(color='transparent'){
		if(!this.visible) return;
		ctx.beginPath();
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		ctx.translate(this.x,this.y);
		ctx.rect(-this.w/2,-this.h/2,this.w,this.h);
		if(this.img) ctx.drawImage(this.img,0,0,this.img.width,this.img.height,-this.w/2,-this.h/2,this.w,this.h);
		ctx.stroke();
		ctx.restore();

		// See if clicked

		if(mouse.down&&mouse.pos.x>this.x-this.w/2&&mouse.pos.x<this.x+this.w/2&&mouse.pos.y>this.y-this.h/2&&mouse.pos.y<this.y+this.h/2){
			this.click();
		}
	}
	hide(){
		this.visible = false;
	}
	show(){
		this.visible = true;
	}
}


function makeImg(path){
	let img = new Image;
	img.src = path;
	return img;
}


(function(gb){
	var cameras = {}
	gb.camera = cameras;
	
	camera.current = 0;
	camera.visible = false;
	camera.buttons = [];

	var cam_pos = [new Vector(531,237),new Vector(680,298),new Vector(643,213),new Vector(816,293),new Vector(734,106),new Vector(762,376)];

	var cams = [];
	for(let i=0;i<6;i++){
		cams.push(makeImg(`imgs/camBackgrounds/${i}.png`));
	}

	function setCamTo(index){
		camera.current = index;
		audio.play('sounds/camswitch.ogg',false,.3);
		mouse.down = false;
	}

	let imgs = [];

	for(let i=0;i<6;i++){
		imgs.push(makeImg(`imgs/camButtons/${i+1}.png`));
		let b = new Button(cam_pos[i].x,cam_pos[i].y,50,30,click=>{
			setCamTo(i);
		},imgs[i]);
		camera.buttons.push(b);
	}

	var map = makeImg('imgs/map/0.png');

	camera.draw = function(){
		if(this.visible){
			let cam_image = cams[camera.current];
			ctx.drawImage(cam_image,canvas.width/2-944/2,canvas.height/2-548/2,944,548);

			ctx.globalAlpha = .4;
			static.draw();
			ctx.globalAlpha = 1;

			ctx.fillStyle = 'white';
			ctx.drawImage(map,500,100);
			ctx.fillText(`Camera 0${camera.current+1}`,40,60);
			for(let button of camera.buttons){
				button.draw();
			}
			let ix = camera.current;
			ctx.beginPath();
			ctx.rect(cam_pos[ix].x-25,cam_pos[ix].y-15,50,30);
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 5;
			ctx.stroke();
		}
	}

})(this);


var b1 = new Button(canvas.width/2,canvas.height/2,100,50,startGame,makeImg('imgs/Play.png'));
var started = false;
var buster = new Sprite('imgs/btb/0.png');
buster.addAnimation('imgs/btb/btb.anims').then(e=>{
	buster.animation.play('spin',true);
});
buster.position = new Vector(300,300);
buster.visible = false;
var camflip = new Sprite('imgs/camflip/5.png');
camflip.position = new Vector(canvas.width/2,canvas.height/2);
camflip.addAnimation('imgs/camflip/camflip.anims');
var CAMUP = false;
camflip.visible = false;
var static = new Sprite('imgs/static/0.png');
static.visible = false;
static.addAnimation('imgs/static/static.anims').then(e=>{
	static.animation.play('static',true);
});
static.position = new Vector(canvas.width/2,canvas.height/2);
var office = new Sprite('imgs/Office.png');
office.position = new Vector(canvas.width/2,canvas.height/2);
var door = new Sprite('imgs/DoorFrames/0.png');
door.addAnimation('imgs/DoorFrames/door.anims');
door.position = new Vector(canvas.width/2,canvas.height/2);
door.visible = false;
var dooropen = true;

function start(){
	mouse.start(canvas);
	keys.start();
	loop();
}


function loop(){
	ctx.font = '20px ps2p';
	ctx.clearRect(-2,-2,canvas.width+2,canvas.height+2);
	setTimeout(loop,1000/45);

	b1.draw();

	if(started){
		office.draw();
		door.draw();
		camflip.draw();
		buster.draw();
		camera.draw();
		door.wait = Math.max(0,door.wait-1);
		camflip.wait = Math.max(0,camflip.wait-1);
		if(keys.down('s')) toggleCamera();
		if(keys.down('w')) toggleDoor();
	}
}

function toggleCamera(){
	if(door.wait !== 0) return;
	door.wait = 15;
	if(CAMUP){
		static.visible = false;
		camera.visible = false;
		buster.visible = false;
		audio.stop('sounds/camup.ogg');
		audio.stop('sounds/cam.ogg');
		audio.play('sounds/camdown.ogg',false,.3);
		camflip.animation.play('close').then(e=>{
			camflip.visible = false;
		});
	} else {
		camflip.visible = true;
		audio.play('sounds/camup.ogg',false,.3).then(e=>{
			audio.play('sounds/cam.ogg',true);
		})
		camflip.animation.play('open').then(e=>{
			static.visible = true;
			buster.visible = true;
			camera.visible = true;
		});
	}
	CAMUP = !CAMUP;
	keys.keys['s'] = false;
}

function toggleDoor(){
	if(CAMUP || camflip.wait !== 0) return;
	camflip.wait = 30;
	if(dooropen){
		door.visible = true;
		door.animation.play('close');
		audio.play('sounds/door.ogg',false,.2);
	} else {
		audio.play('sounds/door.ogg',false,.2);
		door.animation.play('open').then(e=>{
			door.visible = false;
		});
	}
	dooropen = !dooropen;
	keys.keys['w'] = false;
}

function startGame(){
	b1.hide();
	started = true;
	canvas.requestFullscreen();
	audio.play('sounds/fan.ogg',true,.05);
	camflip.wait = 0;
	door.wait = 0;
}

start();