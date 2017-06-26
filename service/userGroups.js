var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);

function updateUsergroup(group, callback) {
    var groupid = group["id"];
    var opts = {};
    opts.name = group["name"];
 
    web.usergroups.update(groupid, opts, function updategroup(err, response) {
           console.log(callback);
        if (err) {
            console.log('usergroup update-Error:', err);
        } else {
            var channel = group["channelid"];
            var name = shortenGroupName(group["name"]);
            web.channels.rename(channel, name, function renamechannel(channelerror, channelresponse){
                if (channelerror) {
                    console.log('channel-rename-Error:', channelerror);
                } else {        
                    console.log("rename is good");
                }
            }); 

           return callback(response);
        }
    });
};


function shortenGroupName(name) {
    console.log(name);
    var shortname = "";
    var regions = ["Stavanger", "Rogaland", "Øst", "Trondheim"];
    var shortword = {prosjektledelse:"Pl", microsoft:"MS", rådgivning:"Råd", brukeropplevelse:"BO", administrasjon:"Admin", teknologi:"Tek"};   
    var splitname = name.split(" ");
    if(regions.indexOf(splitname[0]) != -1) {
        shortname = splitname[0].substring(0,3);
    } else {
        shortname = splitname[0];
    }
    for (i = 1; i < splitname.length; i++) {
        shortname += " ";
        if(splitname[i].toLowerCase() in shortword) {
        shortname += shortword[splitname[i].toLowerCase()];
        } else {
        shortname += splitname[i];
        }
    }
    return shortname.substring(0,21);
};

  function createChannel(channel, callback) {
    console.log(channel);
    var channelname = channel["name"]; 
    var name = shortenGroupName(channelname);
    console.log(name);
    web.channels.create(name, function(err, response) {
        if (err) {
        console.log("Err: " +err);
    } else {
        setTimeout(function() {
            console.log("channel created: " +name);
            return callback(response);
        }, 500);        
        }
    });
};

CreateUserGroup = function (group, channel, callback) {
    var groupname = group["name"];
    var opts = {};
    opts.channels = channel;
    web.usergroups.create(groupname, opts , function (err, response){
        if (err) {
            console.log("Err: " +err);
        } else {
            setTimeout(function() {
            return callback(response);
        }, 500);   
        }
    });
};

function usergroup(req,res){

    if(req.method == "GET"){    
    GetUsergroups(function(usergrouplist) {
      Object(usergrouplist.usergroups).forEach(function(element, key, _array) {
      var deleted;
      
      if(element["deleted_by"]) {
        deleted = true;
      } else {
        deleted = false;
      }   
      element["_deleted"] = deleted;
      element["_updated"] = element["date_update"];
      element["_id"] = element["id"];
    });

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(usergrouplist));
  });

    } else if( req.method == "POST"){
        postGroup(req, res);
    }

}

GetUsergroups = function(callback) {
    web.usergroups.list(function teamInfoCb(err, reponse) {
        if (err) {
            console.log('Error:', err);
        } else {      
            return callback(reponse);
        }
    }); 

}


function postGroup(req,res){ 
    var usergroups =  JSON.parse( JSON.stringify( request.post ) ); 
    Object(usergroups).forEach(function(element, key, _array) {
      var channelid = "";
      if(element["_deleted"]) {
        console.log("deactivate");
      } else {
        var name = ShortenGroupName(element['name']);
        if(element['id'] > "") {  
          
          (element, function(group) {        
            console.log("UpdateUsergroup:" +group);
          });   
        } else {
          if(element['name'] != null) {
            CreateChannel(element, function(res) {
              
              CreateUserGroup(element, res.channel.id,function(group) {
                console.log("usergroupid: " +group);
              }); 
            });
                  
          } else {
            console.log("Empty name" +element);
            console.log("null value detected. Skipping: " +element._id);
          }  
          
        }
      }
      
    })
    response.end(JSON.stringify(request.post));

}

exports.usergroup = usergroup;

