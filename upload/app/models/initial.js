/**
 * 
 */
var Revision = require("../models/revision")
var fs = require("fs")
var async = require('async')
var overallCounts
var counts = []
var admins, bots
//var admins = fs.readFileSync('./public/admin.txt');
//var bots = fs.readFileSync('./public/bot.txt');

//console.log(admins.toString())

var ini = async.parallel([
	  function(callback){
	    fs.readFile('./public/admin.txt', function (err, data) {
	      if (err) callback(err);
	      callback(null, data);
	    });
	  },
	  function(callback){
	    fs.readFile('./public/bot.txt', function (err, data2) {
	      if (err) callback(err);
	      callback(null, data2);
	    });
	  }
	],
	function(err, results){
	if (err) {
		console.log("Read File Error!!")
	} else {
		admins = results[0].toString().split("\n")
		bots = results[1].toString().split("\n")
		module.exports.admins = admins
		module.exports.bots = bots
		
		Revision.find({anon:{$exists:true}, userType:{$exists:false}}).cursor()
		  .on('data', function(doc){
			    // handle doc
			  	doc.userType = "anon"
			  	doc.save();
			  })
			  .on('error', function(err){
				  console.log("Error ini")
			    // handle error
			  })
			  .on('end', function(){
			    // final callback
				  console.log("anon signed complete")
			  });
		Revision.find({userType:{$exists:false}}).cursor()
		  .on('data', function(doc){
			    // handle doc
			  if(bots.indexOf(doc.user) != -1) {
				  doc.userType = "bot";
				  doc.save();
			  }
			  else if(admins.indexOf(doc.user) != -1) {
				  doc.userType = "admin";
				  doc.save();
			  }else {
				  doc.userType = "regular";
				  doc.save();
			  }
			  })
			  .on('error', function(err){
				  console.log("Error ini")
			    // handle error
			  })
			  .on('end', function(){
			    // final callback
				  //Revision.save()
				  console.log("bots & admins signed complete")
			  });
	}
	});
