// import * as THREE from './libs/threejs/build/three.module.js';

Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';
import * as utils from './utils.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from './libs/tween.esm.js';
import * as THREE_AUDIO from './libs/threejs/build/three.module.js';
import { GLTFLoader } from './libs/threejs/examples/jsm/loaders/GLTFLoader.js';

//import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";

// defintion of the object for the level

var distance_bound = 1000;
// definition and instatiation of the groups
var anim_box_repeat;
var anim_box_repeat_instance;
var anim_box_single;
var anim_box_single_instance;
var land_anim_a;

var animations_conc = [];
var tremble_anim = [];

var ascent, descent, land, land_grass, orbit;
var box_1;
var box_3;
var controls;
var scene;

var sphere;

var keys;

var camera_x_pos = 0;
var camera_y_pos = 68;
var camera_z_pos = 180;

var mouse_x;
var mouse_pressing = false;

const canvas = document.querySelector('#c');

// Loading assets
var areModelsLoaded = false;
var areSoundsLoaded = false;
//AGGIUNGERE SUONI

const sounds = {
	background  :  { url: './asserts/sounds/background.wav' },
	ambient     :  { url: './asserts/sounds/ambient.flac' },
	adventure   :  { url: './asserts/sounds/adventure.wav' }
}


function loadSounds() {

	const soundsLoaderManager = new THREE_AUDIO.LoadingManager();
	soundsLoaderManager.onLoad = () => {

		areSoundsLoaded = true;

		// hide the loading bar
		document.querySelector('#sounds_loading').hidden = true;

		if(areModelsLoaded & areSoundsLoaded) {
			init();
		}
	};

	const modelsProgressBar = document.querySelector('#sounds_progressbar');
	soundsLoaderManager.onProgress = (url, itemsLoaded, itemsTotal) => {
		console.log("Loading sounds... ", itemsLoaded / itemsTotal * 100, '%');
		modelsProgressBar.style.width = `${itemsLoaded / itemsTotal * 100 | 0}%`;
	};
	{
		const audioLoader = new THREE_AUDIO.AudioLoader(soundsLoaderManager);
		for (const sound of Object.values(sounds)) {
			audioLoader.load( sound.url, function( buffer ) {
				
				sound.sound = buffer;

				console.log("Loaded ", buffer);
			});
		}
	} 
}

/*******            START TEST          ******************/

var root = new THREE.Object3D();

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
    gltf:new THREE.Object3D(),
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



/*******            END TEST            *****************/

function initializate_page(){
    canvas.setAttribute("hidden", true);
    document.querySelector('#life_counter').setAttribute("hidden",true);
        
    document.getElementById("body_").removeAttribute("d-flex");
    document.getElementById("body_").removeAttribute("h-100");
    document.getElementById("body_").removeAttribute("text-center");
    document.getElementById("body_").removeAttribute("text-white");
    document.getElementById("body_").removeAttribute("bg-dark");

    document.getElementById("game_start").onclick = function(event) {
        canvas.setAttribute("hidden", true);
        // document.getElementById('intro_page').classList.add("invisible");
        document.getElementById('intro_page').remove();
        document.getElementById('life_counter').removeAttribute("hidden");
        canvas.removeAttribute("hidden");
        main();
    };
    
}
function loadModel(){
    const gltfLoader = new GLTFLoader();
    // const gltfLoader = new THREE_AUDIO.ObjectLoader();
    gltfLoader.load('./scene.gltf', (gltf) => {
    
    gltf.scene.traverse( function ( child ) {

      if ( child.isMesh ) {
        if( child.castShadow !== undefined ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }

      } );
// vedere questo perche senza THREE.Object3D non funziona ma con THREE.Object3D non me lo fa vedere  
      root = new THREE.Object3D(gltf.scene.getObjectByName('RootNode'));
      root.name = 'RootNode';

      // Add gltf model to scene
      //scene.add(root);


      zombie.gltf = root;//gltf.scene.getObjectByName('RootNode');
      //init();
    },0,() => {
      console.log("ERRORE DURANTE IL CARICAMENTO DEL MODELLO!!!!");
    });
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

loadModel();
loadSounds();
function main() {
    
    var renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 20;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 10000;

    scene = new Physijs.Scene(); // create Physijs scene

    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.set(0, 10, 100);



    


    scene.background = new THREE.Color('black');

    scene.setGravity(new THREE.Vector3(0, - 9.8, 0)); // set gravity
    scene.addEventListener('update', function () {
        scene.simulate(); // simulate on every scene update
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
        // sphere.setLinearVelocity(new THREE.Vector3(0,0,0));
    });

    /* ************************* PLANES ***********************************/

    {
        utils.create_Box_Plane([0, 0, 0], [0, 0, 0], 40, scene, false);
    }

    /* ************************* BOXES ***********************************/

    {
        box_1 = utils.create_Box("Namecc", [0, 20, 0], 0, scene);
        utils.create_Box("Moss", [-5, 20, 0], 0, scene);
        utils.create_Box("Dirt", [5, 20, 0], 0, scene);
        utils.create_Box("Lava", [10, 20, 0], 0, scene);
        utils.create_Box("Rock", [-10, 20, 0], 0, scene);
        utils.create_Box("Amethyst", [15, 20, 0], 0, scene);
        utils.create_Box("Grass", [-15, 20, 0], 0, scene);
        box_3 = utils.create_Box("Terracotta", [0, 20, -10], 0, scene);


        land = utils.createFlatLand(4,4, "Namecc", [30, 0, 30], scene);

        land_grass = utils.createFlatLand(4,4, "Grass", [-30, 0, 30], scene);

        orbit = utils.createFlatLand(3,5, "Grass", [-30,30,-30], scene);

        utils.createUphillLand(10, 10, 10, "Lava", [0, 0, -80], scene)

        ascent = utils.createAscentGround(5, 5, 10, "Amethyst", [-39, 0, -5], scene)

        descent = utils.createDescentGround(5, 5, 10, "Rock", [-39, 0, -5], scene)

    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_Sphere(3, 0xFFFF00, "rock", scene);
    }

    {
        utils.create_teleport([0, 20, 10], scene); // emissive light of the teleport
    }

    /* ************************* LIGHT ***********************************/
    {
        // utils.create_pointLIght([10,10,10],0xffffff,scene);
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane([0, -distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([0, distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([-distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane([distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane([0, 0, distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([0, 0, -distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
    }

    /* ************************* ZOMBIE ***********************************/
    {
        //hierarchical model
        //second version


        //the root: head
        var head = utils.create_Box("Namecc", [0, 14, 5], 1, scene, null,null,true);
        head.scale.set(1, 1, 1);

        var hb1_displacement = -6;
        var hb2_displacement = -4.5;
        
        var hit_box_1 = utils.create_hitbox([1.0,5,0.9],[head.position.x, head.position.y-hb1_displacement, head.position.z], 0, scene,0.3,true);
        var hit_box_2 = utils.create_hitbox([2,2,1], [head.position.x, head.position.y-hb2_displacement, head.position.z], 0, scene,0.3,true);

        

        var body = utils.create_Box("Namecc", [0, -4.5, 0], 0, scene);
        body.scale.set(1.0, 2, 1.0);

        var left_arm = utils.create_Box("Namecc", [2.25, 0, 0], 0, scene);
        left_arm.scale.set(0.5, 1.0, 1.0);

        var right_arm = utils.create_Box("Namecc", [-2.25, 0, 0], 0, scene);
        right_arm.scale.set(0.5, 1.0, 1.0);

        var left_leg = utils.create_Box("Namecc", [0.75,-3, 0], 0, scene);
        left_leg.scale.set(0.5, 1.0, 1.0);

        var right_leg = utils.create_Box("Namecc", [-0.75,-3, 0], 0, scene);
        right_leg.scale.set(0.5, 1.0, 1.0);


        head.add(body)
        body.add(left_arm)
        body.add(right_arm)
        body.add(left_leg)
        body.add(right_leg)

        // test HM moving head

        head.__dirtyPosition = true;
        head.__dirtyRotation = true;
        hit_box_1.__dirtyPosition = true;
        hit_box_1.__dirtyRotation = true;
        hit_box_2.__dirtyPosition = true;
        hit_box_2.__dirtyRotation = true;

        // body.__dirtyPosition = false;
        // body.__dirtyRotation = false;
        // left_arm.__dirtyPosition = false;
        // left_arm.__dirtyRotation = false;
        // right_arm.__dirtyPosition = false;
        // right_arm.__dirtyRotation = false;
        // left_leg.__dirtyPosition = false;
        // left_leg.__dirtyRotation = false;
        // right_leg.__dirtyPosition = false;
        // right_leg.__dirtyRotation = false;
        
        head.position.set(0, -4.5, 10)

        scene.simulate(); //update the new position for physijs

        head.__dirtyPosition = false;
        head.__dirtyRotation = false;
        hit_box_1.__dirtyPosition = false;
        hit_box_1.__dirtyRotation = false;
        hit_box_2.__dirtyPosition = false;
        hit_box_2.__dirtyRotation = false;

        scene.simulate();
        

        /*
        // first version 
        //the root: head
        var hitbox= utils.create_Box()

        var head = utils.create_Box("Namecc", [0, 13, 5], 0, scene);
        head.scale.set(1, 1, 1);

        var body = utils.create_Box("Namecc", [0, -4.5, 0], 0, scene);
        body.scale.set(1.0, 2, 1.0);

        var left_arm = utils.create_Box("Namecc", [2.25, 0, 0], 0, scene);
        left_arm.scale.set(0.5, 1.0, 1.0);

        var right_arm = utils.create_Box("Namecc", [-2.25, 0, 0], 0, scene);
        right_arm.scale.set(0.5, 1.0, 1.0);

        var left_leg = utils.create_Box("Namecc", [0.75,-3, 0], 0, scene);
        left_leg.scale.set(0.5, 1.0, 1.0);

        var right_leg = utils.create_Box("Namecc", [-0.75,-3, 0], 0, scene);
        right_leg.scale.set(0.5, 1.0, 1.0);

        head.add(body)
        body.add(left_arm)
        body.add(right_arm)
        body.add(left_leg)
        body.add(right_leg)
        */


        /* ************************* MAiN SPHERE ***********************************/
        sphere = utils.create_Sphere(3, 0xFF0000, "rock", scene, [0,5,0], true);

        // sphere = utils.create_Box("Terracotta", [0,3,0], 1, scene);


        controls = new OrbitControls(camera, canvas);
        controls.update();
/*
        camera.position.z = sphere.position.z + camera_z_pos;
        camera.position.y = sphere.position.y + camera_y_pos;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        scene.add(camera);

*/


/***************************************************************************************************************************** */
camera.position.z = zombie.mesh.position.z + camera_z_pos;
camera.position.y = zombie.mesh.position.y + camera_y_pos;
camera.position.x = zombie.mesh.position.x;

zombie.mesh.add(camera);
camera.lookAt(zombie.mesh.position);

// camera.position.set(0, 10, 100);
// camera.lookAt(scene.position);


scene.add(camera);

console.log(zombie.gltf.type.toString());

zombie.mesh.position.set(0, 0, 0);


root = zombie.gltf;
root.scale.set(.08, .08, .08);



zombie.mesh.add(camera);

zombie.mesh.add(root);

scene.add(zombie.mesh);


initZombieMovebleParts();


/***************************************************************************************************************************** */

        // sphere.add(camera);

        canvas.onmousedown = function(e){
            mouse_x = e.pageX;
            mouse_pressing = true;
        }
        
        canvas.addEventListener('mousemove', e => {
            // sphere.__dirtyPosition = true;
            // sphere.__dirtyRotation = true;
            if(mouse_pressing){
                if(e.pageX > mouse_x){
                    console.log("Moved Right");
                    //sphere.rotation.y = (sphere.rotation.y + 0.05);
                }else{
                    console.log("Moved Left")
                    //sphere.rotation.y = (sphere.rotation.y - 0.05);
                }
                mouse_x = e.pageX;
            }
        });

        
    }

    /* ************************* ANIMATIONS ******************************/

    utils.animateTeleport(scene);

    // using names
    anim_box_repeat = utils.animateBackAndForwardName("box_5", scene, 'y', 100, 20, 5000);
    anim_box_repeat.start();
    anim_box_single = utils.animatePlatformByName("box_1", scene, 'z', 100, 5000);
    anim_box_single.start();

    // using a single instance
    anim_box_single_instance = utils.animatePlatformByInstance(box_1, scene, 'z', -100, 5000)
    anim_box_single_instance.start();

    anim_box_repeat_instance = utils.animateBackAndForwardInstance(box_3, scene, 'x', -100, 0, 5000);
    anim_box_repeat_instance.start();

    // using groups single animation

    land_anim_a = utils.animateBackAndForwardInstanceGroup(land, scene, 'x', 70, 30, 5000);
    land_anim_a.forEach(anim => { anim.start()});

    // using groups multiple animation

    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'z', 30,5000,-30,[3,5]));//not squared platform i've to specify the shape, if not, can be avoided
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'x', 30,5000,-30,[3,5]));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'z',-30,5000, 30,[3,5]));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'x',-30,5000, 30,[3,5]));

    animations_conc = utils.concatenateAnimationsGroup(animations_conc);
    animations_conc.forEach(elem => elem.start());

    // tumble animation group

    utils.animateFallenPlatformGroup(land_grass, scene)
    
    /* ************************* RESETS ******************************/

    //  utils.resetAll(scene,5000); // problem: try to change the time of activation of this functions, is it's less than 5s all ok, otherwise the cubes become static without sense
    var camera_pivot;
    function render() {

        
        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        hit_box_1.position.set(head.position.x, head.position.y +hb1_displacement , head.position.z) 
        hit_box_2.position.set(head.position.x, head.position.y +hb2_displacement , head.position.z)


        
        TWEEN.update();
        scene.simulate();
        // controls.enabled = false;
        

        var VELOCITY = 2;
        var MAX_VELOCITY = 50;
        var JUMP_VELOCITY = 10;
        var MAX_JUMP_VELOCITY = 50;
        var x = 0;
        var y = 0;
        var z = 0;
        var t = utils.degrees_to_radians(0);
  

        // console.log(sphere.getLinearVelocity());
        console.log(utils.radians_to_degrees(sphere.rotation.y))

        if ( keys.w ){
            z = sphere.getLinearVelocity().z-VELOCITY;
        }
        if ( keys.s ){
            z = sphere.getLinearVelocity().z+VELOCITY;
        }
        if ( keys.a ){
            // x = sphere.getLinearVelocity().x-VELOCITY;
            
// camera_pivot = new THREE.Object3D()
// var Y_AXIS = new THREE.Vector3( 0, 1, 0 );

// scene.add( camera_pivot );
// camera_pivot.add( camera );
// // camera.position.set( 500, 0, 0 );
// camera.lookAt( camera_pivot.position );
// camera_pivot.rotateOnAxis( Y_AXIS, 15 );    // radians

            sphere.setAngularVelocity(new THREE.Vector3(camera_pivot,VELOCITY,sphere.getAngularVelocity().z));
            t = (sphere.rotation.y);
        }
        if ( keys.d ){
            // x = sphere.getLinearVelocity().x+VELOCITY;
            sphere.setAngularVelocity(new THREE.Vector3(sphere.getAngularVelocity().x,-VELOCITY,sphere.getAngularVelocity().z));
            t =  (sphere.rotation.y);
        }
        if ( keys.space ){
            y = sphere.getLinearVelocity().y+JUMP_VELOCITY;
        }

        if(x > MAX_VELOCITY){
            x = MAX_VELOCITY;
        }        
        if(y > MAX_VELOCITY){
            y = MAX_VELOCITY;
        }        
        if(z > MAX_VELOCITY){
            z = MAX_VELOCITY;
        }

        if(x < -MAX_VELOCITY){
            x = -MAX_VELOCITY;
        }        
        if(y < -MAX_VELOCITY){
            y = -MAX_VELOCITY;
        }        
        if(z < -MAX_VELOCITY){
            z = -MAX_VELOCITY;
        }

        if(y > MAX_JUMP_VELOCITY){
            y = MAX_JUMP_VELOCITY;
        }

        if(y < -MAX_JUMP_VELOCITY){
            y = -MAX_JUMP_VELOCITY;
        }  


        if(keys.w | keys.s | keys.space){

            // sphere.__dirtyPosition = true;
            // sphere.__dirtyRotation = true;
            
          

            // sphere.__dirtyPosition = true;
            // sphere.__dirtyRotation = true;
            // sphere.setLinearVelocity(new THREE.Vector3(x,y,z));
            // console.log(quaternion);


//             camera_pivot = new THREE.Object3D()
// var Y_AXIS = new THREE.Vector3( 0, 1, 0 );

// scene.add( camera_pivot );
// camera_pivot.add(sphere);
// camera_pivot.add( camera );
// // camera.position.set( 500, 0, 0 );
// camera.lookAt( camera_pivot.position );
// camera_pivot.rotateOnAxis( Y_AXIS, 15 );    // radians
            sphere.setLinearVelocity(new THREE.Vector3(0, 0 , z));
            //   sphere.translateZ(z);
            // sphere.position.y = (sphere.position.y + y);
            // sphere.position.x = (sphere.position.x + x);

        }

        // console.log(utils.radians_to_degrees(sphere.rotation.y));

        // camera.position.z = sphere.position.z + camera_z_pos;
        // camera.position.y = sphere.position.y + camera_y_pos;
        // camera.position.x = sphere.position.x;

        
        // METTERE CAMERA CHE SEGUE LA PALLA
        // FARE CHE FUNZIONANO I PULTANTI CONTEMPORANEAMENTE

        // console.log(sphere.getLinearVelocity())
        TWEEN.update();
        scene.simulate();
        camera.lookAt( sphere.position );

        controls.update();
        // // console.log(sphere.getLinearVelocity())
        // // TWEEN.update();
        // // scene.simulate();

        // camera.lookAt( zombie.mesh.position );
        // renderer.render(scene, camera);
        // // effect.render(scene, camera);

        // // camera.lookAt( sphere.position );

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }


    render();
}


initializate_page();