// import * as THREE from './libs/threejs/build/three.module.js';

Physijs.scripts.worker = '/libs/physijs_worker.js';
Physijs.scripts.ammo = '/libs/ammo.js';

var plane;

function main() {
    const canvas = document.querySelector('#c');
    var renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;

    var scene = new Physijs.Scene();

    var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 70);
    camera.lookAt(scene.position);
    scene.add(camera);




    // const scene = new THREE.Scene();
    // scene.background = new THREE.Color('black');

    // const scene = new Physijs.Scene(); // create Physijs scene
    scene.setGravity(new THREE.Vector3(0, -9.8, 0)); // set gravity
    scene.addEventListener('update', function () {
        scene.simulate(); // simulate on every scene update
    });



    {
        const planeSize = 20;

        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, 0); //third parameter to make the object static
        const planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // plane = new Physijs.PlaneMesh(planeGeo, planeMat);
        plane = new Physijs.BoxMesh(
            new THREE.CubeGeometry(40, 0, 40),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 },
            0)
        );
        // plane.rotation.x = Math.PI * -.5;
        plane.__dirtyPosition = true;
        plane.__dirtyRotation = true;
        plane.setCcdMotionThreshold(1);
        plane.name = "plane";

        scene.add(plane);
    }

    {
        var box = new Physijs.BoxMesh(
            new THREE.CubeGeometry(3, 3, 3),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        );
        box.__dirtyPosition = true;
        box.__dirtyRotation = true;
        box.position.set(-0, 20, 0);
        box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
            console.log("Che botta!");

            // box.setAngularVelocity(new THREE.Vector3(20, 0, 0));
            // box.setLinearVelocity(new THREE.Vector3(0, 0, 0));

        });

        box.setCcdMotionThreshold(0.1);
        scene.add(box);
    }

    // {
    //     const cubeSize = 4;
    //     const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    //     const cubeMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    //     const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    //     mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    //     scene.add(mesh);
    // }
    {
        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        var sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        var sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000})
        var sphere = new Physijs.SphereMesh(sphereGeo, sphereMat);
        sphere.position.set(-sphereRadius - 1 -25, sphereRadius + 20, 0);


        sphere.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
            console.log("Colpita la sfera");

            // remove object after being hit
            // if (scene.getObjectByName('plane')){
            //     scene.remove(plane);
            // }
        });
        scene.add(sphere);
    }
    // {
    //     const color = 0xFFFFFF;
    //     const intensity = 1;
    //     const light = new THREE.AmbientLight(color, intensity);
    //     scene.add(light);
    // }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
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