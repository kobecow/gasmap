//--------- Creating array from json

// var addressPoints = [];
// for (var i in myData) {
//     var item = myData[i];
//     addressPoints.push([
//         item.Location.Latitude,
//         item.Location.Longitude,
//         item.NormConcentration,
//         item.GasID,
//         item.orbitYear
//     ]);
// }
/*
gasID	gas
1	CCl2F2
2	CCl3F
3	CH4
4	CO2
5	N2O
6	O3
*/

let currentYear = 2004;
let subArray = [];
let map;
let timer;
let heat;

let marker;
let latlng;
let data_Alt_con;

let layerObj ={
    "id": 'layer1',
    "gradient": {0: "rgb(0, 0, 255)", 0.2: "rgb(0, 255, 255)", 0.4: "rgb(0, 255, 0)", 0.6: "rgb(255, 255, 0)", 0.8: "rgb(255, 128, 0)", 1.0:"rgb(255, 0, 0)"},
    "radius": 30,
    "blur": 15,
    "minOpacity":0.1,
    "max": 10
};


/**
 * 
 * @param {Int} year
 * 
 * @return {addressPoints:[{}]} 
 */
async function get_data(year) {
    try {
      return (await axios.get('/whole/data',{
        params:{
            "year": year
        }
    })).data
    } catch (error) {
        console.log(error)
        throw error;
    }
  };
  
  

jQuery(document).ready(function () {
    jQuery(".gas").change(function (e) {
        //debugger;
        //addressPoints.filter(gases,e.data);
        //addressPoints.filter(point => point[1] == e.data);
        
    });
    map = L.map('map', {
        center: [56.1304, -108.3468],
        zoom: 3,
        continuousWorld: true
    });
    
    let tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    get_data('2004')
    .then(obj => {
        console.log(obj.addressPoints[0])
        addressPoints = obj.addressPoints
        subArrayPos = addressPoints.filter(point => point[3] === 6 && point[4] === 2004 ).map(point => [point[0],point[1],point[2]+5])
        // subArrayPos = addressPoints.filter(point => point[3] === 6 && point[4] === 2004).map(point => [point[0],point[1],5])
        console.log(subArrayPos)
        heat = L.heatLayer(subArrayPos, layerObj).addTo(map);
    
    })
    .catch(err => console.log(err))


    let default_marker = {"lat": 45, "lng": -76};
    marker = L.marker(default_marker).addTo(map);
    subArray_year =2004;
    get_Alt_Con(default_marker.lat,default_marker.lng,subArray_year);
    

    async function onMapClick(e) {

        if(marker != undefined){
            
            map.removeLayer(marker);
        }

        marker = L.marker(e.latlng).addTo(map);
        latlng = {lat: getRound(e.latlng.lat),lng:getRound(e.latlng.lng)};

        get_Alt_Con(latlng.lat,latlng.lng,subArray_year)
        
    }
    
    map.on('click', onMapClick);
    


});

const getRound = (num) =>{
    const intNum = Math.round(num)
    return intNum
}




const get_Alt_Con = (lat, lng, year)=>{
    axios.get('/data',{
        params:{
            "lat": lat,
            "lng": lng,
            "year": year
        }
    })
  .then(function (response) {
    // handle success
    //console.log(response.data);
    let latlng ={"lat": lat, "lng":lng};
    notify(latlng,year,response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}




function playMap() {
    
    timer = setInterval(function(){
        currentYear++;
        if (currentYear >= 2020) {
            //window.clearInterval(timer);
            currentYear = 2004;
        }
        console.log("currentYEAR: " +currentYear);
        
        callMap()
    }, 3000);

}

function stopMap(){
    clearInterval(timer); 
}

function getGas(){
    let gas;
    const radios = document.getElementsByName('gas');

    radios.forEach(element =>{
        if(element.checked){
            gas = parseInt(element.value);
        }
    })
    return gas;
}

function callMap() {
    jQuery('#year').text(currentYear);
    //
    const gas = getGas()
    createMap(gas, currentYear); //jQuery(".gas input[type='radio']:checked").val()   
}

function createMap(gas, year) {
    console.log("this is gas: "+gas)
    console.log("this is year: "+year)

    if (typeof map !== 'undefined') {
        console.log("Undefi")
        map.removeLayer(heat);
    }
    
    if ((year !== null && year !== undefined) && year !== '') {


        if(addressPoints[0][4] === year){
            console.log("SAME")
            
            subArrayPos = addressPoints.filter(point => point[3] === gas && point[4] === year).map(point => [point[0],point[1],point[2]])
            console.log("length: "+ subArrayPos.length)
            console.log(subArrayPos)
            // setTimeout(function(){
            //     heat = L.heatLayer(subArrayPos, layerObj).addTo(map);
            // }, 1500);
            heat = L.heatLayer(subArrayPos, layerObj).addTo(map);
            //map.addLayer(heat);
        }else{
            get_data(year)
            .then(obj => {
                console.log(obj.addressPoints[0])
                addressPoints = obj.addressPoints
                subArrayPos = addressPoints.filter(point => point[3] === gas && point[4] === year).map(point => [point[0],point[1],point[2]+5])
                // subArrayPos = addressPoints.filter(point => point[3] === gas && point[4] === year).map(point => [point[0],point[1],5])
                console.log("length: "+ subArrayPos.length)
                console.log(subArrayPos)
                heat = L.heatLayer(subArrayPos, layerObj).addTo(map);
        
            })
            .catch(err => console.log(err))

            subArray_year = year;
            let latlng = {lat: getRound(marker.getLatLng().lat),lng:getRound(marker.getLatLng().lng)};
            console.log("YYYYYY")
            get_Alt_Con(latlng.lat,latlng.lng,subArray_year)

        }
    } else {
        console.log("BIGFAIL")
        subArray = addressPoints.filter(point => point[3] == gas).map(point => [point[0],point[1],point[2]]);
    }
}
