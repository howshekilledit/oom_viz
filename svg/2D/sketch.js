

let cvs;
let cvs_h = 800;
let cvs_w = 1000;

cvs = SVG().addTo('main').size(cvs_w, cvs_h).attr({background:colors[0]});
function draw(){
  drawOrder(frameCount-1);
}
let x = 10;
let this_order = 1;
let order_i = 0;
document.getElementById('lbl').innerText = this_order;
function drawOrder(num){
  y = num*10%(cvs_h);
  if(y < 10){
    x+=10;
  }
  let clr = colors[order_i];
  rectangle(x, y, 10, 10, clr);
  if(num >= this_order *10){
    order_i += 1;

    this_order*=10;
    document.getElementById('lbl').innerText = this_order;

  }
  // if(x > width){
  //   reDraw(num, 0.5);
  // }
}

//draws a rectangle at a certain location
function rectangle(x, y, width, height, clr = '#000'){
  str = '';
  str += `${x},${y} `;
  str += `${x + width},${y} `;
  str += `${x + width},${y + height} `;
  str += `${x},${y + height} `;


  let polygon = cvs.polygon(str).fill(clr);
  return polygon;


}


 // one = cvs.rect(100, 100).fill('#f06');
  //two = cvs.rect(1000, 100).fill(colors[0]).attr({position:'absolute', left:100});





//downloads current picture to SVG file in downloads folder
var saveData = (function () {
  var a = document.createElement("a");
  // document.body.appendChild(a);
  // a.style = "display: none";
  return function (data, fileName) {
    var json = data,
      blob = new Blob([json], { type: "octet/stream" }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());
