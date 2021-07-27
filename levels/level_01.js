
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
    jump        :  { url: './asserts/sounds/jump.wav' },
    level_1     :  { url: './asserts/sounds/level_1.wav' },
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

function playSound(sound,loop = false){

    var sound_to_play = new THREE_AUDIO.Audio(listener);
    sound_to_play.isPlaying = false;
    sound_to_play.setBuffer( sound );
	sound_to_play.setLoop( loop );
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
    if(curr_level == 1){
        stopSound(sounds.background.sound);
        playSound(sounds.level_1.sound,true);
        return level_1;
    }
}

function level_0(){

    /* ************************* PLANES ***********************************/

    {
        // utils.create_Box_Plane([0, 0, 0], [0, 0, 0], 1000, scene, false);
    }

    /* ************************* BOXES ***********************************/

    {


        utils.createFlatLand(30,20, "Grass", [-45, 0, 370], scene);
        utils.createFlatLand(10,10, "Grass", [-45, 0, 340], scene);

        utils.createFlatLand(10,10, "Grass", [0, 0, 290], scene);
        utils.createFlatLand(10,10, "Grass", [-45, 0, 240], scene);

        utils.create_Box_Plane([90, 20, 330], [0, 30, 90], 60, scene, false, './textures/bgs/spacebar.PNG',2);

        utils.create_Box_Plane([-90, 20, 330], [0, -30, 90], 60, scene, false, './textures/bgs/wasd.jpg',3 );

        utils.create_Box_Plane([0,75, 260], [90, 0, 0], 60, scene, false, './textures/bgs/mouse.jpg',2);


    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_teleport([0, 20, 350], scene); // emissive light of the teleport
    }


    /* ************************* LIGHT ***********************************/
    {
        utils.create_pointLIght([10,10,10],0xffffff,scene);
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane([0, -1300 / 2, 0], [0, 0, 0],  1300, scene, true); //ceil/floor
        utils.create_Box_Plane([0, 1300 / 2, 0], [0, 0, 0],   1300, scene, true); 
        utils.create_Box_Plane([-1300 / 2, 0, 0], [0, 0, 90], 1300, scene, true); // lateral walls
        utils.create_Box_Plane([1300 / 2, 0, 0], [0, 0, 90],  1300, scene, true);
        utils.create_Box_Plane([0, 0, 1300 / 2], [90, 0, 0],  1300, scene, true); // front and back walls
        utils.create_Box_Plane([0, 0, -1300 / 2], [90, 0, 0], 1300, scene, true);
    }

    /* ************************* MAiN SPHERE ***********************************/
    sphere = utils.create_Sphere(3, 0xFFFFFF, "body_f", scene, utils.start_level_1, true);
}


function level_1(scene){

    /* ************************* BOXES ***********************************/

    {


        utils.createFlatLand(30,20, "Grass", [-45, 0, 370], scene);

        utils.createFlatLand(10,10, "Grass", [45, 0, 290], scene);
        utils.createFlatLand(10,10, "Grass", [45, 0, 240], scene);

    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_teleport([0, 0, 350], scene); // emissive light of the teleport
    }


    /* ************************* LIGHT ***********************************/
    {
        utils.create_pointLIght([10,10,10],0xffffff,scene);
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane([0, -1300 / 2, 0], [0, 0, 0],  1300, scene, true); //ceil/floor
        utils.create_Box_Plane([0, 1300 / 2, 0], [0, 0, 0],   1300, scene, true); 
        utils.create_Box_Plane([-1300 / 2, 0, 0], [0, 0, 90], 1300, scene, true); // lateral walls
        utils.create_Box_Plane([1300 / 2, 0, 0], [0, 0, 90],  1300, scene, true);
        utils.create_Box_Plane([0, 0, 1300 / 2], [90, 0, 0],  1300, scene, true); // front and back walls
        utils.create_Box_Plane([0, 0, -1300 / 2], [90, 0, 0], 1300, scene, true);
    }

    /* ************************* MAiN SPHERE ***********************************/
    sphere = utils.create_Sphere(3, 0xFFFFFF, "body_f", scene, utils.start_level_1, true);
}


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


    level_0();
    playSound(sounds.background.sound,true);

    /* ****************************** PG ***********************************/
    {       
        camera.position.z = sphere.position.z + utils.camera_z_pos;
        camera.position.y = sphere.position.y + utils.camera_y_pos;
        camera.position.x = sphere.position.x;
        camera.lookAt(sphere.position);

        controls = new OrbitControls(camera, canvas);
        controls.update();



        scene.add(camera);

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
        if (! utils.level_completed && ! utils.gameOver){
            utils.check_in_teleport(scene, [sphere.position.x,sphere.position.y,sphere.position.z])
        } 

        if(utils.level_completed){
            utils.toggle_level_completed();
            var level = utils.curr_level;
            utils.changeLevel(scene,getNextLevel(level));
        }


        

        // if game is active, take the commands from the user
        if (! utils.level_completed && ! utils.gameOver){


            var VELOCITY_w = 20;
    

            if ( keys.q && pressable_q==true){
                console.log("pressed q");
                what_look_at = utils.change_main(scene,camera);

                console.log(what_look_at);
                pressable_q = false;
                setTimeout(function(){
                    pressable_q = true;
                }, 500);  
            }


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
                    var force_vector = new THREE.Vector3( 0,VELOCITY_w*2000,0)
                    sphere.applyCentralImpulse(force_vector)
                    playSound(sounds.jump.sound);
                }

            }

            // remove arrow if no input has been detected
            if(!(keys.w | keys.s | keys.d | keys.a | keys.space)){
                var sphere_direction = scene.getObjectByName("sphere_direction");
                if(sphere_direction) scene.remove(sphere_direction);
            }


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