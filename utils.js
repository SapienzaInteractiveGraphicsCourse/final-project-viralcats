/* utils functions */
import { MathUtils } from './libs/threejs/build/three.module.js';
import TWEEN from './libs/tween.esm.js';

export var curr_level = 0;
export var start_animation = false;
export var button_pressed = false;


export var hitboxes_hit = [false, false, false, false, false, false];


// progressives objects
var prog_cubes = 0;
var prog_planes = 0;
var prog_spheres = 0;
var prog_hit_box = 0;
var prog_buttons = 0;
var prog_pgs = 0;

// time
var curr_time = 0;
var last_time = 0;

// groups
var bounds_group = [];
var cubes_group = [];
var objects_group = [];
var hit_boxes_group = [];
var buttons_group = [];

// dynamics and static vectors
const static_vector = new THREE.Vector3(0, 0, 0);
const dynamic_vector = new THREE.Vector3(1, 1, 1);
const distance_bound = 1000;

//physics constants
const friction_box = 1.0; // high friction
const restitution_box = 0.0; // low restitution (bouncing factor)

var pg_to_delete = true;
//pg variable
// export var pg;
export var is_pg_sphere = true;


//stats game
export var level;
export var life = document.getElementById("curr_life").innerText;
export var gameOver = false;
export var level_completed = false;
var life_tag = document.getElementById("curr_life");
life_tag.innerHTML = life;


//starting positions
export var start_level_1 = [0, 5, 400];


export var camera_x_pos = 0;
export var camera_y_pos = 70;
export var camera_z_pos = 200;

export function setPgToDelete(value) {
    pg_to_delete = value;
    prog_pgs = 0;
}

export function setLife(curr_life) {
    life = curr_life;
}

// dictionary that shows wich textures must be used, in order: top texture, side texture, bottom texture
const cubes_type = {
    "Dirt": ["Dirt", "Dirt", "Dirt"],
    "Moss": ["Moss", "Dirt", "Dirt"],
    "Grass": ["grass", "grass_side", "Dirt"],
    "Namecc": ["namecc_top", "namecc_side", "namecc_bottom"],
    "Lava": ["crimson", "crimson_side", "crimson_bottom"],
    "Rock": ["rock", "rock", "rock"],
    "Amethyst": ["amethyst", "amethyst", "amethyst"],
    "Terracotta": ["terracotta", "terracotta", "terracotta"]
}

const pg_textType = {
    "Head": ["head_l", "head_r", "head_u", "main_color", "head_f", "head_b"],
    "Body": ["armsLegs_u", "armsLegs_u", "armsLegs_u", "armsLegs_d", "body_f", "body_b"],
    "LeftArm": ["leftArm_l", "main_color", "armsLegs_u", "armsLegs_d", "leftArm_f", "leftArm_b"],
    "RightArm": ["main_color", "rightArm_r", "armsLegs_u", "armsLegs_d", "rightArm_f", "rightArm_b"],
    "LeftLeg": ["leftLeg_l", "main_color", "armsLegs_u", "armsLegs_d", "leftLeg_f", "leftLeg_b"],
    "RightLeg": ["main_color", "rightLeg_r", "armsLegs_u", "armsLegs_d", "rightLeg_f", "rightLeg_b"],
    "HeadControl": ["head_l", "head_r", "head_u", "main_color", "headControl_f", "head_b"],
}


const dim_cube = 3;


/* ************************************* internal functions ************************************* */
function load_texture_cube(tex_top_name, tex_side_name, tex_bottom_name, normal_top, normal_side, normal_bottom) {
    const textureLoader = new THREE.TextureLoader();

    var texture_top = textureLoader.load(tex_top_name);
    var texture_side = textureLoader.load(tex_side_name);
    var texture_bottom = textureLoader.load(tex_bottom_name);

    var normals_present = false
    if (normal_top != undefined) {
        var tex_nor_top = textureLoader.load(normal_top);
        var tex_nor_side = textureLoader.load(normal_side);
        var tex_nor_bottom = textureLoader.load(normal_bottom);
        normals_present = true
    }

    //varType 
    if (normals_present) {
        var materials = [
            new THREE.MeshBasicMaterial({ map: texture_side }),     // right face
            new THREE.MeshBasicMaterial({ map: texture_side }),     // left face
            new THREE.MeshBasicMaterial({ map: texture_top }),      //  upper face
            new THREE.MeshBasicMaterial({ map: texture_bottom }),   // lower face
            new THREE.MeshBasicMaterial({ map: texture_side }),     // front face
            new THREE.MeshBasicMaterial({ map: texture_side })      // opposite face
        ];
    }
    else {
        var materials = [
            new THREE.MeshPhongMaterial({ map: texture_side }),     // right face
            new THREE.MeshPhongMaterial({ map: texture_side }),     // left face
            new THREE.MeshPhongMaterial({ map: texture_top }),      //  upper face
            new THREE.MeshPhongMaterial({ map: texture_bottom }),   // lower face
            new THREE.MeshPhongMaterial({ map: texture_side }),     // front face
            new THREE.MeshPhongMaterial({ map: texture_side })      // opposite face

        ];
    }

    return materials;
}

function load_texture_pg(bodyPart) {

    var path1 = './textures/character/' + String(pg_textType[bodyPart][0]) + ".png";  // right
    var path2 = './textures/character/' + String(pg_textType[bodyPart][1]) + ".png";  // left 
    var path3 = './textures/character/' + String(pg_textType[bodyPart][2]) + ".png";  // upper 
    var path4 = './textures/character/' + String(pg_textType[bodyPart][3]) + ".png";  // lower
    var path5 = './textures/character/' + String(pg_textType[bodyPart][4]) + ".png";  // front
    var path6 = './textures/character/' + String(pg_textType[bodyPart][5]) + ".png";  // back


    var path_nor_1 = './textures/normals/' + String(pg_textType[bodyPart][0]) + ".png";  // right
    var path_nor_2 = './textures/normals/' + String(pg_textType[bodyPart][1]) + ".png";  // left 
    var path_nor_3 = './textures/normals/' + String(pg_textType[bodyPart][2]) + ".png";  // upper 
    var path_nor_4 = './textures/normals/' + String(pg_textType[bodyPart][3]) + ".png";  // lower
    var path_nor_5 = './textures/normals/' + String(pg_textType[bodyPart][4]) + ".png";  // front
    var path_nor_6 = './textures/normals/' + String(pg_textType[bodyPart][5]) + ".png";  // back


    const textureLoader = new THREE.TextureLoader();

    var texture_right = textureLoader.load(path1);
    var texture_left = textureLoader.load(path2);
    var texture_up = textureLoader.load(path3);
    var texture_down = textureLoader.load(path4);
    var texture_front = textureLoader.load(path5);
    var texture_back = textureLoader.load(path6);


    var texture_nor_right = textureLoader.load(path_nor_1);
    var texture_nor_left = textureLoader.load(path_nor_2);
    var texture_nor_up = textureLoader.load(path_nor_3);
    var texture_nor_down = textureLoader.load(path_nor_4);
    var texture_nor_front = textureLoader.load(path_nor_5);
    var texture_nor_back = textureLoader.load(path_nor_6);

    var materials = [
        new THREE.MeshPhongMaterial({ map: texture_right, normalMap: texture_nor_right }),     // right face
        new THREE.MeshPhongMaterial({ map: texture_left, normalMap: texture_nor_left }),     // left face
        new THREE.MeshPhongMaterial({ map: texture_up, normalMap: texture_nor_up }),      //  upper face
        new THREE.MeshPhongMaterial({ map: texture_down, normalMap: texture_nor_down }),   // lower face
        new THREE.MeshPhongMaterial({ map: texture_front, normalMap: texture_nor_front }),     // front face
        new THREE.MeshPhongMaterial({ map: texture_back, normalMap: texture_nor_back })      // opposite face
    ];

    return materials;
}

export function setStartAnimation(value) {
    start_animation = value;
}

export function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

export function radians_to_degrees(radians) {
    var pi = Math.PI;
    return radians * 180 / pi;
}


function getTime() {
    last_time = Date.now();
}

function setCurrentTime() {
    curr_time = Date.now();
}

function diff_time(recent_time, old_time) {
    return (recent_time - old_time);
}

function degtorad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function radtodeg(rad) {
    var pi = Math.PI;
    return rad * 180 / pi;
}


/* ************************************* external functions ************************************* */


export function setLevel(n) {
    level = n;
}



/************************************************ OBJECTS CREATION  [start] ***************************************************/

export function create_Box_Plane(pos, rot, dim, scene, is_bound, name = null, num = null) {

    var texture;
    var materials;
    const textureLoader = new THREE.TextureLoader();
    if (name == null) {
        texture = textureLoader.load('./textures/blocks/test_wall.png');
        materials = [
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 }),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 }),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 }),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 }),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 }),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 1.0 })
        ];
    }
    else {
        texture = textureLoader.load(name);

        materials = [
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        ];

        materials[num] = new THREE.MeshBasicMaterial({ map: texture });

    }






    var mat_box = new THREE.MeshFaceMaterial(materials);

    var mat_box_phy = Physijs.createMaterial(
        mat_box,
        friction_box,  // friction
        restitution_box // restitution / bounciness
    );

    var plane_box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(dim, 0, dim),
        mat_box_phy,
        // new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true,opacity: 0.3}), // wireframe: true, 
        0);  // if make static here cannot be chaged during the time

    plane_box.__dirtyPosition = true;
    plane_box.__dirtyRotation = true;
    plane_box.position.set(pos[0], pos[1], pos[2]);
    plane_box.rotateX(degrees_to_radians(rot[0]));
    plane_box.rotateY(degrees_to_radians(rot[1]));
    plane_box.rotateZ(degrees_to_radians(rot[2]));
    // plane_box.rotation.set(, degrees_to_radians(rot[1]) , degrees_to_radians(rot[2]));

    plane_box.setCcdMotionThreshold(1);
    if (is_bound) {
        plane_box.name = "bound_" + String(prog_planes);
    }
    else {
        plane_box.name = "plane_box" + String(prog_planes);
    }
    prog_planes++;
    if (is_bound) {
        plane_box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {

            if (other_object.name == ("Hitbox_pg")) {   //the hit_box of the pg
                life = parseInt(life) + parseInt(document.getElementById("curr_zombie").innerHTML);
                console.log("lives left: " + String(life));
                life_tag.innerHTML = life;
            }

            if (other_object.name == ("mainSphere")) {
                life = life - 1;
                console.log("lives left: " + String(life));
                life_tag.innerHTML = life;
                if (life == "0") {
                    console.log("Game over!!");
                    gameOver = true;
                    resetAll(scene, 20);
                }
            }

            else {   //other objects 
                scene.remove(other_object)

                if (curr_level == 0) {
                    if (other_object.id_name == "Hitbox_pg_1") {
                        pg_to_delete = false;
                    }
                }
                if (curr_level == 1) {
                    if (other_object.id_name != "Hitbox_pg_0") {
                        pg_to_delete = false;
                    }
                }
                if (curr_level == 2) {
                    if (other_object.id_name.includes("Hitbox_pg_")) {
                        pg_to_delete = false;
                    }
                }

                console.log("the object: " + String(other_object.name) + " has been removed, map limit exceeded.\nHitten the bound: " + String(plane_box.name));
            }

            scene.simulate()
        });
        bounds_group.push(plane_box);
    }
    else objects_group.push(plane_box)
    scene.add(plane_box);

    return plane_box;
}

export function create_hitbox(dim_multiplier, pos, is_dynamic, scene, alpha, is_visible, effective_dim = null, is_pg, num_pg = undefined) {
    var box;

    var materials = [
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: alpha, visible: is_visible })
    ];

    var mat_box = new THREE.MeshFaceMaterial(materials);
    if (dim_multiplier == null) {
        var geometry_cube = new THREE.CubeGeometry(effective_dim[0], effective_dim[1], effective_dim[2]);
    }
    else {
        var geometry_cube = new THREE.CubeGeometry(dim_cube * dim_multiplier[0], dim_cube * dim_multiplier[1], dim_cube * dim_multiplier[2]);
    }

    // geometry_cube.position.set(pos[0], pos[1], pos[2]);

    var mat_box_phy = Physijs.createMaterial(
        mat_box,
        friction_box,  // friction
        restitution_box // restitution / bounciness
    );

    if (is_dynamic) {
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box_phy,
            1
        );
    }
    else {  //static and cannot be changed
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box_phy,
            0
        );
    }
    box.__dirtyPosition = true;
    box.__dirtyRotation = true;

    box.position.set(pos[0], pos[1], pos[2]);
    if (is_pg) {
        box.name = "Hitbox_pg";
        box.id_name = "Hitbox_pg_" + String(prog_pgs);
        console.log("PG NAME: " + box.id_name);
        prog_pgs++;
    } else {
        box.name = "Hitbox_" + String(prog_hit_box);
        prog_hit_box++;
    }


    box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if (other_object.name == "mainSphere" && is_pg) {
            hitboxes_hit[num_pg] = true;
        }
    });

    box.setCcdMotionThreshold(0.1);
    hit_boxes_group.push(box);

    scene.add(box);
    return box;

}


export function create_Box(type, pos, is_dynamic, scene, rot = null, is_pg = false, mult_dim) {
    var box;
    var temp
    if (cubes_type[type] != undefined) {
        var path1 = './textures/blocks/' + String(cubes_type[type][0]) + ".png";  // top
        var path2 = './textures/blocks/' + String(cubes_type[type][1]) + ".png";  // side
        var path3 = './textures/blocks/' + String(cubes_type[type][2]) + ".png";  // base

        temp = load_texture_cube(path1, path2, path3);
    }
    else { // so it's a pg 
        temp = load_texture_pg(type);
    }

    var mat_box = new THREE.MeshFaceMaterial(temp);
    var geometry_cube;
    var dim_Box;

    if (typeof mult_dim == 'undefined' || mult_dim == null) {
        geometry_cube = new THREE.CubeGeometry(dim_cube, dim_cube, dim_cube)
        dim_Box = [dim_cube, dim_cube, dim_cube]
    }
    else {
        geometry_cube = new THREE.CubeGeometry(dim_cube * mult_dim[0], dim_cube * mult_dim[1], dim_cube * mult_dim[2])
        dim_Box = [dim_cube * mult_dim[0], dim_cube * mult_dim[1], dim_cube * mult_dim[2]]
    }

    var mat_box_phy = Physijs.createMaterial(
        mat_box,
        friction_box,  // friction
        restitution_box // restitution / bounciness
    );

    if (is_dynamic) {
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box_phy,
            1
        );

    }
    else {  //static and cannot be changed
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box_phy,
            0
        );

    }
    box.__dirtyPosition = true;
    box.__dirtyRotation = true;
    box.dimensions = dim_Box;

    box.position.set(pos[0], pos[1], pos[2]);


    if (rot) {
        box.rotation.set(degrees_to_radians(rot[0]), degrees_to_radians(rot[1]), degrees_to_radians(rot[2]));
    }

    if (is_pg) box.name = "main_pg";
    else box.name = "box_" + String(prog_cubes);

    prog_cubes++;

    box.setCcdMotionThreshold(0.1);
    cubes_group.push(box);
    scene.add(box);
    return box;
}


export function rotateArmsLegs(box, angle) {

    var anchorPoint = new THREE.Vector3(box.position.x, box.position.y + (box.dimensions[1] / 2 - 1), box.position.z);

    let moveDir = new THREE.Vector3(
        anchorPoint.x - box.position.x,
        anchorPoint.y - box.position.y,
        anchorPoint.z - box.position.z
    );

    moveDir.normalize();
    let moveDist = box.position.distanceTo(anchorPoint);

    box.translateOnAxis(moveDir, moveDist);

    box.rotateX(degrees_to_radians(angle));

    moveDir.multiplyScalar(-1);
    box.translateOnAxis(moveDir, moveDist);
}


export function move(box, angle) {

    var anchorPoint = new THREE.Vector3(box.position.x, box.position.y + (box.dimensions[1] / 2 - 1), box.position.z);

    let moveDir = new THREE.Vector3(
        anchorPoint.x - box.position.x,
        anchorPoint.y - box.position.y,
        anchorPoint.z - box.position.z
    );

    moveDir.normalize();
    let moveDist = box.position.distanceTo(anchorPoint);

    box.translateOnAxis(moveDir, moveDist);

    box.translateZ(degrees_to_radians(angle));

    moveDir.multiplyScalar(-1);
    box.translateOnAxis(moveDir, moveDist);
}


export function create_Sphere(dim, color, type, scene, pos = null, is_main) {
    var path;
    var normal_path;
    var specular_path;
    if (cubes_type[type] != undefined) {
        path = "./textures/blocks/" + String(type.toLowerCase()) + ".png";
        normal_path = "./textures/normals/" + String(type) + ".png";
        specular_path = "./textures/specular/" + String(type) + ".png";
    }
    else {
        path = "./textures/character/" + String(type) + ".png";
        normal_path = "./textures/normals/" + String(type) + ".png";
        specular_path = "./textures/specular/" + String(type) + ".png";
    }

    var tex = new THREE.TextureLoader().load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);

    var nor_tex = new THREE.TextureLoader().load(normal_path);
    nor_tex.wrapS = THREE.RepeatWrapping;
    nor_tex.wrapT = THREE.RepeatWrapping;
    nor_tex.repeat.set(5, 5);

    var spec_tex = new THREE.TextureLoader().load(specular_path);
    nor_tex.wrapS = THREE.RepeatWrapping;
    nor_tex.wrapT = THREE.RepeatWrapping;
    nor_tex.repeat.set(5, 5);


    // varType
    var sphereMat = new THREE.MeshPhongMaterial({
        map: tex,
        normalMap: nor_tex,
        specularMap: spec_tex,
        color: color,
        specular: 0xADD8E6,
        shininess: 0
    });

    var sphereMat_phy = Physijs.createMaterial(
        sphereMat,
        friction_box,  // friction
        restitution_box // restitution / bounciness
    );

    const sphereRadius = dim;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    var sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    var sphere = new Physijs.SphereMesh(sphereGeo, sphereMat_phy, 1000);
    if (pos) {
        sphere.position.set(pos[0], pos[1], pos[2]);
        sphere.initial_pos = pos
    } else {
        sphere.position.set(-sphereRadius - 1 - 25, sphereRadius + 20, 0);
    }
    if (is_main) {
        sphere.name = "mainSphere";
        sphere.canJump = true;
        sphere.isFallen = false;
    }
    else sphere.name = "sphere_" + String(prog_spheres);
    prog_spheres++;
    sphere.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if (is_main) {

            sphere.canJump = true;   //will be false when the jump is used.
            if (other_object.name.includes("bound_")) {
                sphere.__dirtyPosition = true;
                sphere.__dirtyRotation = true;
                sphere.position.set(sphere.initial_pos[0], sphere.initial_pos[1], sphere.initial_pos[2])

                sphere.setLinearVelocity(new THREE.Vector3(0, 0, 0));
                sphere.setAngularVelocity(new THREE.Vector3(0, 0, 0));

                sphere.isFallen = true;

                scene.simulate()
            }
        }
    });

    objects_group.push(sphere);
    scene.add(sphere);
    return sphere;
}


export function create_teleport(pos, scene) {

    var path = "./textures/blocks/grass.png";
    var radius = 5;
    var subdivs = 32;
    var telGeo = new THREE.CylinderGeometry(radius, radius, radius * 4, subdivs, 1, false)

    var tex = new THREE.TextureLoader().load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);

    // varType
    var material_tel = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0x15B7FF,
        transparent: true,
        opacity: 0.8,

    });

    var myBoxMaterial = Physijs.createMaterial(
        material_tel,
        0,  // friction
        0 // restitution/bounciness
    );

    var teleport = new THREE.Mesh(telGeo, material_tel);


    teleport.name = "teleport";
    teleport.position.set(pos[0], pos[1], pos[2]);

    objects_group.push(teleport);
    scene.add(teleport);
    return teleport
}

export function create_button(scene, pos, group) {
    var button;
    var radius = 3;
    var subdivs = 64;
    var buttonGeo = new THREE.CylinderGeometry(radius, radius, radius / 2, subdivs, 1, false)
    button_pressed = false;
    var material_button = new THREE.MeshPhongMaterial({
        color: 0xff0000,

        specular: 0xff0000,
        emissive: 0xff0000,
        shininess: 50
    });

    var buttonMaterial = Physijs.createMaterial(
        material_button,
        0,  // friction
        0 // restitution/bounciness
    );

    button = new Physijs.CylinderMesh(buttonGeo, buttonMaterial, 0)// static
    prog_buttons++;
    button.name = "button_" + String(prog_buttons);
    button.__dirtyPosition = true;
    button.__dirtyRotation = true;
    button.position.set(pos[0], pos[1], pos[2]);
    button.pushed = false;
    button.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        if (!button.pushed && other_object.name == "mainSphere") {
            var new_prop_mat = new THREE.MeshPhongMaterial({
                color: 0x00ff00,

                specular: 0x00ff00,
                emissive: 0x00ff00,
                shininess: 50
            });

            var new_mat = Physijs.createMaterial(
                new_prop_mat,
                0,
                0
            );
            button.material = new_mat

            var mainSphere = scene.getObjectByName("mainSphere");
            mainSphere.initial_pos = [pos[0], pos[1] + 5, pos[2]];
            mainSphere.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            mainSphere.setAngularVelocity(new THREE.Vector3(0, 0, 0));

            removeByGroup(group, scene);
            button.pushed = true;
            button_pressed = true;
        }

    });
    buttons_group.push(button);


    scene.add(button)
    return button
}


export function create_pg(scene, num_pg, loc = undefined) {
    //the root: head
    var head

    if (!is_pg_sphere) {
        head = create_Box("Head", [0, 6, 0], 1, scene, null, true, null,);
    }
    else {
        head = create_Box("HeadControl", [0, 6, 0], 1, scene, null, true, null,);
    }

    head.scale.set(1, 1, 1);

    // **************** the hitbox*********************
    var hit_box;
    if (loc == undefined) {
        hit_box = create_hitbox([1.5, 5, 1], [0, 9.5, -10], 1, scene, 0.3, false, undefined, true, num_pg);
    }
    else {
        hit_box = create_hitbox([1.5, 5, 1], [loc[0], loc[1], loc[2]], 1, scene, 0.3, false, undefined, true, num_pg);
        // hit_box.initial_pos =  [loc[0], loc[1], loc[2]]; // no assign cause it's not the actual fist one.
    }
    hit_box.initial_pos = [0, 9.5, -10];



    var body = create_Box("Body", [0, -4.5, 0], 0, scene, null, false, [1.0, 2, 1.0]);
    // body.scale.set(1.0, 2, 1.0);

    var left_arm = create_Box("LeftArm", [2.25, 0, 0], 0, scene, null, false, [0.5, 2.0, 0.5]);
    // left_arm.scale.set(0.5, 2.0, 0.5);

    var right_arm = create_Box("RightArm", [-2.25, 0, 0], 0, scene, null, false, [0.5, 2.0, 0.5]);
    // right_arm.scale.set(0.5, 2.0, 0.5);

    var left_leg = create_Box("LeftLeg", [0.75, -5.5, 0], 0, scene, null, false, [0.45, 2.5, 0.5]);
    // left_leg.scale.set(0.5, 2.0, 1.0);

    var right_leg = create_Box("RightLeg", [-0.75, -5.5, 0], 0, scene, null, false, [0.45, 2.5, 0.5]);
    // right_leg.scale.set(0.5, 2.0, 1.0);

    hit_box.add(head)
    head.add(body)

    body.add(left_arm)
    body.add(right_arm)
    body.add(left_leg)
    body.add(right_leg)

    return [hit_box, head, body, left_arm, right_arm, left_leg, right_leg];
}

/**************************************************** OBJECTS CREATION  [end] ******************************************************/

/******************************************************* LIGHTS [start] ***********************************************************/

export function create_pointLight(pos, color, scene) {
    const light = new THREE.PointLight(color, 1, 0);
    light.position.set(pos[0], pos[1], pos[2]);
    scene.add(light);
    return light
}

export function create_directionalLight(color, scene, direction) {
    const light = new THREE.DirectionalLight(color, 1.0)
    light.position.set(direction[0], direction[1], direction[2])

    scene.add(light)
    return light
}

/******************************************************* LIGHTS [end] *************************************************************/

/*************************************************** Lands scenario [start] ******************************************************/

export function createFlatLand(n_width, n_depth, type, left_top_pos, scene) {
    var hit_box_width = n_width * dim_cube;
    var hit_box_depth = n_depth * dim_cube;
    var hit_box_height = dim_cube;
    var epsilon = 0



    var hit_box = create_hitbox(null, [left_top_pos[0] + hit_box_width / 2 - dim_cube / 2, left_top_pos[1], left_top_pos[2] + hit_box_depth / 2 - dim_cube / 2], 0, scene, 0.9, false, [hit_box_width, hit_box_height, hit_box_depth]);
    hit_box.initial_pos = [left_top_pos[0] + hit_box_width / 2, left_top_pos[1], left_top_pos[2] + hit_box_depth / 2];

    var flat_land_group = [];
    var box;
    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {
            box = create_Box(type, [left_top_pos[0] + i * (dim_cube - epsilon), left_top_pos[1], left_top_pos[2] + j * (dim_cube - epsilon)], 0, scene);
            flat_land_group.push(box);

        }
    }


    return { 'group': flat_land_group, 'hitbox': hit_box };
}


export function createUphillLand(n_width, n_depth, height_desired, type, left_top_pos, scene) {
    var uphill_group = [];
    var box;
    var step = Math.floor(180 / (n_width - 1));

    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {

            box = create_Box(type, [left_top_pos[0] + i * (dim_cube + epsilon), left_top_pos[1] + Math.floor(height_desired * Math.sin(degrees_to_radians((step * i)))), left_top_pos[2] + j * (dim_cube + epsilon)], false, scene);
            uphill_group.push(box);
        }
    }
    return uphill_group;
}


export function createAscentGround(n_width, n_depth, height_desired, type, left_top_pos, scene, direction = "+x") {
    var ascent_group = [];
    var box;
    var step = Math.floor(height_desired / (n_width));

    if (direction == "+x") {
        for (var i = 0; i < n_width; i++) {
            for (var j = 0; j < n_depth; j++) {

                box = create_Box(type, [left_top_pos[0] + i * dim_cube, left_top_pos[1] + Math.floor(step * (i + 1)), left_top_pos[2] + j * dim_cube], false, scene);
                ascent_group.push(box);
            }
        }
    }
    else if (direction == "+z") {
        for (var i = 0; i < n_width; i++) {
            for (var j = 0; j < n_depth; j++) {

                box = create_Box(type, [left_top_pos[0] + j * dim_cube, left_top_pos[1] + Math.floor(step * (i + 1)), left_top_pos[2] - i * dim_cube], false, scene);
                ascent_group.push(box);
            }
        }

    }
    return ascent_group;
}


export function createDescentGround(n_width, n_depth, actual_height, type, left_top_pos, scene, direction = "+x") {
    var descent_group = [];
    var box;
    var step = Math.floor(actual_height / n_width);

    if (direction == "+x") {
        for (var i = 0; i < n_width; i++) {
            for (var j = 0; j < n_depth; j++) {

                box = create_Box(type, [left_top_pos[0] + i * dim_cube, left_top_pos[1] - Math.floor(step * (i)), left_top_pos[2] + j * dim_cube], false, scene);
                descent_group.push(box);
            }
        }
    }
    else if (direction == "+z") {
        for (var i = 0; i < n_width; i++) {
            for (var j = 0; j < n_depth; j++) {

                box = create_Box(type, [left_top_pos[0] + j * dim_cube, left_top_pos[1] - Math.floor(step * (i)), left_top_pos[2] - i * dim_cube], false, scene);
                descent_group.push(box);
            }
        }
    }
    return descent_group;
}


export function createPhysicWall(type, scene, row, columns, left_down_pos, on_x) {
    var wall_group = [];
    var box;

    for (var i = 0; i < row; i++) {
        for (var j = 0; j < columns; j++) {
            if (on_x)
                box = create_Box(type, [(left_down_pos[0] + dim_cube / 2) + j * dim_cube, (left_down_pos[1] + dim_cube / 2) + i * dim_cube, (left_down_pos[2] + dim_cube / 2)], 1.0, scene);
            else  //create along z axis 
                box = create_Box(type, [(left_down_pos[0] + dim_cube / 2), (left_down_pos[1] + dim_cube / 2) + i * dim_cube, (left_down_pos[2] + dim_cube / 2) + j * dim_cube], 1.0, scene);

            box.__dirtyPosition = false;
            box.__dirtyRotation = false;
            wall_group.push(box);

        }
    }
    return wall_group;

}

/*************************************************** Lands scenario [start] ******************************************************/

/****************************************************** animations  [start] *******************************************************/

export function animateTeleport(scene) {
    var teleport = scene.getObjectByName("teleport");
    if (teleport) {
        teleport.rotation.y += degrees_to_radians(1);  //  attention to the friction of the plane where is situated
        scene.simulate();
    }
}

export function animatePlatformByName(name, scene, axis, new_position_a, time, new_position_b) {  //last parameter is not strictly rewired for just a single animation
    var value_axis_from;
    var value_axis_to;
    var platform = scene.getObjectByName(name);

    if (typeof new_position_b !== 'undefined') {
        value_axis_from = new_position_b;
        value_axis_to = new_position_a;
    } else {
        if (axis == "x") value_axis_from = platform.position.x;
        else if (axis == 'y') value_axis_from = platform.position.y;
        else if (axis == 'z') value_axis_from = platform.position.z;
        value_axis_to = new_position_a;
    }

    if (platform) {
        platform.is_dynamic = 0;
        platform.__dirtyPosition = true;
        platform.__dirtyRotation = true;

        var initial_value = { pos: value_axis_from }
        var animation = new TWEEN.Tween(initial_value).to({ pos: value_axis_to }, time);

        animation.easing(TWEEN.Easing.Linear.None)
        animation.onUpdate(function () {
            if (axis == "x") platform.position.x = initial_value.pos;
            else if (axis == 'y') platform.position.y = initial_value.pos;
            else if (axis == 'z') platform.position.z = initial_value.pos;
        }).onComplete(function () {
            platform.__dirtyPosition = true;
            platform.__dirtyRotation = true;
        });

        // or not using Tween -> platform.position.x += 0.5 ....

        scene.simulate();
        return animation;
    }
}

export function animatePlatformByInstance(platform, scene, axis, new_position_a, time, new_position_b) {

    var value_axis_from;
    var value_axis_to;

    if (typeof new_position_b !== 'undefined') {
        value_axis_from = new_position_b;
        value_axis_to = new_position_a;
    }
    else {
        if (axis == "x") value_axis_from = platform.position.x;
        else if (axis == 'y') value_axis_from = platform.position.y;
        else if (axis == 'z') value_axis_from = platform.position.z;
        value_axis_to = new_position_a;
    }

    if (platform) {
        platform.is_dynamic = 0;
        platform.__dirtyPosition = true;
        platform.__dirtyRotation = true;

        var initial_value = { pos: value_axis_from }
        var animation = new TWEEN.Tween(initial_value).to({ pos: value_axis_to }, time);

        animation.easing(TWEEN.Easing.Linear.None)
        animation.onUpdate(function () {
            if (axis == "x") platform.position.x = initial_value.pos;
            else if (axis == 'y') platform.position.y = initial_value.pos;
            else if (axis == 'z') platform.position.z = initial_value.pos;
        }).onComplete(function () {
            platform.__dirtyPosition = true;
            platform.__dirtyRotation = true;
        });
        // or not using Tween -> platform.position.x += 0.5 ....
        scene.simulate();

    }
    return animation;
}

export function animatePlatformByGroupInstance(group, scene, axis, new_position_a, time, new_position_b, irregular_shape, hit_box = null) {  //irregular_shape parameter only if is not a squared platform.

    var animations = [];
    var value_axis_from;
    var value_axis_to;
    var max_length;

    if (typeof irregular_shape !== 'undefined') {
        max_length = irregular_shape[1];
    }
    else max_length = Math.sqrt(group.length);

    var i = 0, j = 0;

    group.forEach(platform => {

        if (i >= max_length) {
            i = 0;
            j++;
        }

        if (typeof new_position_b !== 'undefined') {
            if (axis == "x") {
                value_axis_from = new_position_b + j * dim_cube;
                value_axis_to = new_position_a + j * dim_cube;
            }
            else if (axis == 'y') {
                value_axis_from = new_position_b;
                value_axis_to = new_position_a;
            }
            else if (axis == 'z') {
                value_axis_from = new_position_b + i * dim_cube;
                value_axis_to = new_position_a + i * dim_cube;
            }
        }
        else {
            if (axis == "x") {
                value_axis_from = platform.position.x;
                value_axis_to = new_position_a + j * dim_cube;
            }
            else if (axis == 'y') {
                value_axis_from = platform.position.y;
                value_axis_to = new_position_a;
            }
            else if (axis == 'z') {
                value_axis_from = platform.position.z;
                value_axis_to = new_position_a + i * dim_cube;
            }
        }
        if (platform) {
            platform.is_dynamic = 0;
            platform.__dirtyPosition = true;
            platform.__dirtyRotation = true;

            var initial_value = { pos: value_axis_from }
            var animation = new TWEEN.Tween(initial_value).to({ pos: value_axis_to }, time);

            animation.easing(TWEEN.Easing.Linear.None)
            animation.onUpdate(function () {
                if (hit_box != undefined || hit_box != null) {
                    hit_box.__dirtyPosition = true;
                    var dispx, dispz, dispy;
                    if (typeof irregular_shape != 'undefined') {
                        dispx = (irregular_shape[0] / 2 * dim_cube) - dim_cube / 2;
                        dispz = (irregular_shape[1] / 2 * dim_cube) - dim_cube / 2;
                        dispy = - dim_cube / 2;
                    }
                    else {
                        dispx = (max_length / 2 * dim_cube) - dim_cube / 2;
                        dispz = dispx;
                        dispy = - dim_cube / 2;
                    }
                    if (axis == "x") {
                        platform.position.x = initial_value.pos;
                        hit_box.position.x = platform.position.x - dispx;
                    }
                    else if (axis == 'y') {
                        platform.position.y = initial_value.pos;
                        hit_box.position.y = platform.position.y - dispy;
                    }
                    else if (axis == 'z') {
                        platform.position.z = initial_value.pos;
                        hit_box.position.z = platform.position.z - dispz;
                    }
                    scene.simulate()
                }
                else {
                    if (axis == "x") {
                        platform.position.x = initial_value.pos;
                    }
                    else if (axis == 'y') {
                        platform.position.y = initial_value.pos;
                    }
                    else if (axis == 'z') {
                        platform.position.z = initial_value.pos;
                    }
                }

            }).onComplete(function () {
                platform.__dirtyPosition = true;
                platform.__dirtyRotation = true;
            });

            // or not using Tween -> platform.position.x += 0.5 ....

            scene.simulate();

            animations.push(animation);

            i++;
        }
    });
    return animations;
}


export function animateBackAndForwardName(name, scene, axis, new_position_a, new_position_b, time) {
    var animation_a;
    var animation_b;

    animation_a = animatePlatformByName(name, scene, axis, new_position_a, time);
    animation_b = animatePlatformByName(name, scene, axis, new_position_b, time, new_position_a);

    animation_a.chain(animation_b);
    animation_b.chain(animation_a);

    return animation_a;
}

export function animateBackAndForwardInstance(instance, scene, axis, new_position_a, new_position_b, time) {
    var animation_a;
    var animation_b;

    animation_a = animatePlatformByInstance(instance, scene, axis, new_position_a, time);
    animation_b = animatePlatformByInstance(instance, scene, axis, new_position_b, time, new_position_a);

    animation_a.chain(animation_b);
    animation_b.chain(animation_a);

    return animation_a;
}


export function animateBackAndForwardInstanceGroup(group, scene, axis, new_position_a, new_position_b, time, hit_box) {
    var animations_a;
    var animations_b;
    var i;
    var length;

    if (hit_box != undefined || hit_box != null) {
        animations_a = animatePlatformByGroupInstance(group, scene, axis, new_position_a, time, undefined, undefined, hit_box);
        animations_b = animatePlatformByGroupInstance(group, scene, axis, new_position_b, time, new_position_a, undefined, hit_box);
    }
    else {
        animations_a = animatePlatformByGroupInstance(group, scene, axis, new_position_a, time, undefined, undefined);
        animations_b = animatePlatformByGroupInstance(group, scene, axis, new_position_b, time, new_position_a, undefined);
    }
    length = animations_a.length;
    // console.log(animations_a);
    for (i = 0; i < length; i++) {
        animations_a[i].chain(animations_b[i]);
        animations_b[i].chain(animations_a[i]);
    }
    return animations_a;
}

function resetScene(scene) {
    scene.children.forEach(function (object) {
        if (object) {
            scene.remove(object);
        }
    });

    for (var i in scene._objects) {
        if (scene._objects[i]) {
            scene.remove(scene._objects[i]);
        }
    }

    for (var i = scene.children.length - 1; i >= 0; i--) {
        var obj = scene.children[i];
        if (obj)
            scene.remove(obj);
    }
}

export function changeLevel(scene, function_init_scene) {
    resetScene(scene);
    function_init_scene(scene);
}

export function concatenateAnimationsGroup(animations) {
    var length_animations = animations.length;
    var i, j;

    if (length_animations == 0) return;
    if (length_animations == 1) return animations[0];
    var length_singleAnim = animations[0].length;

    for (i = 0; i < length_animations; i++) {

        if (i == (length_animations - 1)) {
            for (j = 0; j < length_singleAnim; j++) {
                animations[i][j].chain(animations[0][j]);
            }
        }
        else {
            for (j = 0; j < length_singleAnim; j++) {
                animations[i][j].chain(animations[i + 1][j]);
            }
        }
    }
    return animations[0];
}


export function animateFallenPlatformGroup(platform, scene, irregular_shape, hit_box, sphere) {

    // tremble anim
    var tremble_anims = [];
    var tremble_anim_start;
    var x = platform[0].position.x;
    var z = platform[0].position.z;
    var intensity = 0.5;

    // going down anim
    var goingDown_anims = [];
    var initial_value = { pos: platform[0].position.y }
    var hb_notRemoved = true;

    platform.forEach(cube_plat => {
        var animation = new TWEEN.Tween(initial_value).to({ pos: - 400 }, 3000);

        animation.easing(TWEEN.Easing.Cubic.In)
        animation.onUpdate(function () {
            cube_plat.position.y = initial_value.pos
            hit_box.position.y = cube_plat.position.y;

        }).onComplete(function () {
            scene.remove(cube_plat);
        });
        goingDown_anims.push(animation);
    })


    if (typeof irregular_shape !== 'undefined') {

        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z + intensity, 50, z));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z, 50, z + intensity));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z - intensity, 50, z));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z, 50, z - intensity));
        // x axis trambles
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x + intensity, 50, x));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x, 50, x + intensity));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x - intensity, 50, x));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x, 50, x - intensity));

    } else {

        // z axis trambles
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z + intensity, 50, z));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z, 50, z + intensity));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z - intensity, 50, z));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'z', z, 50, z - intensity));

        // x axis trambles
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x + intensity, 50, x));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x, 50, x + intensity));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x - intensity, 50, x));
        tremble_anims.push(animatePlatformByGroupInstance(platform, scene, 'x', x, 50, x - intensity));

    }
    tremble_anim_start = concatenateAnimationsGroup(tremble_anims);
    tremble_anim_start.forEach(elem => elem.start());


    setTimeout(function () {

        if (hb_notRemoved) {
            try {
                scene.remove(hit_box);
            } catch (error) {
                console.log(error);
            }
        }

        tremble_anims.forEach(anims => anims.forEach(anim => anim.pause()));

        goingDown_anims.forEach(anim => {
            anim.start();
        })
    }, 5000)

}

/****************************************************** animations  [start] *******************************************************/

/****************************************************** gameplay  [start] *******************************************************/

export function change_main(scene, camera) {

    var loc;

    if (is_pg_sphere) {  // now the controllable character will be the man
        console.log("dfffd")

        var temp = load_texture_pg("Head");
        var mat_box = new THREE.MeshFaceMaterial(temp);
        var mat_box_phy = Physijs.createMaterial(
            mat_box,
            friction_box,// friction
            restitution_box // restitution / bounciness
        );
        pg[1].material = mat_box_phy

        is_pg_sphere = false;
    }
    else {  // now the controllable character will be the sphere

        var temp = load_texture_pg("HeadControl");
        var mat_box = new THREE.MeshFaceMaterial(temp);
        var mat_box_phy = Physijs.createMaterial(
            mat_box,
            friction_box,// friction
            restitution_box // restitution / bounciness
        );
        pg[1].material = mat_box_phy

        is_pg_sphere = true;
    }
    scene.simulate();

    return is_pg_sphere == true ? undefined : pg[0];
}

export function update_arrow_sphere(scene) {  //update with the direction of the sphere 
    if (is_pg_sphere) {
        var sphere = scene.getObjectByName("mainSphere");
        var sphere_direction = scene.getObjectByName("sphere_direction");
        var from = sphere.position
        var to = new THREE.Vector3(from.x, from.y, from.z + 10);

    }
}

export function toggle_level_completed() {
    level_completed = false;
}

export function check_in_teleport(scene, pos_main_pg) {
    var teleport = scene.getObjectByName("teleport");
    if (teleport) {
        var radius_size_check = 5;
        var height_size_check = 10;
        var conditionx = (teleport.position.x - radius_size_check < pos_main_pg[0]) && (pos_main_pg[0] < teleport.position.x + radius_size_check);
        var conditiony = (teleport.position.y - height_size_check < pos_main_pg[1]) && (pos_main_pg[1] < teleport.position.y + height_size_check);
        var conditionz = (teleport.position.z - radius_size_check < pos_main_pg[2]) && (pos_main_pg[2] < teleport.position.z + radius_size_check);
        if (conditionx && conditiony && conditionz) {
            console.log("Level completed!! ");
            curr_level++;
            level_completed = true;
        }
    }
}

export function setCurrentLevel(value) {
    curr_level = value;
}
/****************************************************** gameplay  [end] *******************************************************/

/****************************************************** Rendering  [start] ********************************************************/


export function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

/****************************************************** Rendering  [end] ********************************************************/

/****************************************************** Resetting  [start] ******************************************************/

export function reset_data() {
    prog_cubes = 0;
    prog_planes = 0;
    prog_spheres = 0;
    prog_hit_box = 0;
    prog_buttons = 0;

    bounds_group = [];
    cubes_group = [];
    objects_group = [];
    hit_boxes_group = [];
    buttons_group = [];

    last_time = 0;
    curr_time = 0;
    hitboxes_hit = [false, false, false, false, false, false];

    is_pg_sphere = true;

    life = document.getElementById("curr_life").innerText;
}


export function remove_allBoxes(scene) {
    cubes_group.forEach(Element => scene.remove(Element));
}

export function remove_allBounds(scene) {
    bounds_group.forEach(Element => scene.remove(Element));
}

export function remove_OtherObjects(scene) {
    objects_group.forEach(Element => scene.remove(Element));
}

export function remove_hit_boxes(scene) {
    hit_boxes_group.forEach(Element => scene.remove(Element));
}

export function remove_buttons(scene) {
    buttons_group.forEach(Element => scene.remove(Element));
}

export function removeByGroup(group, scene) {

    if (pg_to_delete) {
        group.forEach(Element => scene.remove(Element));
    } else {
        group.forEach(Element => {
            if (curr_level == 0) {
                if (Element.id_name != "Hitbox_pg_1") {
                    scene.remove(Element)
                }
            }
            if (curr_level == 1) {
                if (Element.id_name != "Hitbox_pg_0") {
                    scene.remove(Element)
                }
            }
            if (curr_level == 2) {
                if (Element.id_name != undefined) {
                    if (!Element.id_name.includes("Hitbox_pg_")) {
                        scene.remove(Element)
                    }
                }
            }
        });
    }
    scene.simulate();
}

export function resetAll(scene, time) {
    setTimeout(function () {

        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }

        reset_data();
        scene.onSimulationResume();
    },
        time
    )
}

/****************************************************** Resetting  [end] ******************************************************/
