
Physijs.scripts.worker = './libs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
import * as utils from './utils.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from './libs/tween.esm.js';
import * as THREE_AUDIO from './libs/threejs/build/three.module.js';
import * as level_1 from './levels/level_01.js';
import * as level_2 from './levels/level_02.js';
import * as level_3 from './levels/level_03.js';
import * as settings from './settings.js';

var controls;
var scene;
var sphere;
var load_new_level = true;

var keys;

var loading = false;
var percent = 0;
var wait_and_toggle_level = false;

var start_x_pos;
var start_z_pos;
var start_y_pos;

var listener;
var curr_sounds = new Map([]);

var max_num_of_levels = 2;

var start_walk_level_0 = false;

const canvas = document.querySelector('#c');


var key_down_evt;
var key_up_evt;

var fov = 20;
var aspect = 2;  // the canvas default
var near = 0.1;
var far = 10000;

var walk_level_1;
var jump_level_1;
var walk_level_2;
var jump_level_2;


var jump_level_3_1;
var jump_level_3_2;
// Loading assets
var areSoundsLoaded = false;

const sounds = {
	background  :  { url: './asserts/sounds/background.wav' },
	ambient     :  { url: './asserts/sounds/ambient.flac' },
	adventure   :  { url: './asserts/sounds/adventure.wav' },
    jump        :  { url: './asserts/sounds/jump.wav' },
    level_2     :  { url: './asserts/sounds/level_2.wav' },
    level_3     :  { url: './asserts/sounds/level_3.wav' }
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

function playJumpSound(sound,loop = false){
    
    const iterator = curr_sounds[Symbol.iterator]();
    if(curr_sounds.has(sound)){
        for (const item of iterator){
            if(item[0] == sound){
                if(item[1].isPlaying)
                    return;
            }
        }
    }
    
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

function startTimer(duration, bar) {
    duration = duration*10;
    document.getElementById("loading-levels-bar").style = ("width:0%;");
    percent = 0;
    var timer_loading = setInterval(function () {
        percent = percent + 1;
        document.getElementById("loading-levels-bar").style = ("width:" + parseInt(percent) + '%;');
        document.getElementById("loading-levels-bar").innerText = (parseInt(percent) + '%');
        if (--duration < 0) {
            $('#loadingModal').modal('hide');
            document.getElementById("loading-levels-bar").style = ("width:0%;");
            clearInterval(timer_loading);
            wait_and_toggle_level = false;
            utils.toggle_level_completed();
        }
    }, 100);
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
        document.getElementById('intro_page').remove();
        document.getElementById('life_counter').removeAttribute("hidden");
        canvas.removeAttribute("hidden");
       
        utils.setLife(document.getElementById("curr_life").innerText);
        main();

    };

    settings.setFunctionForJumpLevel(function(curr_lev){
        console.log( "VALUE: " + (document.getElementById("curr_life_info").innerText))

        document.getElementById("curr_life").innerText = (document.getElementById("curr_life_info").innerText);
        document.getElementById("curr_zombie").innerText = (document.getElementById("curr_zombie_info").innerText);
        
    
        document.getElementById("grid_container").style = ("");
        canvas.setAttribute("hidden", true);
        document.getElementById('intro_page').remove();
        document.getElementById('life_counter').removeAttribute("hidden");
        canvas.removeAttribute("hidden");
        
        utils.setLife(document.getElementById("curr_life").innerText);
        utils.setCurrentLevel(curr_lev);
        if(curr_lev == 0){
            sphere = level_1.getSphere();
        }
        if(curr_lev == 1){
            sphere = level_2.getSphere();
        }
        if(curr_lev == 2){
            sphere = level_3.getSphere();
        }
        
        main();
    });
    
}




loadSounds();


function getNextLevel(curr_level){
    if(curr_level == 0){
        playSound(sounds.background.sound,true);
        return level_1.level_1;
    }
    if(curr_level == 1){
        stopSound(sounds.background.sound);
        playSound(sounds.level_2.sound,true);
        return level_2.level_2;
    } 
    if(curr_level == 2){
        stopSound(sounds.level_2.sound);
        playSound(sounds.level_3.sound,true);
        return level_3.level_3;
    }
}



function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var step = 0;
var step_jump = 0;
var step_arms = 0;
var step_arms_jump = 2;

function walk_around(who, scene, rotate,forward_move_max_value){
    var start_rotate_pos = 0;
    var z_value = 0.35;
    var forward_move_max = forward_move_max_value;
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
            who[0].translateZ(z_value);
    
            scene.simulate();

            if(rotate == true){
                if(who[0].position.x >= start_x_pos + forward_move_max){
                    step = 1;
                }
            }else{
                if(who[0].position.z >= start_z_pos + forward_move_max){
                    step = 1;
                }
            }

        break;
        case 1:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateZ(z_value);
           
    
            scene.simulate();
    
            if(rotate == true){
                who[0].rotation.set(0,utils.degrees_to_radians(-180),0);
                if(who[0].position.z <= start_z_pos - 8){
                    step = 2;
                }
            }else{
                
                who[0].rotation.set(0,utils.degrees_to_radians(-90),0);
                if(who[0].position.x < start_x_pos - 8){
                    step = 2;
                }
            }
        break;
        case 2:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateZ(z_value);
            

            scene.simulate();

            if(rotate == true){
                who[0].rotation.set(0,utils.degrees_to_radians(-90),0);
                if(who[0].position.x <= start_x_pos){
                    step = 3;
                }
            }else{
                who[0].rotation.set(0,utils.degrees_to_radians(-180),0);
                if(who[0].position.z <= start_z_pos){
                    step = 3;
                }
            }
        break;
        case 3:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            who[0].translateZ(z_value);
            
            

            scene.simulate();

            if(rotate == true){
                who[0].rotation.set(0,utils.degrees_to_radians(-0),0);
                if(who[0].position.z >= start_z_pos){
                    step = 0;
                    who[0].rotation.set(0,utils.degrees_to_radians(90),0);
                }
            }else{
                who[0].rotation.set(0,utils.degrees_to_radians(-270),0);
                if(who[0].position.x >= start_x_pos){
                    step = 0;
                    who[0].rotation.set(0,utils.degrees_to_radians(-360),0);
                }
            }
        break;
    }
}

var time_counter = 0;
function jump(who, scene, rotate,forward_move_max_value, time_stop,who2 = undefined){
    var start_rotate_pos = 0;
    var z_value = 0.35;
    var forward_move_max = forward_move_max_value;

    switch(step_arms_jump){

        case 0:

            if(who2 != undefined){
                who2[4].__dirtyRotation = true;
                who2[3].__dirtyRotation = true;
                utils.rotateArmsLegs(who2[3],    -   18);
                utils.rotateArmsLegs(who2[4],    -   18);
            }

            who[3].__dirtyPosition = true;
            who[4].__dirtyPosition = true;
            
            utils.rotateArmsLegs(who[3],    -   18);
            utils.rotateArmsLegs(who[4],    -   18);

            if(who[3].rotation.x <= start_rotate_pos - 1)
                step_arms_jump++;

            break;

        case 1:
            who[3].__dirtyPosition = true;
            who[4].__dirtyPosition = true;

            if(who2 != undefined){
                who2[3].__dirtyRotation = true;
                who2[4].__dirtyRotation = true;
                utils.rotateArmsLegs(who2[3],       18);
                utils.rotateArmsLegs(who2[4],       18);
            }
            utils.rotateArmsLegs(who[3],        18);
            utils.rotateArmsLegs(who[4],        18);

            if(who[3].rotation.x >= start_rotate_pos)
                step_arms_jump = 2;

            break;
        case 2:
            break;

    }


    switch(step_jump){
        case 0:
            step_arms_jump = 0;
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            if(who2 != undefined){
                who2[0].__dirtyPosition = true;
                who2[0].__dirtyRotation = true;
                who2[0].translateY(z_value);
            }
            who[0].translateY(z_value);
    
            scene.simulate();
                 
             if(who[0].position.y >= parseInt(start_y_pos + forward_move_max)){
                step_jump = 1;
            }
        

        break;
        case 1:
            who[0].__dirtyPosition = true;
            who[0].__dirtyRotation = true;
            

            if(who[0].position.y <= parseInt(start_y_pos)){
                step_jump = 2;
            }
        break;
        case 2:

            time_counter++
            if(time_counter > time_stop*2){
                time_counter = 0;
                step_jump = 0;
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

    key_down_evt = document.body.addEventListener('keydown', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if(keys[key] !== undefined)
            keys[key] = true;
    });


    key_up_evt = document.body.addEventListener('keyup', function(e) {
        var key = e.code.replace('Key', '').toLowerCase();
        if (keys[key] !== undefined ){
            keys[key] = false;
        }
    });


    if(utils.curr_level == 0){
        // playSound(sounds.background.sound,true);
        var level = utils.curr_level;
        utils.changeLevel(scene,getNextLevel(level));
        $('#loadingModal').modal({backdrop: 'static', keyboard: false});
        var seconds = 10,
        bar = document.querySelector('#loadingModal');
        startTimer(seconds, bar);
        document.getElementById("curr_level_info").innerText = level;
        sphere = level_1.getSphere();
        step_arms_jump = 2;
        utils.setPgToDelete(true);
        // camera.position.z = sphere.position.z + 150;
        
    }
    if(utils.curr_level == 1){
        // playSound(sounds.level_2.sound,true);
        var level = utils.curr_level;
        utils.changeLevel(scene,getNextLevel(level));
        $('#loadingModal').modal({backdrop: 'static', keyboard: false});
        var seconds = 10,
        bar = document.querySelector('#loadingModal');
        startTimer(seconds, bar);
        document.getElementById("curr_level_info").innerText = level;
        sphere = level_2.getSphere();
        step_arms_jump = 2;
        utils.setPgToDelete(true);
        // camera.position.z = sphere.position.z + 150;
    }
    if(utils.curr_level == 2){
        // playSound(sounds.level_3.sound,true);
        var level = utils.curr_level;
        utils.changeLevel(scene,getNextLevel(level));
        $('#loadingModal').modal({backdrop: 'static', keyboard: false});
        var seconds = 10,
        bar = document.querySelector('#loadingModal');
        startTimer(seconds, bar);
        document.getElementById("curr_level_info").innerText = level;
        sphere = level_3.getSphere();
        step_arms_jump = 2;
        utils.setPgToDelete(true);
        // camera.position.z = sphere.position.z + 150;
    }


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





    var counter = 0;


    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 139;
    controls.maxDistance = 140;


        



    if(utils.curr_level == 0){
        if(utils.curr_level == 0){
            setTimeout(() => {
                start_walk_level_0 = true;
            }, 6000);
        }
    
        start_x_pos = level_1.pg[0].position.x;
        start_z_pos = level_1.pg[0].position.z;
        start_y_pos = level_1.pg2[0].position.y;
    }

    if(utils.curr_level == 1){
    
        start_x_pos = level_2.pg2[0].position.x;
        start_z_pos = level_2.pg2[0].position.z;
        start_y_pos = level_2.pg[0].position.y;
    }

    if(utils.curr_level == 2){

        start_x_pos = level_3.pg[0].position.x;
        start_z_pos = level_3.pg[0].position.z;
        start_y_pos = level_3.pg[0].position.y;
    }

    renderer.shadowMapEnabled = true;

    function render() {

        if(load_new_level){
            //reset the camera position behind the ball
            camera.position.z = sphere.position.z + 150;
            load_new_level = false;
        }

        controls.target.set(sphere.position.x,sphere.position.y,sphere.position.z);
        
        
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
            // controls.object.position.z = sphere.position.z + 200;
            camera.position.z = sphere.position.z + 150;
        }

        var isShown = $('#loadingModal').hasClass('show');

        if(isShown == true){
            loading = true;
        }else{
            loading = false;
        }


        if(utils.level_completed & !wait_and_toggle_level){
            utils.toggle_level_completed();

            wait_and_toggle_level = true;
            load_new_level = true;

            var level = utils.curr_level;
            if(utils.curr_level <= max_num_of_levels){
                utils.changeLevel(scene,getNextLevel(level));
                document.getElementById("curr_level_info").innerText = level;
                if(level == 0){
                    utils.setStartAnimation(false);
                    sphere = level_1.getSphere();
                    $('#loadingModal').modal({backdrop: 'static', keyboard: false});
                    var seconds = 10,
                    bar = document.querySelector('#loadingModal');
                    startTimer(seconds, bar);
                    start_x_pos = level_1.pg[0].position.x;
                    start_z_pos = level_1.pg[0].position.z;
                    start_y_pos = level_1.pg[0].position.y;

                    camera.position.z = sphere.position.z + 150;
                    step_arms_jump = 2;
                    utils.setPgToDelete(true);
                    // start_x_pos = level_1.pg.position.x;
                    // start_z_pos = level_1.pg.position.z;

                    // camera.position.z = sphere.position.z + utils.camera_z_pos;
                    // camera.position.y = sphere.position.y;
                    // camera.position.x = sphere.position.x;
                    // camera.lookAt(sphere.position);
                }
                if(level == 1){
                    utils.setStartAnimation(false);
                    clearInterval(walk_level_1);
                    clearInterval(jump_level_1);
                    sphere = level_2.getSphere();
                    $('#loadingModal').modal({backdrop: 'static', keyboard: false});
                    var seconds = 10,
                    bar = document.querySelector('#loadingModal');
                    startTimer(seconds, bar);

                    start_x_pos = level_2.pg2[0].position.x;
                    start_z_pos = level_2.pg2[0].position.z;
                    start_y_pos = level_2.pg[0].position.y;

                    camera.position.z = sphere.position.z + 150;
                    step_arms_jump = 2;
                    utils.setPgToDelete(true);
                    // camera.position.z = sphere.position.z + utils.camera_z_pos;
                    // camera.position.y = sphere.position.y;
                    // camera.position.x = sphere.position.x;
                    // camera.lookAt(sphere.position);

                }
                if(level == 2){
                    utils.setStartAnimation(false);
                    $('#loadingModal').modal({backdrop: 'static', keyboard: false});
                    var seconds = 10,
                    bar = document.querySelector('#loadingModal');
                    clearInterval(walk_level_2);
                    clearInterval(jump_level_2);
                    sphere = level_3.getSphere();
                    startTimer(seconds, bar);
                    camera.position.z = sphere.position.z + 150;
                    start_y_pos = level_3.pg[0].position.y;
                    step_arms_jump = 2;
                    utils.setPgToDelete(true);
                    // camera.position.z = sphere.position.z + utils.camera_z_pos;
                    // camera.position.y = sphere.position.y;
                    // camera.position.x = sphere.position.x;
                    // camera.lookAt(sphere.position);

                    // start_x_pos = level_3.list_of_pgs[0][0].position.x;
                    // start_z_pos = level_3.list_of_pgs[0][0].position.z;

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
            if(counter % 2 == 0){
                
            }
        }

        if(utils.curr_level == 0 && !utils.start_animation && start_walk_level_0){
            utils.setStartAnimation(true);
            step = 0;
            step_arms = 0;
            walk_level_1 = setInterval(function(){
                walk_around(level_1.pg,scene, false, 10);
            },50);

            jump_level_1 = setInterval(function(){
                jump(level_1.pg2,scene, false, 1.5, 100);
            },50);
        }

        if(utils.curr_level == 1 && !utils.start_animation){
            utils.setStartAnimation(true);
            step = 0;
            step_arms = 0;
            walk_level_2 = setInterval(function(){
                walk_around(level_2.pg2,scene, true, 65);
            },50);

            jump_level_2 = setInterval(function(){
                jump(level_2.pg,scene, false, -11, 100);
            },50);
        }

        if(utils.curr_level == 2 && !utils.start_animation){
            utils.setStartAnimation(true);
            step = 0;
            step_arms = 0;
            jump_level_3_1 = setInterval(function(){
                jump(level_3.pg2,scene, false, 0.75, 25, level_3.pg);
            },50);
        }


        //clear animations

        if(utils.hitboxes_hit[1] == true) {
            clearInterval(walk_level_1);
            console.log("hitbox number 2");
            utils.hitboxes_hit[1] =  false;
        }
        else if (utils.hitboxes_hit[0] == true){
            clearInterval(jump_level_1);
            console.log("hitbox number 1");
            utils.hitboxes_hit[0] = false;
        }

        // check the correct hitbox number of the pgs in level files 
        else if (utils.hitboxes_hit[2] == true) {
            console.log("hitbox number 3");
            clearInterval(jump_level_2);
            utils.hitboxes_hit[2] = false;
        }
        else if (utils.hitboxes_hit[3] == true) {
            console.log("hitbox number 4");
            clearInterval(walk_level_2);
            utils.hitboxes_hit[3] = false;
        }
        else if (utils.hitboxes_hit[4] == true) {
            console.log("hitbox number 5");
            clearInterval(jump_level_3_1);
            utils.hitboxes_hit[4] = false;
        }
        else if (utils.hitboxes_hit[5] == true) {
            console.log("hitbox number 6");
            clearInterval(jump_level_3_1);
            utils.hitboxes_hit[5] = false;
        }



        

        if (! utils.level_completed && ! utils.gameOver){

            if(sphere.isFallen){  //if the ball is dropped
                camera.position.z = sphere.position.z + 150;

                sphere.isFallen = false;
                if(utils.curr_level == 0){
                    level_1.cleanAndRebuildPlatforms(scene);
                }
                if(utils.curr_level == 1){
                    level_2.cleanAndRebuildPlatforms(scene);
                }
            }


            var VELOCITY_w = 40;
    
            if ( keys.w && !loading){  

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
            if ( keys.s && !loading){

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


            if ( keys.a && !loading){
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
            if ( keys.d && !loading){

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

            if ( keys.space && !loading){

                if(sphere.canJump){
                    // console.log("canJump")
                    // stopSound(sounds.jump.sound);
                    sphere.canJump = false;
                    var force_vector = new THREE.Vector3( 0,VELOCITY_w*500,0)
                    sphere.applyCentralImpulse(force_vector)
                    playJumpSound(sounds.jump.sound);
                }

            }

            // remove arrow if no input has been detected
            if(!(keys.w | keys.s | keys.d | keys.a | keys.space && !loading)){
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
        scene.simulate();
        TWEEN.update();
        // scene.simulate();
        
        controls.update();

        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}



initializate_page();