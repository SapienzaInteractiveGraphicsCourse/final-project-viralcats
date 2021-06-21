// import * as THREE from './libs/threejs/build/three.module.js';

Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';
import * as utils from './utils.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';

// defintion of the object for the level
var plane,box, box2,sphere;

// definition of the boudnds for the level
var plane_bottom;
var plane_top ;
var plane_left ;
var plane_right ;
var plane_front ;
var plane_behind;
var distance_bound = 1000;
// definition and instatiation of the groups
var bounds_group = [];
var cubes_group = [];
var objects_group = [];





var controls;
function main() {
    const canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 10000;

    var scene = new Physijs.Scene(); // create Physijs scene

    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 70);
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
        plane = utils.create_Box_Plane( 20,[0,0,0],[0,0,0], 40, scene);
        scene.add(plane);
    }

    /* ************************* BOXES ***********************************/

    {
        box  = utils.create_Box("Namecc", [0, 20, 0], false);
        box2 = utils.create_Box("Namecc", [0, 10, 0], false);

        cubes_group.push(box);        cubes_group.push(box2);

        // put all the cubes in the group into the scene
        cubes_group.forEach(Element => scene.add(Element));
    }

    /* ************************* SPHERES ***********************************/

    {
        sphere= utils.create_Sphere(3, 0xff0000);
        scene.add(sphere);
    }

    /* ************************* BOUNDS ***********************************/
    {
        plane_bottom = utils.create_Box_Plane( 20, [0,-distance_bound/2,0] ,[0,0,0]  ,distance_bound, scene);
        plane_top    = utils.create_Box_Plane( 20, [0,distance_bound/2,0]  ,[0,0,0]  ,distance_bound, scene);
        plane_left   = utils.create_Box_Plane( 20, [-distance_bound/2,0,0] ,[0,0,90] ,distance_bound, scene);
        plane_right  = utils.create_Box_Plane( 20, [distance_bound/2,0,0]  ,[0,0,90] ,distance_bound, scene);     
        plane_front  = utils.create_Box_Plane( 20, [0,0,distance_bound/2]  ,[90,0,0] ,distance_bound, scene);
        plane_behind = utils.create_Box_Plane( 20, [0,0,-distance_bound/2] ,[90,0,0] ,distance_bound, scene);
         
        scene.add(plane_bottom);
        scene.add(plane_top);
        scene.add(plane_left);
        scene.add(plane_right);
        scene.add(plane_front);
        scene.add(plane_behind);
    }

    
    function render() {

        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        scene.simulate()
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();