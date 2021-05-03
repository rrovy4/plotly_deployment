function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
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
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var sorted_sample_values = sample_values.sort((a,b) => b - a);
    var top_sample_values = sorted_sample_values.slice(0,10);
    var rev_top_sample_values = top_sample_values;
    var sorted_otu_labels = otu_labels.sort((a, b) => b - a);
    var top_otu_labels = sorted_otu_labels.slice(0,10);

    var otu_id_list = otu_ids.slice(0,10);

    var yticks = otu_id_list.map(object => 'OTU_'.concat(object.toString()));
    console.log(yticks);
    console.log(rev_top_sample_values);
    console.log(top_otu_labels);

    // 8. Create the trace for the bar chart.
    var barData = [{
          x: rev_top_sample_values,
          y: yticks,
          text: top_otu_labels.map(object => object.split(";").sort().join(";")),
          type: "bar",
          orientation: 'h'
    }];
    // 9. Create the layout for the bar chart.
    var barLayout = {
          title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
              size: sample_values,
              sizeref: 2
            }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var meta_resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var meta_result = meta_resultArray[0];
    console.log(meta_result);

    // 3. Create a variable that holds the washing frequency.
    wfreq = meta_result.wfreq || 0;
    console.log(wfreq);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
        value: wfreq,
        type: "indicator",
        mode: "gauge+number",
        title: { text: "Belly Button Washing Frequency" },
        bar: { color: "black" },
        gauge: {
              axis: { range: [0, 10] },
              steps: [
                      {range: [0, 2], color: "red"},
                      {range: [2, 4], color: "orange"},
                      {range: [4, 6], color: "yellow"},
                      {range: [6, 8], color: "lightgreen"},
                      {range: [8, 10], color: "green"},
                    ]
              }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
        width: 400,
        height: 350,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "azure",
        font: {color: "gray", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}
