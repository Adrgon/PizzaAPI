/*
 * Library for storing, deleting and editing data
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// Create a file with data
lib.create = (dir,file,data,callback)=>{

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'w', (err, fileDescriptor)=>{
    if(!err && fileDescriptor){
      // Convert data to string
      let stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fileDescriptor, stringData,(err)=>{
        if(!err){
          fs.close(fileDescriptor,(err)=>{
            if(!err){
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist', lib.baseDir+dir+'/'+file+'.json');
    }
  });
};

// Read data from a file
lib.read = (dir,file,callback)=> {

  const filePath = lib.baseDir+dir+'/'+file+'.json';
  fs.readFile(filePath, 'utf8', (err,data)=>{
      if(!err) 
      {
        if (data) {
            console.log(`Data read from file ${filePath}:\n ${data}`);
            callback(false, helpers.parseJsonToObject(data));
        }
        else {
          console.log(`No data read from file ${filePath}.`);
          callback(false,null);
        }   
    } else {
      console.log(err, data);
      callback('Trying to read ' + filePath, data);
    }
  });
};

// Update the data
lib.update = (dir, file, data, callback)=> {
	//open the file for writing
	fs.open(lib.baseDir + dir + '/'+file+'.json', 'r+', (err, fileDescriptor)=> 
	{
		if (!err && fileDescriptor)
		{
			 // Convert data to string
      		let stringData = JSON.stringify(data);

      		fs.truncate(fileDescriptor, (err)=>{
      			if (!err)
      			{
      				//Write to the file and close it
      				fs.writeFile(fileDescriptor, stringData, (err)=> {
      					if(!err)
      					{
      						fs.close(fileDescriptor, (err)=> {
      							if (!err) {
      								callback(false);
      							} 
                    else {
      								callback('Error closing the file.');
      							}
      						});
      					}
      					else {
      						callback('Error writing to the existing file.');
      					}
      				});
      			}
      			else {
      				callback('Error truncating the file.');
      			}
      		});
		}
		else
		{
			callback('Could not open the file for update, it may not exist yet.');
		}
	});
};

//Delete a file
lib.delete = (dir, file, callback)=>{
  
  console.log('Trying to delete file: ' + lib.baseDir + dir + '/' + file + '.json');

	fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err)=> {
		if (!err){
			callback(false);
		}
		else {
			callback('Error deleting the file.');
		}
	});
};

//List all the items in a directory
lib.list = (dir, callback)=>{
  fs.readdir(lib.baseDir + dir + '/', (err, data)=>{
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach( (fileName)=>{
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

//List all the items in a directory that contain a given string in the name
lib.listContaining = (dir, containsFileName, callback)=>{

  fs.readdir(lib.baseDir + dir + '/', (err, data)=>{
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach((fileName)=>{
        if (fileName.includes(containsFileName))
          trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

//Export the module
module.exports = lib;