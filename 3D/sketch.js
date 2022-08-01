
var canvas = document.getElementById("renderCanvas");
let scale = 1;
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
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(160 * scale, 165 * scale, 205 * scale), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    //wait until typeface has loaded to create materials
    scene.executeWhenReady(function () {
        //create materials for exponent and text format labels
        txt_lbls = text_labels();
        exp_lbls = text_labels('exp');
        //apply non-exponent labels for now
        blocks.map((p, i) => p.material = txt_lbls[i]);
        exp_on = false; //boolean to toggle materials
    });

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(165 * scale, 170 * scale, 210 * scale), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    var light3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(165 * scale, 170 * scale, 210 * scale), scene);
    //light.diffuse = new BABYLON.Color3.FromHexString(colors[0]);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 1;
    light2.intensity = 0;
    light3.intensity = 0;

    scene.clearColor = BABYLON.Color3.White(); //white background
    var blocks; //initalize variable that will hold array of blocks
    var exp_on; //initialize exponent toggle


    //draw each block and append to an array of blocks
    blocks = cornerCutBox(0, 10 * scale);
    blocks = blocks.concat(cornerCutBox(90 * scale, 1 * scale));
    blocks = blocks.concat(cornerCutBox(99 * scale, 0.1 * scale));

    //smallest block (1)
    var box_pos = new BABYLON.Vector3(99.9 * scale, 99.9 * scale, 99.9 * scale);
    var box_dim = new BABYLON.Vector3(0.1 * scale, 0.1 * scale, 0.1 * scale);
    one_box = placeBlock(box_dim, box_pos, [0, 1, 2, 3, 4, 5]);
    one_box.rotation.z += Math.PI / 2
    blocks.push(one_box)

    //labels to print on text materials
    var mat_labels = ['billion', '100 million', '10 million', 'million', '100,000', '10,000', '1,000', '100', '10', '1']

    //creates a configuration of three blocks, with a total volume of 10^n - 10^(n-3)
    function cornerCutBox(offset = 0, scale = 1) {

        //10^n - 10^(n-1) block
        var pos = new BABYLON.Vector3(offset, offset, offset);
        var dim = new BABYLON.Vector3(10 * scale, 10 * scale, 9 * scale);
        var n = placeBlock(dim, pos, [5, 2]);
        n.rotation.z += Math.PI / 2;

        //10^(n-1) - 10^(n-2) block
        pos = new BABYLON.Vector3(offset, offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(10 * scale, 9 * scale, scale);
        var n_less_one = placeBlock(dim, pos, 0);
        n_less_one.rotation.z += Math.PI;

        //10^(n-2) - 10^(n-3) block
        pos = new BABYLON.Vector3(offset, 9 * scale + offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(9 * scale, scale, scale);
        var n_less_two = placeBlock(dim, pos, 0);
        n_less_two.rotation.z += Math.PI;
        return [n, n_less_one, n_less_two];
    }



    function placeBlock(dim, pos, text_face = 4) {
        //text on cube reference: https://doc.babylonjs.com/divingDeeper/materials/using/texturePerBoxFace
        const mat = new BABYLON.StandardMaterial("mat", scene);

        //set which faces have dynamic texture (i.e. texture with writing)
        const faceUV = new Array(6);

        for (let i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }


        //write label on face or faces as specified

        if (Array.isArray(text_face)) {
            for (const face of text_face) {
                faceUV[face] = new BABYLON.Vector4(0, 0, 1, 1);
            }
        } else {
            faceUV[text_face] = new BABYLON.Vector4(0, 0, 1, 1);
        }


        let boxOption = {
            faceUV: faceUV,
            width: dim.x, height: dim.y, depth: dim.z
        }
        const box = BABYLON.MeshBuilder.CreateBox("box", boxOption);

        box.material = mat;
        box.position = new BABYLON.Vector3(pos.x + dim.x / 2, pos.y + dim.y / 2, pos.z + dim.z / 2);

        return box;

    }


    //CREATE CONTROLS

    //camera positions to animate between
    var cam_c = 110 * scale;
    var cam_d = 101 * scale;
    var campos = new BABYLON.Vector3(cam_c, cam_c, cam_c);
    var campos2 = new BABYLON.Vector3(cam_d, cam_d, cam_d);
    var campos_og = new BABYLON.Vector3(160 * scale, 165 * scale, 205 * scale);
    var pos = 0;
    // animations that move camera in/out
    var anim_0 = [{ obj: camera, prop: 'position', val: campos, dims: ['x', 'y', 'z'] }];
    var anim_1 = [{ obj: camera, prop: 'position', val: campos2, dims: ['x', 'y', 'z'] }];
    var anim_og = [{ obj: camera, prop: 'position', val: campos_og, dims: ['x', 'y', 'z'] }];

    //zoom in button
    var inn = document.getElementById('in');
    //zoom out button
    var outt = document.getElementById('out');
    //exponent button
    var exp = document.getElementById('exp');
    //explode button
    var explode = document.getElementById('explode');

    explode.addEventListener("click", function () {
        var newExplosion = new BABYLON.MeshExploder(blocks);
        newExplosion.explode(0.1);
    });

    //magnifying glass + click
    inn.addEventListener("click", function () {
        switch (pos) {
            case 0: //zoom from initial position to middle
                animate(anim_0, scene);
                pos++;
                //set colors to indicate active buttons
                outt.firstElementChild.firstElementChild.style.fill = 'blue';
                outt.style.cursor = "pointer";
                break;
            case 1: //zoom from middle position to closest
                animate(anim_1, scene);
                pos++;
                //set colors to indicate active buttons
                this.style.cursor = "auto";
                this.firstElementChild.firstElementChild.style.fill = 'gray';

                break;
            default:
                break;
        }
        //camera.position = campos;
    });
    //magnifying glass - click
    outt.addEventListener("click", function () {
        switch (pos) {
            case 1: //zoom out from middle position to original
                animate(anim_og, scene);
                pos--;
                //set colors to indicate active buttons
                this.style.cursor = "auto";
                this.firstElementChild.firstElementChild.style.fill = 'gray';
                break;
            case 2: //zoom out from closest position to middle
                animate(anim_0, scene);
                //set colors to indicate active buttons
                inn.style.cursor = "pointer";
                inn.firstElementChild.firstElementChild.style.fill = 'blue';
                pos--;
                break;
            default:
                break;
        }

    });

    //toggle between exponent and standard labels when clicked
    exp.addEventListener("click", function () {
        if (exp_on) {
            blocks.map((p, i) => p.material = txt_lbls[i]);
            exp.style.color = 'blue';
            exp_on = false;
        } else {
            blocks.map((p, i) => p.material = exp_lbls[i]);
            exp.style.color = 'black';
            exp_on = true;
        }
    });

    //returns an array of materials to apply to blocks, with different number formats
    function text_labels(format = "std") {
        function labeled_materials(p, i) {
            lbl = mat_labels[i];
            var clr = colors[i];
            var p = blocks[i];
            var dim = p.getBoundingInfo().boundingBox.extendSize; //get size of current block
            var w = 5000; //material width
            var h = w * dim.y / dim.x; //material height
            var dynamicTexture = new BABYLON.DynamicTexture("text", { width: w, height: h }, scene);
            var material = new BABYLON.StandardMaterial();
            material.diffuseTexture = dynamicTexture;
            var font_size;
            //format as standard or exponents
            switch (format) {
                case ('std'):
                    if (lbl == '1') {
                        font_size = 3000;
                    } else {
                        if (h < 1000) {
                            font_size = 350;
                        } else {
                            font_size = 550;
                        }

                    }
                    dynamicTexture.drawText(lbl, null, null, `${font_size}px Rubik`, "white", clr);
                    exp_on = false;
                    break;
                case ('exp'):
                    font_size = Math.round(h * 0.6);
                    dynamicTexture.drawText(9 - i, w / 2 + font_size / 2, h / 2 - font_size / 3, `${font_size / 3}px Rubik`, "white", clr);
                    dynamicTexture.drawText('10', null, null, `${font_size}px Rubik`, "white");
                    exp_on = true;
                    break;
                case ('blank'):
                    dynamicTexture.drawText('', null, null, `$80px Rubik`, "white", clr);
                    break;
                default:
                    break;

            }
            return material;
        }
        return blocks.map((p, i) => labeled_materials(p, i));
    }
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
