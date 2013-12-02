var width = 960,
    height = 900,
    centered;

var projection = d3.geo.mercator()
    .center([-73.94, 40.73])
    .scale(140000)
    .translate([(width) / 2, (height)/2]);

var path = d3.geo.path()
    .projection(projection);

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var smap = svg.append("g");

plotSchoolDistricts();

d3.select("#mapschool").on("click", function() {
    smap.remove();
    smap = svg.append("g");
    plotSchoolDistricts();
});

$("#overlay").html("I am the best!");

function color(property) {
  if (property == "LOW" || property == "D" || property == "F")
    { return "#FF2C00"; }
  else if (property == "MED" || property == "B" || property == "C")
    { return "#FFDE00"; }
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
    return "#c0c0c0";
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
    d3.json("json/district_merged.json", function(error, nyb) {
        smap.attr("id", "schooldistrict")
        .selectAll(".state")
        .data(nyb.features)
        .enter().append("path")
        .attr("class", function(d){ return d.properties.SchoolDist; })
        .attr("d", path)
        .attr("fill", function(d) { return colorDistrict(d.properties.school_gra); } )

        plotSchools();
    });
}

function plotPrecincts() {
}

var circle_r = 4;

function plotSchools() {
    d3.json("json/schools_with_info_trim.json", function(error, school) {
        var mouseDuration = 150;

        smap.selectAll(".school")
        .data(school.features)
        .enter().append("circle")
        .attr("id", "school")
        .attr("class", function(d) { return d.properties.SCHOOLNAME; })
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("r", circle_r)
        .attr("stroke-width", 0)
        .style("fill", "blue")
        .style("opacity", 0.60)
        .on("mouseover", function(d) {     
            d3.select(this).transition().duration(mouseDuration).style("opacity", 1);
            div.transition().duration(mouseDuration)
            .style("opacity", 1)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY -30) + "px")
            .style("height", "50px");

            var toolText = toTitleCase(d.properties.SCHOOLNAME)
            if (d.properties.SAT != "<NA>") {
                toolText += "<br /> The average SAT score is " + d.properties.SAT;
            }
            div.html(toolText);
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
        smap.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        smap.selectAll("circle")
            .attr("d", path.projection(projection))
            .attr("r", circle_r / d3.event.scale)
        smap.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)
