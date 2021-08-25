import * as utils from '../utils.js';

utils.setLevel(3);
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
var pg;
var sphere;


export function level_3(scene){


    /* ************************* BOXES ***********************************/

      
        var temp;  //temporary variable to unpack the objects 


        // main platform number 1

        temp = utils.createFlatLand(30,20, "Moss", [-45, 0, 570], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // start of strip platforms

        temp = utils.createFlatLand(2,20, "Lava", [-6, 0, 500], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        //--

        temp = utils.createFlatLand(2,20, "Namecc", [-12, 0, 430], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(2,20, "Namecc", [0, 0, 430], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        //--

        temp = utils.createFlatLand(2,20, "Lava", [-18, 0, 360], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(2,20, "Lava", [-6, 0, 360], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(2,20, "Lava", [6, 0, 360], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        //--

        temp = utils.createFlatLand(2,20, "Namecc", [-24, 0, 290], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(2,20, "Namecc", [-12, 0, 290], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(2,20, "Namecc", [0, 0, 290], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(2,20, "Namecc", [12, 0, 290], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

         //--

         temp = utils.createFlatLand(2,20, "Lava", [-36, 0, 220], scene)
         temp["group"].forEach(Element => group_1.push(Element));
         group_1.push(temp["hitbox"]);
         
        //  temp = utils.createFlatLand(2,15, "Lava", [-48, 0, 227.5], scene)
        //  temp["group"].forEach(Element => group_1.push(Element));
        //  group_1.push(temp["hitbox"]);

         temp = utils.createFlatLand(2,10, "Lava", [-60, 0, 235], scene)
         temp["group"].forEach(Element => group_1.push(Element));
         group_1.push(temp["hitbox"]);

        //  temp = utils.createFlatLand(2,5, "Lava", [-72, 0, 242.5], scene)
        //  temp["group"].forEach(Element => group_1.push(Element));
        //  group_1.push(temp["hitbox"]);

         temp = utils.createFlatLand(2,2, "Lava", [-84, 0, 247], scene)
         temp["group"].forEach(Element => group_1.push(Element));
         group_1.push(temp["hitbox"]);


         temp = utils.createFlatLand(20,1, "Lava", [-144, 0, 248.5], scene)
         temp["group"].forEach(Element => group_1.push(Element));
         group_1.push(temp["hitbox"]);

         temp = utils.createFlatLand(10,10, "Namecc", [-174, 0, 235], scene)
         temp["group"].forEach(Element => group_1.push(Element));
         group_1.push(temp["hitbox"]);

        {
            var pg = utils.create_pg(scene);
    
            pg[0].__dirtyPosition = true;
            pg[0].__dirtyRotation = true;
    
    
            pg[0].position.set(-159, 10, 250)
            pg[0].rotation.set(0,utils.degrees_to_radians(45),0)
    
            scene.simulate(); //update the new position for physijs

            group_1.push(pg[0]);
        }


        temp = utils.createFlatLand(2,20, "Lava", [24, 0, 220], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(2,15, "Lava", [36, 0, 227.5], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(2,10, "Lava", [48, 0, 235], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(2,5, "Lava", [60, 0, 242.5], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(2,2, "Lava", [72, 0, 247], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(20,1, "Lava", [72, 0, 248.5], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(10,10, "Namecc", [132, 0, 235], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

       {
           var pg = utils.create_pg(scene);
   
           pg[0].__dirtyPosition = true;
           pg[0].__dirtyRotation = true;
   
   
           pg[0].position.set(147, 10, 250)
           pg[0].rotation.set(0,utils.degrees_to_radians(-45),0)
   
           scene.simulate(); //update the new position for physijs

           group_1.push(pg[0]);
   
       }

        //--

        temp = utils.createFlatLand(1,20, "Namecc", [-22.5, 0, 150], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);
       
        // temp = utils.createFlatLand(1,20, "Namecc", [-10.5, 0, 150], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);
       
        // temp = utils.createFlatLand(1,20, "Namecc", [1.5, 0, 150], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);
       
        temp = utils.createFlatLand(1,20, "Namecc", [13.5, 0, 150], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        //--

        temp = utils.createFlatLand(1,20, "Lava", [-16.5, 0, 80], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // temp = utils.createFlatLand(1,20, "Lava", [-4.5, 0, 80], scene)
        // temp["group"].forEach(Element => group_1.push(Element));
        // group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(1,20, "Lava", [7.5, 0, 80], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);


        //--

        temp = utils.createFlatLand(1,20, "Namecc", [-10.5, 0, 10], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        temp = utils.createFlatLand(1,20, "Namecc", [1.5, 0, 10], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        
        // --

        temp = utils.createFlatLand(1,20, "Lava", [-4.5, 0, -60], scene)
        temp["group"].forEach(Element => group_1.push(Element));
        group_1.push(temp["hitbox"]);

        // main platform number 1

        temp = utils.createFlatLand(30,20, "Moss", [-48, 0, -120], scene)


        {
            temp = utils.create_button(scene , [-4.5,2.5,-90], group_1);
        }

        // squared pattern platforms

        // 1st floor

        temp = utils.createFlatLand(6,6, "Amethyst", [-108, 0, -160], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', -20,10000, -108    ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -253,10000, -160 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', - 108,10000, -20   ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -160,10000, -253 ,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

        
        temp = utils.createFlatLand(6,6, "Amethyst", [108, 0, -160], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',   5, 10000, 93  ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -253, 10000, -160 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',  93, 10000, 5  ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -160, 10000, -253 ,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());


        // left mid-plat

        temp = utils.createFlatLand(6,6, "Namecc", [130, 5, -402+150], scene)


        temp = utils.createFlatLand(6,6, "Namecc", [130, 10, -379+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [130, 15, -356+150], scene)

         // right mid-plat
        temp = utils.createFlatLand(6,6, "Namecc", [-130, 5, -402+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [-130, 10, -379+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [-130, 15, -356+150], scene)

        // 2nd floor

        temp = utils.createFlatLand(6,6, "Amethyst", [-108, 20, -325+150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150,10000, -325+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', -20,10000, -108    ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150,10000, -418+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', - 108,10000, -20   ,[6,6], temp.hitbox));
       
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

        
        temp = utils.createFlatLand(6,6, "Amethyst", [108, 20, -325+150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150, 10000, -325+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',   5, 10000, 93  ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150, 10000, -418+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',  93, 10000, 5  ,[6,6], temp.hitbox));
        
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());


        // mid-platoforms

        temp = utils.createFlatLand(6,6, "Namecc", [-55, 25, -440+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [37, 25, -440+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [-32, 30, -440+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [14, 30, -440+150], scene)

        temp = utils.createFlatLand(6,6, "Namecc", [-9, 35, -440+150], scene)


         // 3rd floor

        temp = utils.createFlatLand(6,6, "Amethyst", [-108, 40, -325+150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', -20,10000, -108    ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150,10000, -325+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', - 108,10000, -20   ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150,10000, -418+150 ,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

        
        temp = utils.createFlatLand(6,6, "Amethyst", [108, 40, -325+150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',   5, 10000, 93  ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150, 10000, -325+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',  93, 10000, 5  ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150, 10000, -418+150,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

         // left mid-plat

        temp = utils.createFlatLand(6,6, "Namecc", [130, 45, -402+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [130, 50, -379+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [130, 55, -356+150], scene)
        
         // right mid-plat
        temp = utils.createFlatLand(6,6, "Namecc", [-130, 45, -402+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [-130, 50, -379+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [-130, 55, -356+150], scene)


        // 4th floor

        temp = utils.createFlatLand(6,6, "Amethyst", [-108, 60, -325+150], scene)
    
        var animations_conc = [];
    
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150,10000, -325+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', -20,10000, -108    ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150,10000, -418+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x', - 108,10000, -20   ,[6,6], temp.hitbox));
       
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

        
        temp = utils.createFlatLand(6,6, "Amethyst", [108, 60, -325+150], scene)

        var animations_conc = [];

        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -418+150, 10000, -+150 ,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',   5, 10000, 93  ,[6,6], temp.hitbox));//not squared platform i've to specify the shape, if not, can be avoided
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'z', -325+150, 10000, -418+150,[6,6], temp.hitbox));
        animations_conc.push(utils.animatePlatformByGroupInstance(temp.group,scene,'x',  93, 10000, 5  ,[6,6], temp.hitbox));
    
        animations_conc = utils.concatenateAnimationsGroup(animations_conc);
        animations_conc.forEach(elem => elem.start());

        // mid-platoforms

        temp = utils.createFlatLand(6,6, "Namecc", [-55, 65, -440+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [37, 65, -440+150], scene)
                
        temp = utils.createFlatLand(6,6, "Namecc", [-32, 70, -440+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [14, 70, -440+150], scene)
        
        temp = utils.createFlatLand(6,6, "Namecc", [-9, 75, -440+150], scene)


        // final part 

        temp = utils.createFlatLand(10,10, "Moss", [-16, 80, -480+150], scene)


        // teleport platform

        {
            utils.create_teleport([-2, 90,  -465+150], scene); // emissive light of the teleport
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
        utils.create_Box_Plane([0, 0, -1000 / 2], [90, 0, 0], 1600, scene, true);
    }


        
        /* ************************* MAiN SPHERE ***********************************/
        sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [-48, 10, -120], true); // -48, 10, -120 [0,5,600]
        // set the start position of the camera (will change)
        // camera.position.z = sphere.position.z + utils.camera_z_pos;
        // // camera.position.y = sphere.position.y + utils.camera_y_pos;
        // camera.position.y = sphere.position.y + 20;
        // camera.position.x = sphere.position.x;
        // camera.lookAt(sphere.position);

        // controls = new OrbitControls(camera, canvas);
        // controls.update();



        // scene.add(camera);
}

export function getSphere(){
    return sphere;
}