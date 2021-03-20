// load in data
d3.json('samples.json').then((data) => {
    console.log(data);
});

// chart function
function charts(sample) {

    // Read in data
    d3.json('samples.json').then((data) => {
        var sampledata = data.samples;
        console.log(sampledata)
        // object filter
        var results = sampledata.filter(sampleobject => sampleobject.id == sample)[0];
        //console.log(results)
        // bar chart variables
        var otulabels = results.otu_labels.slice(0, 10).reverse();
        //console.log(otulabels);
        var samplevalues = results.sample_values.slice(0, 10).reverse();
        //console.log(samplevalues);
        var otuid = results.otu_ids;
        //console.log(otuid);
        var yticks = otuid.map(sampleobject => 'OTU' + sampleobject).slice(0,10).reverse();
       



    
        //plotting the bar chart
        var barchartdata = [{
            x: samplevalues,
            y: yticks,
            text: otulabels,
            type: 'bar',
            orientation: 'h'
        }];

        var barchartlayout = {
            title: 'Top 10 OTU'
        };

        Plotly.newPlot('bar', barchartdata, barchartlayout);




        // Bubble chart
        d3.json('samples.json').then((data) => {
            var sampleforbubble = data.samples;
            var results = sampleforbubble.filter(sampleobject => sampleobject.id == sample)[0];
            var bubbledata =  [{
                x: results.otu_ids,
                y: results.sample_values,
                mode: 'markers',
                text: results.otu_labels,
                marker: {
                    size: results.sample_values,
                    color: results.otu_ids
                 }
            }]; 
        
            var layout = {
                xaxis: {title: 'OTU IDs'}
            };
            Plotly.newPlot('bubble', bubbledata, layout);
        });
    });
}

// metadata variables
function metadata(sample) {
    d3.json('samples.json').then((data) => {
        var sampleMeta = data.metadata;
        var results = sampleMeta.filter(sampleobject => sampleobject.id == sample)[0];
        var paneldata = d3.select('#sample-metadata');
        paneldata.html("");

        Object.entries(results).forEach(([key, value]) => {
            paneldata.append('h6').text(`${key} : ${value}`);

        });
    });
}



// Add sample names to drop down menu
function init() {
    var dropdown = d3.selectAll('#selDataset');

    // Read in json and add sample names to a variable
    d3.json('samples.json').then((data) => {
        var samplenames = data.names;

        samplenames.forEach((sample) => {
            dropdown
                .append('option')
                .text(sample)
                .property('value', sample);
        });

        var sample = samplenames[0];
        charts(sample);
        metadata(sample);

    });
}

function samplechange(newsample) {
    charts(newsample);
    metadata(newsample);
}

init();