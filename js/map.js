var width = 800,
    height = 900,
    centered;

var svg = d3.select("#map")
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

plotSchoolDistricts();

d3.select("#mapschool").on("click", function() {
  map.remove();
  map = svg.append("g");
  plotSchoolDistricts();
});

function color(property) {
  if (property == "LOW" || property == "D" || property == "F")
    { return "red"; }
  else if (property == "MED" || property == "B" || property == "C")
    { return "yellow"; }
  else if (property == "HIGH" || property == "A")
    { return "green"; }
  else
    return "gray";
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

d3.select("#cluster").on("click", function() {
  d3.selectAll("circle")
    .style("fill", function(d) {
      return color(d.properties.CLUSTER);
    });
  return false;
});

d3.select("#gradrate").on("click", function() {
  d3.selectAll("circle")
    .style("fill", function(d) {
      return color(d.properties.GRADRATE);
    });
  return false;
});

d3.select("#grade").on("click", function() {
  d3.selectAll("circle")
    .style("fill", function(d) {
      return color(d.properties.GRADE);
    });
});

d3.select("#regents").on("click", function() {
  d3.selectAll("circle")
    .style("fill", function(d) {
      return color(d.properties.REGENTS);
    });
});

d3.select("#sat").on("click", function() {
  d3.selectAll("circle")
    .style("fill", function(d) {
      return color(d.properties.SAT);
    });
});

function plotSchoolDistricts() {
  d3.json("json/ny_school_districts-simplify2.json", function(error, nyb) {
    map.attr("id", "schooldistrict")
      .selectAll(".state")
        .data(nyb.features)
      .enter().append("path")
        .attr("class", function(d){ return d.properties.SchoolDist; })
        .attr("d", path);

    plotSchools();
  });
}

function plotPrecincts() {
}

var circle_r = 3,
    circle_stroke = 1;

function plotSchools() {
  d3.json("json/schools_with_info_trim.json", function(error, school) {
    var mouseDuration = 150;

    map.selectAll(".school")
        .data(school.features)
      .enter().append("circle")
        .attr("id", "school")
        .attr("class", function(d) { return d.properties.SCHOOLNAME; })
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("r", circle_r)
        .style("fill", "lime")
        .style("stroke-width", circle_stroke)
        .style("stroke", "white")
        .style("opacity", 0.90)
        .on("mouseover", function(d) {     
            d3.select(this).transition().duration(mouseDuration).style("opacity", 1);
            div.transition().duration(mouseDuration)
            .style("opacity", 1)
            div.text(toTitleCase(d.properties.SCHOOLNAME) + "\n Avg SAT is " + d.properties.SAT)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY -30) + "px");
            .style("height", "50px");
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

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        map.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        map.selectAll("circle")
            .attr("d", path.projection(projection))
            .attr("r", circle_r / d3.event.scale)
            .style("stroke-width", circle_stroke / d3.event.scale);
        map.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)
