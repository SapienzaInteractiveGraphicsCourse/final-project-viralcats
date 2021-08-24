
Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = '../libs/ammo.js';
import * as utils from '../utils.js';
import { OrbitControls } from '../libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from '../libs/tween.esm.js';
import * as THREE_AUDIO from '../libs/threejs/build/three.module.js';
import * as level_1 from './levels/level_01.js';
import * as level_2 from './levels/level_02.js';
import * as settings from './settings.js';
import { curr_level } from './utils.js';

var controls;
var scene;
var sphere;

var keys;

var start_x_pos;
var start_z_pos;

var listener;
var curr_sounds = new Map([]);

var max_num_of_levels = 2;

const canvas = document.querySelector('#c');


var fov = 20;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 10000;


// Loading assets
var areSoundsLoaded = false;

const sounds = {
	background  :  { url: './asserts/sounds/background.wav' },
	ambient     :  { url: './asserts/sounds/ambient.flac' },
	adventure   :  { url: './asserts/sounds/adventure.wav' },
    jump        :  { url: './asserts/sounds/jump.wav' },
    level_1     :  { url: './asserts/sounds/level_1.wav' }
}

function game_over(){
    playSound(sounds.background.sound,true);
    window.location.href = window.location.href + "game_over.html"
}

function game_win(){
    playSound(sounds.background.sound,true);
    window.location.href = window.location.href + "game_win.html"
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

function playSound(sound,loop = false){

    var volume = settings.current_volume;

    if(volume == -1)
        volume = 100;

    var sound_to_play = new THREE_AUDIO.Audio(listener);
    sound_to_play.isPlaying = false;
    sound_to_play.setBuffer( sound );
	sound_to_play.setLoop( loop );
	sound_to_play.setVolume( volume/100 );
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

function toggle_html_element_visibility(who){
    var catdiv = document.getElementById(who);
    if(catdiv.style.display == ""){  
        catdiv.style.display = "none";  
    } else {  
        catdiv.style.display = "";  
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






    document.getElementById("curr_life").innerText = (document.getElementById("curr_life_info").innerText);
    document.getElementById("curr_zombie").innerText = (document.getElementById("curr_zombie_info").innerText);
    
    document.getElementById("game_start").onclick = function(event) {
        
    
        console.log( "VALUE: " + (document.getElementById("curr_life_info").innerText))

        document.getElementById("curr_life").innerText = (document.getElementById("curr_life_info").innerText);
        document.getElementById("curr_zombie").innerText = (document.getElementById("curr_zombie_info").innerText);
        
    
        document.getElementById("grid_container").style = ("");
        canvas.setAttribute("hidden", true);
        // document.getElementById('intro_page').classList.add("invisible");
        document.getElementById('intro_page').remove();
        document.getElementById('life_counter').removeAttribute("hidden");
        canvas.removeAttribute("hidden");
        // toggle_html_element_visibility("game_over");
        // toggle_html_element_visibility("grid_container");
        
        utils.setLife(document.getElementById("curr_life").innerText);
        main();
    };
    
}




loadSounds();


function getNextLevel(curr_level){
    if(curr_level == 0){
        return level_1.level_1;
    }
    if(curr_level == 1){
        stopSound(sounds.background.sound);
        playSound(sounds.level_1.sound,true);
        return level_2.level_2;
    }
}



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var left_end    = false;
var right_end   = false;

var left_leg_end    = false;
var right_leg_end   = false;

function move_arms(who){

    var start_rotate_pos = 0;

    var time = 15;

    it_arm_1 = setInterval(() => {
        who[3].__dirtyPosition = true;
        who[3].__dirtyRotation = true;
        utils.rotateArmsLegs(who[3],1);

        scene.simulate();
        if(who[3].rotation.x >= start_rotate_pos + 1){
            clearInterval(it_arm_1);
            it_arm_2 = setInterval(() => {
                who[3].__dirtyPosition = true;
                who[3].__dirtyRotation = true;
                utils.rotateArmsLegs(who[3],-1);
        
                scene.simulate();
                if(who[3].rotation.x <= start_rotate_pos - 1){
                    clearInterval(it_arm_2);
                    right_end = true;
                    if(left_end && right_end){
                        left_end = false;
                        right_end = false;
                        clearInterval(it_arm_1);
                        clearInterval(it_arm_2);
                        clearInterval(it_arm_3);
                        clearInterval(it_arm_4);
                        move_arms(who);
                    }
                }
        
            }, 10);
        }

    }, 10);


    it_arm_3 = setInterval(() => {
        who[4].__dirtyPosition = true;
        who[4].__dirtyRotation = true;
        utils.rotateArmsLegs(who[4],-1);

        scene.simulate();
        if(who[4].rotation.x <= start_rotate_pos - 1){
            clearInterval(it_arm_3);
            it_arm_4 = setInterval(() => {
                who[4].__dirtyPosition = true;
                who[4].__dirtyRotation = true;
                utils.rotateArmsLegs(who[4],1);
        
                scene.simulate();
                if(who[4].rotation.x >= start_rotate_pos + 1){
                    clearInterval(it_arm_4);
                    left_end = true;
                    if(left_end && right_end){
                        left_end = false;
                        right_end = false;
                        clearInterval(it_arm_1);
                        clearInterval(it_arm_2);
                        clearInterval(it_arm_3);
                        clearInterval(it_arm_4);
                        move_arms(who);
                    }
                }
        
            }, 10);
        }

    }, 10);



    if(left_end && right_end){
        left_end = false;
        right_end = false;
        clearInterval(it_arm_1);
        clearInterval(it_arm_2);
        clearInterval(it_arm_3);
        clearInterval(it_arm_4);
        move_arms(who);
    }



}


function move_legs(who){

    var start_rotate_pos = 0;

    var time = 15;

    it_leg_1 = setInterval(() => {
        who[6].__dirtyPosition = true;
        who[6].__dirtyRotation = true;
        utils.rotateArmsLegs(who[6],1);

        scene.simulate();
        if(who[6].rotation.x >= start_rotate_pos + 1){
            clearInterval(it_leg_1);
            it_leg_2 = setInterval(() => {
                who[6].__dirtyPosition = true;
                who[6].__dirtyRotation = true;
                utils.rotateArmsLegs(who[6],-1);
        
                scene.simulate();
                if(who[6].rotation.x <= start_rotate_pos - 1){
                    clearInterval(it_leg_2);
                    right_leg_end = true;
                    if(left_leg_end && right_leg_end){
                        left_leg_end = false;
                        right_leg_end = false;
                        clearInterval(it_leg_1);
                        clearInterval(it_leg_2);
                        clearInterval(it_leg_3);
                        clearInterval(it_leg_4);
                        //move_legs(who);
                    }
                }
        
            }, 10);
        }

    }, 10);


    it_leg_3 = setInterval(() => {
        who[5].__dirtyPosition = true;
        who[5].__dirtyRotation = true;
        utils.rotateArmsLegs(who[5],-1);

        scene.simulate();
        if(who[5].rotation.x <= start_rotate_pos - 1){
            clearInterval(it_leg_3);
            it_leg_4 = setInterval(() => {
                who[5].__dirtyPosition = true;
                who[5].__dirtyRotation = true;
                utils.rotateArmsLegs(who[5],1);
        
                scene.simulate();
                if(who[5].rotation.x >= start_rotate_pos + 1){
                    clearInterval(it_leg_4);
                    left_leg_end = true;
                    if(left_leg_end && right_leg_end){
                        left_leg_end = false;
                        right_leg_end = false;
                        clearInterval(it_leg_1);
                        clearInterval(it_leg_2);
                        clearInterval(it_leg_3);
                        clearInterval(it_leg_4);
                        //move_legs(who);
                    }
                }
        
            }, 10);
        }

    }, 10);



    if(left_leg_end && right_leg_end){
        left_leg_end = false;
        right_leg_end = false;
        clearInterval(it_leg_1);
        clearInterval(it_leg_2);
        clearInterval(it_leg_3);
        clearInterval(it_leg_4);
        move_legs(who);
    }



}


var it_move_1;
var it_move_2;
var it_move_3;
var it_move_4;

var it_leg_1;
var it_leg_2;
var it_leg_3;
var it_leg_4;

var it_arm_1;
var it_arm_2;
var it_arm_3;
var it_arm_4;

var walk_end = false;


var step = 0;
var step_arms = 0;
function walk_around(who){
    var start_rotate_pos = 0;

    switch(step_arms){

        case 0:
            who[3].__dirtyPosition = true;
            who[3].__dirtyRotation = true;
            utils.rotateArmsLegs(who[3],    -   4);
            utils.rotateArmsLegs(who[4],        4);
            utils.rotateArmsLegs(who[5],    -   4);
            utils.rotateArmsLegs(who[6],        4);
            

            if(who[3].rotation.x <= start_rotate_pos - 1)
                step_arms++;

        break;

        case 1:
            who[3].__dirtyPosition = true;
            who[3].__dirtyRotation = true;
            utils.rotateArmsLegs(who[3],        4);
            utils.rotateArmsLegs(who[4],    -   4);
            utils.rotateArmsLegs(who[5],        4);
            utils.rotateArmsLegs(who[6],    -   4);
            if(who[3].rotation.x >= start_rotate_pos + 1)
                step_arms = 0;

        break;

    }


    switch(step){
        case 0:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateZ(0.1);
    
            scene.simulate();
    
            // who[0].__dirtyPosition = false;
            // who[0].__dirtyRotation = false;
            
            if(who[0].position.z >= start_z_pos + 15){
                step = 1;
            }
        break;
        case 1:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateX(-0.1);
    
            scene.simulate();
    
            // who[0].__dirtyPosition = false;
            // who[0].__dirtyRotation = false;
            if(who[0].position.x < start_x_pos - 8){
                step = 2;
            }
        break;
        case 2:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateZ(-0.1);

            scene.simulate();

            // who[0].__dirtyPosition = false;
            // who[0].__dirtyRotation = false;
            if(who[0].position.z <= start_z_pos){
                step = 3;
            }
        break;
        case 3:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateX(0.1);

            scene.simulate();

            // who[0].__dirtyPosition = false;
            // who[0].__dirtyRotation = false;
            if(who[0].position.x >= start_x_pos){
                step = 0;
            }
        break;
    }
}

function main() {
    
    fov     = parseInt(settings.current_fov);
    far     = parseInt(settings.current_far);
    near    = parseInt(settings.current_near);

    if(near == 0)
        near = 0.1;

    console.log("fov: " + fov);
    console.log("far: " + far);
    console.log("near: " + near);





    var renderer = new THREE.WebGLRenderer({ canvas });

    scene = new Physijs.Scene(); // create Physijs scene

    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

	listener = new THREE_AUDIO.AudioListener();

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


    //level_0();
    playSound(sounds.background.sound,true);
    var level = utils.curr_level;
    utils.changeLevel(scene,getNextLevel(level));
    document.getElementById("curr_level_info").innerText = level;
    sphere = level_1.getSphere();


    /* ****************************** PG ***********************************/
    {       
        camera.position.z = sphere.position.z + utils.camera_z_pos;
        camera.position.y = sphere.position.y;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        controls = new OrbitControls(camera, canvas);
        controls.update();



        scene.add(camera);       
    }





    walk_end = true;
    var counter = 0;

    if(utils.curr_level == 1){
        start_x_pos = level_2.list_of_pgs[0][0].position.x;
        start_z_pos = level_2.list_of_pgs[0][0].position.z;
    }


    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 139;
    controls.maxDistance = 140;

    function render() {


        controls.target.set(sphere.position.x,sphere.position.y,sphere.position.z)
        
        
        var pos_sphere = sphere.position.clone();
        var pos_camera = camera.position.clone();
        var dir = pos_sphere.sub(pos_camera);
        dir.y = 0;
        dir.normalize();

        utils.animateTeleport(scene);
        if (! utils.level_completed && ! utils.gameOver){
            utils.check_in_teleport(scene, [sphere.position.x,sphere.position.y,sphere.position.z])
        } 

        if(utils.level_completed){
            utils.toggle_level_completed();
            var level = utils.curr_level;
            if(utils.curr_level <= max_num_of_levels){
                utils.changeLevel(scene,getNextLevel(level));
                document.getElementById("curr_level_info").innerText = level;
                if(level == 0){
                    sphere = level_1.getSphere();
                }
                if(level == 1){
                    sphere = level_2.getSphere();

                    start_x_pos = level_2.list_of_pgs[0][0].position.x;
                    start_z_pos = level_2.list_of_pgs[0][0].position.z;

                }
                scene.simulate();
            }
        }

        if(utils.gameOver){
            game_over();
        }

        if(utils.curr_level > max_num_of_levels){
            game_win();
        }

        if(utils.curr_level == 1){
            counter++;
            if(counter % 2 == 0)
                walk_around(level_2.list_of_pgs[0]);
        }

        

        if (! utils.level_completed && ! utils.gameOver){

            if(sphere.isFallen){  //if the ball is dropped
                sphere.isFallen = false;
                if(utils.curr_level == 0){
                    level_1.cleanAndRebuildPlatforms(scene);
                }

            }


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
                    playSound(sounds.jump.sound);
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