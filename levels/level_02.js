
Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = '../libs/ammo.js';
import * as utils from '../utils.js';
import { OrbitControls } from '../libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from '../libs/tween.esm.js';
import * as THREE_AUDIO from '../libs/threejs/build/three.module.js';


utils.setLevel(2);

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
var pg;
var sphere;

//groups for the checkpoints
var group_1 = [];
var group_2 = [];


var pg1;
var pg2;


// falling lands variables
var fallen1 = false
var fallen2 = false
var fallen3 = false
var fallen4 = false
var fallingLand;
var fallingLand2;
var fallingLand3;
var fallingLand4;

var keys;
var pressable_q = true;


var listener;
var curr_sounds = new Map([]);

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
	adventure   :  { url: './asserts/sounds/adventure.wav' },
}


function loadSounds() {

	const soundsLoaderManager = new THREE_AUDIO.LoadingManager();
	soundsLoaderManager.onLoad = () => {

		areSoundsLoaded = true;

		// hide the loading bar
		document.querySelector('#sounds_progressbar').hidden = true;

        document.getElementById("sounds_progressbar").style.visibility = 'hidden';
        document.getElementById("loadings").style.visibility = 'hidden';

        document.getElementById('sounds_progressbar').remove();
        document.getElementById('loadings').remove();
        
        document.getElementById("intro_page").style.visibility = 'visible';
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

function playSound(sound){

    var sound_to_play = new THREE_AUDIO.Audio(listener);
    sound_to_play.isPlaying = false;
    sound_to_play.setBuffer( sound );
	sound_to_play.setLoop( true );
	sound_to_play.setVolume( 0.3 );
	sound_to_play.play();

    curr_sounds.set(sound,sound_to_play);
}

function stopSound(sound){

    const iterator = curr_sounds[Symbol.iterator]();

    if(curr_sounds.has(sound)){
        for (const item of iterator){
            if(item[0] == sound){
                item[1].stop();
                curr_sounds.delete(item[0]);
            }
        }
    }
}


function initializate_page(){
    
    document.getElementById("intro_page").style.visibility = 'hidden';
    canvas.setAttribute("hidden", true);
    document.querySelector('#life_counter').setAttribute("hidden",true);
        
    document.getElementById("body").removeAttribute("d-flex");
    document.getElementById("body").removeAttribute("h-100");
    document.getElementById("body").removeAttribute("text-center");
    document.getElementById("body").removeAttribute("text-white");
    document.getElementById("body").removeAttribute("bg-dark");
    
    document.getElementById("game_start").onclick = function(event) {
        
        document.getElementById("grid_container").style = ("");
        canvas.setAttribute("hidden", true);
        // document.getElementById('intro_page').classList.add("invisible");
        document.getElementById('intro_page').remove();
        document.getElementById('life_counter').removeAttribute("hidden");
        canvas.removeAttribute("hidden");
        main();
    };
    
}




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


	// create an AudioListener and add it to the camera
	listener = new THREE_AUDIO.AudioListener();
	//camera.add(listener);


    // renderer.clear();

    //playBackgroundSound();
    //playSound(sounds.background.sound);
    // playSound(sounds.ambient.sound);
    // playSound(sounds.adventure.sound);

    scene.background = new THREE.Color('black');

    scene.setGravity(new THREE.Vector3(0, - 20, 0)); // set gravity
    scene.addEventListener('update', function () {
        scene.simulate(); // simulate on every scene update
    });

    keys = {
        a: false,
        s: false,
        d: false,
        w: false,
        q: false,
        space:false
    };

    document.body.addEventListener('keydown', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if(keys[key] !== undefined)
            keys[key] = true;
    });


    document.body.addEventListener('keyup', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if (keys[key] !== undefined ){
            keys[key] = false;
        }

    });


    /* ************************* BOXES ***********************************/

      
        var temp;  //temporary variable to unpack the objects 


        // main platform number 1

        temp = utils.createFlatLand(30,20, "Moss", [-45, 0, 570], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        temp = utils.createFlatLand(6,6, "Namecc", [-45, 8, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [-35, 16, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [-25, 24, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [-45, 32, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [-35, 40, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [-25, 48, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // end first uphill formation

        temp = utils.createFlatLand(6,6, "Namecc", [15, 48, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        temp = utils.createFlatLand(6,6, "Namecc", [55, 48, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        // bonus with pg

        temp = utils.createFlatLand(5,5, "Namecc", [105, 48, 546.5], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        temp = utils.createFlatLand(4,4, "Namecc", [155, 48, 548], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        pg1 = utils.create_pg(scene)
    
    
        pg1[0].__dirtyPosition = true;
        pg1[0].__dirtyRotation = true;
    
    
        pg1[0].position.set(159.5, 70, 552.5)
        pg1[0].rotation.set(0,utils.degrees_to_radians(-45),0)
    
        scene.simulate();//update the new position for physijs

        group_1.push(pg1[0]);

        // start second formation uphill formation

        temp = utils.createFlatLand(6,6, "Namecc", [45, 56, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [65, 64, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [55, 72, 545], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [45, 80, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(6,6, "Namecc", [65, 88, 525], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        // end second formation uphill formation

        // shifty platform


        temp = utils.createFlatLand(6,6, "Amethyst", [65, 88, 505], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        var anim_lift1 = utils.animateBackAndForwardInstanceGroup(temp["group"], scene, 'z', 450, 505, 5000, temp["hitbox"]);
        anim_lift1.forEach(anim => { anim.start()});


        temp = utils.createFlatLand(6,6, "Namecc", [65, 88, 415], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createDescentGround(20, 6, 50, "Rock", [65, 88, 410], scene, "+z")
        temp.forEach(Element => group_1.push(Element));


        temp = utils.createFlatLand(6,6, "Amethyst", [65, 48, 330], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        var anim_lift2 = utils.animateBackAndForwardInstanceGroup(temp["group"], scene, 'z', 250, 330, 7000, temp["hitbox"]);
        anim_lift2.forEach(anim => { anim.start()});




        // main platform number 2


        temp = utils.createFlatLand(30,20, "Moss", [-45, 0, 170], scene)

        {
            temp = utils.create_button(scene , [0,2.5,185], group_1);
        }

        pg2 = utils.create_pg(scene)
    
        pg2[0].__dirtyPosition = true;
        pg2[0].__dirtyRotation = true;
        scene.simulate();
    
    
        pg2[0].position.set(-25, 10, 200);
        pg2[0].rotation.set(0,utils.degrees_to_radians(90),0);
    
        scene.simulate(); //update the new position for physijs

        temp = utils.createPhysicWall("Terracotta",scene,7,19,[-20, 1.6, 170],false)

        temp = utils.createFlatLand(6,6, "Amethyst", [-45, 0, 150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', 45,7000, -45,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', 50,10000, 150,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', -45,7000, 45,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', 150,10000, 50,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());


        temp = utils.createFlatLand(10,6, "Dirt", [-15, 0, 20], scene)

        // block strips

        temp = utils.createFlatLand(2,8, "Dirt", [9, 0, -4], scene)

        temp = utils.createFlatLand(16,2, "Dirt", [-33, 0, -10], scene)

        temp = utils.createFlatLand(2,10, "Dirt", [-33, 0, -36], scene)

        temp = utils.createFlatLand(16,2, "Dirt", [-33, 0, -40], scene)

        // --

        temp = utils.createFlatLand(2,10, "Dirt", [9, 0, -69], scene)

        temp = utils.createFlatLand(16,2, "Dirt", [-33, 0, -75], scene)

        temp = utils.createFlatLand(2,10, "Dirt", [-33, 0, -104], scene)

        temp = utils.createFlatLand(16,2, "Dirt", [-33, 0, -110], scene)


        // --

        temp = utils.createFlatLand(1,10, "Dirt", [12, 0, - 139], scene)

        temp = utils.createFlatLand(6,1, "Dirt", [-3, 0, -142], scene)

        temp = utils.createFlatLand(1,32, "Dirt", [-3, 0, -238], scene)


        // main platform number 3


        temp = utils.createFlatLand(5,5, "Moss", [-9, 0, -252.5], scene)


        // teleport platform

        {
            utils.create_teleport([-3, 11, -246], scene); // emissive light of the teleport
        }


    /* ************************* LIGHT ***********************************/
    {
        utils.create_directionalLight(0xffffff,scene,[0,1,1])
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane([0, -300, 0], [0, 0, 0],  1600, scene, true); //ceil/floor
        utils.create_Box_Plane([0, 300, 0], [0, 0, 0],   1600, scene, true); 
        utils.create_Box_Plane([-1000 / 2, 0, 0], [0, 0, 90], 1600, scene, true); // lateral walls
        utils.create_Box_Plane([1000 / 2, 0, 0], [0, 0, 90],  1600, scene, true);
        utils.create_Box_Plane([0, 0, 1500 / 2], [90, 0, 0],  1600, scene, true); // front and back walls
        utils.create_Box_Plane([0, 0, -800 / 2], [90, 0, 0], 1600, scene, true);
    }


        
        /* ************************* MAiN SPHERE ***********************************/
        sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0,5,600], true); // [0,5,600]
        // set the start position of the camera (will change)
        camera.position.z = sphere.position.z + utils.camera_z_pos;
        // camera.position.y = sphere.position.y + utils.camera_y_pos;
        camera.position.y = sphere.position.y;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        controls = new OrbitControls(camera, canvas);
        controls.update();



        scene.add(camera);

    
    /* ************************* RESETS ******************************/



    //stopSound(sounds.background.sound);

    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 139;
    controls.maxDistance = 140;

    function render() {

        controls.target.set(sphere.position.x,sphere.position.y,sphere.position.z)
        
        

        // compute vector direction from camera to sphere
        var pos_sphere = sphere.position.clone();
        var pos_camera = camera.position.clone();
        var dir = pos_sphere.sub(pos_camera);
        dir.y = 0;
        dir.normalize();



        // some animations need to be called in the render
        utils.animateTeleport(scene);
        if (! utils.level_completed && ! utils.gameOver) utils.check_in_teleport(scene, [sphere.position.x,sphere.position.y,sphere.position.z])

        

        // if game is active, take the commands from the user
        if (! utils.level_completed && ! utils.gameOver){

        // re-build the falling platform

        // if(sphere.isFallen){  //if the ball is dropped
        //     sphere.isFallen = false;

        //     // clean all the platform that are still there

        //     group_fallen_lands = [];
        //     if(!fallen1){
        //         // console.log("rimuovo prima piattaforma")
        //         fallingLand["group"].forEach(Element => scene.remove(Element));
        //         scene.remove(fallingLand["hitbox"]);
        //     }
        //     if(!fallen2){
        //         // console.log("rimuovo seconda piattaforma")
        //         fallingLand2["group"].forEach(Element => scene.remove(Element));
        //         scene.remove(fallingLand2["hitbox"]);
        //     }
        //     if(!fallen3){
        //         // console.log("rimuovo terza piattaforma")
        //         fallingLand3["group"].forEach(Element => scene.remove(Element));
        //         scene.remove(fallingLand3["hitbox"]);
        //     }
        //     if(!fallen4){
        //         // console.log("rimuovo quarta piattaforma")
        //         fallingLand4["group"].forEach(Element => scene.remove(Element));
        //         scene.remove(fallingLand4["hitbox"]);
        //     }


        //      // rebuild platoforms


        //     // ------ 1st

        //     fallingLand = utils.createFlatLand(5,5, "Grass", [-5, 10, -330], scene);
        //     fallen1 = false;

        //     fallingLand.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //     if(other_object.name == "mainSphere" && !fallen1){
        //         fallen1 = true;
        //         utils.animateFallenPlatformGroup(fallingLand.group, scene, undefined, fallingLand.hitbox,sphere);
        //     }
        //     });

        //     fallingLand["group"].forEach(Element => group_fallen_lands.push(Element));
        //     group_fallen_lands.push(fallingLand["hitbox"]);

        //     // ------ 2nd

        //     fallingLand2 = utils.createFlatLand(5,5, "Grass", [-5, 5, -370], scene);
        //     fallen2 = false;

        //     fallingLand2.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //     if(other_object.name == "mainSphere" && !fallen2){
        //         fallen2 = true;
        //         utils.animateFallenPlatformGroup(fallingLand2.group, scene, undefined, fallingLand2.hitbox,sphere);
        //     }
        //     });

        //     fallingLand2["group"].forEach(Element => group_fallen_lands.push(Element));
        //     group_fallen_lands.push(fallingLand2["hitbox"]);


        //     // ------ 3rd

        //     fallingLand3 = utils.createFlatLand(5,5, "Grass", [-5, 0, -410], scene);
        //     fallen3 = false;

        //     fallingLand3.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //     if(other_object.name == "mainSphere" && !fallen3){
        //         fallen3 = true;
        //         utils.animateFallenPlatformGroup(fallingLand3.group, scene, undefined, fallingLand3.hitbox,sphere);
        //         }
        //     });


        //     fallingLand3["group"].forEach(Element => group_fallen_lands.push(Element));
        //     group_fallen_lands.push(fallingLand3["hitbox"]);


        //     // ------ 4th

        //     fallingLand4 = utils.createFlatLand(5,5, "Grass", [-5, -5, -450], scene);
        //     fallen4 = false;

        //     fallingLand4.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //     if(other_object.name == "mainSphere" && !fallen4){
        //         fallen4 = true;
        //         utils.animateFallenPlatformGroup(fallingLand4.group, scene, undefined, fallingLand4.hitbox,sphere);
                
        //         }
        //     });

        //     fallingLand4["group"].forEach(Element => group_fallen_lands.push(Element));
        //     group_fallen_lands.push(fallingLand4["hitbox"]);

        // }


            var VELOCITY_w = 40;
    
            if ( keys.w){  

                var force_vector = dir.clone().multiplyScalar(VELOCITY_w*10);
                sphere.applyCentralImpulse(force_vector);



                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction){

                    sphere_direction.setDirection(dir.clone());
                    sphere_direction.position.x = sphere.position.x;
                    sphere_direction.position.y = sphere.position.y + 5;
                    sphere_direction.position.z = sphere.position.z;
                }
                else{         
                
                    const arrow_pos = new THREE.Vector3( sphere.position.x, sphere.position.y+5, sphere.position.z );
                
                    const length = 20;
                    const hex = 0x00ff00;
                
                    var arrowHelper = new THREE.ArrowHelper(dir.clone(), arrow_pos, length, hex );
                
                    arrowHelper.setLength(7.5,2,2);

                    arrowHelper.name = "sphere_direction";
                    arrowHelper.children[0].scale.z = 100;
                    scene.add( arrowHelper );
                }

            }
            if ( keys.s ){

                var force_vector =  dir.clone().multiplyScalar(-VELOCITY_w*10);
                sphere.applyCentralImpulse(force_vector);

                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction){


                    sphere_direction.setDirection(dir.clone().multiplyScalar(-1));
                    sphere_direction.position.x = sphere.position.x;
                    sphere_direction.position.y = sphere.position.y + 5;
                    sphere_direction.position.z = sphere.position.z;
                }
                else{
                
                    const arrow_pos = new THREE.Vector3( sphere.position.x, sphere.position.y+5, sphere.position.z );
                
                    const length = 20;
                    const hex = 0x00ff00;
                
                    var arrowHelper = new THREE.ArrowHelper( dir.clone().multiplyScalar(-1), arrow_pos, length, hex );
                
                    arrowHelper.setLength(7.5,2,2);

                    arrowHelper.name = "sphere_direction";
                    scene.add( arrowHelper );
                }

            }


            if ( keys.a ){
                var ang_vel = sphere.getAngularVelocity();


                var axis = new THREE.Vector3(0,1,0);
                var angle = utils.degrees_to_radians(90);

                var force_vector =  dir.clone().multiplyScalar(VELOCITY_w*10).applyAxisAngle( axis, angle );


                sphere.applyCentralImpulse(force_vector);

                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction){


                    sphere_direction.setDirection(dir.clone().applyAxisAngle( axis, angle ));
                    sphere_direction.position.x = sphere.position.x;
                    sphere_direction.position.y = sphere.position.y + 5;
                    sphere_direction.position.z = sphere.position.z;
                }
                else{
                
                    const arrow_pos = new THREE.Vector3( sphere.position.x, sphere.position.y+5, sphere.position.z );
                
                    const length = 20;
                    const hex = 0x00ff00;
                
                    var arrowHelper = new THREE.ArrowHelper( dir.clone().applyAxisAngle( axis, angle ), arrow_pos, length, hex );
                
                    arrowHelper.setLength(7.5,2,2);

                    arrowHelper.name = "sphere_direction";
                    scene.add( arrowHelper );
                }


            }
            if ( keys.d ){

                var axis = new THREE.Vector3(0,1,0);
                var angle = utils.degrees_to_radians(-90);

                var force_vector =  dir.clone().multiplyScalar(VELOCITY_w*10).applyAxisAngle( axis, angle );

                sphere.applyCentralImpulse(force_vector);

                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction){

                    sphere_direction.setDirection(dir.clone().applyAxisAngle( axis, angle ));

                    sphere_direction.position.x = sphere.position.x;
                    sphere_direction.position.y = sphere.position.y + 5;
                    sphere_direction.position.z = sphere.position.z;
                }
                else{
                
                    const arrow_pos = new THREE.Vector3( sphere.position.x, sphere.position.y+5, sphere.position.z );
                    dir.normalize();
                
                    const length = 20;
                    const hex = 0x00ff00;
                
                    var arrowHelper = new THREE.ArrowHelper( dir.clone().applyAxisAngle( axis, angle ), arrow_pos, length, hex );
                
                    arrowHelper.setLength(7.5,2,2);

                    arrowHelper.name = "sphere_direction";
                    scene.add( arrowHelper );
                }

            }

            if ( keys.space ){

                if(sphere.canJump){
                    sphere.canJump = false;
                    var force_vector = new THREE.Vector3( 0,VELOCITY_w*500,0)
                    sphere.applyCentralImpulse(force_vector)
                   
                }

            }

            // remove arrow if no input has been detected
            if(!(keys.w | keys.s | keys.d | keys.a | keys.space)){
                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction) scene.remove(sphere_direction);



            }

            // increase gravity effect simulation
            sphere.applyCentralImpulse(new THREE.Vector3( 0,-VELOCITY_w*5,0))


            // reduce max height reachable while jumping
            if(sphere.getLinearVelocity().y >= 30){
                sphere.setLinearVelocity(new THREE.Vector3(sphere.getLinearVelocity().x, 30 ,sphere.getLinearVelocity().z))
            }
        }



        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }


        TWEEN.update();
        scene.simulate();
        
        controls.update();

        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }

    render();
}

initializate_page();