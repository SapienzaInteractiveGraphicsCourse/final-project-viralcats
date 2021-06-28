/* utils functions */

// import { ObjectLoader } from "./libs/threejs/build/three.module";
import TWEEN from './libs/tween.esm.js';

// progressives objects
var prog_cubes = 0;
var prog_planes = 0;
var prog_spheres = 0;

// time
var curr_time = 0;
var last_time = 0;

// groups
var bounds_group = [];
var cubes_group = [];
var objects_group = [];

// dynamics and static vectors
const static_vector = new THREE.Vector3(0, 0, 0);
const dynamic_vector = new THREE.Vector3(1, 1, 1);
const distance_bound = 1000;


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

const dim_cube = 3;


/* ************************************* internal functions ************************************* */
function load_texture_cube(tex_top_name, tex_side_name, tex_bottom_name) {
    const textureLoader = new THREE.TextureLoader();

    var texture_top = textureLoader.load(tex_top_name);
    var texture_side = textureLoader.load(tex_side_name);
    var texture_bottom = textureLoader.load(tex_bottom_name);

    var materials = [
        new THREE.MeshBasicMaterial({ map: texture_side, transparent: true }),     // right face
        new THREE.MeshBasicMaterial({ map: texture_side, transparent: true }),     // left face
        new THREE.MeshBasicMaterial({ map: texture_top, transparent: true }),      //  upper face
        new THREE.MeshBasicMaterial({ map: texture_bottom, transparent: true }),   // lower face
        new THREE.MeshBasicMaterial({ map: texture_side, transparent: true }),     // front face
        new THREE.MeshBasicMaterial({ map: texture_side, transparent: true })      // opposite face
    ];

    return materials;
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
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
  
  function radtodeg(rad){
    var pi = Math.PI;
    return rad*180/pi;
  }


/* ************************************* external functions ************************************* */

export function create_Box_Plane(pos, rot, dim, scene, is_bound) {

    const textureLoader = new THREE.TextureLoader();
    // var texture = textureLoader.load('./textures/blocks/test_wall.png');

    // var materials = [
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 }),
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 }),
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 }),
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 }),
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 }),
    //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.6 })
    // ];

    var materials = [
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
    ];



    var mat_box = new THREE.MeshFaceMaterial(materials);

    var plane_box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(dim, 0, dim),
        mat_box,
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
    plane_box.name = "plane_box" + String(prog_planes);
    prog_planes++;
    if (is_bound) {
        plane_box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
            scene.remove(other_object)
            scene.simulate()
            console.log("the object: " + String(other_object.name) + " has been removed, map limit exceeded.\nHitten the bound: " + String(plane_box.name));
            // console.log("Che botta!");
            // box.setAngularVelocity(new THREE.Vector3(20, 0, 0));
            // box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        });
        bounds_group.push(plane_box);
    }
    else objects_group.push(plane_box)
    scene.add(plane_box);
}



export function create_Box(type, pos, is_dynamic, scene) {
    var path1 = './textures/blocks/' + String(cubes_type[type][0]) + ".png";  // top
    var path2 = './textures/blocks/' + String(cubes_type[type][1]) + ".png";  // side
    var path3 = './textures/blocks/' + String(cubes_type[type][2]) + ".png";  // base
    var box;

    var temp = load_texture_cube(path1, path2, path3);

    var mat_box = new THREE.MeshFaceMaterial(temp);
    var geometry_cube = new THREE.CubeGeometry(dim_cube, dim_cube, dim_cube)
    // geometry_cube.dynamic = is_dynamic;

    // console.log(is_dynamic);



    if (is_dynamic) {
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box,
            1
        );

        // box.setAngularFactor(static_vector);
        // box.setAngularVelocity(static_vector);
        // box.setLinearFactor(static_vector);
        // box.setLinearVelocity(static_vector);


        // box.setAngularFactor({x:0, y:0, z:0});
        // box.setAngularVelocity({x:0,y:0,z:0});

        // box.setLinearFactor({x:0, y:0, z:0});
        // box.setLinearVelocity({x:0, y:0, z:0});
    }
    else {  //static and cannot be changed
        box = new Physijs.BoxMesh(
            geometry_cube,
            mat_box,
            0
        );

    }
    box.__dirtyPosition = true;
    box.__dirtyRotation = true;


    box.position.set(pos[0], pos[1], pos[2]);

    box.name = "box_" + String(prog_cubes);
    prog_cubes++;
    box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // console.log("Che botta!");
        // box.setAngularVelocity(new THREE.Vector3(20, 0, 0));
        // box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    });

    box.setCcdMotionThreshold(0.1);
    cubes_group.push(box);
    scene.add(box);
    return box;
}

export function create_Sphere(dim, color, type, scene) {
    var path = "./textures/blocks/" + String(type) + ".png";

    var tex = new THREE.TextureLoader().load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);

    var sphereMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: color,
        // transparent: true,
        // opacity: 0.8
    });

    const sphereRadius = dim;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    var sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    // var sphereMat = new THREE.MeshBasicMaterial({ color: color })
    var sphere = new Physijs.SphereMesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1 - 25, sphereRadius + 20, 0);
    sphere.name = "sphere_" + String(prog_spheres);
    prog_spheres++;
    sphere.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // console.log("Colpita la sfera");
        // remove object after being hit
        // if (scene.getObjectByName('plane')){
        //     scene.remove(plane);
        // }
    });
    objects_group.push(sphere);
    scene.add(sphere);
}



export function create_teleport(pos, scene) {

    var path = "./textures/blocks/grass.png";
    // first solution 

    // var temp = load_texture_teloport(path);

    // var mat_box = new THREE.MeshFaceMaterial(temp);
    // var geometry_cube = new THREE.CubeGeometry(5, 0.2, 5)
    // geometry_cube.dynamic = true;

    // var teleport = new Physijs.BoxMesh(
    //     geometry_cube,
    //     mat_box
    // );

    //second solution

    var radius = 5;
    var subdivs = 32;
    var telGeo = new THREE.CylinderGeometry(radius, radius, radius * 4, subdivs, 1, false)

    var tex = new THREE.TextureLoader().load(path);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);

    var material_tel = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0x15B7FF,
        transparent: true,
        opacity: 0.8

        // specular: 0x6C00FF,
        // emissive: 0x6C00FF,
        // emissiveIntensity : 1,
        // shininess: 0 
        // side: THREE.DoubleSide
    });

    var myBoxMaterial = Physijs.createMaterial(
        material_tel,
        0,  // friction
        0 // restitution / bounciness
    );
    var teleport = new Physijs.CylinderMesh(telGeo, myBoxMaterial);

    teleport.name = "teleport";
    teleport.__dirtyPosition = true;
    teleport.__dirtyRotation = true;
    teleport.position.set(pos[0], pos[1], pos[2]);
    teleport.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // console.log("level ended!")
    });
    objects_group.push(teleport);
    scene.add(teleport);
    return teleport
}

export function create_pointLIght(pos, color, scene) {
    const light = new THREE.PointLight(color, 1, 0);
    light.position.set(pos[0], pos[1], pos[2]);
    scene.add(light);
}

export function createFlatLand(n_width, n_depth, type, left_top_pos, scene) {
    var flat_land_group = [];
    var box;
    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {
            box = create_Box(type, [left_top_pos[0] + i * dim_cube, left_top_pos[1], left_top_pos[2] + j * dim_cube], 0, scene);
            // box.setAngularFactor(static_vector );
            // box.setAngularVelocity(static_vector);
            // box.setLinearFactor(static_vector);
            // box.setLinearVelocity(static_vector);
            flat_land_group.push(box);

        }
    }
    return flat_land_group;
}


export function createUphillLand(n_width, n_depth, height_desired, type, left_top_pos, scene) {
    var uphill_group = [];
    var box;
    var step = Math.floor(180 / (n_width - 1));

    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {

            box = create_Box(type, [left_top_pos[0] + i * dim_cube, left_top_pos[1] + Math.floor(height_desired * Math.sin(degrees_to_radians((step * i)))), left_top_pos[2] + j * dim_cube], false, scene);
            uphill_group.push(box);
        }
    }
    return uphill_group;
}


export function createAscentGround(n_width, n_depth, height_desired, type, left_top_pos, scene) {
    var ascent_group = [];
    var box;
    var step = Math.floor(height_desired / (n_width));

    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {

            box = create_Box(type, [left_top_pos[0] + i * dim_cube, left_top_pos[1] + Math.floor(step * (i + 1)), left_top_pos[2] + j * dim_cube], false, scene);
            ascent_group.push(box);
        }
    }
    return ascent_group;
}


export function createDescentGround(n_width, n_depth, actual_height, type, left_top_pos, scene) {
    var descent_group = [];
    var box;
    var step = Math.floor(actual_height / n_width);

    for (var i = 0; i < n_width; i++) {
        for (var j = 0; j < n_depth; j++) {

            box = create_Box(type, [left_top_pos[0] + i * dim_cube, actual_height - Math.floor(step * (i)), left_top_pos[2] + j * dim_cube], false, scene);
            descent_group.push(box);
        }
    }
    return descent_group;
}


export function animateTeleport(scene) {
    var teleport = scene.getObjectByName("teleport");
    if (teleport) {
        teleport.setAngularVelocity(
            new THREE.Vector3(0., 6.0, 0.)
        );
        // teleport.rotation.x += degrees_to_radians(1);  //  attention to the friction of the plane where is situated
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

export function animatePlatformByGroupInstance(group, scene, axis, new_position_a, time, new_position_b, irregular_shape) {  //irregular_shape parameter only if is not a squared platform.

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

        // console.log("i: " + String(i));
        // console.log("j: " + String(j));
        // console.log("animatePlatform");

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
                if (axis == "x") platform.position.x = initial_value.pos;
                else if (axis == 'y') platform.position.y = initial_value.pos;
                else if (axis == 'z') platform.position.z = initial_value.pos;
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


export function animateBackAndForwardInstanceGroup(group, scene, axis, new_position_a, new_position_b, time) {
    var animations_a;
    var animations_b;
    var i;
    var length;

    animations_a = animatePlatformByGroupInstance(group, scene, axis, new_position_a, time);
    animations_b = animatePlatformByGroupInstance(group, scene, axis, new_position_b, time, new_position_a);
    length = animations_a.length;
    // console.log(animations_a);
    for (i = 0; i < length; i++) {
        animations_a[i].chain(animations_b[i]);
        animations_b[i].chain(animations_a[i]);
    }
    return animations_a;
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


export function animateFallenPlatformGroup(platform, scene, irregular_shape) {

    // tremble anim
    var tremble_anims = [];
    var tremble_anim_start;
    var x = platform[0].position.x;
    var z = platform[0].position.z;
    var intensity = 0.5;

    // going down anim
    var goingDown_anims = [];
    var initial_value = { pos: platform[0].position.y}

    platform.forEach(cube_plat => {
        var animation = new TWEEN.Tween(initial_value).to({ pos: - distance_bound}, 6000);

        animation.easing(TWEEN.Easing.Cubic.In)
        animation.onUpdate(function () {
        cube_plat.position.y = initial_value.pos

        }).onComplete(function () {
            scene.remove(cube_plat);
            // cube_plat.__dirtyPosition = true;
            // cube_plat.__dirtyRotation = true;
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
        tremble_anims.forEach(anims => anims.forEach(anim => anim.pause()));

        goingDown_anims.forEach(anim => { anim.start();

            // cube_plat._physijs.mass  = true;


            // cube_plat.setAngularFactor(dynamic_vector);
            // cube_plat.setAngularVelocity(dynamic_vector);
            // cube_plat.setLinearFactor(new THREE.Vector3(0,-5,0));

            // cube_plat.setLinearVelocity(new THREE.Vector3(0,-5,0));




            // cube_plat.setAngularFactor({x:1,y:1,z:1});
            // cube_plat.setAngularVelocity({x:1,y:1,z:1});

            // cube_plat.setLinearFactor({x:1,y:-5,z:1});
            // cube_plat.setLinearVelocity({x:1,y:-5,z:1});
            // cube_plat._physijs.angularVelocity.set(THREE.Vector3(0,4,0));

            // scene.remove(cube_plat);

            // cube_plat.setAngularFactor(dynamic_vector );
            // cube_plat.setAngularVelocity(dynamic_vector);
            // cube_plat.setLinearFactor(dynamic_vector);
            // cube_plat.setLinearVelocity(dynamic_vector);

            // console.log(cube_plat);


            // fix this
            // one possible solution (not optimum) delete and recreate the object making it not static
        })
    }, 3000)

}



/* Rendering functions*/

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



/* ************************************* resetting the level functions ************************************* */

export function reset_data() {
    prog_cubes = 0;
    prog_planes = 0;
    prog_spheres = 0;

    bounds_group = [];
    cubes_group = [];
    objects_group = [];

    last_time = 0;
    curr_time = 0;
}

export function remove_allBoxes(scene) {
    cubes_group.forEach(Element => scene.remove(Element));
    scene.simulate()
}

export function remove_allBounds(scene) {
    bounds_group.forEach(Element => scene.remove(Element));
    scene.simulate()
}

export function remove_OtherObjects(scene) {
    objects_group.forEach(Element => scene.remove(Element));
    scene.simulate()
}

export function resetAll(scene, time) {
    setTimeout(function () {
        remove_OtherObjects(scene);
        remove_allBounds(scene);
        remove_allBoxes(scene);
        reset_data();
    },
        time
    )
}

