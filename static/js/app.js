// Build the metadata panel/table
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let objectarray = metadata.filter(sampleobject=>sampleobject.id==sample);
    let results = objectarray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (i in results){
      panel.append("h6").text(`${i.toUpperCase()}: ${results[i]}`);
    }
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let objectarray = samples.filter(sampleobject=>sampleobject.id==sample);
    let results = objectarray[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;

    // Build a Bubble Chart
    let bubbledata = [{
      x : otu_ids,
      y : sample_values,
      text : otu_labels,
      mode : "markers", 
      marker : {size: sample_values, color: otu_ids} 
  }];

    let bubblechart = {
      title : "Bubble Chart",
      margin : {t:30},
      xaxis : {title:"OTU IDs"},
      yaxis : {title: "Number of bacteria found"}
    };

    // Render the Bubble Chart

    Plotly.newPlot("bubble", bubbledata, bubblechart);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let slicedData = {
      otu_ids: otu_ids.slice(0, 10),
      sample_values: sample_values.slice(0, 10),
      otu_labels: otu_labels.slice(0, 10)
    };
    let yticks = slicedData.otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sorted = yticks.sort(function sortFunction(a, b) {
      return b - a;
    });
    

    // Render the Bar Chart
    let bardata = [{
      y: sorted,
      x: slicedData.sample_values,
      text: slicedData.otu_labels,
      type: "bar",
      orientation: "h"
    }];

    let barlayout = {
      title: "Top 10 Bacteria Found",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU IDs"}
    };
  Plotly.newPlot("bar", bardata, barlayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samplenames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let x = 0; x < samplenames.length; x++){
      dropdown.append("option").text(samplenames[x]).property("value", samplenames[x])
        };

    // Get the first sample from the list
    let firstsample = samplenames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstsample);
    buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newsample) {
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newsample);
buildMetadata(newsample);
}

// Initialize the dashboard
init();
