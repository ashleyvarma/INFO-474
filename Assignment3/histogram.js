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
        .then(() => makeHistogram(measurements.height))
    

    function makeHistogram(height) {
        // get arrays of TOEFL Score
        let toeflScores = data.map((row) => parseInt(row["TOEFL Score"]))
        console.log(toeflScores);
        // let toeflCount = data.map((row) =>  parseFloat(row["Research"]))

        let toeflCount = {};

        for (var i = 0; i < toeflScores.length; i++) {
            var num = toeflScores[i];
            toeflCount[num] = toeflCount[num] ? toeflCount[num] + 1 : 1;
          }

        console.log(toeflCount);

        // var toeflCount = d3.nest()
        // .key(function(d) {
        //     return d.toeflScores;
        // })
        // // .key(function(d) { return d.priority; })
        // .rollup(function(leaves) {
        //     return leaves.length;
        // })
        // .entries(data);

        // toeflCount.forEach(function(element) {
        //     console.log(element);
        // });

        // // define count object that holds count for each score
        // var countObj = {};

        // // count how much each score occurs in list and store in countObj
        // data.forEach(function(d) {
        //     var toeflScores = d.value;
        //     if(countObj[toeflScores] === undefined) {
        //         countObj[toeflScores] = 0;
        //     } else {
        //         countObj[toeflScores] = countObj[toeflScores] + 1;
        //     }
        // });

        // // now store the count in each data member
        // data.forEach(function(d) {
        //     var score = d.value;
        //     d.count = countObj[score];
        // });

        // let toeflCount = data.map((row) =>  parseFloat(countObj))

        // console.log(toeflCount);

        // find range of data
        const limits = findMinMax(toeflScores, toeflCount)
        // create a function to scale x coordinates
        let scaleX = d3.scaleLinear()
            .domain([limits.toeflMin - 5, limits.toeflMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])
        // create a function to scale y coordinates
        let scaleY = d3.scaleLinear()
            .domain([limits.countMax, limits.countMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])
        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY, toeflCount, height)

        svgContainer.append('text') 
            .attr('x', 200)
            .attr('y', 490)
            // .attr('transform', 'rotate(-90, 0)')
            .attr('fill', 'black')
            .text('TOEFL Score (bin)')
        
        svgContainer.append('text') 
            .attr('transform', 'translate(15, 300)rotate(-90)')
            .attr('fill', 'black')
            .text('Count of TOEFL Score')
    }

    function findMinMax(toeflScores, toeflCount) {
        return {
            toeflMin: d3.min(toeflScores),
            toeflMax: d3.max(toeflScores),
            freqMin: d3.min(toeflCount),
            freqMax: d3.max(toeflCount)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // .domain([0, d3.max(bins, function(d) { return d.length; })]);

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

    function plotData(scaleX, scaleY, toeflCount, height) {
        // var bins = bin(numbers);

        var bins = d3.histogram()
            .domain(scaleX.domain())
            .thresholds(scaleY.ticks(10))
            (toeflCount);

        // const xMap = function(d) { return scaleX(+d["TOEFL Score"]) }
        // const yMap = function(d) { return scaleY(+d[toeflCount]) }  
        
        svgContainer.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + scaleX(d.x0) + "," + scaleY(d.length) + ")"; })
            .attr("width", function(d) { return scaleX(d.x1) - scaleX(d.x0) -1 ; })
            .attr("height", function(d) { return height - scaleY(d.length); })
            .style("fill", "black")
        
        // const circles = svgContainer.selectAll(".circle")
        //     .data(data)
        //     .enter()
        //     .append('circle')
        //         .attr('cx', xMap)
        //         .attr('cy', yMap)
        //         .attr('r', 3)
        //         .attr('fill', "#4286f4")
                
    }

})()