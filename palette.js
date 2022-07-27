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

colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

colors = shuffle(colors);

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

//b&w
// colors = [
//     '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff',
//     '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff',  '#000', '#ffffff'
// ];

//mehretu https://news.artnet.com/art-world/julie-mehretu-lacma-review-1699149
// colors = [
//     '#282B80', //indigo
//     '#F58A44', //creamsicle
//     '#086746', //dayglo
//     '#0F90AB', //blue

//     '#233FA1', //tarp blue

//     '#E0659F', //pink
//     '#58CFCC', //light blue
//     //'#F3E004', //yellow
//     '#9F9D92', //gray
//     '#113746', //gray green
//     '#CB2A38' //tomato



// ]