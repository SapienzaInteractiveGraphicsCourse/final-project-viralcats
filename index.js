// Three.js - Load .GLTF
// from https://threejsfundamentals.org/threejs/threejs-load-gltf.html


import TWEEN from './libs/tween.esm.js';
import * as THREE from './libs/threejs/build/three.module.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './libs/threejs/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from './libs/threejs/examples/jsm/effects/OutlineEffect.js';
import * as Animation from './animations.js'

var hemisphere_light;
var directional_light;
var ambient_light;

var velocity_ws = 0.0;
var velocity_ad = 0.0;
var speed = 0.0;
var speed_2 = 0.0;
var keys;

var scene, camera, renderer, controls, effect;

var mouse_x                 = 0;

var centerCanvasOnX         = 0;
var centerCanvasOnY         = 0;
var canvas_x                = 0;
var canvas_width            = 0;
var canvas_y                = 0;
var canvas_height           = 0;



var mouse_x;
var mouse_pressing = false;



var terrain;

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
var camera_y_pos = 68;
var camera_z_pos = 180;

function init(){

    const fov = 80;
    const aspect = 1;
    const near = 1;
    const far = 10000;

    
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
    camera.position.z = zombie.mesh.position.z + camera_z_pos;
    camera.position.y = zombie.mesh.position.y + camera_y_pos;
    camera.position.x = zombie.mesh.position.x;

    zombie.mesh.add(camera);
    camera.lookAt(zombie.mesh.position);

    renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = THREE.sRGBEncoding;

    initScene();
    initZombie();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth/window.innerHeight;
    });


      
    keys = {
        a: false,
        s: false,
        d: false,
        w: false,
        space:false
    };

    document.body.addEventListener('keydown', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if(keys[key] !== undefined)
            keys[key] = true;
    });


    document.body.addEventListener('keyup', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if (keys[key] !== undefined )
            keys[key] = false;
    });

    canvas.onmousedown = function(e){
        mouse_x = e.pageX;
        mouse_pressing = true;
    }
    
    canvas.addEventListener('mousemove', e => {
      
        if(mouse_pressing){
            if(e.pageX > mouse_x){
                console.log("Moved Right");
                zombie.mesh.rotateY(0.05);
            }else{
                console.log("Moved Left")
                zombie.mesh.rotateY(-0.05);
            }
            mouse_x = e.pageX;
        }
    });

    canvas.onmouseup = function(e){
        mouse_pressing = false;
    }

    effect = new OutlineEffect( renderer, {defaultThickness: 0.0025, defaultColor: [ 0, 0, 0 ], defaultAlpha: 0.5, defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
    }); 
    

    initZombiePosition();
    render();
}

function initZombiePosition(){

    zombie.body.rotation.set(degtorad(0), degtorad(0), degtorad(180));
    zombie.joints.arms.right.rotation.set(zombie.joints.arms.right.rotation.x +degtorad(-80),zombie.joints.arms.right.rotation.y,zombie.joints.arms.right.rotation.z );
    zombie.joints.arms.left.rotation.set(zombie.joints.arms.left.rotation.x   +degtorad(-80),zombie.joints.arms.left.rotation.y  ,zombie.joints.arms.left.rotation.z     );
}

function initScene(){


    controls = new OrbitControls(camera, canvas);

    controls.maxPolarAngle = Math.PI;

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
    var root = (zombie.gltf);
    root.scale.set(.08, .08, .08);

    console.log("******* ZOMBIE *******\n", dumpObject(root).join('\n'));


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


      // zombie.gltf = gltf.scene.getObjectByName('RootNode');

      var root = (gltf.scene.getObjectByName('RootNode'));
      root.name = 'RootNode';

      // Add gltf model to scene
      //scene.add(root);


      zombie.gltf = root;//gltf.scene.getObjectByName('RootNode');
      init();
    },0,() => {
      console.log("ERRORE DURANTE IL CARICAMENTO DEL MODELLO!!!!");
    });
}





function render(){


    requestAnimationFrame(render);

    TWEEN.update();
    controls.update();
       
    controls.enabled = false;

    speed = 0.0;

    if ( keys.w ){
        speed = -5;
        Animation.moveForward(zombie,1); 
        velocity_ws += ( speed - velocity_ws ) * 0.3;
        zombie.mesh.translateZ( velocity_ws );     
    }
    if ( keys.s ){
        speed = 5;
        Animation.moveBackward(zombie,1);
        velocity_ws += ( speed - velocity_ws ) * 0.3;
        zombie.mesh.translateZ( velocity_ws );
    }

    if ( keys.a ){
        speed_2 = -5;
        velocity_ad += ( speed_2 - velocity_ad ) * 0.3;
        zombie.mesh.translateX( velocity_ad );
        Animation.moveSx(zombie,1);
    }
    if ( keys.d ){
        speed_2 = 5;
        velocity_ad += ( speed_2 - velocity_ad ) * 0.3;
        zombie.mesh.translateX( velocity_ad );
        Animation.moveDx(zombie,1);
    }

    if(keys.space){
        Animation.moveJump(zombie,zombie.position.y,zombie.position.y + 50,"y",100);
    }


    camera.lookAt( zombie.mesh.position );
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