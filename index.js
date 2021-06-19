// Three.js - Load .GLTF
// from https://threejsfundamentals.org/threejs/threejs-load-gltf.html


import * as THREE from './libs/threejs/build/three.module.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './libs/threejs/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from './libs/threejs/examples/jsm/effects/OutlineEffect.js';
import TWEEN from './libs/tween.esm.js';


var hemisphere_light;
var directional_light;
var ambient_light;

var scene, camera, renderer, controls, effect;
const canvas = document.querySelector('#c');

var zombie = {
  joints:{
    arms:{
      left:{},
      right:{}
    },
    legs:{
      left:{},
      right:{}
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
var camera_z_pos = 100;

var at = (camera_x_pos, camera_y_pos, camera_z_pos);
const up = (0.0, 1.0, 0.0);


function init(){

  const fov = 150;
  const aspect = 1;
  const near = 0.1;
  const far = 2000000;


  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(0, 180,45);
  camera.position.z = camera_z_pos;
	camera.position.y = camera_y_pos;

  var eye = (camera_x_pos,camera_y_pos,camera_z_pos);

	camera.lookAt(eye, at, up);
  // camera.lookAt(0, 1, 1);
  camera.updateProjectionMatrix();


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
	
		camera.updateProjectionMatrix();
	});

  effect = new OutlineEffect( renderer, {defaultThickness: 0.0025, defaultColor: [ 0, 0, 0 ], defaultAlpha: 0.5, defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
  }); 
  







  initZombiePosition();

  moveForward(zombie,20);


  // timer = setInterval(() => {
  //   c1 += 1;
  //   // directional_light.position.set(c1, c1/2, 2);
  //   moveForward(zombie,c1);
    
  // }, 20);

  render();
}

function initZombiePosition(){

    zombie.body.rotation.set(degtorad(0), degtorad(0), degtorad(180));
}

function moveForward(who,target){
  	// animated movement
	var position = { z: who.mesh.position.z };
  var leg_r_pos = {pos:who.joints.legs.right.rotation.x}

	var tween_z = new TWEEN.Tween(position)
		.to({ z: target }, 200)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate( function(){
						who.mesh.position.z = position.z;
            camera.position.z = position.z + 50;
					}
		);

    
    var tween_leg_r = new TWEEN.Tween(leg_r_pos)
		.to({ pos: degtorad(-90)}, 15000)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate( function(){
      console.log(leg_r_pos.pos + " == "+ degtorad(90));
      
						who.joints.legs.right.rotation.set(who.joints.legs.right.rotation.x+degtorad(leg_r_pos.pos), who.joints.legs.right.rotation.y, who.joints.legs.right.rotation.z);
            // camera.position.z = position.z + 20;
					}
		);

	tween_z.start();
  tween_leg_r.start();
}

function initScene(){

  controls = new OrbitControls(camera, canvas);


    // controls = new OrbitControls(camera, canvas);
    // // controls.target.set(0, 5, 0);
    controls.update();

    scene = new THREE.Scene();
    scene.background = new THREE.Color('cyan');

    // TERRAIN
    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.scale.set(10000, 1, 1500);
    mesh.position.y = -.5;
    mesh.receiveShadow = true;
    scene.add(mesh);



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
      if (part.isBone && part.name === 'Bone005_05') { 
        zombie.joints.arms.left = part;
      }
      if (part.isBone && part.name === 'Bone028_014') { 
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

function degtorad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function radtodeg(rad){
  var pi = Math.PI;
  return rad*180/pi;
}


var c1 = -180;
var timer;

