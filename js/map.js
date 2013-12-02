var width = 960,
height = 900,
centered;

var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.mercator()
    .center([-73.94, 40.673])
    .scale(80000)
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
    { return "#FF2C00"; }
  else if (property == "MED" || property == "B" || property == "C")
    { return "FFDE00"; }
  else if (property == "HIGH" || property == "A")
    { return "00B945"; }
  else
    return "gray";
}

function colorDistrict(property) {
  if (property == "LOW") 
    { return "#BCFFFF"; }
  else if (property == "MED") 
    { return "#7AF5F5"; }
  else if (property == "HIGH")
    { return "#34DDDD"; }
  else 
    return "black";
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// group by dropdown handling
d3.select("#cluster").on("click", function() {
    d3.selectAll("circle")
        .style("fill", function(d) {
        return color(d.properties.CLUSTER);
    });

    $('#groupby').html('Cluster');
});

d3.select("#gradrate").on("click", function() {
    d3.selectAll("circle")
    .style("fill", function(d) {
        return color(d.properties.GRADRATE);
    });

    $('#groupby').html('Graduation Rate');
});

d3.select("#grade").on("click", function() {
    d3.selectAll("circle")
    .style("fill", function(d) {
        return color(d.properties.GRADE);
    });

    $('#groupby').html('Grade');
});

d3.select("#regents").on("click", function() {
    d3.selectAll("circle")
    .style("fill", function(d) {
        return color(d.properties.REGENTS);
    });

    $('#groupby').html('Regent Score');
});

d3.select("#sat").on("click", function() {
    d3.selectAll("circle")
    .style("fill", function(d) {
        return color(d.properties.SAT);
    });

    $('#groupby').html('SAT Score');
});

// plot the school districts and school points
function plotSchoolDistricts() {
    d3.json("json/ny_school_districts-simplify2.json", function(error, nyb) {
        map.attr("id", "schooldistrict")
        .selectAll(".state")
        .data(nyb.features)
        .enter().append("path")
        .attr("class", function(d){ return d.properties.SchoolDist; })
        .attr("d", path)
        .attr("fill", colorDistrict());

        plotSchools();
    });
}

function plotPrecincts() {
}

var circle_r = 4;

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
        .attr("stroke-width", 0)
        .style("fill", "lime")
        .style("opacity", 0.90)
        .on("mouseover", function(d) {     
            d3.select(this).transition().duration(mouseDuration).style("opacity", 1);
            div.transition().duration(mouseDuration)
            .style("opacity", 1)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY -30) + "px")
            .style("height", "50px");

            div.html(toTitleCase(d.properties.SCHOOLNAME) + " <br> Avg SAT is " + d.properties.SAT)
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

// zoom
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        map.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        map.selectAll("circle")
            .attr("d", path.projection(projection))
            .attr("r", circle_r / d3.event.scale)
        map.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)
