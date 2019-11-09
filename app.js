
'use strict';
const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
var jsonQuery = require('json-query');

var data = [];

app.use(express.static('public'));
app.use(express.static('dist'));


// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');

});

app.get('/whole/data', function (req, res) {
  /**
   * input Int req.year
   * 
   * output Object {addressPoints:[[
   * Int Latitude,
    Int Longitude,
    Float NormConcentration,
    Int GasID,
    Int orbitYear,
    Int orbitMonth
   * ]]}
   * 
   */

   //TODO
   // 1486.741ms without break
   // 1333.965ms with break
   // need to be more quick. manuplating array takes 1200ms. should be less than 600ms. 
   // just idea use json key-value.
  const qYear = parseInt(req.query.year);
  
  const qResult = jsonQuery(`gasData[*orbitYear=${qYear}]`,{data: data}).value;
  
  let resObj = {"addressPoints":[]};
  // console.time("arrayTime");
  // let cont_loop = 0
  if (qResult.length > 1){
    qResult.forEach((obj) =>{
      if(resObj.addressPoints.length === 0){
        let tmpArr =[]
        tmpArr.push(parseInt(obj.latitude))
        tmpArr.push(parseInt(obj.longitude))
        tmpArr.push(parseFloat(obj.vMax))
        tmpArr.push(parseInt(obj.gasID))
        tmpArr.push(parseInt(obj.orbitYear))
        tmpArr.push(parseInt(obj.orbitMonth))
        tmpArr.push(1)
        resObj.addressPoints.push(tmpArr)


      }else{
        // For same location, different altitude.
        let push_flag = true;

        for(let x=0;x < resObj.addressPoints.length;x++){
          // cont_loop += 1
          if(resObj.addressPoints[x][0] === parseInt(obj.latitude) && resObj.addressPoints[x][1] === parseInt(obj.longitude) && resObj.addressPoints[x][3] === parseInt(obj.gasID) && resObj.addressPoints[x][4] === parseInt(obj.orbitYear) && resObj.addressPoints[x][5] === parseInt(obj.orbitMonth)){
            resObj.addressPoints[x][2] += parseFloat(obj.vMax);
            resObj.addressPoints[x][6] += 1;
            push_flag = false;
            break;
          } 

        }
        if(push_flag){
          let tmpArr =[]
          tmpArr.push(parseInt(obj.latitude))
          tmpArr.push(parseInt(obj.longitude))
          tmpArr.push(parseFloat(obj.vMax))
          tmpArr.push(parseInt(obj.gasID))
          tmpArr.push(parseInt(obj.orbitYear))
          tmpArr.push(parseInt(obj.orbitMonth))
          tmpArr.push(1)
          resObj.addressPoints.push(tmpArr)


      }
      
        

        }
  })
  // console.log(cont_loop)
  // console.timeEnd("arrayTime");
}

  resObj.addressPoints.forEach(e =>{
    e[2] = e[2]/parseFloat(e[6])
    e.pop()
  })

  //console.log(resObj.addressPoints)

  res.send(resObj)



});


app.get('/data', function (req, res) {
  

  let qLat = parseInt(req.query.lat);
  let qLng = parseInt(req.query.lng);
  let qYear = parseInt(req.query.year);

  let incr = 2;
  let qLathi = qLat +incr;
  let qLatlo = qLat -incr;

  let qLnghi = qLng +incr;
  let qLnglo = qLng -incr;
  
  // now do the json query

  // This is wrong comparison but Works
  let qResult = jsonQuery(`gasData[*latitude>=${qLatlo}
                            &latitude<=${qLathi}
                            &longitude>=${qLnglo}
                            &longitude<=${qLnghi}
                            &orbitYear=${qYear}]`,
                            {data: data}).value; 

    
  let RES = [];
  let resObj = {
    Methane:{
      altitudes: [],
      concentrations: []
    },
    Ozone: {
      altitudes: [],
      concentrations: []
    },
    CarbonDioxide: {
      altitudes: [],
      concentrations: []
    }
  };


  if (qResult.length > 1){

    qResult.forEach((element) => {
      if(element.gasID ==='3'){
        resObj.Methane.altitudes.push(element.altitude)
        resObj.Methane.concentrations.push(element.vAvg)
      }else if (element.gasID ==='4'){
        resObj.CarbonDioxide.altitudes.push(element.altitude)
        resObj.CarbonDioxide.concentrations.push(element.vAvg)
      }else if (element.gasID ==='6'){
        resObj.Ozone.altitudes.push(element.altitude)
        resObj.Ozone.concentrations.push(element.vAvg)
      }
    });
  };

   
  

  RES.push(resObj);

  //console.log(RES);

  res.send(RES);

});


const csvToJSON = () => {
  const csvFilePath = './gas_summary.csv';
  const csv = require('csvtojson');
  csv()
  .fromFile(csvFilePath)
  .then(jsonObj=>{
    
      //console.log(jsonObj)
      jsonObj.forEach(jObj =>{
        jObj.longitude = parseInt(jObj.longitude)
      })
      //console.log(jsonObj)


      data = {
        gasData : jsonObj
      };
        
    console.log('CSV data loaded complete!'); 
  });

}

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

    csvToJSON();
});




