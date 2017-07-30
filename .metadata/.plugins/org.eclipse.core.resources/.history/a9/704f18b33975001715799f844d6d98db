var Revision = require("../models/revision")
var Promise = require('promise')

var async = require('async')
var initial = require('../models/initial.js')
var bots, admins

module.exports.pullUpdate = function(req, res) {
	title = req.query.title
	var time
	Revision.findLatestTime(title, function(err, results) {
		if(err){
			console.log("Find latest timestamp of " + title + " error" + err)
		}
		else{
			time = results[0].timestamp
			//console.log("Latest timestamp for "+ title+ " is "+ time)
			
			console.log(time)
			//var myDate = new Date();
			var latestDateString = time.split("T")[0].split("-")
			var latestTimeString = time.split("T")[1].split("Z")[0].split(":")
			
			var latestDate = new Date(latestDateString[0], (latestDateString[1] - parseInt(1)), (parseInt(latestDateString[2]) + parseInt(1)) 
					,latestTimeString[0], latestTimeString[1], latestTimeString[2])
			
			var currentDate = new Date();
			
			console.log("latestDate = " + latestDate)
			console.log("currentDate = " + currentDate)
			if (latestDate < currentDate)
			{
				//console.log("less");
				var update = require('../models/update.js')
				update.queryAPI(title, time, null, res)
			}
			else
			{
				//console.log("greater");
				res.json("up to date")
			}
			//console.log("Latest timestamp for "+ title+ " is "+ time)
			//console.log("Now is " + myDate.toLocaleString( ))
			//check up to date
			
			
			
			/*
			var request = require('request')
			

			var wikiEndpoint = "https://en.wikipedia.org/w/api.php",
				parameters = ["action=query",
					"format=json",
					"prop=revisions",
					"titles=" + title,
					"rvstart=" + "2018-10-25T16:08:07Z",
					"rvdir=newer",
					"rvlimit=max",
					"rvprop=timestamp|userid|user|ids"]

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
				} else if (res.statusCode !== 200) {
					console.log('Status:', res.statusCode);
				} else {
					json = JSON.parse(data);
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
				}
			});
			*/
		}
		
	})
}

function requestAPI(option) {
	
}
module.exports.getTable = function(req, res) {
	title = req.query.title
	Revision.findTopUser(title, function(err, results) {
		if (err){
			console.log("Find pie Error")
		}else{
			res.render("individual/individualTable.pug", {results:results})
		}
	})
}

module.exports.getBar = function(req, res) {
	title = req.query.title
	console.log(title)
	Revision.findYearDistributionIndividual(title,function(err, results){
		if (err){
			console.log("Find pie Error")
		}else{
			var dis = [['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular user']]
			//console.log(results.length)
			
			for (var i = 0; i < results.length; i++) {
				var one = [5]
				one[0] = results[i]._id
				for (var j = 0; j < results[i].distribution.length; j++){
					if (results[i].distribution[j].userType == "admin") {
						one[1] = results[i].distribution[j].count
					}
					if (results[i].distribution[j].userType == "anon") {
						one[2] = results[i].distribution[j].count
					}
					if (results[i].distribution[j].userType == "bot") {
						one[3] = results[i].distribution[j].count
					}
					if (results[i].distribution[j].userType == "regular") {
						one[4] = results[i].distribution[j].count
					}
				}
				dis.push(one)
			}
			res.json(dis);
		}
	})
}

module.exports.getPie = function(req, res) {
	title = req.query.title
	Revision.findDistributionIndividual(title, function(err, results){
		if (err){
			console.log("Find pie Error")
		}else{
			var dis = {}
			for (var i = 0; i < results.length; i++) {
				dis[results[i]._id] = results[i].count
				//dis.push(results[i]._id)
				//dis[dis[i]] = results[i].count
			}
			res.json(dis);
		}
	})
}

module.exports.getUserChart = function(req, res) {
	title = req.query.title
	users = req.query.users
	//console.log(title)
	//console.log(users)
	Revision.findYearUserDistribution(title, users, function(err, results){
		if (err){
			console.log("Find user Chart Error")
		}else{
			res.json(results);
		}
	})
}
/*
module.exports.getTable = function(req, res) {
	title = req.query.title
	Revision.findTopUser (title, function(err, results) {
		if (err){
			console.log("Find pie Error")
		}else{
			res.json(results)
		}
	})
}
*/