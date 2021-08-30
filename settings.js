var current_difficulty = 0;


var current_life = 0;
var current_zombie = 0;

export var current_fov      = 20   ;
export var current_far      = 10000;
export var current_near     = 0.1  ;
export var current_volume   = 8    ;


const LIFE_EASY_MODE        = 3;
const ZOMBIE_EASY_MODE      = 3;

const LIFE_NORMAL_MODE      = 2;
const ZOMBIE_NORMAL_MODE    = 2;

const LIFE_HARD_MODE        = 1;
const ZOMBIE_HARD_MODE      = 1;


var function_for_jump_level = undefined;
export function setFunctionForJumpLevel(function_jump){
    function_for_jump_level = function_jump;
}

document.getElementById('easy').addEventListener('click', function () {
    changeEasyDifficulty();
});
document.getElementById('normal').addEventListener('click', function () {
    changeNormalDifficulty();
});
document.getElementById('hard').addEventListener('click', function () {
    changeHardDifficulty();
});

document.getElementById('game_settings').addEventListener('click', function () {
    setInitialParameters();
});


document.getElementById('volumeInputSlider').addEventListener('input', function () {
    changeRange('volumeValue',document.getElementById('volumeInputSlider').value);
});

document.getElementById('select_level_1').addEventListener('click', function(){
    function_for_jump_level(0);
    $('#settingsModal').modal('hide');
});

document.getElementById('select_level_2').addEventListener('click', function(){
    function_for_jump_level(1);
    $('#settingsModal').modal('hide');
});

document.getElementById('select_level_3').addEventListener('click', function(){
    function_for_jump_level(2);
    $('#settingsModal').modal('hide');
});



document.getElementById('fovInputSlider').addEventListener('input', function () {
    changeRange('fovValue',document.getElementById('fovInputSlider').value);
});

document.getElementById('farInputSlider').addEventListener('input', function () {
    changeRange('farValue',document.getElementById('farInputSlider').value);
});

document.getElementById('nearInputSlider').addEventListener('input', function () {
    changeRange('nearValue',document.getElementById('nearInputSlider').value);
});


function changeRange(idText,idVal){
    document.getElementById(idText).innerHTML = (idVal)
}


document.getElementById('apply').addEventListener('click', function () {
    
    current_life    = document.getElementById('lifePoint').innerHTML;
    current_zombie  = document.getElementById('zombiePoint').innerHTML;
    current_volume  = document.getElementById('volumeValue').innerHTML;

    current_fov     = document.getElementById('fovValue').innerHTML;
    current_far     = document.getElementById('farValue').innerHTML;
    current_near    = document.getElementById('nearValue').innerHTML;


    if(current_life == LIFE_EASY_MODE){
        current_difficulty = 0;
    }
    if(current_life == LIFE_NORMAL_MODE){
        current_difficulty = 1;
    }
    if(current_life == LIFE_HARD_MODE){
        current_difficulty = 2;
    }
    console.log("current_life:      " + current_life);
    console.log("current_zombie:    " + current_zombie);

    document.getElementById('curr_life_info').innerHTML     = current_life;
    document.getElementById('curr_zombie_info').innerHTML   = current_zombie;

});



function changeEasyDifficulty(){
    changeDifficulty(    getLifeInEasyMode(),    getZombieInEasyMode(),'easy')
}

function changeNormalDifficulty(){
    changeDifficulty(     getLifeInNormalMode(),  getZombieInNormalMode(),'normal')
}

function changeHardDifficulty(){
    changeDifficulty(      getLifeInHardMode(),    getZombieInHardMode(),'hard')
}


function changeDifficulty(life,zombie,mode){
    $('#lifePoint').text(life)
    $('#zombiePoint').text(zombie)

    if(mode === 'easy'){
        $('.btn-retro-secondary').css('background','#008300')
        $('.btn-retro-tertiary').css('background','#0000BC')
        $('.btn-retro-primary').css('background','#881400')
    }
    else if(mode === 'normal'){
        $('.btn-retro-secondary').css('background','#005800')
        $('.btn-retro-tertiary').css('background','#0000FC')
        $('.btn-retro-primary').css('background','#881400')
    }
    else if(mode === 'hard'){
        $('.btn-retro-secondary').css('background','#005800')
        $('.btn-retro-tertiary').css('background','#0000BC')
        $('.btn-retro-primary').css('background','#b91c00')
    }
        
}



function getLifeInEasyMode(){
    return LIFE_EASY_MODE;
}

function getZombieInEasyMode(){
    return String("+" + ZOMBIE_EASY_MODE);
}

function getLifeInNormalMode(){
    return LIFE_NORMAL_MODE;
}

function getZombieInNormalMode(){
    return String("+" + ZOMBIE_NORMAL_MODE);
}

function getLifeInHardMode(){
    return LIFE_HARD_MODE;
}

function getZombieInHardMode(){
    return String("+" + ZOMBIE_HARD_MODE);
}

function getVolume(){
    return current_volume;
}

function setInitialParameters(){
    if(current_difficulty == 0){
        changeEasyDifficulty();
    }
    if(current_difficulty == 1){
        changeNormalDifficulty();
    }
    if(current_difficulty == 2){
        changeHardDifficulty();
    }

    if(current_volume == -1){
        document.getElementById('volumeValue').innerHTML = 100;
        document.getElementById('volumeInputSlider').value = 100;
    }else{
        document.getElementById('volumeValue').innerHTML = current_volume;
        document.getElementById('volumeInputSlider').value = current_volume;
    }


    if(current_fov == -1){
        document.getElementById('fovValue').innerHTML = 100;
        document.getElementById('fovInputSlider').value = 100;
    }else{
        document.getElementById('fovValue').innerHTML = current_fov;
        document.getElementById('fovInputSlider').value = current_fov;
    }

    if(current_far == -1){
        document.getElementById('farValue').innerHTML = 100;
        document.getElementById('farInputSlider').value = 100;
    }else{
        document.getElementById('farValue').innerHTML = current_far;
        document.getElementById('farInputSlider').value = current_far;
    }

    if(current_near == -1){
        document.getElementById('nearValue').innerHTML = 100;
        document.getElementById('nearInputSlider').value = 100;
    }else{
        document.getElementById('nearValue').innerHTML = current_near;
        document.getElementById('nearInputSlider').value = current_near;
    }

    


}


changeEasyDifficulty();