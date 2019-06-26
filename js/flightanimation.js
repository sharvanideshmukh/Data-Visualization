$(function() {
    var currentWidth = $('#map').width();
    var width = 938;
    var height = 620;

    var projection = d3.geo
        .mercator()
        .scale(150)
        .translate([width / 2, height / 1.41]);

    var path = d3.geo
        .path()
        .pointRadius(2)
        .projection(projection);

    var svg = d3.select("#map")
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", currentWidth)
        .attr("height", currentWidth * height / width);

    var airportMap = {};

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .style("text-align", "center")          
    .text("a simple tooltip");
    
    function loaded(error, countries) {
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topojson.feature(countries, countries.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", path)
	    .attr("data-name", function(d) { return d.properties.name; })
	    .on('mouseover', function () {
                        var region = d3.select(this);
                        document.querySelector('.legend').innerText = region.attr('data-name');
	    }).on('mouseout', function () {
                        document.querySelector('.legend').innerText = '';
                    });
    }

    queue().defer(d3.json, "countries.topo.json")
        .await(loaded);

    $(window).resize(function() {
        currentWidth = $("#map").width();
        svg.attr("width", currentWidth);
        svg.attr("height", currentWidth * height / width);
    });
});
