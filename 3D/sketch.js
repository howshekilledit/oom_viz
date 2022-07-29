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
    var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
    var light3 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(165 * scale, 170 * scale, 210 * scale), scene);
    //light.diffuse = new BABYLON.Color3.FromHexString(colors[0]);
    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 1;
    light2.intensity = 0;
    light3.intensity = 0;

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

    //one box
    var box_pos = new BABYLON.Vector3(99.9 * scale, 99.9 * scale, 99.9 * scale);
    var box_dim = new BABYLON.Vector3(0.1 * scale, 0.1 * scale, 0.1 * scale);
    one_box = placePrism(box_dim, box_pos, colors[c_index],[0, 1, 2, 3, 4, 5]);
    one_box.rotation.x += Math.PI/2;
    prisms.push(one_box)
    console.log(prisms.length);
    var mat_labels = ['billion', '100 million', '10 million', 'million', '100,000', '10,000', '1,000', '100', '10', '1']

    //text_labels('blank');
    //array of materials with number names printed on them
    scene.executeWhenReady(function () {
        text_labels('exp');
    });
    //})();




    function cornerCutBox(offset = 0, scale = 1, labels = ['billion', '100 million', '10 million'], wf = false) {
        //by chunk version

        //billion
        var pos = new BABYLON.Vector3(offset, offset, offset);
        var dim = new BABYLON.Vector3(10 * scale, 10 * scale, 9 * scale);
        var nine = placePrism(dim, pos, colors[c_index],  [5, 2]);
        nine.rotation.z += Math.PI / 2;
        //hundred million
        c_index++;
        pos = new BABYLON.Vector3(offset, offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(10 * scale, 9 * scale, scale);
        var eight = placePrism(dim, pos, colors[c_index],  0);

        eight.rotation.z += Math.PI;

        //ten million

        c_index++;
        pos = new BABYLON.Vector3(offset, 9 * scale + offset, 9 * scale + offset);
        dim = new BABYLON.Vector3(9 * scale, scale, scale);
        var seven = placePrism(dim, pos, colors[c_index],  0);
        seven.rotation.z += Math.PI;
        return [nine, eight, seven];


    }



    function placePrism(dim, pos, clr, text_face = 4) {
        //text on cube reference: https://doc.babylonjs.com/divingDeeper/materials/using/texturePerBoxFace
        const dynamicTexture = new BABYLON.DynamicTexture("text", { width: 100 * dim.x, height: 100 * dim.y }, scene);
        const mat = new BABYLON.StandardMaterial("mat", scene);

        const faceColors = new Array(6);
        for (var i = 0; i < faceColors.length; i++) {
            faceColors[i] = new BABYLON.Color3.FromHexString(clr);
        }

        //set which faces have dynamic texture (i.e. texture with writing)
        const faceUV = new Array(6);

        for (let i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(0, 0, 0, 0);
        }


        //write label on face or faces as specified
        //if (text_face) {
            if (Array.isArray(text_face)) {
                for (const face of text_face) {
                    faceUV[face] = new BABYLON.Vector4(0, 0, 1, 1);
                }
            } else {
                faceUV[text_face] = new BABYLON.Vector4(0, 0, 1, 1);
            }

        //}
        let boxOption = {
            //faceColors: faceColors,
            faceUV: faceUV,
            width: dim.x, height: dim.y, depth: dim.z
        }
        const box = BABYLON.MeshBuilder.CreateBox("box", boxOption);

        box.material = mat;
        box.position = new BABYLON.Vector3(pos.x + dim.x / 2, pos.y + dim.y / 2, pos.z + dim.z / 2);

        return box;

    }

    function placeBox(x, y, z, size, wf = false) {

        var box = BABYLON.MeshBuilder.CreateBox("box", { width: size, height: size, depth: size }, scene);
        box.position = new BABYLON.Vector3(x + size / 2, y + size / 2, z + size / 2);
        var mat = new BABYLON.StandardMaterial();


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
    var cam_d = 101 * scale;
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
    var explode = document.getElementById('explode');
    explode.addEventListener("click", function () {
        var newExplosion = new BABYLON.MeshExploder(prisms);

        newExplosion.explode(0.1);
    });
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
        if (exp_on) {
            text_labels();
            //this.innerHTML = '10<sup>x</sup>';
            exp_on = false;
        } else {
            text_labels('exp');
            exp_on = true;

        }

    });
    function text_labels(format = "std") {
        c_index = 0;
        console.log(mat_labels.length, prisms.length)
        for (var i = 0; i < prisms.length; i++) {
            lbl = mat_labels[i];
            var clr = colors[c_index];
            var p = prisms[i];
            console.log(lbl, p);
            var dim = p.getBoundingInfo().boundingBox.extendSize;
            //var dim = {x:10, y:10};
            //var dynamicTexture = new BABYLON.DynamicTexture("text", { width: 100 * dim.x, height: 100 * dim.y }, scene);
            var height_fact;
            var w = 3000; //material width
            var h = w * dim.y / dim.x; //material height

            var font_size = 500;
            if (lbl == '1') {
                font_size = 3000;
            }
            if (dim.x = dim.y * 9) {
                height_fact = 1 / 9;
            } else {
                height_fact = 1;
            }
            var dynamicTexture = new BABYLON.DynamicTexture("text", { width: w, height: h }, scene);
            p.material.diffuseTexture = dynamicTexture;
            //format as standard or exponents
            switch (format) {
                case ('std'):
                    dynamicTexture.drawText(lbl, null, null, `${font_size}px Rubik`, "white", clr);
                    break;
                case ('exp'):
                    font_size = Math.round(h*1.6);
                    console.log(font_size, lbl);
                    //font_size = 300;
                    //dynamicTexture.drawText(9-i, w/2+font_size/2, h/2-font_size/3, `${font_size/3}px Rubik`, "white", clr);
                    dynamicTexture.drawText('10', null, null, `${font_size}px Rubik`, "white");
                    break;
                case ('blank'):
                    dynamicTexture.drawText('', null, null, `$80px Rubik`, "white", clr);
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
