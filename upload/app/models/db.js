var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/wikipedia', function (err) {
	if (!err) {
		mongoose.Promise = global.Promise;
		console.log('mongodb connected')
	}
	else console.log ('db err' + err)

})

module.exports = mongoose