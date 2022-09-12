function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

//------------Deliverable 1: Bar Graph---------------//

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    var metaresults = metadataArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var PANEL = d3.select("#sample-metadata");  
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var washing_frequency = metaresults.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
        marker: {
          color: 'rgb 127, 255, 212'}
      } 
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 600, height: 500,
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 50, l: 150 },
      plot_bgcolor:"rgb 51, 51, 51",
      paper_bgcolor:"#333333",
      font: {
        color: '#edf7f4'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 




//------------Deliverable 2: Bubble Chart---------------//

  // Bar and Bubble charts
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "YlGnBu",
        }
      }
    ];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      width: 1200, height: 600,
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      plot_bgcolor:"rgb 51, 51, 51",
      paper_bgcolor:"#333333",
      font: {
        color: '#edf7f4'}
    };  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);



//------------Deliverable 3: Gauge Chart---------------//
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly Button Washing Frequency</b> <br> # of Scrubs per Week" },
      gauge: {
        axis: { range: [null,10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "#f5bfdb" },
          { range: [2, 4], color: "#cfbff5" },
          { range: [4, 6], color: "#bcf2f5" },
          { range: [6, 8], color: "#acfab9" },
          { range: [8, 10], color: "#73d44a" }
        ],
        threshold: {
          value: washing_frequency,
        }
      },
      
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 500,
      plot_bgcolor:"rgb 51, 51, 51",
      paper_bgcolor:"#333333",
      font: {
        color: '#edf7f4'}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
