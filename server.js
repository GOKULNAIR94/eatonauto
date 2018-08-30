'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
var https = require('https');
var fs = require('fs'),
    path = require('path');
restService.use(bodyParser.urlencoded({
    extended: true
}));
restService.use(bodyParser.json());

var csv = require('csv-parser');

restService.get('/', onRequest);
restService.use(express.static(path.join(__dirname, '/public')));

function onRequest(request, response){
  response.sendFile(path.join(__dirname, '/public/index.html'));
}



restService.get('/load', function(req, res) {
    console.log("Load");
    var result = [];
    fs.createReadStream('batchL.csv')
    .pipe(csv())
    .on('data', function (data) {

        result.push({
            "Email" : data.Email,
            "Id" : data.Id,
            "Update" : data.Update,
            "Delete" : data.Delete
        });
    })
    .on('end', function () {
        console.log(JSON.stringify(result));
        
        res.json({
            "status" : 200,
            "output" : result
        });
    });
    
    
});


function updateRecord(request, response, result, count, callback){
    

    if( count == result.length ){

        response.json({
                    "status" : 200,
                    "output" : result
                });
    }
    else{
        
        var options = {
          "method": "GET",
          "hostname": "eear-test.crm.us2.oraclecloud.com",
          "port": null,
          "path": "/salesApi/resources/latest/partnerContacts/" + result[count].Id + "?onlyData=true",
          "headers": {
            "authorization": "Basic RTAwMjgzNjY6UHJvZEAxMjM0",
            "content-type": "application/vnd.oracle.adf.resourceitem+json",
            "cache-control": "no-cache",
            "postman-token": "10bc5870-81c7-3279-7617-04cc1a85b97c"
          }
        };

        var req = https.request(options, function (res) {
          var chunks = [];

          res.on("data", function (chunk) {
            chunks.push(chunk);
          });

          res.on("end", function () {
            var body = JSON.parse(Buffer.concat(chunks));
//            console.log("Flag : " + body.PersonDEO_Status_c);
            if( body.PersonDEO_Status_c == "INACTIVE" ){
                result[count].Update = "OK "+ body.PersonDEO_Status_c;
                console.log(result[count].Email +","+ result[count].Id +","+ body.ContactName +","+ body.PersonDEO_Status_c);
                updateRecord( request, response, result, count+1);    
              }
              else{
                  result[count].Update = "Fail " + result[count].PersonDEO_Status_c;
                console.log(result[count].Email +","+ result[count].Id +","+ body.PersonDEO_Status_c);
                updateRecord( request, response, result, count+1);    
              }
              
          });
            res.on("err", function (e) {
                console.log("Error : " + e);
                response.json({
                    "status" : 500,
                    "output" : result
                });
            });

        });

//        req.write("{\n\t\"PersonDEO_Status_c\" : \"INACTIVE\"\n}");
        req.end();
        
    }
    
}


restService.get('/update', function(request, response) {
    console.log("Update");
    

    var result = [];
    
    fs.createReadStream('batchL.csv')
    .pipe(csv())
    .on('data', function (data) {

        result.push({
            "Email" : data.Email,
            "Id" : data.Id,
            "Update" : data.Update,
            "Delete" : data.Delete
        });
    })
    .on('end', function () {
        console.log(JSON.stringify(result));
        console.log("Length : " + result.length);
        console.log("Email,Id,Contact Name,Update");
        updateRecord( request, response, result, 0 );
        
    });
});

//restService.get('/delete', function(request, response) {
//    console.log("Deletenode");
//    
//    var result = [];
//    
//    fs.createReadStream('batchL.csv')
//    .pipe(csv())
//    .on('data', function (data) {
//
//        result.push({
//            "Email" : data.Email,
//            "Id" : data.Id,
//            "Update" : data.Update,
//            "Delete" : data.Delete
//        });
//    })
//    .on('end', function () {
//        console.log(JSON.stringify(result));
//        console.log("Length : " + result.length);
//        console.log("Count,Email,Id,Delete");
//        deleteRecord( request, response, result, 0 );
//        
//    });
//});
//
//function deleteRecord(request, response, result, count, callback){
//
//    if( count == result.length ){
//
//        response.json({
//                    "status" : 200,
//                    "output" : result
//                });
//    }
//    else{
//
//        var options = {
//          "method": "DELETE",
//          "hostname": "eear-test.crm.us2.oraclecloud.com",
//          "port": null,
//          "path": "/salesApi/resources/latest/partnerContacts/" + result[count].Id + "/child/userdetails/" + result[count].Email + "?onlyData=true",
//          "headers": {
//            "authorization": "Basic RTAwMjgzNjY6UHJvZEAxMjM0",
//            "cache-control": "no-cache"
//          }
//        };
//
//        var req = https.request(options, function (res) {
//          var chunks = [];
//
//          res.on("data", function (chunk) {
//            chunks.push(chunk);
//          });
//
//          res.on("end", function () {
//            var body = Buffer.concat(chunks);
////              console.log("Status :" + res.statusCode);
////              console.log(body.toString());
//              
//              
//              var options1 = {
//                  "method": "GET",
//                  "hostname": "eear-test.crm.us2.oraclecloud.com",
//                  "port": "443",
//                  "path": "/salesApi/resources/latest/partnerContacts/" + result[count].Id + "/child/userdetails/" + result[count].Email + "?onlyData=true",
//                  "headers": {
//                    "authorization": "Basic RTAwMjgzNjY6UHJvZEAxMjM0",
//                    "content-type": "application/vnd.oracle.adf.resourceitem+json",
//                    "cache-control": "no-cache"
//                  }
//                };
//
//                var req1 = https.request(options1, function (res1) {
//                  var chunks = [];
//
//                  res1.on("data", function (chunk) {
//                    chunks.push(chunk);
//                  });
//
//                  res1.on("end", function () {
//                    var body = Buffer.concat(chunks);
////                        console.log(body.toString());
//                      if( res1.statusCode == "404" ){
//                        result[count].Delete = "OK";
//                        console.log(count+1 +"," +result[count].Email +","+ result[count].Id +","+ result[count].Delete);
//                        deleteRecord( request, response, result, count+1);    
//                      }
//                      else{
//                          result[count].Delete = "Fail";
//                        console.log(count+1 +"," + result[count].Email +","+ result[count].Id +","+ result[count].Delete);
//                        deleteRecord( request, response, result, count+1);    
//                      }
//                  });
//                });
//
//                req1.end();
//          });
//            res.on("err", function (e) {
//                console.log("Error : " + e);
//                response.json({
//                    "status" : 500,
//                    "output" : result
//                });
//            });
//        });
//
//        req.end();
//        
//
//    }
//    
//}


restService.listen((process.env.PORT || 3000), function() {
  console.log("Server up and listening");
});
