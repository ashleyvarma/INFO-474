// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = ""
    // dimensions for svg
    const measurements = {
        width: 500,
        height: 500,
        marginAll: 50
    }

    // load data and append svg to body
    svg = d3.select('body').append("svg")
        .attr('width', measurements.width)
        .attr('height', measurements.height);


// get the data
d3.csv("Admission_Predict.csv", function(data) {
    let toeflScores = data.map((row) => parseInt(row["TOEFL Score"]))
    console.log(toeflScores);

    // X axis: scale and draw:
    var x = d3.scaleLinear()
        .domain([92, 122])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([50, width-50]);
    svg.append("g")
        .attr("transform", "translate(0," + (height - 50) + ")")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(15)); // then the numbers of bins


    // And apply this function to data to get the bins
    var bins = histogram(toeflScores);
    console.log(bins);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height - 50, 50]);
        console.log(height);
         
        console.log(d3.max(bins, function(d) { return d.length; }))  // d3.hist has to be called before the Y axis obviously
        svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
            .attr("height", function(d) { return (height-50) - y(d.length); })
            .style("fill", "black")
    
    svg.append('text') 
        .attr('x', 170)
        .attr('y', 345)
        .attr('fill', 'black')
        .text('TOEFL Score (bin)')
        
    svg.append('text') 
        .attr('transform', 'translate(15, 300)rotate(-90)')
        .attr('fill', 'black')
        .text('Count of TOEFL Score')
});