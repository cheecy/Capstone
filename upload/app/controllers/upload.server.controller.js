var multer  = require('multer')
var fs = require('fs');

module.exports.index = function (req, res) {
	console.log("index is invoked")
	res.render("mainpage.pug")
}

module.exports.publish = function(req, res) {
	console.log("publish is invoked")
	var file = req.file;
	if (file.mimetype.indexOf("image") >= 0) {
		res.write("<a href=\"" + "http://localhost:3000/load?query=" +file.path +"\">"+ file.path+"</a></br> " )
	} else
	if (file.mimetype == "application/x-zip-compressed") {
		//File unzip
		var DecompressZip = require('decompress-zip');
		var unzipper = new DecompressZip(file.path)
		var zipPath = file.path.substring(0, file.path.lastIndexOf("."))
		 
		unzipper.on('error', function (err) {
			console.log(err)
		    console.log('Caught an error');
		});
		 
		unzipper.on('extract', function (log) {
			
		    console.log('Finished extracting');
		    //console.log(file.name)
		    walk('./upload/' + file.filename.substring(0, file.filename.lastIndexOf(".")))
		    console.log(fileList)
			for (var i = 0; i < fileList.length; i ++) {
				res.write("<a href=\"" +fileList[i] +"\">"+ fileList[i].substring(fileList[i].indexOf("./upload"))+"</a></br> " )
			}
			res.end()
			
		});
		 
		unzipper.on('progress', function (fileIndex, fileCount) {
		    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
		});
		 
		unzipper.extract({
		    path: zipPath,
		    filter: function (file) {
		        return file.type !== "SymbolicLink";
		    }
		});
	}
}

module.exports.load = function(req, res) {
	show(req.query.query, res)
}

//function for showing pic
function show(path, response) {  
  console.log("Request handler 'show' was called.");  
 
  fs.readFile(path, "binary", function(error, file) {  
    if(error) {  
      response.writeHead(500, {"Content-Type": "text/plain"});  
      response.write(error + "\n");  
      response.end();  
    } else {  
      response.writeHead(200, {"Content-Type": "image/png"});  
      response.write(file, "binary");  
      response.end();  
    }  
  });  
}  

//traverse the dir of "upload", only "jpg" or "png" can be listed in screen

var fileList = [];
var url = require('url');

var urlObj = { 
  protocol: 'http:',
    slashes: true,
    hostname: 'localhost',
    port: 3000,
    search: '?query=string',
    pathname: '/load'
}

function walk(path){  
	if (fileList.length > 0) {
		console.log("reset")
		fileList = []
	}
	var dirList = fs.readdirSync(path);
	dirList.forEach(function(item){
		if(fs.statSync(path + '/' + item).isDirectory()){
			walk(path + '/' + item);
		}else{
    	if (item.substring(item.lastIndexOf(".") + 1) == "jpg" ||item.substring(item.lastIndexOf(".") + 1) == "png") {
    		urlObj.search = '?query=' + path + '/' + item
        	var result = url.format(urlObj);
            fileList.push(result);
    	}
    	
    }
});
}
