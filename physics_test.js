// import * as THREE from './libs/threejs/build/three.module.js';

Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';
import * as utils from './utils.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';

// defintion of the object for the level

var distance_bound = 1000;
// definition and instatiation of the groups

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
        utils.create_Box_Plane( 20,[0,0,0],[0,0,0], 40, scene);
    }

    /* ************************* BOXES ***********************************/

    {
        utils.create_Box("Namecc",   [0, 20, 0], false, scene);
        utils.create_Box("Moss",     [-5, 20, 0], false, scene);
        utils.create_Box("Dirt",     [5, 20, 0], false, scene);
        utils.create_Box("Lava",     [10, 20, 0], false, scene);
        utils.create_Box("Rock",     [-10, 20, 0], false, scene);
        utils.create_Box("Amethyst", [15, 20, 0], false, scene);
        utils.create_Box("Grass",    [-15, 20, 0], false, scene);

        utils.create_Box("Terracotta", [0, 20, -10], false, scene);




        // utils.create_Box("Rock", [-10, 20, 10], false, scene);

        // utils.create_Box("Grass", [-10, 20, 0], false, scene);

        // cubes_group.push(box);        cubes_group.push(box2);

        // put all the cubes in the group into the scene
        // cubes_group.forEach(Element => scene.add(Element));
    }

    /* ************************* SPHERES ***********************************/

    {
        utils.create_Sphere(3, 0xff0000, scene);
    }

    {
        utils.create_teleport([0,10,10],scene); // emissive light of the teleport
    }

    /* ************************* LIGHT ***********************************/  
    {
        // utils.create_pointLIght([10,10,10],0xffffff,scene);
    }

    /* ************************* BOUNDS ***********************************/
    {
        utils.create_Box_Plane( 20, [0,-distance_bound/2,0] ,[0,0,0]  ,distance_bound, scene);
        utils.create_Box_Plane( 20, [0,distance_bound/2,0]  ,[0,0,0]  ,distance_bound, scene);
        utils.create_Box_Plane( 20, [-distance_bound/2,0,0] ,[0,0,90] ,distance_bound, scene);
        utils.create_Box_Plane( 20, [distance_bound/2,0,0]  ,[0,0,90] ,distance_bound, scene);     
        utils.create_Box_Plane( 20, [0,0,distance_bound/2]  ,[90,0,0] ,distance_bound, scene);
        utils.create_Box_Plane( 20, [0,0,-distance_bound/2] ,[90,0,0] ,distance_bound, scene);
    }

    // setTimeout(function(){
    //     utils.remove_OtherObjects(scene);
    //     utils.remove_allBounds(scene);
    //     utils.remove_allBoxes(scene);
    // },
    // 5000
    // )

    
    function render() {

        if (utils.resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        
        utils.animateTeleport(scene);
        scene.simulate()
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();