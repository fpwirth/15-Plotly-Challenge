//Create variables for global datasets
var jsonmeta=[];
var jsonsample=[];
//Read json object, create subject list and select data for initial plots
d3.json('static/data/samples.json').then((data)=>{
  var names=data.names;
  var metadata=data.metadata;
  jsonmeta.push(metadata);
  var samples=data.samples;
  jsonsample.push(samples);
  var sample=names[0];
  sampleselect=d3.select('#selDataset');
  names.forEach(name=>{
    var row=sampleselect.append('option');
    row.text(name);});
  console.log('sample')
  console.log(sample);
  builddash(metadata,samples,sample);});
//Build dashboard plots
function builddash(metadata,samples,subject){
  //Filter data for subject
  var filteredmetadata=metadata.filter(metadata=>metadata.id==subject);
  var filteredsamples=samples.filter(samples=>samples.id==subject);
  //Create metadata table
  var row=d3.select('#sample-metadata').html('');
  filteredmetadata.forEach((meta)=>{
    Object.entries(meta).forEach(([key,value])=>{
      row.append('p').text(key.toUpperCase()+': '+value);});});
  //Determine top 10 bacteria found in subject's belly button
  var otuids=filteredsamples[0].otu_ids.slice(0,10).reverse();
  otuids=otuids.map(String).map(i=>'OTU '+i);
  var otulabels=filteredsamples[0].otu_labels.slice(0,10).reverse();
  var otuvalues=filteredsamples[0].sample_values.slice(0,10).reverse();
  //Create top 10 bacteria found in subject's belly button plot variables
  var bartrace=[{
    type:'bar',
    x:otuvalues,
    y:otuids,
    text:otulabels,
    orientation:'h'}];
  var barlayout={
    title: `Top 10 Bacteria Found in Subject's Belly Button`,
    xaxis:{
      'title':'Bacteria Counts'},
    yaxis:{
      'title':'Bacteria'}};
  //Create bacteria found in subject's belly button plot variables
  var bubbletrace=[{
    mode:'markers',
    x:filteredsamples[0].otu_ids,
    y:filteredsamples[0].sample_values,
    text:filteredsamples[0].otu_labels,
    marker:{
      'size':filteredsamples[0].sample_values.map(i=>i*25),
      'sizemode':'area',
      'color':filteredsamples[0].otu_ids,
      'colorscale':'YlGnBu'}}];
  var bubblelayout={
    title: `Bacteria Found in Subject's Belly Button`,
    xaxis:{
      'title':'Bacteria OTU ID'},
    yaxis:{
      'title':'Bacteria Counts'}};
  //Create subject's belly washing frequency plot variables
  var gaugetrace=[{
    type:'indicator',
    value:filteredmetadata[0].wfreq,
    mode:'gauge+number',
    gauge:{
      'axis':{
        'range':[null,9],
        'ticktext':'array',
        'tickvals':[1,2,3,4,5,6,7,8]},
      'steps':[
        {'range':[0,1],'color':'rgb(249,253,247)'},
        {'range':[1,2],'color':'rgb(248,253,245)'},
        {'range':[2,3],'color':'rgb(246,252,243)'},
        {'range':[3,4],'color':'rgb(244,251,240)'},
        {'range':[4,5],'color':'rgb(241,250,236)'},
        {'range':[5,6],'color':'rgb(238,249,231)'},
        {'range':[6,7],'color':'rgb(234,247,225)'},
        {'range':[7,8],'color':'rgb(229,245,217)'},
        {'range':[8,9],'color':'rgb(223,242,208)'}],
      'bar':{
        'color':'rgb(99,194,191)'}}}];
  var gaugelayout={
    width:600,
    height:400,
    padding:20,
    template:{
      data:{
        'indicator':[
          {'title':{'text':'Belly Button Washing Frequency<br><span style="font-size:0.8em">Scrubs per Week</span>'},
          'mode':'number+gauge',}]}}};
  //Create dashboard plots
  Plotly.newPlot('bar',bartrace,barlayout);
  Plotly.newPlot('bubble',bubbletrace,bubblelayout);
  Plotly.newPlot('gauge',gaugetrace,gaugelayout);};
//Create new dashboard plots for another subject
function optionChanged(){
  let sample=d3.select('#selDataset').node().value;
  metadata=jsonmeta[0];
  samples=jsonsample[0];
  builddash(metadata,samples,sample);
  console.log('sample')
  console.log(sample);};