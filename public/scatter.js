

var Ozone = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Ozone',
  marker: { size: 12 }
  //text:"aaa"
};

var Methane = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Methane',
  marker: { size: 12 }
  //text: "aaa"
};

var CarbonDioxide = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Carbon Dioxide',
  marker: { size: 12 }
  //text: ["aaa"]
};

var Dichlorodifluoromethane = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Dichlorodifluoromethane',
  marker: { size: 12 }
  //  text: ["aaa"]
}

var Trichlorofluoromethane = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Trichlorofluoromethane',
  marker: { size: 12 }
}

var Nitrous_oxide = {
  x: [],
  y: [],
  mode: 'markers',
  name: 'Nitrous oxide',
  marker: { size: 12 }
}


var data = [Ozone, Methane, CarbonDioxide, Dichlorodifluoromethane, Trichlorofluoromethane, Nitrous_oxide];
var lat = 0;
var lng = 0;
var oneyear = 0;
let words = ""

function notify(latlng, year, resdata) {
  lat = latlng.lat;
  lng = latlng.lng;
  oneyear = year;
  dataset = resdata;

  // console.log(dataset[0].Ozone)
  console.log(dataset);
  if (dataset[0].Ozone.altitudes.length > 0) {
    data[0].x = dataset[0].Ozone.altitudes
    data[0].y = dataset[0].Ozone.concentrations
  } else {
    data[0].x = []
    data[0].y = []
  }

  if (dataset[0].Methane.altitudes.length > 0) {

    data[1].x = dataset[0].Methane.altitudes
    data[1].y = dataset[0].Methane.concentrations

  } else {
    data[1].x = []
    data[1].y = []
  }

  if (dataset[0].CarbonDioxide.altitudes.length > 0) {
    data[2].x = dataset[0].CarbonDioxide.altitudes
    data[2].y = dataset[0].CarbonDioxide.concentrations
  } else {
    data[2].x = []
    data[2].y = []
  }

  if (dataset[0].Dichlorodifluoromethane.altitudes.length > 0) {
    data[3].x = dataset[0].Dichlorodifluoromethane.altitudes
    data[3].y = dataset[0].Dichlorodifluoromethane.concentrations
  } else {
    data[3].x = []
    data[3].y = []
  }

  if (dataset[0].Trichlorofluoromethane.altitudes.length > 0) {
    data[4].x = dataset[0].Trichlorofluoromethane.altitudes
    data[4].y = dataset[0].Trichlorofluoromethane.concentrations
  } else {
    data[4].x = []
    data[4].y = []
  }

  if (dataset[0].Nitrous_oxide.altitudes.length > 0) {
    data[5].x = dataset[0].Nitrous_oxide.altitudes
    data[5].y = dataset[0].Nitrous_oxide.concentrations
  } else {
    data[5].x = []
    data[5].y = []
  }


  words = ""
  if (data[0].x.length === 0) {
    words = "No Data Measurement"
  }



  // console.log("From notify: "+ lat);
  // console.log("From notify: "+ lng);
  // console.log("From notify: "+ oneyear);
  Plotly.purge('myDiv');
  layout.title.text = 'Concentration vs Altitude, ' + oneyear + ', ' + lat + '° N' + ', ' + (-1 * lng) + '° W <br>' + words;



  Plotly.newPlot('myDiv', data, layout, { showSendToCloud: true });
};

var layout = {
  title: {
    text: 'Concentration vs Altitude, ' + oneyear + ', ' + lat + '° N' + ', ' + (-1 * lng) + '° W ',
    font: {
      family: 'Courier New, monospace',
      size: 18
    },
    xref: 'paper',
    x: 0.05,
  },
  xaxis: {
    title: {
      text: 'Altitude (Km)',
      font: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    },
  },
  yaxis: {
    title: {
      text: 'Concentration (Deviation from Mean)',
      font: {
        family: 'Courier New, monospace',
        size: 18,
        color: '#7f7f7f'
      }
    }
  }
};





Plotly.newPlot('myDiv', data, layout, { showSendToCloud: true });