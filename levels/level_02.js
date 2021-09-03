import * as utils from '../utils.js';

utils.setLevel(2);

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


export function level_2(scene){


    /* ************************* BOXES ***********************************/

        var temp;  //temporary variable to unpack the objects 

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

        pg = utils.create_pg(scene,2)
    
    
        pg[0].__dirtyPosition = true;
        pg[0].__dirtyRotation = true;
    
    
        pg[0].position.set(159.5, 70, 552.5)
        pg[0].rotation.set(0,utils.degrees_to_radians(-45),0)
    
        scene.simulate();//update the new position for physijs

        group_1.push(pg[0]);

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

        pg = utils.create_pg(scene,3)
    
        pg[0].__dirtyPosition = true;
        pg[0].__dirtyRotation = true;
        scene.simulate();
    
    
        pg[0].position.set(-25, 10, 200);
        pg[0].rotation.set(0,utils.degrees_to_radians(90),0);
    
        scene.simulate(); //update the new position for physijs

        // temp = utils.createPhysicWall("Terracotta",scene,7,19,[-20, 1.6, 170],false)
        temp = utils.createPhysicWall("Terracotta",scene,7,8,[-20, 1.6, 205],false)

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
        // sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0,5,600], true); // [0,5,600]
        sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [-10,15,185], true); // [0,5,600]
        // sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0, 5, -240], true); // [0,5,600]
        // sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0,5,600], true); // [0,5,600]


        // camera.position.z = sphere.position.z + 150;
}

export function getSphere(){
    return sphere;
}

export function cleanAndRebuildPlatforms(scene){
    
        // re-build the falling platform

        if(sphere.isFallen){  //if the ball is dropped
            sphere.isFallen = false;

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
}