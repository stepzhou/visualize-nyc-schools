var width = 960,
    height = 900,
    centered;

var envLow = "#B0E2FF",
    envMed = "#5CACEE",
    envHigh = "#4A708B",
    envNa = "#c0c0c0";

var envLegendData = [{ "label": "Low", "color": envLow },
                     { "label": "Medium", "color": envMed },
                     { "label": "High", "color": envHigh },
                     { "label": "N/A", "color": envNa }];

var schLow = "#FF2C00",
    schMed = "#FFDE00",
    schHigh = "00B945",
    schNa = "gray";

var schLegendData = [{ "label": "Low", "color": schLow },
                     { "label": "Medium", "color": schMed },
                     { "label": "High", "color": schHigh },
                     { "label": "N/A", "color": schNa }];

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
console.log(d3.csv.parse('resource/messages.csv'));

function color(property) {
  if (property == "LOW" || property == "D" || property == "F")
    { return schLow; }
  else if (property == "MED" || property == "B" || property == "C")
    { return schMed; }
  else if (property == "HIGH" || property == "A")
    { return schHigh; }
  else
    return schNa;
}

function colorDistrict(property) {
  if (property == "LOW") 
    { return envLow; }
  else if (property == "MEDIUM" || property == "MED") 
    { return envMed; }
  else if (property == "HIGH")
    { return envHigh; }
  else 
    return envNa;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// group by dropdown handling
d3.select("#none").on("click", function() {
    d3.selectAll("circle")
        .style("fill", "blue");

    removeLegend("schLegend");
    $('#groupby').html('School');
});

d3.select("#cluster").on("click", function() {
    colorSchools('Cluster', 'CLUSTER');
});

d3.select("#gradrate").on("click", function() {
    colorSchools('Graduation Rate', 'GRADRATE');
});

d3.select("#grade").on("click", function() {
    colorSchools('Grade', 'GRADE');
});

d3.select("#regents").on("click", function() {
    colorSchools('Regent Score', 'REGENTS');
});

d3.select("#sat").on("click", function() {
    colorSchools('SAT Score', 'SAT');
});

function colorSchools(name, key) {
    d3.selectAll("circle")
    .style("fill", function(d) {
        return color(d.properties[key]);
    });

    showLegend("schLegend", 20);
    $('#groupby').html(name);
}

// environment factors
d3.select("#mapnone").on("click", function() {
    d3.selectAll("path")
        .attr("fill", "#c0c0c0");

    removeLegend("envLegend");
    $('#environment').html('Environment');
});

d3.select("#mapgraffiti").on("click", function() {
    colorEnvironment('Graffiti', 'graffiti');
});

d3.select("#mapnoise").on("click", function() {
    colorEnvironment('Noise Complaints', 'noise');
});

d3.select("#mapassistance").on("click", function() {
    colorEnvironment('Public Assistance', 'assistance');
});

d3.select("#mapattendance").on("click", function() {
    colorEnvironment('School Attendance', 'attendance');
});

d3.select("#mapenrollment").on("click", function() {
    colorEnvironment('School Enrollment', 'enrollment');
});

function colorEnvironment(name, key) {
    d3.selectAll("path")
        .attr("fill", function(d) {
            return colorDistrict(d.properties[key]);
        });

    showLegend("envLegend", 160);
    $('#' + key).html(event.name);
}



// plot the school districts and school points
function plotSchoolDistricts() {
    d3.json("json/districts_merged.json", function(error, nyb) {
        smap.attr("id", "schooldistrict")
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

var circle_r = 5;

function plotSchools() {
    d3.json("json/schools_trim_merged.json", function(error, school) {
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
                .style("fill", "#8DB6CD")
                .style("height", "90px");

                var toolText = toTitleCase(d.properties.SCHOOLNAME)
                if (d.properties.SAT_RAW != "<NA>" && d.properties.SAT_RAW != "null" && d.properties.SAT_RAW != "NaN") {
                    toolText += "<br /> The average SAT score is " + d.properties.SAT_RAW; 
                }
                if (d.properties.GRADE != "<NA>" && d.properties.GRADE != "null" && d.properties.GRADE != "NaN") {
                    toolText += "<br /> Progress Report Grade is " + d.properties.GRADE;
                }
                if (d.properties.GRAD_RAW != "<NA>" && d.properties.GRAD_RAW != "null" && d.properties.GRAD_RAW != "NaN") {
                    toolText += "<br /> The graduation rate is " + Math.round(d.properties.GRAD_RAW * 100) + "%";
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

// envLegend
function showLegend(className, xOffset) {
    var yOffset = 130;
    if (className == "envLegend") {
        var data = envLegendData;
        var title = "Environment";
    }
    else {
        var data = schLegendData;
        var title = "School";
    }

    d3.selectAll("g." + className).remove();

    var legend = svg.selectAll("g." + className)
        .data(data)
        .enter().append("g")
        .attr("class", className);

    legend.append("text")
        .attr("x", xOffset)
        .attr("y", yOffset)
        .attr("font-size", "16pt")
        .text(title);

    legend.append("rect")
        .attr("x", xOffset)
        .attr("y", function(d, i) { return i * 18 + yOffset + 10; })
        .attr("width", 60)
        .attr("height", 18)
        .style("fill", function(d) { return d.color; });

    legend.append("text")
        .attr("x", xOffset + 66)
        .attr("y", function(d, i) { return i * 18 + yOffset + 10; })
        .attr("dy", "14px")
        .text(function(d) { return d.label; });
}

function removeLegend(className) {
    d3.selectAll("g." + className).remove();
}
