let colors = ['#BE5F7D' /*dodge pink*/,
  '#2AADCB' /*dodge blue*/,
  '#7A3648' /*dodge plum*/,
  '#B54550' /*dodge tomato*/,
  '#503E6E' /*oehlen purple*/,
  '#bbc4b3' /* green resin*/,
  '#FFBF00' /*amber*/,
  '#4BCC3A' /*green sea glass*/,
  '#2385A3' /*blue sea glass*/,
  '#DA1A1E' /*tomato*/
];

let cvs;
function setup() {
  noLoop();
}
function draw() {

  cvs = SVG().addTo('main').size(windowWidth, windowWidth).attr({background:random(colors)});

  rect = cvs.rect(100, 100).fill('#f06')

  document.getElementById('saver').onclick = function () { saveData(cvs.svg(), 'svg.svg') };


}

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
