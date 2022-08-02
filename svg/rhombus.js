//class for a collection of facets (dimensional shape)
let prism = class {
  constructor(facets = []) { //constructor based on list of facet instances
    this.fcts = facets;
  }
  addFacet(f) {
    this.fcts.push(f);
  }
  addMerged(f1, f2) { //add facet from two merged facets
    let newF = f1.vtcs.concat(f2.vtcs)
    //newF = [...new Set(newF)];
    let f = new facet(newF);
    f.sortCw();
    this.fcts.push(f);
  }
  getCenter() { //gets center point of facet
    let points = this.getPoints()
    points.sort((a, b) => b.y - a.y);
    let cy = (points[0].y + points[points.length - 1].y) / 2;
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let cx = (points[0].x + points[points.length - 1].x) / 2;
    //this.sortCw();
    return createVector(cx, cy);

  }
  label() {
    let clrs = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    for (let [i, f] of this.fcts.entries()) {
      //let c = lerpColor(color('red'), color('purple'), map(i, 0, this.fcts.length, 0, 1))
      let c = color(clrs[i % clrs.length]);
      stroke(c);
      noFill();
      f.drawShape();
      let ctr = f.getCenter();
      fill(c);
      noStroke();

      text(i, ctr.x, ctr.y);

    }
  }
  //check if two prisms are the same
  is_equal(other){
    //gets all points from this and checks if other contains each
    //returns false if not
    let pts = this.getPoints();
    for(let pt of pts){
      if(other.includes(pt) == false){
        return false;
      }
    }
    // //iterate through facets
    // for (let [i, f] of this.fcts.entries()) {
    //   let of = other.fcts[i];
    //   of.sortCw();
    //   f.sortCw();
    //   //this susually but not always works
    //   if(!(of.is_equal(f))){
    //     console.log(of, f);
    //     return(false); //return false of any facets don't match
    //   }
    // }
    return true; //return true if all facets match

  }
  //get array of slopes of lines within prism
  getMx(){
    let mxs = [];
    for(let fct of this.fcts){
      let fmx = fct.getMx();
      for(let m of fmx){
        mxs.push(m);
      }
    }
    return mxs;
  }
  getCross(draw_ln = false){ //draw a line across the center of a prism
    //currently written to accomodate subsets  from frontFacets
    let ctr = this.getCenter();
    let types = this.byType();
    let legs = types.leg;
    let m = new prism(legs); //create a prism of legs
    let mxs = m.getMx(); //get mx and b values for formula y = mx + b for various legs
    //console.log(mxs);
    //let ms = mxs.map(x => x.m);
    let len = 0, i = 0;
    let nmxs;
    while((len != 4) && (i < mxs.length)){ //find prism set with four lines of same slope
      nmxs = mxs.filter(m => round(m.m,2) == round(mxs[i].m,2));
      len = nmxs.length;
      //console.log(len);
      if(len != 4){
        i++;
      }
    }
    //m.drawAll(cvs, 'none', {width:1, color: 'blue'}); //option to draw facets in play in blue
    if(len != 4){console.log('no match');}

    let bs = nmxs.map(x => x.b); //get all b values for various y = mx + b equatiosn
    let b_min = nmxs[bs.indexOf(min(bs))], b_max = nmxs[bs.indexOf(max(bs))]; //get y - mx+b equatiosn with largest and smallest b values
    if(draw_ln){ //draws line across if draw_ln == true (default false)
      cvs.line(ctr.x, ctr.x * b_min.m + b_min.b, ctr.x, ctr.x * b_max.m + b_max.b).stroke({width:1, color: '#f00'});
    }
    return b_max.b - b_min.b; //returns height of cross section





   }
  getPoints() { //returns all points from all facets
    let points = [];
    for (let f of this.fcts) {
      for (let v of f.vtcs) {
        points.push(v);
      }
    }

    return points;
  }
  includes(pt){ //check if prism includes a certain point
    let points = this.getPoints();
    for(let v of points){
     // let circle = cvs.circle(6).dx(v.x-3).dy(v.y-3).fill('#00f');
      if((v.x == pt.x) && (v.y == pt.y)){

        return true;
      }
    }
    return false;
  }
  includes_fct(fct){ //check if prism includes a certain fct
    let facets = this.fcts;
    for(let f of facets){
     // let circle = cvs.circle(6).dx(v.x-3).dy(v.y-3).fill('#00f');
      if(fct.is_equal(f)){
        return true;
      }
    }
    return false;
  }
  getDim() { //gets dimensions of facet
    let points = this.getPoints();
    points.sort((a, b) => b.y - a.y);
    let dy = abs(points[0].y - points[points.length - 1].y);
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let dx = abs(points[0].x - points[points.length - 1].x);
    return createVector(dx, dy);

  }
  drawAll(container = cvs, fll = 'none', strk_clr = '#000', strk_wgt = 1) {
    let group = cvs.group();
    for (let f of this.fcts) {
      f.drawShape(group, fll, strk_clr, strk_wgt);
    }
  }
  copyTranslated(trans) { //returns a copy of the current instance, translated by x and y
    let facets = [];
    for (let f of this.fcts) {
      let n_fs = []; //array of translated facets
      for (let v of f.vtcs) {
        n_fs.push(createVector(v.x + trans.x, v.y + trans.y))
      }
      let nf = new facet(n_fs);
      nf.set_type(f.f_type);
      facets.push(nf);
    }
    return new prism(facets);
  }
  byType() { //returns an object where facets are listed by type
    let type_lists = {}; //initialize object of type lists
    for (let f of this.fcts) {
      let t = f.f_type;
      let types = Object.keys(type_lists); //get keys
      let i = types.indexOf(t);
      if (i == -1) { //if new types
        type_lists[t] = [f];
      }
      else {
        type_lists[t].push(f);
      }
    }
    return type_lists;
  }
  frontFacets() { //returns facet groups from either front or back of prism
    let matches = [];
    let t_list = this.byType(); //sorts facets by type
    let dim = this.getDim(); //get dimensions



    for (let bs of t_list.base) { //iterates through base facets

      for (let a = 0; a < t_list.leg.length; a++) { //iterates through leg facets, A round
        let fa = t_list.leg[a]; //current leg (a set)

        for (let b = 1; b < t_list.leg.length; b++) { //iterates through leg facets, B round
          let fb = t_list.leg[b]; //current leg (b set)

          fa.sortCw();
          fb.sortCw();
          let m = new prism([bs, fa, fb]); //creates prism from base and new legs
          if (
          //if the two legs are note the same and the dimensions are the same as main prism
          (fa.getAbsolute().is_equal(fb.getAbsolute()) == false) &&
          (m.getDim().x == dim.x) && (m.getDim().y == dim.y)
            //if cross sectional dimension = base dimension

     && (round(m.getCross(),2) == round(bs.getDim().y,2))
          ) {
            let includes = false; //variable to check if matches already includes current set
            for(let mtch of matches){
              if(m.is_equal(mtch)){
                includes = true;
              }
            }
            if(includes == false ){
              matches.push(m);
            }
          }


        }
      }
    }
    return matches;

  }
  threeFacets() { //returns combinations of three facets that include one base
    //let copies = 0;
    let matches = [];
    let t_list = this.byType(); //sorts facets by type
    let dim = this.getDim();
    for (let bs of t_list.base) {
      let b_dim = bs.getDim();
      for (let a = 0; a < t_list.leg.length; a++) {
        let fa = t_list.leg[a];
        for (let b = 1; b < t_list.leg.length; b++) {
          let fb = t_list.leg[b];
          let a_cmn = bs.commonPoints(fa); //common points between base and leg a
          let b_cmn = bs.commonPoints(fb); //common points between base and leg b
          let ab_cmn = fa.commonPoints(fb); //common points between a and bß

          fa.sortCw();
          fb.sortCw();

          matches.push(new prism([bs, fa, fb]));


        }
      }
    }
    return matches;
  }
  stackFull(i, c1, c2, o) { //index of facet, color1, color 2, opacity
    let fct = this.fcts[i];
    fct.sortCw();


    let n;
    for (let [j, f] of this.fcts.entries()) {
      f.sortCw();
      if (i != j) { //search facets for similar facet
        //console.log(f.getAbsolute(), fct.getAbsolute());
        if (f.getAbsolute().is_equal(fct.getAbsolute())) {
          n = createVector((f.vtcs[0].x - fct.vtcs[0].x), f.vtcs[1].y - fct.vtcs[1].y);
        }
      }
    }
    if (n == undefined) { //draw a red filled shape if can't identify equal facet
      //this.drawAll(cvs, '#f00');
      console.log(fct.getAbsolute());
      for (let f of this.fcts) {
        f.sortCw();
        console.log(f.getAbsolute());
      }
    } else {
      //console.log(n);

      let ctr = fct.getCenter();
      //let rct = cvs.rect(fct_dim.x, fct_dim.y).attr({ fill: '#f06', opacity: 0.5}).dx(ctr.x-fct_dim.x/2).dy(ctr.y-fct_dim.y/2)
      let group = cvs.group();
      //let rect = cvs.rect(fct_dim.x, fct_dim.y);
      //let
      //n = this.getDim();
      noStroke();
      let nml = ceil(random(200, 600)); //number of layers in stack
      for (let i = 0; i < nml; i += 1) {
        //normal deltas to number of layers
        let x_off = map(i, 0, nml, 0, n.x);
        let y_off = map(i, 0, nml, 0, n.y);

        //console.log(n.x, i, x_off, n.y, i, y_off);

        let clr = lerpColor(color(c1), color(c2), map(i, 0, abs(nml), 0, 1));

        clr = `rgb(${clr.levels[0]},${clr.levels[1]},${clr.levels[2]})`

        let str = ""


        for (let c of fct.vtcs) {

          str += `${c.x + x_off},${c.y + y_off} `
        }

        let polygon = group.polygon(str).fill(clr).attr({ opacity: o })
      }

    }
  }
  //sandwiches a color stack between front and rear facets of a prism
  sandwich(c1, c2, m){ //color 1, color 2, 6 sided prism that includes (or equals) this one
    //get array of two front facets
    let fronts = m.frontFacets();
    //draws back facets
    for(let fct of this.fcts){
      if(fronts[0].includes_fct(fct)){
        fct.drawShape()
      }
    }
    //draws color stack
    m.stackFull(floor(random(6)), c1, c2, 0.02);
    //draws front facets
    for(let fct of this.fcts){
      if(fronts[1].includes_fct(fct)){
        fct.drawShape()
      }
    }

  }
}

let facet = class {
  constructor(vects, //constructs facet based on series of vectors (as vertices) and offsets
    offset = createVector(random(width / 2), random(height / 2))) {
    this.f_type = 'stand';
    if (vects.constructor != Array) { //if single centerpoint and offset given
      //draw diamond around centerpoint, offset by offset.x and offset.y on each side

      this.vtcs = [
        createVector(vects.x - offset.x, vects.y),
        createVector(vects.x + offset.x, vects.y),
        createVector(vects.x, vects.y - offset.y),
        createVector(vects.x, vects.y + offset.y),
      ];
    } else { //if two corner points and offset given, offset from two corners to create 4 corners
      if (vects.length <= 2) {
        this.vtcs = [vects[0],
        vects[1],
        createVector(vects[1].x + offset.x, vects[1].y + offset.y),
        createVector(vects[0].x + offset.x, vects[0].y + offset.y)
        ];
      } else { //if three or more points given, assign all as vertices
        this.vtcs = vects;
      }

    }
  }
  commonPoints(f) { //returns common verticies between this and another facetß
    let cmn = [];
    for (let v1 of this.vtcs) {
      for (let v2 of f.vtcs) {
        ////console.log(v1, v2);
        if (v1.x == v2.x) {
          if (v1.y == v2.y) {
            cmn.push(v2);
          }
        }

      }
    }
    return cmn;
  }
  notInside(f, m) {
    let clr = random(colors);
    let f_lns = f.getMx();
    let ts_lns = this.getMx();
    //this.label();

    f.drawShape(cvs, 'none', clr);
    this.drawShape(cvs, 'none', clr);
    console.log(f_lns, ts_lns);
    for(let i = 0; i <1; i++){
      let ln1 = f_lns[i];
      for(let ln2 of ts_lns){
        // let min_y = min([f.vtcs[i].y, f.vtcs[i+1].y]);
        // let max_y = max([f.vtcs[i].y, f.vtcs[i+1].y]);
        // let min_x = min([f.vtcs[i].x, f.vtcs[i+1].x]);
        // let max_x = max([f.vtcs[i].x, f.vtcs[i+1].x]);
        let insct = intersection(ln1, ln2);
        console.log(insct);

        //draws red circle along line don't remember why
        // if(m.includes(insct) == false){
        //   let circle = cvs.circle(6).dx(insct.x-3).dy(insct.y-3).fill('#f00');
        //     return false;
        // } else {
        //   let circle = cvs.circle(6).dx(insct.x-3).dy(insct.y-3).fill('#00f');
        // }
      }
    }


    return true;
  }
  getMx(){ //for each two sequential clockwise points, return m and x for line in form of y = mx + b
    this.sortCw();
    //let slopes = this.getSlopes();
    let mxs = [];
    for(let [i, pt] of this.vtcs.entries()){
      let pt1;
      if(i<this.vtcs.length-1){pt1 = this.vtcs[i+1];}else{pt1 = this.vtcs[0];}
      let m = (pt.y-pt1.y)/(pt.x-pt1.x);

      let b = pt.y - m*pt.x;
      mxs.push({m:m, b:b});
    }
    return mxs;

  }
  drawShape(container = cvs, fll = 'none', strk_clr = '#000', strk_wgt = 1) { //draws shape based on all vertices in facet
    let str = ""

    let strk = {width:strk_wgt, color: strk_clr};
    for (let c of this.vtcs) {

      str += `${c.x},${c.y} `
    }

    //str = str.slice(0, -1);
    //console.log(str);
    let polygon = container.polygon(str).fill(fll).stroke(strk);
    return polygon;

  }
  label() { //labels vertices by index

    for (let [i, c] of this.vtcs.entries()) {
      // var txt = cvs.text(function(add) {
      //   add.tspan(i).dx(c.x).dy(c.y).fill('#000');
      // })
      var txt = cvs.text(i).dx(c.x).dy(c.y).fill('#000');
    }


  }

  copyTranslated(trans) { //returns a copy of the current facet, translated
    let n_f = [];
    for (let v of this.vtcs) {
      n_f.push(createVector(v.x + trans.x, v.y + trans.y))
    }
    let f = new facet(n_f);
    f.set_type(this.f_type);
    return (f)
  }
  sortCw() { //sort points in clockwise order
    //SOURCE: https://stackoverflow.com/questions/45660743/sort-points-in-counter-clockwise-in-javascript
    // Array of points;
    const points = this.vtcs;
    // Find min max to get center
    // Sort from top to bottom
    points.sort((a, b) => a.y - b.y);

    // Get center y
    const cy = (points[0].y + points[points.length - 1].y) / 2;

    // Sort from right to left
    points.sort((a, b) => b.x - a.x);

    // Get center x
    const cx = (points[0].x + points[points.length - 1].x) / 2;

    // Center point
    const center = { x: cx, y: cy };

    // Pre calculate the angles as it will be slow in the sort
    // As the points are sorted from right to left the first point
    // is the rightmost

    // Starting angle used to reference other angles
    var startAng;
    points.forEach(point => {
      var ang = Math.atan2(point.y - center.y, point.x - center.x);
      if (!startAng) { startAng = ang }
      else {
        if (ang < startAng) {  // ensure that all points are clockwise of the start point
          ang += Math.PI * 2;
        }
      }
      point.angle = ang; // add the angle to the point
    });


    // Sort clockwise;
    this.vtcs = points.sort((a, b) => a.angle - b.angle);

  }
  getCenter() { //gets center point of facet
    let points = this.vtcs;
    points.sort((a, b) => b.y - a.y);
    let cy = (points[0].y + points[points.length - 1].y) / 2;
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let cx = (points[0].x + points[points.length - 1].x) / 2;
    this.sortCw();
    return createVector(cx, cy);

  }
  getEnds() { //gets ends points of facet
    let points = this.vtcs;
    points.sort((a, b) => b.y - a.y);
    let cy = [points[0].y, points[points.length - 1].y];
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let cx = [points[0].x, points[points.length - 1].x];
    this.sortCw();
    return ({ x: cx, y: cy });

  }

  getDim() { //gets dimensions of facet
    let points = this.vtcs;
    points.sort((a, b) => b.y - a.y);
    let dy = abs(points[0].y - points[points.length - 1].y);
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let dx = abs(points[0].x - points[points.length - 1].x);
    this.sortCw();
    return createVector(dx, dy);

  }
  getExtremes() { //get min x and y values for facet
    let points = this.vtcs;
    points.sort((a, b) => b.y - a.y);
    let min_y = min([points[0].y, points[points.length - 1].y]);
    let max_y = max([points[0].y, points[points.length - 1].y]);
    // Sort from right to left
    points.sort((a, b) => b.x - a.x);
    // Get center x
    let min_x = min([points[0].x, points[points.length - 1].x]);
    let max_x = max([points[0].x, points[points.length - 1].x]);
    this.sortCw();
    return { min: createVector(min_x, min_y), max: createVector(max_x, max_y) };

  }
  set_type(t) {
    this.f_type = t;
  }
  stackShape(n, c1, c2, str = "test") { //stacks facet to n.x and n.y height/width offset, transluscent colors from c1 to c2
    let ctr = this.getCenter();
    let group = cvs.group();
    noStroke();
    let nml = ceil(random(100, 600));
    for (let i = 0; i < nml / 5; i += 1) {
      let x_off = map(i, 0, abs(nml), 0, n.x);
      let y_off = map(i, 0, abs(nml), 0, n.y);
      let clr = lerpColor(color(c1), color(c2), map(i, 0, abs(nml), 0, 1));

      clr = `rgb(${clr.levels[0]},${clr.levels[1]},${clr.levels[2]})`

      let str = ""


      for (let c of this.vtcs) {

        str += `${c.x + x_off},${c.y + y_off} `
      }

      let polygon = group.polygon(str).fill(clr).attr({ opacity: .05 })
      // var txt = group.text(function(add) {
      //   add.tspan('CRASS').dx(ctr.x+x_off).dy(ctr.y+y_off).fill(clr);
      // })
      // txt.skew(n.x, n.y);

    }
  }
  is_equal(other) { //check if same as another facet
    //make sure they are the same length
    if(this.vtcs.length != other.vtcs.length){return false;}
    for (let [i, v] of this.vtcs.entries()) {
      let ov = other.vtcs[i];
      //this susually but not always works
      if ((round(v.x, 0) != round(ov.x, 0)) | (round(v.y, 0) != round(ov.y, 0))) {
        //console.log('fls');
        return false;
      }
    }
    return true;
  }
  getAbsolute() {
    let extm = this.getExtremes();
    return this.copyTranslated(createVector(-extm.min.x, -extm.min.y));

  }
  getSlopes() {
    this.sortCw();
    let vs = this.vtcs;
    return [(vs[0].x - vs[1].x) / (vs[0].y - vs[1].y), (vs[1].x - vs[2].x) / (vs[1].y - vs[2].y)];
  }

}
function dimensions(points) {
  points.sort((a, b) => b.y - a.y);
  let dy = abs(points[0].y - points[points.length - 1].y);
  // Sort from right to left
  points.sort((a, b) => b.x - a.x);
  // Get center x
  let dx = abs(points[0].x - points[points.length - 1].x);
  return createVector(dx, dy);
}

function isPointInPoly(poly, pt){
  for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
      && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
      && (c = !c);
  return c;
}

function intersection(ln1, ln2){ //gets intersection of two lines described by m and b (y = mx + b form)
  let x = (ln2.b - ln1.b)/(ln1.m - ln2.m);
  let y = ln1.m*x + ln1.b;
  return createVector(x, y);
}

function onLine(pt, ln){ //checks ot see if point is on a line (in form y = mx+b), rounding to account for error
  if(round(pt.x, 2) == round((pt.y*ln.b + ln.m),2)){
    return true;
  } else {
    return false;
  }
}