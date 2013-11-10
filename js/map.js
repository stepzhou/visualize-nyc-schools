var width = 970,
    height = 900;

var svg = d3.select("div.page-header").append("svg")
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

d3.json("json/ny_school_districts-min.json", function(error, nyb) {
    var g = svg.append("g");

    g.append("g")
        .attr("id", "schooldistrict")
        .selectAll(".state")
        .data(nyb.features)
        .enter().append("path")
        .attr("class", function(d){ return d.properties.SchoolDist; })
        .attr("d", path);

    d3.json("json/schools.json", function(error, school) {
        var g = svg.selectAll(".school")
            .data(school.features)
            .enter()
            .append("g")
            .attr("id", "school")
            .attr("class", function(d) { return d.properties.SCHOOLNAME; })
            .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; });

        g.append("circle")
            .attr("r", 2)
            .style("fill", "lime")
            .style("stroke", "white")
            .style("opacity", 0.90)
            .on("mouseover", function(d) {     
                console.log(d);
                d3.select(this).transition().duration(300).style("opacity", 1);
                div.transition().duration(300)
                .style("opacity", 1)
                div.text(d.properties.SCHOOLNAME)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY -30) + "px");
            })
           .on("mouseout", function() {
                d3.select(this)
                .transition().duration(300)
                .style("opacity", 0.8);
                div.transition().duration(300)
                .style("opacity", 0);
           });
    });
});
