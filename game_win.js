import * as THREE_AUDIO from './libs/threejs/build/three.module.js';


var sound_to_play;  
document.getElementById('game_win_button').onclick = function(){
    window.location.href = window.location.href.replace("game_win.html","");
};


var listener = new THREE_AUDIO.AudioListener();
const sounds = {
    background  :  { url: './asserts/sounds/win.wav' }
}


const soundsLoaderManager = new THREE_AUDIO.LoadingManager();
soundsLoaderManager.onLoad = () => {

};

soundsLoaderManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log("Loading sounds... ", itemsLoaded / itemsTotal * 100, '%');
};
{
    const audioLoader = new THREE_AUDIO.AudioLoader(soundsLoaderManager);
    for (const sound of Object.values(sounds)) {
        audioLoader.load( sound.url, function( buffer ) {
            
            sound.sound = buffer;

            console.log("Loaded ", buffer);
            console.log("SOUND LOADED!");
            sound_to_play = new THREE_AUDIO.Audio(listener);
            sound_to_play.isPlaying = false;
            sound_to_play.setBuffer( sounds.background.sound );
            sound_to_play.setLoop( false );
            sound_to_play.setVolume( 0.3 );
            sound_to_play.play();


        });
    }
} 