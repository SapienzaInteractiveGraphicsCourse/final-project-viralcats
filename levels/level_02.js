import * as utils from '../utils.js';

//groups for the checkpoints
var group_1 = [];
export var list_of_pgs = new Array();
var sphere;


export function level_2(scene){


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
            }
        
    /* ************************* OTHER ELEMENTS ***********************************/

    {
        utils.create_teleport([0, 0, -500], scene); // emissive light of the teleport
    }





    for(var i = 0; i < parseInt(document.getElementById("curr_zombie").innerText)-1; i++){
        list_of_pgs.push(utils.create_pg(scene,[10+i*15,20,380]));
    }

    list_of_pgs.push(utils.create_pg(scene,[95, 100, 150]));


        // utils.create_teleport([15, 115, 100], scene); // emissive light of the teleport
    




    
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
    sphere = utils.create_Sphere(3, 0xFFFFFF, "armsLegs_u", scene,  [0,5,400], true); // [0,5,400][20, 120, -125]






        // for(var i = 0; i < parseInt(document.getElementById("curr_zombie").innerText)-1; i++){
        //     list_of_pgs.push(utils.create_pg(scene,[10+i*15,20,380]));
        // }

        // list_of_pgs.push(utils.create_pg(scene,[95, 100, 150]));


        // utils.create_teleport([15, 115, 100], scene); // emissive light of the teleport
    

    


    // if(utils.curr_level == 1)
    //     walk_around(list_of_pgs[0]);
}

export function getSphere(){
    return sphere;
}
