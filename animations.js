import TWEEN from './libs/tween.esm.js';
import * as THREE from './libs/threejs/build/three.module.js';

var isCharacterAnimationRun = false;
var isCharacterAnimationJump = false;




function moveLegs(who,time,steps){

    var leg_r_forward                   = movePart(who.joints.legs.right.rotation     ,who.joints.legs.right.rotation.x     ,degtorad(-155),  "x",    time);
    var leg_l_forward                   = movePart(who.joints.legs.left.rotation      ,who.joints.legs.left.rotation.x      ,degtorad(0),     "x",    time);
    var ankle_r_forward                 = movePart(who.joints.legs.r_ankle.rotation   ,who.joints.legs.r_ankle.rotation.x   ,degtorad(-155),  "x",    time);
    var ankle_l_forward                 = movePart(who.joints.legs.l_ankle.rotation   ,who.joints.legs.l_ankle.rotation.x   ,degtorad(0),     "x",    time);

    var leg_r_forward_return            = movePart(who.joints.legs.right.rotation     ,degtorad(-155)                       ,who.joints.legs.right.rotation.x  ,"x"  ,time);
    var leg_l_forward_return            = movePart(who.joints.legs.left.rotation      ,degtorad(0)                          ,who.joints.legs.left.rotation.x   ,"x"  ,time);
    var ankle_r_forward_return          = movePart(who.joints.legs.r_ankle.rotation   ,degtorad(-155)                       ,who.joints.legs.r_ankle.rotation.x,"x"  ,time);
    var ankle_l_forward_return          = movePart(who.joints.legs.l_ankle.rotation   ,degtorad(0)                          ,who.joints.legs.l_ankle.rotation.x,"x"  ,time);


    var reverse_leg_r_forward           = movePart(who.joints.legs.right.rotation     ,who.joints.legs.right.rotation.x     ,degtorad(0),     "x",    time);
    var reverse_leg_l_forward           = movePart(who.joints.legs.left.rotation      ,who.joints.legs.left.rotation.x      ,degtorad(-155),  "x",    time);
    var reverse_ankle_r_forward         = movePart(who.joints.legs.r_ankle.rotation   ,who.joints.legs.r_ankle.rotation.x   ,degtorad(0),     "x",    time);
    var reverse_ankle_l_forward         = movePart(who.joints.legs.l_ankle.rotation   ,who.joints.legs.l_ankle.rotation.x   ,degtorad(-155),  "x",    time);

    var reverse_leg_r_forward_return    = movePart(who.joints.legs.right.rotation     ,degtorad(0)                          ,who.joints.legs.right.rotation.x  ,"x"  ,time);
    var reverse_leg_l_forward_return    = movePart(who.joints.legs.left.rotation      ,degtorad(-155)                       ,who.joints.legs.left.rotation.x   ,"x"  ,time);
    var reverse_ankle_r_forward_return  = movePart(who.joints.legs.r_ankle.rotation   ,degtorad(0)                          ,who.joints.legs.r_ankle.rotation.x,"x"  ,time);
    var reverse_ankle_l_forward_return  = movePart(who.joints.legs.l_ankle.rotation   ,degtorad(-155)                       ,who.joints.legs.l_ankle.rotation.x,"x"  ,time);

    var curr_steps = 1;

    leg_r_forward.start();
    leg_l_forward.start();
    ankle_r_forward.start();
    ankle_l_forward.start();

    leg_r_forward.onComplete(function(){
        leg_r_forward_return.start().onComplete(function(){
          reverse_leg_r_forward.start().onComplete(function(){
            reverse_leg_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_r_forward.start();
              }
            });
          });
        });
    });
    leg_l_forward.onComplete(function(){
        leg_l_forward_return.start().onComplete(function(){
          reverse_leg_l_forward.start().onComplete(function(){
            reverse_leg_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_l_forward.start();
              }
            });
          });
        });
    });
    ankle_r_forward.onComplete(function(){
        ankle_r_forward_return.start().onComplete(function(){
          reverse_ankle_r_forward.start().onComplete(function(){
            reverse_ankle_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                ankle_r_forward.start();
              }
            });
          });
        });
    });
    ankle_l_forward.onComplete(function(){
        ankle_l_forward_return.start().onComplete(function(){
          reverse_ankle_l_forward.start().onComplete(function(){
            reverse_ankle_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                ankle_l_forward.start();
              }else{
                isCharacterAnimationRun = false;
              }
              curr_steps++;
            });
          });
        });
    });
}



function moveArms(who,time,steps){

    var leg_r_forward                   = movePart(who.joints.arms.right.rotation     ,who.joints.arms.right.rotation.z     ,degtorad(-35),                     "z",    time);
    var leg_l_forward                   = movePart(who.joints.arms.left.rotation      ,who.joints.arms.left.rotation.z      ,degtorad(-80),                     "z",    time);

    var leg_r_forward_return            = movePart(who.joints.arms.right.rotation     ,degtorad(-35)                        ,who.joints.arms.right.rotation.z  ,"z"  ,  time);
    var leg_l_forward_return            = movePart(who.joints.arms.left.rotation      ,degtorad(-80)                        ,who.joints.arms.left.rotation.z   ,"z"  ,  time);

    var reverse_leg_r_forward           = movePart(who.joints.arms.right.rotation     ,who.joints.arms.right.rotation.z     ,degtorad(65),                      "z",    time);
    var reverse_leg_l_forward           = movePart(who.joints.arms.left.rotation      ,who.joints.arms.left.rotation.z      ,degtorad(65),                      "z",    time);

    var reverse_leg_r_forward_return    = movePart(who.joints.arms.right.rotation     ,degtorad(65)                         ,who.joints.arms.right.rotation.z  ,"z"  ,  time);
    var reverse_leg_l_forward_return    = movePart(who.joints.arms.left.rotation      ,degtorad(65)                         ,who.joints.arms.left.rotation.z   ,"z"  ,  time);


    var curr_steps = 1;

    leg_r_forward.start();
    leg_l_forward.start();



    leg_r_forward.onComplete(function(){
        leg_r_forward_return.start().onComplete(function(){
          reverse_leg_r_forward.start().onComplete(function(){
            reverse_leg_r_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_r_forward.start();
              }
            });
          });
        });
    });
    leg_l_forward.onComplete(function(){
        leg_l_forward_return.start().onComplete(function(){
          reverse_leg_l_forward.start().onComplete(function(){
            reverse_leg_l_forward_return.start().onComplete(function(){
              if(curr_steps != steps){
                leg_l_forward.start();
              }
              curr_steps++;
            });
          });
        });
    });
}



export function moveSx(who,steps){
    var time  = 85;

    if(isCharacterAnimationRun == false){
        isCharacterAnimationRun = true;
        moveLegs(who,time,steps);
        moveArms(who,time,steps);
    }  
}

export function moveDx(who,steps){
    var time  = 85;

    if(isCharacterAnimationRun == false){
        isCharacterAnimationRun = true;
        moveLegs(who,time,steps);
        moveArms(who,time,steps);
    }
}

export function moveForward(who,steps){
    
    var time  = 85;

    if(isCharacterAnimationRun == false){
        isCharacterAnimationRun = true;
        moveLegs(who,time,steps);
        moveArms(who,time,steps);
    } 
}

export function moveBackward(who,steps){
    
    var time  = 85;

    if(isCharacterAnimationRun == false){
    isCharacterAnimationRun = true;
    moveLegs(who,time,steps);
    moveArms(who,time,steps);
    }
}

  
export function moveJump(what,initial_value,value,evaluate_on,time){

  
    var _initial_value = {pos:initial_value}
    var _value = {pos:value}
  
    var animation_1 = new TWEEN.Tween(_initial_value)
    .to({pos:value},time)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){     
        if(evaluate_on == "x"){
            what.mesh.translateX(_initial_value.pos);
        }else if(evaluate_on == "y"){
            what.mesh.translateY(_initial_value.pos);
        }else if(evaluate_on == "z"){
            what.mesh.translateZ(_initial_value.pos);
        }
    }); 
  
    var animation_2 = new TWEEN.Tween(_value)
    .to({pos:initial_value},time)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){     
        if(evaluate_on == "x"){
            what.mesh.translateX(_initial_value.pos);
        }else if(evaluate_on == "y"){
            what.mesh.translateY(_initial_value.pos);
        }else if(evaluate_on == "z"){
            what.mesh.translateZ(_initial_value.pos);
        }
    }); 
  
    if(isCharacterAnimationJump == false){
      isCharacterAnimationJump = true;
      animation_1.start().onComplete(function(){
        animation_2.start().onComplete(function(){
          isCharacterAnimationJump = false;        
        });
      });
    }
  
  
  }

function movePart(what,initial_value,value,evaluate_on,time){

    initial_value = {pos:initial_value}

    var animation = new TWEEN.Tween(initial_value)
    .to({pos:value},time)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate( function(){     

        if(evaluate_on == "x"){
            what.set(initial_value.pos,what.y, what.z);
        }else if(evaluate_on == "y"){
            what.set(what.x,initial_value.pos, what.z);
        }else if(evaluate_on == "z"){
            what.set(what.x,what.y, initial_value.pos);
        }
    }); 

    return animation;
}

function degtorad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  
function radtodeg(rad){
    var pi = Math.PI;
    return rad*180/pi;
}



/*
function movePartIntoThePlane(what,initial_value,value,evaluate_on,time){

  initial_value = {pos:initial_value}

  var animation = new TWEEN.Tween(initial_value)
  .to({pos:value},time)
  .easing(TWEEN.Easing.Linear.None)
  .onUpdate( function(){     
    
      if(evaluate_on == "x"){

            what.x = initial_value.pos + Math.sin(angle_of_camera_rotation);
            what.z = what.z + Math.cos(angle_of_camera_rotation);
            // camera.position.set(what.x, 50, what.z + camera_z_pos);

            


          console.log("----------------------------------")
      }else if(evaluate_on == "y"){
          what.y = initial_value.pos;
      }else if(evaluate_on == "z"){

            what.z = initial_value.pos + Math.sin(angle_of_camera_rotation);
            
            CameraUpdate();
            
            zombie.mesh.add(camera);

            //what.x = what.x - Math.cos(angle_of_camera_rotation);
            // var diff = what.z-camera.position.z;
            // camera.position.z = what.z + 50;

            //camera.up =  (what.x, what.y, what.z);
//            camera.position.x = what.x;


            //camera.rotation.set(what.rotationX,what.rotationY,what.rotationZ);
            // camera.position.set(what.x, 50, what.z + camera_z_pos);


      }
  }); 

  return animation;
}

*/