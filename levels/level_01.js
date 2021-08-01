
Physijs.scripts.worker = '../libs/physijs_worker.js';
Physijs.scripts.ammo = '../libs/ammo.js';
import * as utils from '../utils.js';
import { OrbitControls } from '../libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from '../libs/tween.esm.js';
import * as THREE_AUDIO from '../libs/threejs/build/three.module.js';


// defintion of the object for the level

var distance_bound = 10000;

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
var group_fallen_lands = [];


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
        // sphere.setLinearVelocity(new THREE.Vector3(0,0,0));
    });

    /* ************************* PLANES ***********************************/

    {
        // utils.create_Box_Plane([0, 0, 0], [0, 0, 0], 1000, scene, false);
    }

    /* ************************* BOXES ***********************************/

    {
      
        // land1 = utils.createFlatLand(20,20, "Namecc", [30, 0, 30], scene);
        var temp;  //temporary variable to unpack the objects 


        temp = utils.createFlatLand(30,20, "Grass", [-45, 0, 370], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        temp = utils.createFlatLand(10,10, "Grass", [-45, 0, 340], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);
        

        temp = utils.createFlatLand(10,10, "Grass", [0, 0, 290], scene);
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp =utils.createFlatLand(10,10, "Grass", [-45, 0, 240], scene);
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // tutorial on commands

        temp = utils.create_Box_Plane([90, 20, 330], [0, 30, 90], 40, scene, false, './textures/bgs/mouse.jpg',2);
        group_1.push(temp);

        temp = utils.create_Box_Plane([-90, 20, 330], [0, -30, 90], 40, scene, false, './textures/bgs/wasd.jpg',3 );
        group_1.push(temp);
        
        temp =utils.create_Box_Plane([20,20, 240], [90, 0, 0], 40, scene, false, './textures/bgs/spacebar.PNG',2);
        group_1.push(temp);


        temp = utils.createAscentGround(15, 5, 25, "Grass", [-40, 0, 230], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp = utils.createAscentGround(15, 5, 25, "Grass", [-25, 10, 200], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [-10, 20, 170], scene, "+z");
        temp.forEach(Element => group_1.push(Element));


        temp = utils.createAscentGround(15, 5, 25, "Grass", [5, 30, 140], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [20, 40, 110], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [20, 50, 80], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [5, 60, 50], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [-10, 70, 20], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [-25, 80, -10], scene, "+z");
        temp.forEach(Element => group_1.push(Element));

        temp =utils.createAscentGround(15, 5, 25, "Grass", [-40, 90, -40], scene, "+z");
        temp.forEach(Element => group_1.push(Element));



        


        temp = utils.createFlatLand(10,15, "Grass", [-40, 105, -125], scene);
        temp["group"].forEach(Element => group_2.push(Element));
        group_2.push(temp["hitbox"]);

        temp = utils.createFlatLand(10,15, "Namecc", [20, 105, -125], scene);
        temp["group"].forEach(Element => group_2.push(Element));
        group_2.push(temp["hitbox"]);

        temp = utils.createFlatLand(10,15, "Lava", [-100, 105, -125], scene);
        temp["group"].forEach(Element => group_2.push(Element));
        group_2.push(temp["hitbox"]);

        {
            temp = utils.create_button(scene , [35,107.5,-105], group_1);
            group_2.push(temp)
        }

        // tutorial for gameplay

        temp = utils.create_Box_Plane([180, 135, -104], [0, 0, 90], 40, scene, false, './textures/bgs/checkpoint.png',2);
        group_2.push(temp);
        
        temp = utils.create_Box_Plane([-240, 135, -104], [0, 0, 90], 40, scene, false, './textures/bgs/theBoy.png',3 );
        group_2.push(temp);


        temp = utils.createDescentGround(15, 5, 40, "Rock", [-35, 90, -225], scene, "+z");
        temp.forEach(Element => group_2.push(Element));


        temp = utils.createDescentGround(15, 5, 40, "Rock", [-5, 60, -260], scene, "+z");
        temp.forEach(Element => group_2.push(Element));


        temp = utils.createFlatLand(10,15, "Grass", [-40, 90, -220], scene);
        temp["group"].forEach(Element => group_2.push(Element));
        group_2.push(temp["hitbox"]);

        utils.createPhysicWall("Rock",scene,5,9,[-40, 92, -220],true)
        utils.createPhysicWall("Rock",scene,5,9,[-40, 92, -180],true)


        // falling platforms 

        // ------ 1st

        fallingLand = utils.createFlatLand(5,5, "Grass", [-5, 10, -330], scene);

        fallingLand.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // var fallen1 = false
        if(other_object.name == "mainSphere" && !fallen1){
            fallen1 = true;
            // console.log("provaaaaaaaah")
            utils.animateFallenPlatformGroup(fallingLand.group, scene, undefined, fallingLand.hitbox,sphere);
            // try {
            //     scene.remove(fallingLand.hitbox);
            // } catch (error) {
            //     console.log(error);
            // }
        }
        });

        fallingLand["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand["hitbox"]);

        // ------ 2nd

        fallingLand2 = utils.createFlatLand(5,5, "Grass", [-5, 5, -370], scene);

        fallingLand2.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        
        if(other_object.name == "mainSphere" && !fallen2){
             fallen2 = true;
             // console.log("provaaaaaaaah")
             utils.animateFallenPlatformGroup(fallingLand2.group, scene, undefined, fallingLand2.hitbox,sphere);
            //  try {
            //     scene.remove(fallingLand2.hitbox);
            // } catch (error) {
            //    console.log(error);
            // }
        }
        });

        fallingLand2["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand2["hitbox"]);


        // ------ 3rd

        fallingLand3 = utils.createFlatLand(5,5, "Grass", [-5, 0, -410], scene);

        fallingLand3.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if(other_object.name == "mainSphere" && !fallen3){
            fallen3 = true;
            // console.log("provaaaaaaaah")
            utils.animateFallenPlatformGroup(fallingLand3.group, scene, undefined, fallingLand3.hitbox,sphere);
            // try {
            //     scene.remove(fallingLand3.hitbox);
            // } catch (error) {
            //     console.log(error);
            // }

            }
        });


        fallingLand3["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand3["hitbox"]);


        // ------ 4th

        fallingLand4 = utils.createFlatLand(5,5, "Grass", [-5, -5, -450], scene);

        fallingLand4.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if(other_object.name == "mainSphere" && !fallen4){
            fallen4 = true;
            // console.log("provaaaaaaaah")
            utils.animateFallenPlatformGroup(fallingLand4.group, scene, undefined, fallingLand4.hitbox,sphere);
            // try {
            //     scene.remove(fallingLand4.hitbox);
            // } catch (error) {
            //     console.log(error);
            // }
            
            }
        });

        fallingLand4["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand4["hitbox"]);

        // teleport platform

        utils.createFlatLand(8,8, "Grass", [-11, -8.5, -512], scene);
        temp =utils.create_Box_Plane([-2, 10, -540], [90, 0, 0], 40, scene, false, './textures/bgs/teleport.png',2);
        group_2.push(temp);


            

        // utils.create_Box_Plane([90, 20, 330], [0, 0, 90], 60, scene, false);

        // utils.create_Box_Plane([-90, 20, 320], [0, 0, 90], 60, scene, false);

        // utils.create_Box_Plane([-90, 20, 320], [0, 0, 90], 60, scene, false);
        // utils.create_Box_Plane([0,0,0], [0, 0, 90], 100, scene, false);
        // utils.create_Box_Plane([0,0,0], [0, 0, 90], 100, scene, false);

        // utils.createFlatLand(10,10, "Grass", [-45, 0, 340], scene);

        // utils.createFlatLand(30,20, "Grass", [-45, 0, 370], scene);

        // utils.createFlatLand(30,20, "Grass", [-45, 0, 370], scene);
        // utils.createFlatLand(30,20, "Grass", [-45, 0, 400], scene);
        // utils.createFlatLand(30,20, "Grass", [-45, 0, 400], scene);
        // utils.createFlatLand(30,20, "Grass", [-45, 0, 400], scene);

        // orbit  = utils.createFlatLand(5,3, "Grass", [-30,30,-30], scene);

        // utils.createUphillLand(10, 10, 10, "Lava", [0, 0, -80], scene)

        // ascent = utils.createAscentGround(5, 5, 10, "Amethyst", [-39, 0, -5], scene)

        // descent = utils.createDescentGround(5, 5, 10, "Rock", [-39, 0, -5], scene)

        // var brick_wall = utils.createPhysicWall("Rock",scene,13,13,[17,0,-20],false);

    }

    /* ************************* OTHER ELEMENTS ***********************************/

    {
        utils.create_teleport([0, 0, -500], scene); // emissive light of the teleport
    }
    {
        utils.create_pg(scene)

        pg = utils.pg

        pg[0].__dirtyPosition = true;
        pg[0].__dirtyRotation = true;


        pg[0].position.set(-85,115,-105)
        pg[0].rotation.set(0,utils.degrees_to_radians(45),0)

        scene.simulate(); //update the new position for physijs

        pg[0].__dirtyPosition = false;
        pg[0].__dirtyRotation = false;
    }



    /* ************************* LIGHT ***********************************/
    {
        // utils.create_pointLight([0,10,400],0xffffff,scene);
        // utils.create_directionalLight(0xffffff,scene,[0,1,0])
        utils.create_directionalLight(0xffffff,scene,[0,1,1])
        // utils.create_directionalLight(0xffffff,scene,[0,0,1])
        // utils.create_directionalLight(0xffffff,scene,[1,1,0])
        // utils.create_directionalLight(0xffffff,scene,[-1,1,0])
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane([0, -300, 0], [0, 0, 0],  1300, scene, true); //ceil/floor
        utils.create_Box_Plane([0, 300, 0], [0, 0, 0],   1300, scene, true); 
        utils.create_Box_Plane([-1300 / 2, 0, 0], [0, 0, 90], 1300, scene, true); // lateral walls
        utils.create_Box_Plane([1300 / 2, 0, 0], [0, 0, 90],  1300, scene, true);
        utils.create_Box_Plane([0, 0, 1300 / 2], [90, 0, 0],  1300, scene, true); // front and back walls
        utils.create_Box_Plane([0, 0, -1300 / 2], [90, 0, 0], 1300, scene, true);
    }


        
        /* ************************* MAiN SPHERE ***********************************/
        sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,[20, 120, -125], true); // [0,5,400][20, 120, -125]
        
        // set the start position of the camera (will change)
        camera.position.z = sphere.position.z + utils.camera_z_pos;
        // camera.position.y = sphere.position.y + utils.camera_y_pos;
        camera.position.y = sphere.position.y;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        controls = new OrbitControls(camera, canvas);
        controls.update();



        scene.add(camera);

        canvas.onmousedown = function(e){
            mouse_x = e.pageX;
            mouse_pressing = true;
        
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

    // using names
    // anim_box_repeat = utils.animateBackAndForwardName("box_5", scene, 'y', 100, 20, 5000);
    // anim_box_repeat.start();
    // anim_box_single = utils.animatePlatformByName("box_1", scene, 'z', 100, 5000);
    // anim_box_single.start();

    // using a single instance
    // anim_box_single_instance = utils.animatePlatformByInstance(box_1, scene, 'z', -100, 5000)
    // anim_box_single_instance.start();

    // anim_box_repeat_instance = utils.animateBackAndForwardInstance(box_3, scene, 'x', -100, 0, 5000);
    // anim_box_repeat_instance.start();

    // using groups single animation

    // land_anim_a = utils.animateBackAndForwardInstanceGroup(land.group, scene, 'x', 70, 30, 5000, land.hitbox);
    // land_anim_a.forEach(anim => { anim.start()});

    // using groups multiple animation

    // animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'z', 30,5000,-30,[5,3], orbit.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
    // animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'x', 30,5000,-30,[5,3], orbit.hitbox));
    // animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'z',-30,5000, 30,[5,3], orbit.hitbox));
    // animations_conc.push(utils.animatePlatformByGroupInstance(orbit.group,scene,'x',-30,5000, 30,[5,3], orbit.hitbox));

    // animations_conc = utils.concatenateAnimationsGroup(animations_conc);
    // animations_conc.forEach(elem => elem.start());

    // tumble animation group
    // utils.animateFallenPlatformGroup(land_grass.group, scene, undefined, land_grass.hitbox);
    
    /* ************************* RESETS ******************************/

    //stopSound(sounds.background.sound);



    // controls.enablePan = false;
    // controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 2
    controls.minDistance = 139;
    controls.maxDistance = 140;
    var removed = false;
    function render() {

        // re-build the falling platform

        if(removed == false){  //if the ball is dropped
            // removed = true 
            // setTimeout(function () {


            // clean all the platform that are still there

            group_fallen_lands.forEach(Elem => scene.remove(Elem));

            // }, 15000);
        // }else{

            // rebuild platoforms

        }




        // if(fallen1){

        //     fallen1 = false
        //     var touched1 = false
        //     setTimeout(function () {
        //         // try {
        //         //     scene.remove(fallingLand.hitbox);
        //         // } catch (error) {
        //         //     console.log(error);
        //         // }


        //         fallingLand = utils.createFlatLand(5,5, "Grass", [-5, 10, -330], scene);

        //         fallingLand.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //         if(other_object.name == "mainSphere" && !fallen1){
        
        //             utils.animateFallenPlatformGroup(fallingLand.group, scene, undefined, fallingLand.hitbox,sphere);
        //             fallen1 = true;
        //             }
        //         });

        //     }, 15000)
        // }


        // if(fallen2){
        //     // scene.remove(fallingLand2);

        //     fallen2 = false
        //     setTimeout(function () {
        //         // try {
        //         //     scene.remove(fallingLand2.hitbox);
        //         // } catch (error) {
        //         //     console.log(error);
        //         // }

        //         fallingLand2 =  utils.createFlatLand(5,5, "Grass", [-5, 5, -370], scene);

        //         fallingLand2.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //         if(other_object.name == "mainSphere" && !fallen2){
        
        //             utils.animateFallenPlatformGroup(fallingLand2.group, scene, undefined, fallingLand2.hitbox,sphere);
        //             fallen2 = true;
        //             }
        //         });

        //     }, 15000)
        // }

        // if(fallen3){
        //     fallen3 = false
        //     setTimeout(function () {
        //         // try {
        //         //     scene.remove(fallingLand3.hitbox);
        //         // } catch (error) {
        //         //     console.log(error);
        //         // }

        //         fallingLand3 = utils.createFlatLand(5,5, "Grass", [-5, 0, -410], scene);

        //         fallingLand3.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //         if(other_object.name == "mainSphere" && !fallen3){
        
        //             utils.animateFallenPlatformGroup(fallingLand3.group, scene, undefined, fallingLand3.hitbox,sphere);
        //             fallen3 = true;
        //             }
        //         });

        //     }, 15000)
        // }

        // if(fallen4){
        //     fallen4 = false
        //     setTimeout(function () {
        //         // try {
        //         //     scene.remove(fallingLand4.hitbox);
        //         // } catch (error) {
        //         //     console.log(error);
        //         // }
        //         fallingLand4 = utils.createFlatLand(5,5, "Grass", [-5, -5, -450], scene);

        //         fallingLand4.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        //         if(other_object.name == "mainSphere" && !fallen4){
        
        //             utils.animateFallenPlatformGroup(fallingLand4.group, scene, undefined, fallingLand4.hitbox,sphere);
        //             fallen4 = true;
        //             }
        //         });

        //     }, 15000)
        // }


    /* if is present a point light move with the sphere
     pointLight.position.set(sphere.position.x,sphere.position.y + 200,sphere.position.z) */

        // if (controls.target.y < sphere.position.y + utils.camera_y_pos){
        //     controls.enabled = false;
        //     // camera.position.z = sphere.position.z + utils.camera_z_pos;
        //     camera.position.y = sphere.position.y + utils.camera_y_pos;
        //     controls.enabled = true;
        // }

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


            var VELOCITY_w = 20;
    
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
                    var force_vector = new THREE.Vector3( 0,VELOCITY_w*1000,0)
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

//         myReq = requestAnimationFrame(step);
// // the cancelation uses the last requestId
// cancelAnimationFrame(myReq);

// https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame

    }


    render();
}

initializate_page();