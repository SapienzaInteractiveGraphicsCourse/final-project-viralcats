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
var land_anim_a;

var animations_conc = [];
var tremble_anim = [];

var ascent, descent, land, land_grass, orbit;
var box_1;
var box_3;
var controls;
var scene;

var sphere;

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
        utils.create_Box_Plane([0, 0, 0], [0, 0, 0], 40, scene, false);
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


        land = utils.createFlatLand(4,4, "Namecc", [30, 0, 30], scene);

        land_grass = utils.createFlatLand(4,4, "Grass", [-30, 0, 30], scene);

        orbit = utils.createFlatLand(3,5, "Grass", [-30,30,-30], scene);

        utils.createUphillLand(10, 10, 10, "Lava", [0, 0, -80], scene)

        ascent = utils.createAscentGround(5, 5, 10, "Amethyst", [-39, 0, -5], scene)

        descent = utils.createDescentGround(5, 5, 10, "Rock", [-39, 0, -5], scene)

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
        utils.create_Box_Plane([0, -distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([0, distance_bound / 2, 0], [0, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([-distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane([distance_bound / 2, 0, 0], [0, 0, 90], distance_bound, scene, true);
        utils.create_Box_Plane([0, 0, distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
        utils.create_Box_Plane([0, 0, -distance_bound / 2], [90, 0, 0], distance_bound, scene, true);
    }

    /* ************************* ZOMBIE ***********************************/
    {
        // var head = utils.create_Box("Namecc", [0, 10, 5], 0, scene);
        // head.scale.set(1, 1, 1);
        // var body = utils.create_Box("Namecc", [0, 10-3-1.5, 5], 0, scene);
        // body.scale.set(1.70, 2, 1);
        // var left_arm = utils.create_Box("Namecc", [-2-1.15, 10-3+.7, 5], 0, scene, [0,0,90],[0,0,-30]);
        // left_arm.scale.set(.5, 2, .5);
        // var right_arm = utils.create_Box("Namecc", [2+1.15, 10-3+.7, 5], 0, scene, [0,0,-90]);
        // right_arm.scale.set(.5, 2, .5);
        sphere = utils.create_Sphere(3, 0xFF0000, "rock", scene, [0,3,0]);

        sphere.setLinearVelocity(new THREE.Vector3(5,0,0));

        continuare da qui e fare movimenti con i tasti
        

        
    }

    /* ************************* ANIMATIONS ******************************/

    utils.animateTeleport(scene);

    // using names
    anim_box_repeat = utils.animateBackAndForwardName("box_5", scene, 'y', 100, 20, 5000);
    anim_box_repeat.start();
    anim_box_single = utils.animatePlatformByName("box_1", scene, 'z', 100, 5000);
    anim_box_single.start();

    // using a single instance
    anim_box_single_instance = utils.animatePlatformByInstance(box_1, scene, 'z', -100, 5000)
    anim_box_single_instance.start();

    anim_box_repeat_instance = utils.animateBackAndForwardInstance(box_3, scene, 'x', -100, 0, 5000);
    anim_box_repeat_instance.start();

    // using groups single animation

    land_anim_a = utils.animateBackAndForwardInstanceGroup(land, scene, 'x', 70, 30, 5000);
    land_anim_a.forEach(anim => { anim.start()});

    // using groups multiple animation

    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'z', 30,5000,-30,[3,5]));//not squared platform i've to specify the shape, if not, can be avoided
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'x', 30,5000,-30,[3,5]));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'z',-30,5000, 30,[3,5]));
    animations_conc.push(utils.animatePlatformByGroupInstance(orbit,scene,'x',-30,5000, 30,[3,5]));

    animations_conc = utils.concatenateAnimationsGroup(animations_conc);
    animations_conc.forEach(elem => elem.start());

    // tumble animation group

    utils.animateFallenPlatformGroup(land_grass, scene)
    


     /* ************************* RESETS ******************************/

    //  utils.resetAll(scene,5000); // problem: try to change the time of activation of this functions, is it's less than 5s all ok, otherwise the cubes become static without sense

    function render() {

        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        TWEEN.update();
        scene.simulate();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
}


main();