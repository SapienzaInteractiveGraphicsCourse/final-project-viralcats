import * as utils from '../utils.js';


utils.setLevel(1);

//groups for the checkpoints
var group_1 = [];
var group_2 = [];

// falling lands variables
var fallen1 = false
var fallen2 = false
var fallen3 = false
var fallen4 = false
var fallingLand;
var fallingLand2;
var fallingLand3;
var fallingLand4;
var group_fallen_lands = [];
export var pg;
var sphere;

export function cleanAndRebuildPlatforms(scene){

    // clean all the platform that are still there

    group_fallen_lands = [];
    if(!fallen1){
        // console.log("rimuovo prima piattaforma")
        fallingLand["group"].forEach(Element => scene.remove(Element));
        scene.remove(fallingLand["hitbox"]);
    }
    if(!fallen2){
        // console.log("rimuovo seconda piattaforma")
        fallingLand2["group"].forEach(Element => scene.remove(Element));
        scene.remove(fallingLand2["hitbox"]);
    }
    if(!fallen3){
        // console.log("rimuovo terza piattaforma")
        fallingLand3["group"].forEach(Element => scene.remove(Element));
        scene.remove(fallingLand3["hitbox"]);
    }
    if(!fallen4){
        // console.log("rimuovo quarta piattaforma")
        fallingLand4["group"].forEach(Element => scene.remove(Element));
        scene.remove(fallingLand4["hitbox"]);
    }


        // rebuild platoforms


    // ------ 1st

    fallingLand = utils.createFlatLand(5,5, "Grass", [-5, 10, -330], scene);
    fallen1 = false;

    fallingLand.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
    if(other_object.name == "mainSphere" && !fallen1){
        fallen1 = true;
        utils.animateFallenPlatformGroup(fallingLand.group, scene, undefined, fallingLand.hitbox,sphere);
    }
    });

    fallingLand["group"].forEach(Element => group_fallen_lands.push(Element));
    group_fallen_lands.push(fallingLand["hitbox"]);

    // ------ 2nd

    fallingLand2 = utils.createFlatLand(5,5, "Grass", [-5, 5, -370], scene);
    fallen2 = false;

    fallingLand2.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
    if(other_object.name == "mainSphere" && !fallen2){
        fallen2 = true;
        utils.animateFallenPlatformGroup(fallingLand2.group, scene, undefined, fallingLand2.hitbox,sphere);
    }
    });

    fallingLand2["group"].forEach(Element => group_fallen_lands.push(Element));
    group_fallen_lands.push(fallingLand2["hitbox"]);


    // ------ 3rd

    fallingLand3 = utils.createFlatLand(5,5, "Grass", [-5, 0, -410], scene);
    fallen3 = false;

    fallingLand3.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
    if(other_object.name == "mainSphere" && !fallen3){
        fallen3 = true;
        utils.animateFallenPlatformGroup(fallingLand3.group, scene, undefined, fallingLand3.hitbox,sphere);
        }
    });


    fallingLand3["group"].forEach(Element => group_fallen_lands.push(Element));
    group_fallen_lands.push(fallingLand3["hitbox"]);


    // ------ 4th

    fallingLand4 = utils.createFlatLand(5,5, "Grass", [-5, -5, -450], scene);
    fallen4 = false;

    fallingLand4.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
    if(other_object.name == "mainSphere" && !fallen4){
        fallen4 = true;
        utils.animateFallenPlatformGroup(fallingLand4.group, scene, undefined, fallingLand4.hitbox,sphere);
        
        }
    });

    fallingLand4["group"].forEach(Element => group_fallen_lands.push(Element));
    group_fallen_lands.push(fallingLand4["hitbox"]);
}

export function level_1(scene){


    /* ************************* BOXES ***********************************/

    {

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

        temp = utils.create_Box_Plane([90, 20, 330], [0, 30, 90], 40, scene, false, './textures/bgs/spacebar.PNG',2);
        group_1.push(temp);

        temp = utils.create_Box_Plane([-90, 20, 330], [0, -30, 90], 40, scene, false, './textures/bgs/wasd.jpg',3 );
        group_1.push(temp);
        
        temp =utils.create_Box_Plane([20,20, 240], [90, 0, 0], 40, scene, false, './textures/bgs/mouse.jpg',2);
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
            console.log("colpita la prima piattaforma")
            utils.animateFallenPlatformGroup(fallingLand.group, scene, undefined, fallingLand.hitbox,sphere);
        }
        });

        fallingLand["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand["hitbox"]);

        // ------ 2nd

        fallingLand2 = utils.createFlatLand(5,5, "Grass", [-5, 5, -370], scene);

        fallingLand2.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        
        if(other_object.name == "mainSphere" && !fallen2){
             fallen2 = true;
             utils.animateFallenPlatformGroup(fallingLand2.group, scene, undefined, fallingLand2.hitbox,sphere);
        }
        });

        fallingLand2["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand2["hitbox"]);


        // ------ 3rd

        fallingLand3 = utils.createFlatLand(5,5, "Grass", [-5, 0, -410], scene);

        fallingLand3.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if(other_object.name == "mainSphere" && !fallen3){
            fallen3 = true;
            utils.animateFallenPlatformGroup(fallingLand3.group, scene, undefined, fallingLand3.hitbox,sphere);
            }
        });


        fallingLand3["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand3["hitbox"]);


        // ------ 4th

        fallingLand4 = utils.createFlatLand(5,5, "Grass", [-5, -5, -450], scene);

        fallingLand4.hitbox.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if(other_object.name == "mainSphere" && !fallen4){
            fallen4 = true;
            utils.animateFallenPlatformGroup(fallingLand4.group, scene, undefined, fallingLand4.hitbox,sphere);
            }
        });

        fallingLand4["group"].forEach(Element => group_fallen_lands.push(Element));
        group_fallen_lands.push(fallingLand4["hitbox"]);

        // teleport platform

        utils.createFlatLand(8,8, "Grass", [-11, -8.5, -512], scene);
        temp =utils.create_Box_Plane([-2, 10, -540], [90, 0, 0], 40, scene, false, './textures/bgs/teleport.png',2);
        group_2.push(temp);
    }
        
    /* ************************* OTHER ELEMENTS ***********************************/

    {
        utils.create_teleport([0, 0, -500], scene); // emissive light of the teleport
    }


    {
        pg = utils.create_pg(scene);

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
    // sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0,5,400], true); // [0,5,400][20, 120, -125]
    sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [10, 0, -500], true); // [0,5,400][20, 120, -125]
    
    
}

export function getSphere(){
    return sphere;
}

