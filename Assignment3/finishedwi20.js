"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    // dimensions for svg
    const measurements = {
        width: 500,
        height: 500,
        marginAll: 50
    }

    // load data and append svg to body
    svgContainer = d3.select('body').append("svg")
        .attr('width', measurements.width)
        .attr('height', measurements.height);
    d3.csv("Admission_Predict.csv")
        .then((csvData) => data = csvData)
        .then(() => makeScatterPlot())
    

    function makeScatterPlot() {
        // get arrays of GRE Score and Chance of Admit
        let greScores = data.map((row) => parseInt(row["GRE Score"]))
        let admitChances = data.map((row) =>  parseFloat(row["Admit"]))
        // find range of data
        const limits = findMinMax(greScores, admitChances)
        // create a function to scale x coordinates
        let scaleX = d3.scaleLinear()
            .domain([limits.greMin - 5, limits.greMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        // create a function to scale y coordinates
        let scaleY = d3.scaleLinear()
            .domain([limits.admitMax, limits.admitMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])
        
        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY)

        svgContainer.append('text') 
            .attr('x', 200)
            .attr('y', 490)
            // .attr('transform', 'rotate(-90, 0)')
            .attr('fill', 'black')
            .text('Sample Text')
        
            // Simple
        var data = [0, 0.005, 0.01, 0.015, 0.02, 0.025];

        var sliderSimple = d3
            .sliderBottom()
            .min(d3.min(data))
            .max(d3.max(data))
            .width(300)
            .tickFormat(d3.format('.2%'))
            .ticks(5)
            .default(0.015)
            .on('onchange', val => {
            d3.select('p#value-simple').text(d3.format('.2%')(val));
            });

        var gSimple = d3
            .select('div#slider-simple')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gSimple.call(sliderSimple);

        d3.select('p#value-simple').text(d3.format('.2%')(sliderSimple.value()));
        
    }

    function findMinMax(greScores, admitChances) {
        return {
            greMin: d3.min(greScores),
            greMax: d3.max(greScores),
            admitMin: d3.min(admitChances),
            admitMax: d3.max(admitChances)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)
        
        // append x and y axes to svg
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY) {
        // get scaled x and y coordinates from a datum
        // a datum is just one row of our csv file
        // think of a datum as an object of form:
        // {
        //     "GRE Score": ...,
        //     "Admit": ...,
        //     ...
        // }
        const xMap = function(d) { return scaleX(+d["GRE Score"]) }
        const yMap = function(d) { return scaleY(+d["Admit"]) }   
        
        // Define the div for the tooltip
        var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

        const circles = svgContainer.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 3)
                .attr('fill', "#4286f4")
            .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html(formatTime(d["GRE Score"])	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	

        // document.getElementById('#Red').onclick = function() {
        //     svgContainer.selectAll(".circle").attr('fill', 'red')
        //     console.log("scatterplot changed to red")
        // }
    
        // document.getElementById('Blue').on('click', function() {
        //     svgContainer.selectAll("circle").attr('fill', 'blue')
        //     console.log("scatterplot changed to blue")
        // })

        document.getElementById("Red").onclick = function changeToRed() {
            const circles = svgContainer.selectAll(".circle")
                .data(data)
                .enter()
                .append('circle')
                    .attr('cx', xMap)
                    .attr('cy', yMap)
                    .attr('r', 3)
                    .attr('fill', 'red')
        }
    
        document.getElementById("Blue").onclick = function changeToBlue() {
            const circles = svgContainer.selectAll(".circle")
                .data(data)
                .enter()
                .append('circle')
                    .attr('cx', xMap)
                    .attr('cy', yMap)
                    .attr('r', 3)
                    .attr('fill', 'blue')
        }

        

        //Add the SVG Text Element to the svgContainer
        var text = svgContainer.selectAll("text")
        .data(data)
        .enter()
        .append("text");

        //Add SVG Text Element Attributes
        var textLabels = text.attr("x", xMap)
        .attr("y", yMap)
        .text( function (d) { return +d["GRE Score"];})
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .attr("fill", "red");
    }
})()