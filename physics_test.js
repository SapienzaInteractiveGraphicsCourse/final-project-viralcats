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
var pg;
var sphere;

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
    // _1ssssssbackground  :  { url: './asserts/sounds/background.wav' },
	// _1ssssssambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1ssssssadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaaaaaabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaaaaaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaaaaaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _10background  :  { url: './asserts/sounds/background.wav' },
	// _10ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _10adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _19background  :  { url: './asserts/sounds/background.wav' },
	// _19ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _19adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _18background  :  { url: './asserts/sounds/background.wav' },
	// _18ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _18adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _17background  :  { url: './asserts/sounds/background.wav' },
	// _17ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _17adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _16background  :  { url: './asserts/sounds/background.wav' },
	// _16ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _16adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _15background  :  { url: './asserts/sounds/background.wav' },
	// _15ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _15adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _14background  :  { url: './asserts/sounds/background.wav' },
	// _14ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _14adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _13background  :  { url: './asserts/sounds/background.wav' },
	// _13ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _13adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _12background  :  { url: './asserts/sounds/background.wav' },
	// _12ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _12adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1sss44sssbackground  :  { url: './asserts/sounds/background.wav' },
	// _1sss44sssambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1sss44sssadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44background  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44ambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44adventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44aaaabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44aaaaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44aaaaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aab44ackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44mbient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44dventure   :  { url: './asserts/sounds/adventure.wav' },
    // _10ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _10am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _10ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _19ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _19am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _19ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _18ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _18am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _18ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _17ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _17am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _17ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _16ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _16am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _16ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _15ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _15am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _15ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _14ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _14am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _14ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _13ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _13am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _13ad44venture   :  { url: './asserts/sounds/adventure.wav' },
    // _12ba44ckground  :  { url: './asserts/sounds/background.wav' },
	// _12am44bient     :  { url: './asserts/sounds/ambient.flac' },
	// _12ad44venture   :  { url: './asserts/sounds/adventure.wav' },

    // _1ssssskkkkkkbackground  :  { url: './asserts/sounds/background.wav' },
	// _1ssssskkkkkkambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1ssssskkkkkkadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaabakkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaamkkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaadkkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaaaakkkkkkabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaaakkkkkkaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaaakkkkkkaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aabackkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _1aaambkkkkkkent     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaadvkkkkkknture   :  { url: './asserts/sounds/adventure.wav' },
    // _10backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _10ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _10advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _19backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _19ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _19advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _18backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _18ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _18advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _17backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _17ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _17advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _16backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _16ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _16advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _15backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _15ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _15advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _14backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _14ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _14advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _13backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _13ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _13advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _12backkkkkkkround  :  { url: './asserts/sounds/background.wav' },
	// _12ambikkkkkknt     :  { url: './asserts/sounds/ambient.flac' },
	// _12advekkkkkkture   :  { url: './asserts/sounds/adventure.wav' },
    // _1sss44kkkkkkssbackground  :  { url: './asserts/sounds/background.wav' },
	// _1sss44kkkkkkssambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1sss44kkkkkkssadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44kkkkkkackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44kkkkkkmbient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44kkkkkkdventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44kkkkkkaaabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44kkkkkkaaaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44kkkkkkaaaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aab44kkkkkkckground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44kkkkkkbient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44kkkkkkventure   :  { url: './asserts/sounds/adventure.wav' },
    // _10ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _10am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _10ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _19ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _19am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _19ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _18ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _18am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _18ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _17ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _17am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _17ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _16ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _16am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _16ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _15ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _15am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _15ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _14ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _14am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _14ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _13ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _13am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _13ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },
    // _12ba44kkkkkkkground  :  { url: './asserts/sounds/background.wav' },
	// _12am44kkkkkkient     :  { url: './asserts/sounds/ambient.flac' },
	// _12ad44kkkkkkenture   :  { url: './asserts/sounds/adventure.wav' },

    // _1ssssshtrshthtrhtrbackground  :  { url: './asserts/sounds/background.wav' },
	// _1ssssshtrshthtrhtrambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1ssssshtrshthtrhtradventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaabahtrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaamhtrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaadhtrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaaaahtrshthtrhtrabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaaaahtrshthtrhtraambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaaaahtrshthtrhtraadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aabachtrshthtrhtrground  :  { url: './asserts/sounds/background.wav' },
	// _1aaambhtrshthtrhtrent     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaadvhtrshthtrhtrnture   :  { url: './asserts/sounds/adventure.wav' },
    // _10backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _10ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _10advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _19backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _19ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _19advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _18backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _18ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _18advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _17backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _17ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _17advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _16backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _16ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _16advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _15backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _15ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _15advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _14backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _14ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _14advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _13backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _13ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _13advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _12backhtrshthtrhtrround  :  { url: './asserts/sounds/background.wav' },
	// _12ambihtrshthtrhtrnt     :  { url: './asserts/sounds/ambient.flac' },
	// _12advehtrshthtrhtrture   :  { url: './asserts/sounds/adventure.wav' },
    // _1sss44htrshthtrhtrssbackground  :  { url: './asserts/sounds/background.wav' },
	// _1sss44htrshthtrhtrssambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1sss44htrshthtrhtrssadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44htrshthtrhtrackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44htrshthtrhtrmbient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44htrshthtrhtrdventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aaa44htrshthtrhtraaabackground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44htrshthtrhtraaaambient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44htrshthtrhtraaaadventure   :  { url: './asserts/sounds/adventure.wav' },
    // _1aab44htrshthtrhtrckground  :  { url: './asserts/sounds/background.wav' },
	// _1aaa44htrshthtrhtrbient     :  { url: './asserts/sounds/ambient.flac' },
	// _1aaa44htrshthtrhtrventure   :  { url: './asserts/sounds/adventure.wav' },
    // _10ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _10am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _10ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _19ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _19am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _19ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _18ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _18am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _18ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _17ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _17am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _17ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _16ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _16am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _16ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _15ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _15am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _15ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _14ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _14am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _14ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _13ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _13am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _13ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
    // _12ba44htrshthtrhtrkground  :  { url: './asserts/sounds/background.wav' },
	// _12am44htrshthtrhtrient     :  { url: './asserts/sounds/ambient.flac' },
	// _12ad44htrshthtrhtrenture   :  { url: './asserts/sounds/adventure.wav' },
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
    

    //playBackgroundSound();
    //playSound(sounds.background.sound);
    // playSound(sounds.ambient.sound);
    // playSound(sounds.adventure.sound);

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

        land_grass  = utils.createFlatLand(4,4, "Grass", [-30, 0, 30], scene);

        orbit  = utils.createFlatLand(5,3, "Grass", [-30,30,-30], scene);

        utils.createUphillLand(10, 10, 10, "Lava", [0, 0, -80], scene)

        ascent = utils.createAscentGround(5, 5, 10, "Amethyst", [-39, 0, -5], scene)

        descent = utils.createDescentGround(5, 5, 10, "Rock", [-39, 0, -5], scene)

        var brick_wall = utils.createPhysicWall("Rock",scene,13,13,[17,0,-20],false);

    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_Sphere(3, 0xFFFF00, "Rock", scene);
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

    /* ****************************** PG ***********************************/
    {
        //hierarchical model

        utils.create_pg(scene)

        pg = utils.pg

        // test HM moving and rotating

        /*
        if you use the hitbox make sure to modify the flag before launch the simulation of phyisjs otherwise are only 
        three js 3D object you can change rotation and position normally
        */

        setInterval(function(){
             utils.rotateArmsLegs(pg[3],1)
        },50);

        setInterval(function(){
            utils.rotateArmsLegs(pg[4],-1)
       },50);

        //    utils.rotateArmsLegs(pg[5],-90)
        //    utils.rotateArmsLegs(pg[6],90)
    
        //     setInterval(function(){
        //             utils.rotateArmsLegs(pg[5],1)
        //     },100);
    
        //     setInterval(function(){
        //         utils.rotateArmsLegs(pg[6],-1)
        //     },100);

        // i want to use the physijs hitbox, i set the dirty motions flag to true

        pg[0].__dirtyPosition = true;
        pg[0].__dirtyRotation = true;

        pg[0].position.set(15, 40, -70)

        scene.simulate(); //update the new position for physijs

        pg[0].__dirtyPosition = false;
        pg[0].__dirtyRotation = false;
        
        /* ************************* MAiN SPHERE ***********************************/
        sphere = utils.create_Sphere(3, 0xFFFFFF, "body_f", scene, [0,5,0], true);

        controls = new OrbitControls(camera, canvas);
        controls.update();

        camera.position.z = sphere.position.z + utils.camera_z_pos;
        camera.position.y = sphere.position.y + utils.camera_y_pos;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        scene.add(camera);
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
                    // console.log("Moved Right");
                    //sphere.rotation.y = (sphere.rotation.y + 0.05);
                }else{
                    // console.log("Moved Left")
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

    land_anim_a = utils.animateBackAndForwardInstanceGroup(land.group, scene, 'x', 70, 30, 5000, land.hitbox);
    land_anim_a.forEach(anim => { anim.start()});

    // using groups multiple animation

    animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'z', 30,5000,-30,[5,3], orbit.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'x', 30,5000,-30,[5,3], orbit.hitbox));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'z',-30,5000, 30,[5,3], orbit.hitbox));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'x',-30,5000, 30,[5,3], orbit.hitbox));

    animations_conc = utils.concatenateAnimationsGroup(animations_conc);
    animations_conc.forEach(elem => elem.start());

    // tumble animation group
    utils.animateFallenPlatformGroup(land_grass.group, scene, undefined, land_grass.hitbox);
    
    /* ************************* RESETS ******************************/

    //  utils.resetAll(scene,5000); // problem: try to change the time of activation of this functions, is it's less than 5s all ok, otherwise the cubes become static without sense
    var camera_pivot;
    var what_look_at = undefined;
    //stopSound(sounds.background.sound);
    function render() {


        // if (utils.reset_pg){
        //     console.log(" **** resettando il pg ****");
        //     pg = utils.create_pg(scene);
        //     utils.reset_pg = false;
        // }

        
        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // head.position.set(head.position.x, head.position.y +head_displacement_update , head.position.z) 
        // hit_box_2.position.set(head.position.x, head.position.y +hb2_displacement_update , head.position.z)


        
        TWEEN.update();
        scene.simulate();
        // controls.enabled = false;
        

        var VELOCITY = 1;
        var MAX_VELOCITY = 50;
        var JUMP_VELOCITY = 10;
        var MAX_JUMP_VELOCITY = 50;
        var x = 0;
        var y = 0;
        var z = 0;
        var t = utils.degrees_to_radians(0);
  

        // console.log(sphere.getLinearVelocity());
        // console.log(utils.radians_to_degrees(sphere.rotation.y))

        if ( keys.q && pressable_q==true){
            console.log("pressed q");
            what_look_at = utils.change_main(scene,camera);

            console.log(what_look_at);
            pressable_q = false;
            setTimeout(function(){
                pressable_q = true;
            }, 2000);
            
        }

        if ( keys.w ){
            if(what_look_at != undefined){
                what_look_at.__dirtyPosition = true;
                what_look_at.__dirtyRotation = true;
                what_look_at.position.z = what_look_at.position.z -VELOCITY;
                camera.lookAt( what_look_at.position );
                scene.simulate();
                what_look_at.__dirtyPosition = false;
                what_look_at.__dirtyRotation = false;
            }
            else
                z = sphere.getLinearVelocity().z-VELOCITY;
        }
        if ( keys.s ){
            if(what_look_at != undefined){  
                what_look_at.__dirtyPosition = true;
                what_look_at.__dirtyRotation = true;
                what_look_at.position.z = what_look_at.position.z + VELOCITY;
                camera.lookAt( what_look_at.position );
                scene.simulate();
            }else
                z = sphere.getLinearVelocity().z+VELOCITY;
        }

        // camera_pivot = new THREE.Object3D()
// var Y_AXIS = new THREE.Vector3( 0, 1, 0 );

// scene.add( camera_pivot );
// camera_pivot.add( camera );
// // camera.position.set( 500, 0, 0 );
// camera.lookAt( camera_pivot.position );
// camera_pivot.rotateOnAxis( Y_AXIS, 15 );    // radians

            

        if ( keys.a ){
            if(what_look_at != undefined){
                x = what_look_at.position.x;
                x -= VELOCITY;
                t = (what_look_at.rotation.y);
            }
            else{
                x = sphere.getLinearVelocity().x-VELOCITY;
                t = (sphere.rotation.y);
            }
        }
        if ( keys.d ){
            if(what_look_at != undefined){
                x = what_look_at.position.x ;
                x += VELOCITY;
                t =  (what_look_at.rotation.y);
            }else{
                x = sphere.getLinearVelocity().x+VELOCITY;
                t =  (sphere.rotation.y);
            }
        }
        if ( keys.space ){
            if(what_look_at != undefined){
                y = what_look_at.position.y;
                y += JUMP_VELOCITY;
            }else
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


        if(keys.w | keys.s | keys.d | keys.a | keys.space){

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

            // var vel  =new THREE.Vector3(x, y ,z);
            // console.log(vel);
            if(what_look_at != undefined){

                // what_look_at.__dirtyPosition = true;
                // what_look_at.__dirtyRotation = true;
                
                // // what_look_at.__dirtyPosition = true;
                // // what_look_at.__dirtyRotation = true;

                // // what_look_at.position.x += x;
                // // what_look_at.position.y += y;
                // what_look_at.position.z = what_look_at.position.z + 2;
                // camera.lookAt( what_look_at.position );
                // scene.simulate();
                // what_look_at.__dirtyPosition = false;
                // what_look_at.__dirtyRotation = false;
            }else
                sphere.setLinearVelocity(new THREE.Vector3(x, y ,z));

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

        // camera.lookAt( sphere.position );
        if(what_look_at != undefined){  

            

            // what_look_at.__dirtyPosition = true;
            // what_look_at.__dirtyRotation = true;
    
    
            // scene.simulate(); //update the new position for physijs
    



            // camera.position.z = what_look_at.position.z + utils.camera_z_pos;
            // camera.position.y = what_look_at.position.y + utils.camera_y_pos;
            // camera.position.x = what_look_at.position.x;

            // camera.lookAt( what_look_at.position );

            // what_look_at.__dirtyPosition = false;
            // what_look_at.__dirtyRotation = false;
        }
        else{
            // camera.position.z = sphere.position.z + utils.camera_z_pos;
            // camera.position.y = sphere.position.y + utils.camera_y_pos;
            // camera.position.x = sphere.position.x;

            //sphere.add(camera);

            camera.lookAt( sphere.position );
        }


        TWEEN.update();
        scene.simulate();
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