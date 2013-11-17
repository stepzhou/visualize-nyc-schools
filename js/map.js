var width = 970,
    height = 900,
    centered;

var svg = d3.select("div.page-header")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var projection = d3.geo.mercator()
  .center([-73.94, 40.70])
  .scale(75000)
  .translate([(width) / 2, (height)/2]);

var path = d3.geo.path()
  .projection(projection);

var div = d3.select("body").append("div")   
  .attr("class", "tooltip")               
  .style("opacity", 0);

var map = svg.append("g");

d3.json("json/ny_school_districts-min.json", function(error, nyb) {
  map.append("g")
    .attr("id", "schooldistrict")
    .selectAll(".state")
    .data(nyb.features)
    .enter()
    .append("path")
    .attr("class", function(d){ return d.properties.SchoolDist; })
    .attr("d", path);
    //.on("click", clicked");

    plotSchools();

});

function plotSchools() {
  d3.json("json/schools.json", function(error, school) {
    var mouseDuration = 150;

    map.selectAll(".school")
      .data(school.features)
      .enter()
      .append("circle")
      .attr("id", "school")
      .attr("class", function(d) { return d.properties.SCHOOLNAME; })
      .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
      .attr("r", 2)
      .style("fill", "lime")
      .style("stroke", "white")
      .style("opacity", 0.90)
      .on("mouseover", function(d) {     
          d3.select(this).transition().duration(mouseDuration).style("opacity", 1);
          div.transition().duration(mouseDuration)
          .style("opacity", 1)
          div.text(d.properties.SCHOOLNAME)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY -30) + "px");
      })
     .on("mouseout", function() {
          d3.select(this)
          .transition().duration(mouseDuration)
          .style("opacity", 0.8);
          div.transition().duration(mouseDuration)
          .style("opacity", 0);
     });

  });
}

// function clicked(d) {
//   var x, y, k;
// 
//   if (d && centered !== d) {
//     var centroid = path.centroid(d);
//     x = centroid[0];
//     y = centroid[1];
//     k = 4;
//     centered = d;
//   } else {
//     x = width / 2;
//     y = height / 2;
//     k = 1;
//     centered = null;
//   }
// 
//   g.selectAll("path")
//     .classed("active", centered && function(d) { return d === centered; });
// 
//   g.transition()
//     .duration(750)
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
//     .style("stroke-width", 1.5 / k + "px");
// }

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        map.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        map.selectAll("circle")
            .attr("d", path.projection(projection));
        map.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)
