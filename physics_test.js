// import * as THREE from './libs/threejs/build/three.module.js';

Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';
import * as utils from './utils.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import TWEEN from './libs/tween.esm.js';


// defintion of the object for the level

var distance_bound = 1000;
// definition and instatiation of the groups
var anim_box_repeat;
var anim_box_repeat_instance;
var anim_box_single;
var anim_box_single_instance;

var animation_b;

var ascent, descent, land;
var box_1;
var box_3;
var controls;
var scene;
function main() {
    const canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 10000;

    scene = new Physijs.Scene(); // create Physijs scene

    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 100);
    camera.lookAt(scene.position);

    controls = new OrbitControls(camera, canvas);
    controls.update();

    scene.add(camera);

    scene.background = new THREE.Color('black');

    scene.setGravity(new THREE.Vector3(0, - 9.8, 0)); // set gravity
    scene.addEventListener('update', function () {
        scene.simulate(); // simulate on every scene update
    });

    /* ************************* PLANES ***********************************/

    {
        utils.create_Box_Plane(20, [0, 0, 0], [0, 0, 0], 40, scene, false);
    }

    /* ************************* BOXES ***********************************/

    {
        box_1 = utils.create_Box("Namecc", [0, 20, 0], 0, scene);
        utils.create_Box("Moss", [-5, 20, 0], 0, scene);
        utils.create_Box("Dirt", [5, 20, 0], 0, scene);
        utils.create_Box("Lava", [10, 20, 0], 0, scene);
        utils.create_Box("Rock", [-10, 20, 0], 0, scene);
        utils.create_Box("Amethyst", [15, 20, 0], 0, scene);
        utils.create_Box("Grass", [-15, 20, 0], 0, scene);
        box_3 = utils.create_Box("Terracotta", [0, 20, -10], 0, scene);


        land = utils.createFlatLand(4, 4, "Namecc", [30, 0, 30], scene);

        utils.createUphillLand(10, 10, 10, "Lava", [0, 0, -80], scene)

        ascent = utils.createAscentGround(5, 5, 10, "Amethyst", [-39, 0, -5], scene)

        descent = utils.createDescentGround(5, 5, 10, "Rock", [-39, 0, -5], scene)

        // ascent.forEach(Element => Element.rotation.y = -20);


        // cubes_group.forEach(Element => scene.remove(Element));

        // put all the cubes in the group into the scene
        // cubes_group.forEach(Element => scene.add(Element));
    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_Sphere(3, 0xFFFF00, "rock", scene);
    }

    {
        utils.create_teleport([0, 20, 10], scene); // emissive light of the teleport
    }

    /* ************************* LIGHT ***********************************/
    {
        // utils.create_pointLIght([10,10,10],0xffffff,scene);
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane(20, [0, -distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane(20, [0, distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane(20, [-distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane(20, [distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane(20, [0, 0, distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane(20, [0, 0, -distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
    }
    // utils.animatePlatform("box_3",scene);

    // utils.animatePlatformByName("box_5",scene, 'y', -100, 5000);
    // utils.animatePlatformByGroupInstance(ascent, scene, 'y', -100, 5000);

    // anim_forward  = utils.animatePlatformByGroupInstance(land, scene, 'z', 50, 10000);
    // anim_back  = utils.animatePlatformByGroupInstance(land, scene, 'z', -50, 10000);


    // anim_forward  = utils.animatePlatformByName("box_5",scene, 'y', 100, 5000);

    // anim_back  = utils.animatePlatformByName("box_5",scene, 'y', 20, 5000, 100);

    anim_box_repeat = utils.animateBackAndForwardName("box_5", scene, 'y', 100, 20, 5000);
    anim_box_repeat.start();

    anim_box_single = utils.animatePlatformByName("box_1", scene, 'z', 100, 5000);
    anim_box_single.start();

    anim_box_single_instance = utils.animatePlatformByGroupInstance(box_1, scene, 'z', -100, 5000)
    anim_box_single_instance.start();

    // console.log(box_3.position.x);
    // anim_box_repeat_instance  = utils.animateBackAndForwardInstance(box_1, scene, 'x', -100, 5000, 0);
    // anim_box_repeat_instance.start();

    anim_box_repeat_instance = utils.animatePlatformByGroupInstance(box_3, scene, 'x', -100, 5000);
    animation_b = utils.animatePlatformByGroupInstance(box_3, scene, 'x', 0, 5000, -100);

    anim_box_repeat_instance.chain(animation_b);
    animation_b.chain(anim_box_repeat_instance);
    anim_box_repeat_instance.start();







    // problem: try to change the time of activation of this functions, is it's less than 5s all ok, otherwise the cubes become static without sense
    // setTimeout(function(){
    //     utils.remove_OtherObjects(scene);
    //     // utils.remove_allBounds(scene);
    //     // utils.remove_allBoxes(scene);
    // },
    // 10000
    // )

    var val = 0;

    function render() {

        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }



        // scene.setGravity(new THREE.Vector3(0, - 9.8, 0)); // set gravity
        utils.animateTeleport(scene);

        // if(is_finished){
        //     is_finished = false
        //     utils.animatePlatformByGroupInstance(land, scene, 'z', -50, 3000);
        // }

        // if(val == 0){
        //     utils.animatePlatform("box_5",scene);
        //     val = 1;
        // }

        // plat.__dirtyPosition = true;

        TWEEN.update();
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    }

    render();
}

main();