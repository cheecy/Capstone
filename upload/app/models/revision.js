/**
 * 
 */
var mongoose = require('./db')

var RevisionSchema = new mongoose.Schema(
		{title: String, 
		 timestamp:String, 
		 user:String, 
		 anon:String,
		 userType:String},
		 {
			    versionKey: false 
		})

/*
 * Overall status functions
 */

RevisionSchema.statics.findArticleCounts = function(callback) {
	return this.aggregate([
	    {$group:{_id:"$title", count:{$sum:1}}},
	    {$sort:{count:-1}}
	    ])
	    .exec(callback)
}

RevisionSchema.statics.findOverallMostRevision = function(callback) {
	return this.aggregate([
	    {$group:{_id:"$title", numOfEdits: {$sum:1}}},
	    {$sort:{numOfEdits:-1}},
	    {$limit: 1}
	    ])
	    .exec(callback)
}

RevisionSchema.statics.findOverallLeastRevision = function(callback) {
	return this.aggregate([
	    {$group:{_id:"$title", numOfEdits: {$sum:1}}},
	    {$sort:{numOfEdits:1}},
	    {$limit: 1}
	    ])
	    .exec(callback)
}

//new
RevisionSchema.statics.findOverallLargestGroup = function(callback) {
	return this.aggregate([
	    {$match:{userType:"regular"}},
	    {$group:{_id:{title:"$title", user:"$user"}}},
        {$group:{_id:"$_id.title", count:{$sum:1}}},
        {$sort:{count:-1}},
        {$limit: 1}
	    ])
	    .exec(callback)
}

RevisionSchema.statics.findOverallSmallestGroup = function(callback) {
	return this.aggregate([
	    {$match:{userType:"regular"}},
	    {$group:{_id:{title:"$title", user:"$user"}}},
        {$group:{_id:"$_id.title", count:{$sum:1}}},
        {$sort:{count:1}},
        {$limit: 1}
	    ])
	    .exec(callback)
}


RevisionSchema.statics.findOverallLongestHistory = function(callback) {
	return this.aggregate([
	    {$group:{_id:"$title", history: {$min:"$timestamp"}}},
	    {$sort:{history:1}},
	    {$limit: 1}
	    ])
	    .exec(callback)
}

RevisionSchema.statics.findOverallShortestHistory = function(callback) {
	return this.aggregate([
	    {$group:{_id:"$title", history: {$min:"$timestamp"}}},
	    {$sort:{history:-1}},
	    {$limit: 1}
	    ])
	    .exec(callback)
}
//data for bar chart
RevisionSchema.statics.findYearDistribution = function (callback) {
	return this.aggregate([
	    {$project:{year:{$substr:["$timestamp", 0, 4]}, userType:1}},
	    {$group:{_id:{year:"$year", userType:"$userType"}, count:{$sum:1}}},
	    {$project:{_id:"$_id.year", userType:"$_id.userType", count: 1}},
	    {$group:{_id:"$_id", distribution:{$push:{userType:"$userType", count:"$count"}}}},
	    {$sort:{_id:1}}
	    ])
	    .exec(callback)
}
//data for pie chart
RevisionSchema.statics.findDistribution = function (callback) {
	return this.aggregate([
	    {$group:{_id:"$userType", count:{$sum:1}}}
	    ])
	    .exec(callback)
}
/*
 * Individual
 */
RevisionSchema.statics.findLatestTime = function(t, callback) {
	return this.find({title:t}, {timestamp:1})
	.sort({timestamp:-1})
	.limit(1)
	.exec(callback)
}
RevisionSchema.statics.findTopUser = function(a, callback) {
	return this.aggregate([
	    {$match:{title:a, userType:"regular"}},
	    {$group:{_id:"$user", count:{$sum:1}}},
	    {$sort:{count:-1}},
	    {$limit:5}
	    ])
	    .exec(callback)
}
//data for bar chart
RevisionSchema.statics.findYearDistributionIndividual = function (a, callback) {
	return this.aggregate([
		{$match:{title:a}},
	    {$project:{year:{$substr:["$timestamp", 0, 4]}, userType:1}},
	    {$group:{_id:{year:"$year", userType:"$userType"}, count:{$sum:1}}},
	    {$project:{_id:"$_id.year", userType:"$_id.userType", count: 1}},
	    {$group:{_id:"$_id", distribution:{$push:{userType:"$userType", count:"$count"}}}},
	    {$sort:{_id:1}}
	    ])
	    .exec(callback)
}
//data for pie chart
RevisionSchema.statics.findDistributionIndividual = function (t, callback) {
	return this.aggregate([
		{$match:{title:t}},
	    {$group:{_id:"$userType", count:{$sum:1}}}
	    ])
	    .exec(callback)
}
//data for user chart
RevisionSchema.statics.findYearUserDistribution = function(t, u, callback) {
	/*
	var or = "$or:[";
	for (var i = 0; i < u.length - 1; i++) {
		or += "{user: \"" + u[i] + "\"},"
	}
	or += "{user: \"" + u[i] + "\"}]"
	console.log(or)
	*/
	
	var or = []
	for (var i = 0; i < u.length - 1; i++) {
		var p = {user: null}
		p.user = u[i]
		or.push(p)
	}
	//console.log(or)
	return this.aggregate([
	    {$match:{$and:[{title: t}, {$or: or}]}},
	    {$project:{year:{$substr:["$timestamp", 0, 4]}, user:1}},
	    {$group:{_id:{year:"$year", user:"$user"}, count:{$sum:1}}},
	    {$project:{_id:"$_id.year", user:"$_id.user", count:"$count"}},
	    {$group:{_id:"$_id", distribution:{$push:{user:"$user", count:"$count"}}}},
	    {$sort:{_id:1}}
	    ])
	    .exec(callback)
}

var Revision = mongoose.model('Revision', RevisionSchema, 'revisions')

module.exports = Revision