var Revision = require("../models/revision")
var Promise = require('promise')

var async = require('async')
var initial = require('../models/initial.js')
var bots, admins
var revision = {mostRevision:{_id:"",numOfEdits:""}
, leastRevision:{_id:"",numofEdits:""}
, largestGroup:{_id:"", count:""}
, smallestGroup:{_id:"", count:""}
, longestHistory:{_id:"", history:""}
, shortestHistory:{_id:"", history:""}}


module.exports.index = function (req, res) {
	res.render("mainpage.pug")
}
module.exports.getSelecter = function(req, res) {
	Revision.findArticleCounts(function(err, results){
		if (err){
			console.log("Find selecter Error")
		}else{
			var counts = results
			var overallCounts = 0
			for (var i = 0; i < counts.length; i ++) {
				overallCounts += counts[i].count
			}
			counts.splice(0, 0, {_id: 'Overall', count: overallCounts})
			//var countsJson = JSON.stringify(counts);
			var countsJson = JSON.parse(JSON.stringify(counts))
			//console.log(countsJson)
			res.json(counts)
		}
	})
}

module.exports.getBar = function(req, res) {
	Revision.findYearDistribution(function(err, results){
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
	Revision.findDistribution(function(err, results){
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
module.exports.getoverallTable = function(req, res) {
	
	async.parallel([

	//Finding the article with the most number of revisions
	function(callback){
		Revision.findOverallMostRevision(function(err, results){
			if (err){
				console.log("Find most revision Error")
				callback(err);
			}else{
				//console.log("The most revision: ")
				//console.log(results)
				callback(null, results[0]);
			}
		})
	  },
	  //Finding the article with the least number of revisions
	  function(callback) {
		  Revision.findOverallLeastRevision(function(err, results){
				if (err){
					console.log("Find least revision Error")
					callback(err);
				}else{
					//console.log("The least revision: ")
					//console.log(results)
					callback(null, results[0]);
				}
			})
	  },
	  //Finding the article with largest member
		function(callback){
			Revision.findOverallLargestGroup(function(err, results){
				if (err){
					console.log("Find largest user group Error")
					callback(err);
				}else{
					//console.log("The most revision: ")
					//console.log(results)
					callback(null, results[0]);
				}
			})
		  },
	  /*
	  function(callback) {
		  Revision.aggregateUser(function(err, results){
			  if (err){
					console.log("AggregateUser Error")
					callback(err);
				}else{
					var articleList =[];
					for (var i = 0; i < results.length; i ++) {
						articleList[i] = results[i]._id
						var userList = []
						var count = 0
						for (var j = 0; j < results[i].users.length; j ++) {
							if(readfile.bots.indexOf(results[i].users[j]) == -1 
									&& readfile.admins.indexOf(results[i].users[j]) == -1
									&& userList.indexOf(results[i].users[j]) == -1) {
								//console.log(results[i].users[j])
								userList.push(results[i].users[j])
								count ++
							}
						}
						articleList[articleList[i]] = count
						//console.log(articleList)
					}
					
					console.log(articleList["Hurricane Fay (2014)"])
					var result = [articleList[0], articleList[articleList[0]]
					,articleList[0], articleList[articleList[0]]]
					
					for (var i = 0; i < articleList[i].length; i ++) {
						if (articleList[articleList[i]] > result[1]) {
							result[0] = articleList[i]
							result[1] = articleList[articleList[i]]
						}
						if (articleList[articleList[i]] < result[3]) {
							result[2] = articleList[i]
							result[3] = articleList[articleList[i]]
						}
					}
					//console.log(articleList)
					callback(null, result);
				}
		  })
	  },
	  
	  */
	  //Finding the article with smallest member
			function(callback){
				Revision.findOverallSmallestGroup(function(err, results){
					if (err){
						console.log("Find smallest user group Error")
						callback(err);
					}else{
						//console.log("The most revision: ")
						//console.log(results)
						callback(null, results[0]);
					}
				})
			  },
	  //Finding the article with longest history
	  function(callback) {
		  Revision.findOverallLongestHistory(function(err, results){
				if (err){
					console.log("Find longest history Error")
					callback(err);
				}else{
					//console.log("The longest history: ")
					//console.log(results)
					callback(null, results[0]);
				}
			})
	  },
	  
	//Finding the article with shortest history
	  function(callback) {
		  Revision.findOverallShortestHistory(function(err, results){
				if (err){
					console.log("Find shortest history Error")
					callback(err);
				}else{
					//console.log("The shortest history: ")
					//console.log(results)
					callback(null, results[0]);
				}
			})
	  }
	  ],
	  
	  //Build data for bar chart
	  
	  //Build data for pie chart
	  
	  //Overall callback function
	  function (err, results) {
		  if (err) {
			  console.log("Error!!!")
		  }else{
			  revision.mostRevision = results[0]
			  revision.leastRevision = results[1]
			  revision.largestGroup = results[2]
			  revision.smallestGroup = results[3]
			  revision.longestHistory = results[4]
			  revision.shortestHistory = results[5]
			  res.render("overall/table.pug", {revision:revision})
		  }
	  }
	)}

