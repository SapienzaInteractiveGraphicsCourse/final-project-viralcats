/* utils functions */

// import { ObjectLoader } from "./libs/threejs/build/three.module";


// progressives objects
var prog_cubes = 0;
var prog_planes = 0
var prog_spheres = 0

// dictionary that shows wich textures must be used, in order: top texture, side texture, bottom texture
const cubes_type = {     
    "Dirt": ["Dirt","Dirt","Dirt"],
    "Grass": ["Moss","Dirt","Dirt"],
    "Namecc": ["namecc_top","namecc_side","namecc_bottom"],

}
function load_texture_cube(tex_top_name, tex_side_name, tex_bottom_name){
    const textureLoader = new THREE.TextureLoader();

    var texture_top = textureLoader.load( tex_top_name );
    var texture_side = textureLoader.load( tex_side_name );
    var texture_bottom = textureLoader.load(tex_bottom_name);


    var materials = [
        new THREE.MeshBasicMaterial( { map: texture_side } ),     // right face
        new THREE.MeshBasicMaterial( { map: texture_side } ),     // left face
        new THREE.MeshBasicMaterial( { map: texture_top } ),      //  upper face
        new THREE.MeshBasicMaterial( { map: texture_bottom } ),   // lower face
        new THREE.MeshBasicMaterial( { map: texture_side } ),     // front face
        new THREE.MeshBasicMaterial( { map: texture_side } )      // opposite face
    ];

    return materials;
}

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

export function create_Box_Plane(planeSize, pos, rot, dim, scene){

    const textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( './textures/blocks/test_wall.png' );

    var materials = [
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } ),
        new THREE.MeshBasicMaterial( { map: texture , transparent: true, opacity: 0.6 } )
    ];

    var mat_box = new THREE.MeshFaceMaterial(materials);

    var plane_box = new Physijs.BoxMesh(
        new THREE.CubeGeometry(dim, 0, dim),
        mat_box,
        // new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true,opacity: 0.3}), // wireframe: true, 
        0);

    plane_box.__dirtyPosition = true;
    plane_box.__dirtyRotation = true;
    plane_box.position.set(pos[0],pos[1],pos[2]);
    plane_box.rotateX(degrees_to_radians(rot[0]));
    plane_box.rotateY(degrees_to_radians(rot[1]));
    plane_box.rotateZ(degrees_to_radians(rot[2]));
    // plane_box.rotation.set(, degrees_to_radians(rot[1]) , degrees_to_radians(rot[2]));

    plane_box.setCcdMotionThreshold(1);
    plane_box.name = "plane_box" + String(prog_planes);
    prog_planes ++; 
    plane_box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // scene.remove(other_object)
        console.log("the object: " + String(other_object.name) + " has been removed, map limit exceeded.\nHitten the bound: "+ String(plane_box.name));
        // console.log("Che botta!");
        // box.setAngularVelocity(new THREE.Vector3(20, 0, 0));
        // box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    });
    return plane_box;
}


export function create_Box(type, pos, is_static){


    var path1 = './textures/blocks/' + String(cubes_type[type][0]) + ".png";  // top
    var path2 = './textures/blocks/' + String(cubes_type[type][1]) + ".png";  // side
    var path3 = './textures/blocks/' + String(cubes_type[type][2]) + ".png";  // base

    var temp = load_texture_cube(path1,path2, path3);

    var mat_box = new THREE.MeshFaceMaterial(temp);
    var geometry_cube = new THREE.CubeGeometry(3, 3, 3)
    geometry_cube.dynamic = is_static;
    
    console.log(is_static);
    
    var box = new Physijs.BoxMesh(
        geometry_cube,
        mat_box
    );
    
    box.__dirtyPosition = true;
    box.__dirtyRotation = true;
    box.position.set(pos[0], pos[1], pos[2]);
    box.name = "box_" + String(prog_cubes);
    prog_cubes ++;
    box.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // console.log("Che botta!");
        // box.setAngularVelocity(new THREE.Vector3(20, 0, 0));
        // box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
    });
    box.setCcdMotionThreshold(0.1);
    return box;
}

export function create_Sphere(dim, color){
    const sphereRadius = dim;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 32;
    var sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    var sphereMat = new THREE.MeshBasicMaterial({ color: color})
    var sphere = new Physijs.SphereMesh(sphereGeo, sphereMat);
    sphere.position.set(-sphereRadius - 1 -25, sphereRadius + 20, 0);
    sphere.name = "sphere_" + String(prog_spheres);
    prog_spheres++;
    sphere.addEventListener('collision', function (other_object, rel_velocity, rel_rotation, conctact_normal) {
        // console.log("Colpita la sfera");
        // remove object after being hit
        // if (scene.getObjectByName('plane')){
        //     scene.remove(plane);
        // }
    });
    return sphere;
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

