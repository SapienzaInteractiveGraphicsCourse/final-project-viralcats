// Three.js - Load .GLTF
// from https://threejsfundamentals.org/threejs/threejs-load-gltf.html



import * as THREE from './libs/threejs/build/three.module.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './libs/threejs/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from './libs/threejs/examples/jsm/effects/OutlineEffect.js';
import TWEEN from './libs/tween.esm.js';



// physijs lib initialization
// Physijs.scripts.worker = './libs/physijs_worker.js';
// Physijs.scripts.ammo = './libs/ammo.js';

var hemisphere_light;
var directional_light;
var ambient_light;

var scene, camera, renderer, controls, effect, eye;

var phi                     = 16.6328125;
var _theta                  = -75.58349609375;

var x                       = 0.0;
var y                       = 0.0;
var z                       = 0.0;
var radius                  = 13;
var dragging                = false;
var mouse_x                 = 0;

var centerCanvasOnX         = 0;
var centerCanvasOnY         = 0;
var canvas_x                = 0;
var canvas_width            = 0;
var canvas_y                = 0;
var canvas_height           = 0;

var cameraCenterNode;
var cameraPositionNode;

// Navigate
var mouse_x;
var mouse_y;
var mouse_alfa;
var mouse_beta;
var mouse_pressing = false;

var terrain;

var curr_time = 0;
var last_time = 0;
var key_pressed = new Array(5);
for (var i = 0; i < 5; i++) {
	key_pressed[i] = false;
}

var isCharacterAnimationRun = false;
var isCharacterAnimationJump = false;
const canvas = document.querySelector('#c');

var zombie = {
  joints:{
    arms:{
      left:{},
      right:{}
    },
    legs:{
      left:{},
      right:{},
      l_ankle:{},
      r_ankle:{}
    }
  },
  head:{},
  chest:{},
  body:{},
  mesh: new THREE.Object3D(),
  gltf:{},
  //FEATURES
  isJump: false,
  jumpTime: 100,
  jumpHeight: 10,
  position:{
    x:0,
    y:0,
    z:0
  }
};

var collisionBox;
const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const boxCollisionMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff, transparent: true, opacity: .7});


window.onload = loadModel;


var camera_x_pos = 0;
var camera_y_pos = 50;
var camera_z_pos = 50;

var at = (camera_x_pos, camera_y_pos, camera_z_pos);
var up = (0.0, 1.0, 0.0);


function init(){

  const fov = 150;
  const aspect = 1;
  const near = 0.1;
  const far = 2000000;

  
  canvas.getBoundingClientRect();

  canvas_x       = canvas.offsetLeft;
  canvas_width   = canvas.width;
  canvas_y       = canvas.offsetTop;
  canvas_height  = canvas.height;

  mouse_x        = canvas_width;

  var canvas_rect = canvas.getBoundingClientRect();

  centerCanvasOnX = canvas_rect.x + (canvas.width/2) + 2;
  centerCanvasOnY = canvas_rect.y + (canvas.height/2) + 2;


  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(0, 180,45);
  camera.position.z = camera_z_pos;
	camera.position.y = camera_y_pos;
  camera.position.x = camera_x_pos;




  eye = (0,0,0);

	camera.lookAt(eye, at, up);

  // camera.position.set(0,2.5,2.5); // Set position like this
  // camera.lookAt(new THREE.Vector3(0,0,0)); // Set look at coordinate like this
  // camera.lookAt(eye, at, up);
  // camera.updateProjectionMatrix();

  // camera.lookAt(0, 1, 1);
  // camera.updateProjectionMatrix();


  renderer = new THREE.WebGLRenderer({canvas});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	renderer.setPixelRatio(devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.gammaFactor = 2.2;
	renderer.outputEncoding = THREE.sRGBEncoding;

  initScene();
  initZombie();

  window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth/window.innerHeight;
	
		// camera.updateProjectionMatrix();
	});

  // document.addEventListener('keypress', KeysListener);
  document.onkeydown = function(e){
		if (e.key=="w"||e.key=="W") {
			// moveForward(zombie,1); 
      key_pressed[0] = true;
		}
    if (e.key=="a"||e.key=="A") {
			// moveSx(zombie,1);
      key_pressed[1] = true;
		}
    if (e.key=="s"||e.key=="S") {
			// moveBackward(zombie,1);
      key_pressed[2] = true;
		}
    if (e.key=="d"||e.key=="D") {
			// moveDx(zombie,1);
      key_pressed[3] = true;
		}
    if(e.key == " "){
      // moveJump(zombie.mesh.position,zombie.mesh.position.y,zombie.mesh.position.y+20,"y",160);
      key_pressed[4] = true;
    }
	};

  document.onkeyup = function(e){

		if (e.key=="w"||e.key=="W") {
			// moveForward(zombie,1); 
      key_pressed[0] = false;
		}
    if (e.key=="a"||e.key=="A") {
			// moveSx(zombie,1);
      key_pressed[1] = false;
		}
    if (e.key=="s"||e.key=="S") {
			// moveBackward(zombie,1);
      key_pressed[2] = false;
		}
    if (e.key=="d"||e.key=="D") {
			// moveDx(zombie,1);
      key_pressed[3] = false;
		}
    if(e.key == " "){
      // moveJump(zombie.mesh.position,zombie.mesh.position.y,zombie.mesh.position.y+20,"y",160);
      key_pressed[4] = false;
    }
	};



	// canvas.onmousedown = function(e){
	// 	mouse_x = e.offsetX;
	// 	mouse_y = e.offsetY;
	// 	mouse_pressing = true;
	// }

	// canvas.onmouseup = function(e){
	// 	mouse_pressing = false;
	// }

	// canvas.onmousemove = function(e){
	// 	//console.log(Date.now()-last_time); last_time = Date.now();
	// 	if (!mouse_pressing) {return;}

	// };


  canvas.addEventListener( 'mousemove', onMouseMove, false );
  canvas.addEventListener( 'mouseup', onMouseUp, false );
  canvas.addEventListener('mousedown',onMouseDown,false);

  effect = new OutlineEffect( renderer, {defaultThickness: 0.0025, defaultColor: [ 0, 0, 0 ], defaultAlpha: 0.5, defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
  }); 
  




    // // now make nodes for camera
    // cameraCenterNode = new THREE.Object3D();
    // cameraPositionNode = new THREE.Object3D();
    // scene.add(cameraCenterNode);
    // cameraCenterNode.add(cameraPositionNode);
    // cameraPositionNode.position.x = camera_x_pos;
    // cameraPositionNode.position.y = camera_y_pos;
    // cameraPositionNode.position.y = camera_z_pos;

  initZombiePosition();
  // movePartIntoThePlane(zombie.mesh.position,zombie.mesh.position.z,200,"z",2000).start();
  // moveForward(zombie,10);


  // timer = setInterval(() => {
  //   c1 += 1;
  //   // directional_light.position.set(c1, c1/2, 2);
  //   moveForward(zombie,c1);
    
  // }, 20);




  var timer_key = setInterval(function(){
  

    setCurrentTime();
    if (key_pressed[0]) {
      moveForward(zombie,1); 
    } 
    if (key_pressed[1]) {
      moveSx(zombie,1);
    } 
    if (key_pressed[2]) {
      moveBackward(zombie,1);
    } 
    if (key_pressed[3]) {
      moveDx(zombie,1);
    } 
    if (key_pressed[4]) {
      moveJump(zombie.mesh.position,zombie.mesh.position.y,zombie.mesh.position.y+50,"y",100);
    }

    if(key_pressed[0] || key_pressed[1] || key_pressed[2] || key_pressed[3] || key_pressed[4]){
      if(diff_time(curr_time,last_time) > 100)
        getTime();
    }

  
  
  },10);









  render();
}

function initZombiePosition(){

    zombie.body.rotation.set(degtorad(0), degtorad(0), degtorad(180));
    zombie.joints.arms.right.rotation.set(zombie.joints.arms.right.rotation.x +degtorad(-80),zombie.joints.arms.right.rotation.y,zombie.joints.arms.right.rotation.z );
    zombie.joints.arms.left.rotation.set(zombie.joints.arms.left.rotation.x   +degtorad(-80),zombie.joints.arms.left.rotation.y  ,zombie.joints.arms.left.rotation.z     );
}


function moveLegs(who,time,steps){

    var leg_r_forward                   = movePart(who.joints.legs.right.rotation     ,who.joints.legs.right.rotation.x     ,degtorad(-155),  "x",    time);
    var leg_l_forward                   = movePart(who.joints.legs.left.rotation      ,who.joints.legs.left.rotation.x      ,degtorad(0),     "x",    time);
    var ankle_r_forward                 = movePart(who.joints.legs.r_ankle.rotation   ,who.joints.legs.r_ankle.rotation.x   ,degtorad(-155),  "x",    time);
    var ankle_l_forward                 = movePart(who.joints.legs.l_ankle.rotation   ,who.joints.legs.l_ankle.rotation.x   ,degtorad(0),     "x",    time);

    var leg_r_forward_return            = movePart(who.joints.legs.right.rotation     ,degtorad(-155)                       ,who.joints.legs.right.rotation.x  ,"x"  ,time);
    var leg_l_forward_return            = movePart(who.joints.legs.left.rotation      ,degtorad(0)                          ,who.joints.legs.left.rotation.x   ,"x"  ,time);
    var ankle_r_forward_return          = movePart(who.joints.legs.r_ankle.rotation   ,degtorad(-155)                       ,who.joints.legs.r_ankle.rotation.x,"x"  ,time);
    var ankle_l_forward_return          = movePart(who.joints.legs.l_ankle.rotation   ,degtorad(0)                          ,who.joints.legs.l_ankle.rotation.x,"x"  ,time);


    var reverse_leg_r_forward           = movePart(who.joints.legs.right.rotation     ,who.joints.legs.right.rotation.x     ,degtorad(0),     "x",    time);
    var reverse_leg_l_forward           = movePart(who.joints.legs.left.rotation      ,who.joints.legs.left.rotation.x      ,degtorad(-155),  "x",    time);
    var reverse_ankle_r_forward         = movePart(who.joints.legs.r_ankle.rotation   ,who.joints.legs.r_ankle.rotation.x   ,degtorad(0),     "x",    time);
    var reverse_ankle_l_forward         = movePart(who.joints.legs.l_ankle.rotation   ,who.joints.legs.l_ankle.rotation.x   ,degtorad(-155),  "x",    time);

    var reverse_leg_r_forward_return    = movePart(who.joints.legs.right.rotation     ,degtorad(0)                          ,who.joints.legs.right.rotation.x  ,"x"  ,time);
    var reverse_leg_l_forward_return    = movePart(who.joints.legs.left.rotation      ,degtorad(-155)                       ,who.joints.legs.left.rotation.x   ,"x"  ,time);
    var reverse_ankle_r_forward_return  = movePart(who.joints.legs.r_ankle.rotation   ,degtorad(0)                          ,who.joints.legs.r_ankle.rotation.x,"x"  ,time);
    var reverse_ankle_l_forward_return  = movePart(who.joints.legs.l_ankle.rotation   ,degtorad(-155)                       ,who.joints.legs.l_ankle.rotation.x,"x"  ,time);

    var curr_steps = 1;

    leg_r_forward.start();
    leg_l_forward.start();
    ankle_r_forward.start();
    ankle_l_forward.start();

    leg_r_forward.onComplete(function(){
        leg_r_forward_return.start().onComplete(function(){
          reverse_leg_r_forward.start().onComplete(function(){
            reverse_leg_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_r_forward.start();
              }
            });
          });
        });
    });
    leg_l_forward.onComplete(function(){
        leg_l_forward_return.start().onComplete(function(){
          reverse_leg_l_forward.start().onComplete(function(){
            reverse_leg_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_l_forward.start();
              }
            });
          });
        });
    });
    ankle_r_forward.onComplete(function(){
        ankle_r_forward_return.start().onComplete(function(){
          reverse_ankle_r_forward.start().onComplete(function(){
            reverse_ankle_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                ankle_r_forward.start();
              }
            });
          });
        });
    });
    ankle_l_forward.onComplete(function(){
        ankle_l_forward_return.start().onComplete(function(){
          reverse_ankle_l_forward.start().onComplete(function(){
            reverse_ankle_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                ankle_l_forward.start();
              }else{
                isCharacterAnimationRun = false;
              }
              curr_steps++;
            });
          });
        });
    });
}

function moveArms(who,time,steps){

    var leg_r_forward                   = movePart(who.joints.arms.right.rotation     ,who.joints.arms.right.rotation.z     ,degtorad(-35),                     "z",    time);
    var leg_l_forward                   = movePart(who.joints.arms.left.rotation      ,who.joints.arms.left.rotation.z      ,degtorad(-80),                     "z",    time);

    var leg_r_forward_return            = movePart(who.joints.arms.right.rotation     ,degtorad(-35)                        ,who.joints.arms.right.rotation.z  ,"z"  ,  time);
    var leg_l_forward_return            = movePart(who.joints.arms.left.rotation      ,degtorad(-80)                        ,who.joints.arms.left.rotation.z   ,"z"  ,  time);

    var reverse_leg_r_forward           = movePart(who.joints.arms.right.rotation     ,who.joints.arms.right.rotation.z     ,degtorad(65),                      "z",    time);
    var reverse_leg_l_forward           = movePart(who.joints.arms.left.rotation      ,who.joints.arms.left.rotation.z      ,degtorad(65),                      "z",    time);

    var reverse_leg_r_forward_return    = movePart(who.joints.arms.right.rotation     ,degtorad(65)                         ,who.joints.arms.right.rotation.z  ,"z"  ,  time);
    var reverse_leg_l_forward_return    = movePart(who.joints.arms.left.rotation      ,degtorad(65)                         ,who.joints.arms.left.rotation.z   ,"z"  ,  time);


    var curr_steps = 1;

    leg_r_forward.start();
    leg_l_forward.start();



    leg_r_forward.onComplete(function(){
        leg_r_forward_return.start().onComplete(function(){
          reverse_leg_r_forward.start().onComplete(function(){
            reverse_leg_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_r_forward.start();
              }
            });
          });
        });
    });
    leg_l_forward.onComplete(function(){
        leg_l_forward_return.start().onComplete(function(){
          reverse_leg_l_forward.start().onComplete(function(){
            reverse_leg_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_l_forward.start();
              }
              curr_steps++;
            });
          });
        });
    });
}

function moveSx(who,steps){
  var time  = 85;

  if(isCharacterAnimationRun == false){
      isCharacterAnimationRun = true;
      moveLegs(who,time,steps);
      moveArms(who,time,steps);
      
      
  }
  if(diff_time(curr_time,last_time) > 20){

    movePartIntoThePlane(terrain.position,terrain.position.x,terrain.position.x+20,"x",85).start();
  }

  
}



function moveUp(who,steps){
  var time  = 45;

  if(isCharacterAnimationRun == false){
      isCharacterAnimationRun = true;
      moveLegs(who,time,steps);
      moveArms(who,time,steps);
      movePartIntoThePlane(terrain.position,terrain.position.y,terrain.position.y+20,"y",time*4).start();
      
  }
}

function moveDown(who,steps){
  var time  = 45;

  if(isCharacterAnimationRun == false){
      isCharacterAnimationRun = true;
      moveLegs(who,time,steps);
      moveArms(who,time,steps);
      movePartIntoThePlane(terrain.position,terrain.position.y,terrain.position.y+20,"y",time*4).start();
      
  }
}

function moveDx(who,steps){
    var time  = 85;

    if(isCharacterAnimationRun == false){
        isCharacterAnimationRun = true;
        moveLegs(who,time,steps);
        moveArms(who,time,steps);
        
        
    }
    
    
    if(diff_time(curr_time,last_time) > 20){

      movePartIntoThePlane(terrain.position,terrain.position.x,terrain.position.x-20,"x",85).start();
    }
}

function moveForward(who,steps){
  	
    var time  = 85;

    

    if(isCharacterAnimationRun == false){
        isCharacterAnimationRun = true;
        moveLegs(who,time,steps);
        moveArms(who,time,steps);
        
    }

    if(diff_time(curr_time,last_time) > 20){

      movePartIntoThePlane(terrain.position,terrain.position.z,terrain.position.z+20,"z",85).start();//who.mesh.position
    }
    
}

function moveBackward(who,steps){
  	
    var time  = 85;

    if(isCharacterAnimationRun == false){
      isCharacterAnimationRun = true;
      moveLegs(who,time,steps);
      moveArms(who,time,steps);
      
    }

    if(diff_time(curr_time,last_time) > 20){

        movePartIntoThePlane(terrain.position,terrain.position.z,terrain.position.z-20,"z",85).start();
        
    }

}

function movePart(what,initial_value,value,evaluate_on,time){

    initial_value = {pos:initial_value}

    var animation = new TWEEN.Tween(initial_value)
    .to({pos:value},time)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){     

        if(evaluate_on == "x"){
            what.set(initial_value.pos,what.y, what.z);
        }else if(evaluate_on == "y"){
            what.set(what.x,initial_value.pos, what.z);
        }else if(evaluate_on == "z"){
            what.set(what.x,what.y, initial_value.pos);
        }
    }); 

    return animation;
}

function moveJump(what,initial_value,value,evaluate_on,time){

  
  var _initial_value = {pos:initial_value}
  var _value = {pos:value}

  var animation_1 = new TWEEN.Tween(initial_value)
  .to({pos:value},time)
  .easing(TWEEN.Easing.Linear.None)
  .onUpdate( function(){     
      if(evaluate_on == "x"){
          what.x = _initial_value.pos;
          camera.position.x = _initial_value.pos
          // cameraCenterNode.rotation.x = _initial_value.pos
      }else if(evaluate_on == "y"){
          what.y = _initial_value.pos;
          camera.position.y = _initial_value.pos + 50;
          // cameraCenterNode.rotation.y = _initial_value.pos + 50
      }else if(evaluate_on == "z"){
          what.z = _initial_value.pos;
          camera.position.z = _initial_value.pos + 80;
          // cameraCenterNode.rotation.z = _initial_value.pos + 80
      }
  }); 

  var animation_2 = new TWEEN.Tween(_value)
  .to({pos:initial_value},time)
  .easing(TWEEN.Easing.Linear.None)
  .onUpdate( function(){     

      if(evaluate_on == "x"){
          what.x = _value.pos;
          camera.position.x = _value.pos;
          // cameraCenterNode.rotation.x = _value.pos
      }else if(evaluate_on == "y"){
          what.y = _value.pos;
          camera.position.y = _value.pos + 50;
          // cameraCenterNode.rotation.y = _value.pos + 50;
      }else if(evaluate_on == "z"){
          what.z = _value.pos;
          // camera.position.z = _value.pos + 80;
      }
  }); 

  if(isCharacterAnimationJump == false){
    isCharacterAnimationJump = true;
    animation_1.start().onComplete(function(){
      animation_2.start().onComplete(function(){
        isCharacterAnimationJump = false;
      });
    });
  }
}

function movePartIntoThePlane(what,initial_value,value,evaluate_on,time){

  initial_value = {pos:initial_value}

  var animation = new TWEEN.Tween(initial_value)
  .to({pos:value},time)
  .easing(TWEEN.Easing.Linear.None)
  .onUpdate( function(){     
    
      if(evaluate_on == "x"){
          what.x = initial_value.pos;
          // camera.position.x = initial_value.pos;
          // cameraCenterNode.rotation.x = initial_value.pos
          console.log("----------------------------------")
      }else if(evaluate_on == "y"){
          what.y = initial_value.pos;
      }else if(evaluate_on == "z"){
          what.z = initial_value.pos;
          // camera.position.z = initial_value.pos + 80;
          // cameraCenterNode.rotation.z = initial_value.pos + 80
      }
  }); 

  return animation;
}

function initScene(){


    // controls = new OrbitControls(camera, canvas);


    // controls = new OrbitControls(camera, canvas);
    // // controls.target.set(0, 5, 0);
    //controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color('cyan');

    // TERRAIN
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
    terrain = new THREE.Mesh( geometry, material );
    terrain.scale.set(100, 1, 350);
    terrain.position.y = -.5;
    terrain.receiveShadow = true;
    scene.add(terrain);



    ambient_light = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient_light);

    const skyColor = 0x0000FF; 
    const groundColor = 0x00FF00; 
    var intensity = 1;
    hemisphere_light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(hemisphere_light);


    const color = 0xD0D0D0;
    intensity = 2;
    directional_light = new THREE.DirectionalLight(color, intensity);
    directional_light.position.set(0, 0, 2);


    var directLightTargetObject = new THREE.Object3D();
    directLightTargetObject.position.set(0, 0, 20);
    scene.add(directLightTargetObject);

    directional_light.target = directLightTargetObject;
    
    directional_light.castShadow = true;
    directional_light.shadow.mapSize.width = 512;
    directional_light.shadow.mapSize.height = 512;

    const d = 60;
    directional_light.shadow.camera.left = -10;
    directional_light.shadow.camera.right = 10;
    directional_light.shadow.camera.top = 140;
    directional_light.shadow.camera.bottom = 0;
    directional_light.shadow.camera.near = 30;
    directional_light.shadow.camera.far = 55;
    directional_light.shadow.bias = 0.0009;

    scene.add(directional_light);
}


function initZombie(){

    zombie.mesh.position.set(0, 0, 0);
    // zombie.mesh.rotation.set(180, 180, 180);
    // console.log(zombie.mesh.rotation)
    var root = zombie.gltf;
    root.scale.set(.08, .08, .08);

    console.log("******* STO CAZZO *******\n", dumpObject(root).join('\n'));


    var out_cube =  new THREE.Mesh(boxGeometry, boxCollisionMaterial);
    out_cube.name = "collisionBox"
    out_cube.scale.set(20, 80, 20);
    out_cube.position.set(0, 40, -2);
    out_cube.visible = false;
    
    collisionBox = out_cube;
  
    zombie.mesh.add(root);
    zombie.mesh.add(collisionBox);

    scene.add(zombie.mesh);

    initZombieMovebleParts();

}

function initZombieMovebleParts(){

    //Bone037_036 caviglia sinistra
    //Bone036_030 caviglia destra
    //Bone002_02  busto dalla vita in su
    //Bone029_024 gamba destra
    //Bone030_027 gamba sinistra
    //Bone001_03 busto dalle tette in su
    //Bone003_04 busto un po piu in su di quello prima
    //Bone005_05 braccio sinistro
    //Bone028_014 braccio destro
    //Bone004_023 testa
    //Bone032_06 spalla sinistra
    //Bone031_015 spalla destra
    //Bone010_09 gomito sinistro
    //Bone013_018 gomito destro
    //Bone015_025 gamba destra
    //Bone006_028 gamba sinistra
    //Bone016_026 ginocchio destro
    //Bone007_029 ginocchio sinistro

    zombie.mesh.traverse( part => {
      if (part.isBone && part.name === 'Bone032_06') { 
        zombie.joints.arms.left = part;
      }
      if (part.isBone && part.name === 'Bone031_015') { 
        zombie.joints.arms.right = part;
      }
      if (part.isBone && part.name === 'Bone030_027') { 
        zombie.joints.legs.left = part;
      }
      if (part.isBone && part.name === 'Bone029_024') { 
        zombie.joints.legs.right = part;
      }
      if (part.isBone && part.name === 'Bone004_023') { 
        zombie.head = part;
      }
      if (part.isBone && part.name === 'Bone002_02') { 
        zombie.chest = part;
      }
      if (part.isBone && part.name === 'Bone033_00') { 
        zombie.body = part;
      }
      if (part.isBone && part.name === 'Bone037_036') { 
        zombie.joints.legs.l_ankle = part;
      }
      if (part.isBone && part.name === 'Bone036_030') { 
        zombie.joints.legs.r_ankle = part;
      }
    });
}

function loadModel(){
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./scene.gltf', (gltf) => {
    
    gltf.scene.traverse( function ( child ) {

      if ( child.isMesh ) {
        if( child.castShadow !== undefined ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }

      } );


      zombie.gltf = gltf.scene.getObjectByName('RootNode');
      init();
    },0,() => {
      console.log("ERRORE DURANTE IL CARICAMENTO DEL MODELLO!!!!");
    });
}

function render(){
    requestAnimationFrame(render);

    TWEEN.update();


    // console.log("camera.position.x: " + camera.position.x);
    // console.log("camera.position.y: " + camera.position.y);
    // console.log("camera.position.z: " + camera.position.z);
    // console.log("\n"+Date.now());

    // point camera at center
    // camera.lookAt(cameraCenterNode.position);
    renderer.render(scene, camera);

    effect.render(scene, camera);
}


function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

function degtorad(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function radtodeg(rad){
  var pi = Math.PI;
  return rad*180/pi;
}

var c1 = -180;
var timer;


function onMouseUp(event){

    dragging = false;
    mouse_x = canvas_width;
}

function onMouseDown(event){
    if(event.which == 0){
      dragging = false;
      mouse_x = canvas_width;
    }else if(event.which == 1){
      dragging = true;
    }

    mouse_x = event.clientX;
}

function onMouseMove(event) {

  if (dragging) {

      var temp_x = mouse_x - event.clientX;

      var mouseY = ((event.clientY - centerCanvasOnY)*180/canvas_width);

      if(mouseY >= 90){
          mouseY = 90;
      }

      if(mouseY < -90){
          mouseY = -90;
      }

      console.log(x);

      terrain.rotation.set(degtorad(0), (temp_x/(canvas_width/4)), degtorad(0));
  }
}

function getTime(){
    last_time = Date.now();
}

function setCurrentTime(){
    curr_time = Date.now();
}

function diff_time (recent_time, old_time){
    return (recent_time - old_time);
}

function mouseup(event) {
  dragging = false;
}
