var express = require('express')
var bodyParser = require('body-parser')
var path = require("path")

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://projectclout.com:27017/mydb";

const { dirname } = require('path')

MongoClient.connect(url, function(err,db){
    if (err) throw err;
    dbo = db.db("smallProjects");

    app = express()

    app.use(bodyParser.urlencoded({
        extended : true
    }))

    app.use(bodyParser.json())

    app.get('/', function(req,res){
        res.sendFile(path.join(__dirname, "index.html"))
    })
    app.get('/:code', function(req,res){
      
        code = {
            code : req.params.code
        }
        dbo.collection("urlShortenr").find(code).toArray(function(err,result){
            if(result.length > 0){
                res.redirect(result[0].url)
            }
            else{
                res.send("That code is not in use")
            }

        })
      
    })

    app.post('/submit',function(req,res){

        var url = req.body.url
        type = parseInt(req.body.type)
        if(type == 0 && !url.includes("https")){
            url = "https://" + url
        }
        else if(type == 1 && !url.includes("http")){
            url = "http://" + url
        }
        urlObj = {
            url : url,
            code : req.body.code
        }
        console.log(urlObj)

        dbo.collection("urlShortenr").find({code : req.body.code}).toArray(function(err, result){
            if(result.length == 0){
                dbo.collection("urlShortenr").insertOne(urlObj, function(err,result){
                    res.send("Done")
                })
            }
            else{
                res.send("That code is in use")
            }
        })
        
    })
    app.listen(8080)

})