var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(20, 20, 30), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 2, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    //white background
    scene.clearColor = BABYLON.Color3.White();

    //rainbow stick
    // for(var i = 0; i < 100; i++){
    //     var box = BABYLON.MeshBuilder.CreateBox("box", {width:0.2, height:0.2, depth:0.2}, scene);
    //     box.position.x = 2*i/10-10;
    //     var mat = new BABYLON.StandardMaterial();
    //     mat.diffuseColor = new BABYLON.Color3(i/100, 0, (100-i)/100);
    //     box.material = mat;
    // }

    //marginal coordiantes
    var marg_coords = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    //coords for iterating

    var step = 3;

    //coordiantes to use for current iteration
    var it_coords = marg_coords.filter(c => c % step == 0);
    var coord_names = ['x', 'y', 'z'];

    var count = 1000000000;
    var thresh = count / 10;
    var pos = { x: 0, y: 0, z: 0 };
    var boxes = 0;
    var iter_c = 0;
    var c_index = 5; //color index
    cornerCutBox();

    //draw axes
    //const axes = new BABYLON.AxesViewer(scene, 10);

    c_index++;
    // //placeBox(9, 9, 9,1);
    // //c_index+=3;
    cornerCutBox(9, 0.1);
    c_index++;
    cornerCutBox(9.9, 0.01);
    c_index++;

    //one box
    placeBox(10, 10, 10, 0.01)
    function cornerCutBox(offset = 0, scale = 1, wf = false) {
        //by chunk version

        //billion
        var pos = new BABYLON.Vector3(offset, offset, offset);
        var dim = new BABYLON.Vector3(10 * scale, 10 * scale, 9 * scale);
        placePrism(dim, pos, colors[c_index], "billion", 4);

        //hundred million
        c_index++;
        pos = new BABYLON.Vector3(offset, offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(10 * scale, 9 * scale, scale);
        var eight = placePrism(dim, pos, colors[c_index], "hundred\nmillion", 0);

        //eight.rotation.z += Math.PI;

        //ten million

        c_index++;
        pos = new BABYLON.Vector3(offset, 9 * scale + offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(9 * scale, scale, scale);
        var seven = placePrism(dim, pos, colors[c_index], "ten million");
        seven.rotation.z += Math.PI;

        // //by cube version
        // var x = 9;
        // step = 1;
        // //left facet
        // for (var y = 0; y < 10; y += step) {
        //     if (y > 8) {
        //         c_index += 1;
        //     }
        //     for (var z = 0; z < 10; z += step) {
        //         if ((y < 9) || (z < 9)) {
        //             placeBox(x*scale + offset, y*scale + offset, z*scale +offset, step*scale, wf);
        //         }
        //     }
        // }
        // //right facet
        // c_index += 1;
        // var z = 9;
        // for (var y = 0; y < 10; y += step) {

        //     for (var x = 0; x < 9; x += step) {

        //         placeBox(x*scale + offset, y*scale + offset, z*scale +offset, step*scale, wf);

        //         //console.log([x,y,z]);
        //     }
        // }

        // //top facet
        // //c_index -= 1;
        // var y = 9;
        // for (var z = 0; z < 9; z += step) {
        //     for (var x = 0; x < 9; x += step) {
        //         placeBox(x*scale + offset, y*scale + offset, z*scale +offset, step*scale, wf);
        //     }
        // }
    }



    function placePrism(dim, pos, clr, label, text_face = 4) {
        //text on cube reference
        const dynamicTexture = new BABYLON.DynamicTexture("text", { width: 500, height: 500 }, scene);
        const mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = dynamicTexture;
        dynamicTexture.drawText(label, null, null, "100px solid Arial", "blue", "white");
        const faceColors = new Array(6);
        for(var i = 0; i < faceColors.length; i++){
            faceColors[i] = new BABYLON.Color4.FromHexString(clr);
        }
        const faceUV = new Array(6);

        for (let i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }
        faceUV[text_face] = new BABYLON.Vector4(0, 0, 1, 1);

        const boxOption = {
            faceColors: faceColors,
            faceUV: faceUV,
            width: dim.x, height: dim.y, depth: dim.z
        }

        // Our built-in 'sphere' shape.
        const box = BABYLON.MeshBuilder.CreateBox("box", boxOption);

        box.material = mat;
        //var box = BABYLON.MeshBuilder.CreateBox("box", { width: dim.x, height: dim.y, depth: dim.z }, scene);
        box.position = new BABYLON.Vector3(pos.x + dim.x / 2, pos.y + dim.y / 2, pos.z + dim.z / 2);
        // var mat = new BABYLON.StandardMaterial();
        // var text_texture = new BABYLON.DynamicTexture(label + "_texture", { width: dim.x *100, height:dim.y*100}, scene);
        // box.material = mat;

        // text_texture.drawText(label,100, 100, `${Math.round(dim.x*10)}px Century Gothic`, 'black', clr);
        // mat.diffuseTexture = text_texture;
        return box;

    }

    function placeBox(x, y, z, size, wf = false) {
        //if (Math.random() < 0.5) {
        var box = BABYLON.MeshBuilder.CreateBox("box", { width: size, height: size, depth: size }, scene);
        box.position = new BABYLON.Vector3(x + size / 2, y + size / 2, z + size / 2);
        var mat = new BABYLON.StandardMaterial();
        //mat.diffuseColor = new BABYLON.Color3(Math.random(), 0, Math.random());
        box.material = mat;
        mat.diffuseColor = BABYLON.Color3.FromHexString(colors[c_index]);
        console.log(colors[c_index]);
        if (wf) { mat.wireframe = true; } //show wireframe if wf parameter set to true
        boxes++;
    }
    function iter_pos(num, max, step = 1) {
        num += step;
        if (num >= max) {
            num = 0;
        }
        return num;
    }

    //var box = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:10, depth:10}, scene);
    // Move the box upward 1/2 its height
    var cam_c = 11;
    var cam_d = 10.65;
    var campos = new BABYLON.Vector3(cam_c, cam_c, cam_c);
    var campos2 = new BABYLON.Vector3(cam_d, cam_d, cam_d);
    var clicks = 0;
    // Our built-in 'ground' shape.
    var anim_0 = [{ obj: camera, prop: 'position', val: campos, dims: ['x', 'y', 'z'] }];
    var anim_1 = [{ obj: camera, prop: 'position', val: campos2, dims: ['x', 'y', 'z'] }];
    //animate(anims, scene);
    canvas.addEventListener("click", function () {
        if (clicks == 0) {
            animate(anim_0, scene);
            clicks++;
        } else {
            animate(anim_1, scene);
        }
        //camera.position = campos;
    });
    return scene;
};

window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});
