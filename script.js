//Declare the chart dimensions and margins
const width = 900;
const height = 500;

//Create a title for the chart
const title = d3.select("#container")
                .append("h1")
                .attr("id", "title")
                .text("United States GDP");

//Create dataset
let dataset = [];

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(data => {
        dataset = data.data;
        
        //Create the SVG container
        const svg = d3.select("#container")
                    .append("svg")
                    .attr("width", width + 60)
                    .attr("height", height + 100);

        var years = data.data.map(function (item) {
            var quarter;
            var temp = item[0].substring(5, 7);

            if (temp === "01") {
                quarter = "Q1";
            } else if (temp === "04") {
                quarter = "Q2";
            } else if (temp === "07") {
                quarter = "Q3";
            } else if (temp === "10") {
                quarter = "Q4";
            }

            return item[0].substring(0, 4) + " " + quarter;
        });

        //Declare the x (horizontal position) scale
        const yearsDate = dataset.map(function (item) {
            return new Date(item[0]);
        });
        
        const xMax = new Date(d3.max(yearsDate));
        xMax.setMonth(xMax.getMonth() + 3);
        const xScale = d3.scaleTime()
            .domain([d3.min(yearsDate), xMax])
            .range([0, width]);

        var GDP = dataset.map(function (item) {
            return item[1];
        });

        var scaledGDP = [];

        var gdpMax = d3.max(GDP);

        var linearScale = d3.scaleLinear()
                            .domain([0, gdpMax])
                            .range([0, height]);

        scaledGDP = GDP.map(function (item) {
            return linearScale(item);
        });

        //Declare the y (vertical position) scale
        const yScale = d3.scaleLinear()
            .domain([0, gdpMax])
            .range([height, 0]);

        //Create x-axis and label
        const xAxis = d3.axisBottom(xScale);
        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(50, 550)")
            .call(xAxis);

        //Create y-axis and label
        const yAxis = d3.axisLeft(yScale);
        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(50, 50)")
            .call(yAxis);

        
        //Create rects
        svg.selectAll("rect")
            .data(scaledGDP)
            .enter()
            .append("rect")  
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return xScale(yearsDate[i]);
            })
            .attr("y", function (d) {
                return height - d;
            })
            .attr("width", width / 275)
            .attr("height", function (d) {
                return d;
            })
            .attr("fill", "green")
            .attr("data-date", function (d, i) {
                return data.data[i][0];
            })
            .attr("data-gdp", function (d, i) {
                return data.data[i][1];
            })
            .attr("index", (d, i) => i)
            .attr("transform", "translate(50, 50)")
            .on("mouseover", function(event, d) {
                var i = this.getAttribute("index");
                tooltip.transition().duration(200).style("opacity", .9)
                    .style("box-shadow", "0 6px 12px rgba(0, 0, 0, 0.2)");
                tooltip.html(
                years[i] + "<br>"
                    + "$" + GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + " Billions")
                    .attr("data-date", data.data[i][0])
                    .style("left", (width / 2) + "px")
                    .style("top", height - 150 + "px")
                    .style("tranform", "translate(60px)");
            })
            .on("mouseout", function(event) {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        //Create source data
        svg.append("text")
            .attr("class", "source")
            .attr("transform", `translate(${290}, ${height - 450})`)
            .text("Source data : http://www.bea.gov/national/pdf/nipaguid.pdf");

        //Create axis detail
        svg.append("text")
            .attr("class", "y-axis-detail")
            .attr("transform", `translate(${10}, ${height - 465})`)
            .text("($ Billions)");
        svg.append("text")
            .attr("class", "x-axis-detail")
            .attr("transform", `translate(${450}, ${height + 90})`)
            .text("Years (Quarterly)");
            
        //Create tooltip
        const tooltip = d3.select("#container")
            .append("div")
            .attr("id", "tooltip");
    })
    .catch(error => {
        alert("There was an error loading the United States GDP data");
    });