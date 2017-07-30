var request = require('request')
var initial = require('../models/initial.js')
var async = require('async')
var Revision = require("../models/revision")

var revisions = []

module.exports.queryAPI = queryAPI

function queryAPI(title,time,rvcontinue,back) {
	var parameters = []
	if (rvcontinue == null) {
		parameters = ["action=query",
			"format=json",
			"prop=revisions",
			"titles=" + title,
			"rvstart=" + time,
			"rvdir=newer",
			"rvlimit=max",
			"rvprop=timestamp|userid|user|ids"]
	}
	else {
		parameters = ["action=query",
			"format=json",
			"prop=revisions",
			"titles=" + title,
			"rvstart=" + time,
			"rvdir=newer",
			"rvlimit=max",
			"rvprop=timestamp|userid|user|ids",
			"rvcontinue=" + rvcontinue]
	}
	var wikiEndpoint = "https://en.wikipedia.org/w/api.php"
	var url = wikiEndpoint + "?" + parameters.join("&")

//console.log(initial.bots)
	console.log("url: " + url)

var options = {
	url:url,
	Accept: 'application/json',
	'Accept-Charset': 'utf-8'
}

request(options, function (err, res, data){
	if (err) {
		console.log('Error:', err);
		back.json('Error:', err)
	} else if (res.statusCode !== 200) {
		console.log('Status:', res.statusCode);
		back.json('Status:', res.statusCode)
	} else {
		json = JSON.parse(data);
		if (json.continue) {
			console.log("has next")
			console.log(json.continue.rvcontinue)
			pages = json.query.pages
			revisions = revisions.concat(pages[Object.keys(pages)[0]].revisions)
			//revisions = pages[Object.keys(pages)[0]].revisions
			//console.log("There are " + revisions.length + " revisions.");
			
			queryAPI(title, time, json.continue.rvcontinue, back)
			//back.json("500")
		}
		else {
			pages = json.query.pages
			revisions = revisions.concat(pages[Object.keys(pages)[0]].revisions)
			console.log("There are " + revisions.length + " revisions.");
			console.log("no next")
			
			var ObjectID = require('mongodb').ObjectID
			
			var newData = []
			for (var i = 1; i < revisions.length; i ++) {
			//for (revid in revisions) {
				if (revisions[i].user.split(".").length == 4) {
					userType = "anon"
				}
				else if(initial.bots.indexOf(revisions[i].user) != -1) {
					userType = "bot";
				}
				else if(initial.admins.indexOf(revisions[i].user) != -1) {
					userType = "admin";
				}
				else {
					userType = "regular"
				}
				
				var user = {
						user:revisions[i].user,
						title: title,
						userType: userType,
						timestamp:revisions[i].timestamp,
						
						_id: new ObjectID()
					}
				newData.push(user)
				
				//console.log(userType)
				
				/*
				functions.push(function(revid) {
					return function(callback) {
						revid.save(callback)
					}
				})
				*/
			}
			Revision.insertMany(newData, function(error, docs) {
				if(!error) {
					back.json(revisions.length - 1)
					revisions = new Array()
					
					console.log("insert success")
				}
			});
			/*
			async.parallel(functions, function(err, results) {
				if (err) {
					console.log(err)
				}else{
					back.json(revisions.length)
				}
			})
			*/
			//back.json(revisions.length)
		}
		/*
		console.log(json)
		pages = json.query.pages
		revisions = pages[Object.keys(pages)[0]].revisions
		console.log("There are " + revisions.length + " revisions.");
		var users=[]
		for (revid in revisions){
			users.push(revisions[revid].user);
		}
		var anonCount = 0
		for (u in users) {
			if (u == "anon"){
				anonCount ++
			}
		}
		console.log("anonCount" + anonCount)
		uniqueUsers = new Set(users);
		console.log("The revisions are made by " + uniqueUsers.size + " unique users");
		console.log(uniqueUsers)
		*/
	}
});
}


