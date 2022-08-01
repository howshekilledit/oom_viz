<!DOCTYPE html>
<?php
include '3D/svg.php'; //link svg reference for control icons
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>OoM Cube</title>

        <!-- Babylon.js -->

        <script src="./3D/scripts/dat.gui.min.js"></script>
        <script src="./3D/scripts/Assets.js"></script>
        <script src="./3D/scripts/ammo.js"></script>
        <script src="./3D/scripts/cannon.js"></script>
        <script src="./3D/scripts/Oimo.js"></script>
        <script src="./3D/scripts/earcut.min.js"></script>
        <script src="./3D/scripts/babylon.js"></script>
        <script src="./3D/scripts/babylonjs.materials.min.js"></script>
        <script src="./3D/scripts/babylonjs.proceduralTextures.min.js"></script>
        <script src="./3D/scripts/babylonjs.postProcess.min.js"></script>
        <!--script src="./scripts/babylonjs.loaders.js"></script-->
        <!--script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script-->
        <script src="./3D/scripts/babylonjs.serializers.min.js"></script>
        <script src="./3D/scripts/babylon.gui.min.js"></script>
        <script src="./3D/scripts/babylon.inspector.bundle.js"></script>
        <script src = "https://art-151.github.io/art151_bab.js"></script>

        <script src = "./palette.js"></script>
        <script src = "./3D/index.html"></script>

        <link rel = stylesheet href = './3D/oom.css' type = 'text/css'>
    </head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500&display=swap" rel="stylesheet">
<body>
    <div id = "controls">
        <!--ZOOM IN--><a id = "in" href = "javascript:void(0)"><?php echo $magmax?></a>
        <!--ZOOM OUT--><a id = "out" href = "javascript:void(0)"><?php echo $magmin?></a>
        <!--TOGGLE EXPONENT LABELS--><a id = "exp" href = "javascript:void(0)"><em>10<sup>x</sup></em></a>
        <!--FLOAT PIECES APART--><a id = "explode">EXPLODE</a>
        <!--FLOAT PIECES TOGETHER--><a id = "return">CRUNCH</a>
    </div>

    <canvas id="renderCanvas"></canvas>
    <script src = "./3D/sketch.js"> </script>
</body>
</html>
