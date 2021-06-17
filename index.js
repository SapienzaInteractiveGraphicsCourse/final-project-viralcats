// Three.js - Load .GLTF
// from https://threejsfundamentals.org/threejs/threejs-load-gltf.html


import * as THREE from './libs/threejs/build/three.module.js';
import { OrbitControls } from './libs/threejs/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './libs/threejs/examples/jsm/loaders/GLTFLoader.js';

var root;
var hemisphere_light;
var directional_light;

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 0);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    // scene.add(mesh);
  }

  {
    const skyColor = 0x0000FF;  // light blue
    const groundColor = 0x00FF00;  // brownish orange
    const intensity = 1;
    hemisphere_light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(hemisphere_light);
  }

  {
    const color = 0xD0D0D0;
    const intensity = 2;
    directional_light = new THREE.DirectionalLight(color, intensity);
    directional_light.position.set(0, 0, 2);
    scene.add(directional_light);
    scene.add(directional_light.target);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = (new THREE.Vector3())
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 1, 1))
        .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./scene.gltf', (gltf) => {
      
      gltf.scene.traverse( function ( child ) {

        if ( child.isMesh ) {
          if( child.castShadow !== undefined ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
    
      } );

      root = gltf.scene.getObjectByName('RootNode');
      root.scale.set(0.5, 0.5, 0.5);

      console.log("******* STO CAZZO *******\n", dumpObject(root).join('\n'));

      //Bone037_036 caviglia sinistra
      //Bone036_030 caviglia destra
      //Bone002_02  busto dalla vita in su
      //Bone029_024 gamba destra
      //Bone030_027 gamba sinistra
      //Bone001_03 busto dalle tette in su
      //Bone003_04 busto un po piu in su di quello prima
      //Bone005_05 braccio sinistro
      //Bone028_014 braccio destro
      //Bone004_023 testa
      //Bone032_06 spalla sinistra
      //Bone031_015 spalla destra
      //Bone010_09 gomito sinistro
      //Bone013_018 gomito destro
      //Bone015_025 gamba destra
      //Bone006_028 gamba sinistra
      //Bone016_026 ginocchio destro
      //Bone007_029 ginocchio sinistro

      root.traverse( o => {
        if (o.isBone && o.name === 'Bone029_024') { 
          root.bones = o;
        }
      });

      //root.bones.rotation.set(degtorad(180), degtorad(0), degtorad(-85));


      scene.add(root);

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      controls.target.copy(boxCenter);
      controls.update();
      // camera.lookAt(root.position.x,root.position.y,root.position.z);
    });
  }

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

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx;
		dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
}

function degtorad(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

main();


var c1 = -180;
setInterval(() => {
  c1 += 1;
  // directional_light.position.set(c1, c1/2, 2);
  root.bones.rotation.set(degtorad(0), degtorad(c1), degtorad(0));
}, 20);

