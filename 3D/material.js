
//cover wallpaper with text
function matText(text = 'test', mat = new BABYLON.StandardMaterial,
fontSize = 60, color = 'black', flip = false, bg = "#f0ead6") {
    var font = `${fontSize}px Monospace`;
    var texture = mat.diffuseTexture;
    texture.drawText(text, 410, 50 + fontSize * 1.5, font, color, bg);
    if(flip){
        texture.vAng = Math.PI;
    }
    //texture.invertX = true;
    return texture;
}