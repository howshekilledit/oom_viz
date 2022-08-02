

let cvs;
cvs = SVG().addTo('main').size(1000000000, 100).attr({background:colors[0]});
let x = 0;
let scale = 1;
var bottom = rectangle(0, 90, 100000000, 10);
var gradient = cvs.gradient('linear', function(add) {
  add.stop(0, '#333')
  add.stop(1, '#fff')
})
var pattern = cvs.pattern(20, 20, function(add) {
  add.rect(20,20).fill('#fff')
  add.rect(10,10)
  add.rect(10,10).move(10,10)
})

bottom.attr({ fill: pattern });
for(var i = 0; i < 9; i++){
  var pow = Math.pow(10, i+1) * scale;
  //width takes out current chunks unless first chunk
  var width = 0.9*pow;
  if(i == 0){
    width = pow;
  }
  rectangle(x, 0, width, 90, colors[i]);
  x += width;
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
