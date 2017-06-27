var http = require('http');
var url = require('url');
var request = require("request");
var WebClient = require('@slack/client').WebClient;
var token = process.env.Token;
var web = new WebClient(token);

function setProfile(profile) {
  var test = {
    profile: {
      "first_name": "Trondemanns",
      "last_name": "Tufte",
      "image_original": "https:\/\/avatars.slack-edge.com\/2017-06-16\/199693409494_dda460e38c28f99c473c_original.jpg",
      "real_name": "Trond Tufte",
      "real_name_normalized": "Trond Tufte",
      "email": "trond.tufte@bouvet.no",
      "fields": null
    }
  };

  var test2 = { name: "Trond" };
  web.users.profile.set(test2, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Status: 200");
      // return callback(response);
    }
  });

}
function inviteUser(email) {
  var ur = 'https://slack.com/api/users.admin.invite?token=' + token + '&email=' + email + '&pretty=1';
  var opt = {
    url: ur,
    token: token,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  request(opt, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Status: 200");
      return "Status: 200";
    } else {
      return response.statusCode;
    }
  });

}
function deactivateUser(userId) {
  var ur = 'https://slack.com/api/users.admin.invite?token=' + token + '&user=' + userId + '&pretty=1';
  var opt = {
    url: ur,
    header: {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  
  request(opt, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Status: 200");
      return "Status: 200";
    } else {
      console.log(body + " " + response.statusCode);
      return response.statusCode;
    }
  });

}


function user(request, response) {
var usr = request.post;
if (request.method == "GET") {
GetUsers(function (userlist) {
      userlist = userlist;
      Object(userlist.members).forEach(function (element, key, _array) {
        if (element["id"] == "USLACKBOT" || element["is_bot"] == true) {
        } else {
          element["_deleted"] = element["deleted"];
          element["_updated"] = element["updated"];
          element["_id"] = element["id"];
        }
      })
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(userlist));

    });

} else if(request.method == "POST" ){

      var test =  JSON.parse(request.body);
      console.log(test);

        Object(test).forEach(function (element, key, _array) {
          if(element['id'] != "" && element["deleted"]){
          // deactivateUser(element['slack-user:id']);
          console.log("Deactivate user\n\n");
          }else if (element['id'] != "" && !element["deleted"]) {
           // setProfile(element);
          console.log("Update Profile for user\n\n");
          } else if (element['id'] == "" && !element["deleted"]){
          //  inviteUser(element['email']);
          console.log("Invite user for user\n\n");
          }
        }

       )}


}

GetUsers = function (callback) {
  web.users.list(function teamInfoCb(err, resonse) {
    if (err) {
      console.log('Error:', err);
    } else {
      return callback(resonse);
    }
  });
};


exports.user = user;
