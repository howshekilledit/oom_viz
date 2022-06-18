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
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(30, 30, 30), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

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
    var it_coords = marg_coords.filter(c => c%step == 0);
    var coord_names = ['x', 'y', 'z'];
    var c_index = 0;
    var count = 1000000000;
    var thresh = count/10;
    var pos = {x: 0, y: 0, z: 0};
    var boxes = 0;
    var iter_c = 0;
    while(boxes < 5000){
        placeBox(pos.x, pos.y, pos.z, step);


    }

    function placeBox(x, y, z, size) {
        //if (Math.random() < 0.5) {

            var box = BABYLON.MeshBuilder.CreateBox("box", { width: size, height: size, depth:size}, scene);
            console.log(pos, count);
            box.position = new BABYLON.Vector3(x, y, z);
            var mat = new BABYLON.StandardMaterial();
            mat.diffuseColor = BABYLON.Color3.FromHexString(colors[c_index]);
            box.material = mat;
            count -= Math.pow(step*100, step);
            //console.log(count);

            //step down order of magnitude when appropriate
            if(count <= thresh){
                step--;
                thresh = thresh/10;
                it_coords = marg_coords.filter(c => c%step == 0);
                //console.log(it_coords, thresh);
                c_index++;
            }
            var iter_c = Math.floor(Math.random()*3);
            pos[coord_names[iter_c]] = iter_pos(pos[coord_names[iter_c]], marg_coords.length, step);
            //if(pos[coord_names[iter_c]] == 0){
            //iter_c = iter_pos(iter_c, coord_names.length);
            //}
            boxes++;



        //}
    }
    function iter_pos(num, max, step = 1){
        num+=step;
        if(num>=max){
            num = 0;
        }
        return num;
    }

    //var box = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:10, depth:10}, scene);
    // Move the box upward 1/2 its height


    // Our built-in 'ground' shape.

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