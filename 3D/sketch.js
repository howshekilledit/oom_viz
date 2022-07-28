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

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(165 * scale, 170 * scale, 210 * scale), scene);
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0,1,0), scene);
    var light3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(165 * scale, 170 * scale, 210 * scale), scene);
    //light.diffuse = new BABYLON.Color3.FromHexString(colors[0]);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0;
    light2.intensity = 0;
    light3.intensity = 1;

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

    var pos = { x: 0, y: 0, z: 0 };

    var c_index = 0; //color index
    var prisms;
    var exp_on = false;
    //(function () {

        //draw each prism and append to an array of prisms
        prisms = cornerCutBox(0, 10 * scale);
        c_index++;
        prisms = prisms.concat(cornerCutBox(90 * scale, 1 * scale, ['million', '100,000', '10,000']));
        c_index++;
        prisms = prisms.concat(cornerCutBox(99 * scale, 0.1 * scale, ['1000', '100', '10']));
        c_index++;
        console.log(prisms);
        //one box
        prisms.push(placeBox(99.9 * scale, 99.9 * scale, 99.9 * scale, .1 * scale));
        var mat_labels = ['billion', '100 million', '10 million', 'million', '100,000', '10,000', '1,000', '100', '10', '1']

        //text_labels('blank');
        //array of materials with number names printed on them
    scene.executeWhenReady(function () {
        text_labels();
    });
    //})();




    function cornerCutBox(offset = 0, scale = 1, labels = ['billion', '100 million', '10 million'], wf = false) {
        //by chunk version

        //billion
        var pos = new BABYLON.Vector3(offset, offset, offset);
        var dim = new BABYLON.Vector3(10 * scale, 10 * scale, 9 * scale);
        var nine = placePrism(dim, pos, colors[c_index], labels[0], [5, 2]);
        nine.rotation.z += Math.PI / 2;
        //hundred million
        c_index++;
        pos = new BABYLON.Vector3(offset, offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(10 * scale, 9 * scale, scale);
        var eight = placePrism(dim, pos, colors[c_index], labels[1], 0);

        eight.rotation.z += Math.PI;

        //ten million

        c_index++;
        pos = new BABYLON.Vector3(offset, 9 * scale + offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(9 * scale, scale, scale);
        var seven = placePrism(dim, pos, colors[c_index], labels[2], 0);
        seven.rotation.z += Math.PI;
        return [nine, eight, seven];


    }



    function placePrism(dim, pos, clr, label, text_face = 4) {
        //text on cube reference: https://doc.babylonjs.com/divingDeeper/materials/using/texturePerBoxFace
        const dynamicTexture = new BABYLON.DynamicTexture("text", { width: 100 * dim.x, height: 100 * dim.y }, scene);
        const mat = new BABYLON.StandardMaterial("mat", scene);
        //mat.diffuseTexture = dynamicTexture;

        //draw label on texture
        //using label variable
        //dynamicTexture.drawText(label, null, null, `${Math.min(20 * dim.x, 70 * dim.y)}px Rubik`, "white", clr);

        //dynamicTexture.drawText('9', 100*dim.x/2 + Math.min(10*dim.x, 35*dim.y), 100*dim.y/2 - Math.min(6*dim.x, 20*dim.y), `${Math.min(10*dim.x, 35*dim.y)}px Roboto`, "white", clr);
        //dynamicTexture.drawText('10', null, null, `${Math.min(20*dim.x, 70*dim.y)}px Major Mono Display`, "white");
        const faceColors = new Array(6);
        for (var i = 0; i < faceColors.length; i++) {
            faceColors[i] = new BABYLON.Color3.FromHexString(clr);
        }
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

        const boxOption = {
            //faceColors: faceColors,
            //faceUV: faceUV,
            width: dim.x, height: dim.y, depth: dim.z
        }

        const box = BABYLON.MeshBuilder.CreateBox("box", boxOption);

        box.material = mat;
        box.position = new BABYLON.Vector3(pos.x + dim.x / 2, pos.y + dim.y / 2, pos.z + dim.z / 2);

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
        return box;
    }
    function iter_pos(num, max, step = 1) {
        num += step;
        if (num >= max) {
            num = 0;
        }
        return num;
    }

    //var box = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:10, depth:10}, scene);

    var cam_c = 110 * scale;
    var cam_d = 102 * scale;
    var campos = new BABYLON.Vector3(cam_c, cam_c, cam_c);
    var campos2 = new BABYLON.Vector3(cam_d, cam_d, cam_d);
    var campos_og = new BABYLON.Vector3(160 * scale, 165 * scale, 205 * scale);
    var pos = 0;
    // animations that move camera in/out
    var anim_0 = [{ obj: camera, prop: 'position', val: campos, dims: ['x', 'y', 'z'] }];
    var anim_1 = [{ obj: camera, prop: 'position', val: campos2, dims: ['x', 'y', 'z'] }];
    var anim_og = [{ obj: camera, prop: 'position', val: campos_og, dims: ['x', 'y', 'z'] }];
    //animate(anims, scene);
    //zoom in button
    var inn = document.getElementById('in');
    //zoom out button
    var outt = document.getElementById('out');
    var exp = document.getElementById('exp');
    inn.addEventListener("click", function () {
        switch (pos) {
            case 0:
                animate(anim_0, scene);
                pos++;
                break;
            case 1:
                animate(anim_1, scene);
                pos++;
                inn.style.color = 'gray';
                break;
            default:
                break;
        }
        //camera.position = campos;
    });

    outt.addEventListener("click", function () {
        switch (pos) {
            case 1:
                animate(anim_og, scene);
                pos--;
                break;
            case 2:
                animate(anim_0, scene);
                pos--;
                //inn.style.color = 'gray';
                break;
            default:
                break;
        }
        //camera.position = campos;
    });

    //toggle to exponents when clicked
    exp.addEventListener("click", function () {
        if(exp_on){
            text_labels();
            //this.innerHTML = '10<sup>x</sup>';
            exp_on = false;
        } else {
            text_labels('exp');
            exp_on = true;

        }

    });
    function text_labels(format = "std"){
        c_index = 0;

            for (var i = 0; i < prisms.length; i++) {
                lbl = mat_labels[i];
                var clr = colors[c_index];
                var p = prisms[i];
                var dim = p.getBoundingInfo().boundingBox.extendSize;
                //var dim = {x:10, y:10};
                //var dynamicTexture = new BABYLON.DynamicTexture("text", { width: 100 * dim.x, height: 100 * dim.y }, scene);
                var height_fact;
                console.log(3000*dim.y/dim.x, dim.y/dim.x);
                if(dim.x = dim.y*9){
                    height_fact = 1/9;
                } else {
                    height_fact = 1;
                }
                var dynamicTexture = new BABYLON.DynamicTexture("text", { width: 3000, height: 3000*dim.y/dim.x}, scene);
                p.material.diffuseTexture = dynamicTexture;
                //format as standard or exponents
                switch (format) {
                    case ('std'):
                        dynamicTexture.drawText(lbl, null, null, `750px Rubik`, "white", clr);
                        break;
                    case ('exp'):
                        dynamicTexture.drawText(exp, 120 * dim.x / 2 + 30 * dim.y, 100 * dim.y / 2 - 15 * dim.y, `${Math.min(10 * dim.x, 35 * dim.y)}px Rubik`, "white", clr);
                        dynamicTexture.drawText('10', null, null, `${60 * dim.y}px Rubik`, "white");
                        break;
                    case ('blank'):
                        dynamicTexture.drawText('', null, null, `${60 * dim.y}px Rubik`, "white");
                        break;
                    default:
                        break;

                }
                //dynamicTexture.drawText('', null, null, `750px Rubik`, "white", clr);
                //p.material.diffuseColor = new BABYLON.Color3(1, 0, 1);
                //dynamicTexture.drawText(lbl, null, null, `${Math.min(20 * dim.x, 70 * dim.y)}px Rubik`, "white", clr);
                c_index++;
            }

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
