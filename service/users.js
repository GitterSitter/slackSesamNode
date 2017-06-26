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


console.log(request.method);
console.log(request.body);
///console.log(request);
// var headers = request.headers;
//   var method = request.method;
//   var urle = request.url;
//   var body = [];


//   request.on('error', function(err) {
//     console.error(err);
//   }).on('data', function(chunk) {
//     body.push(chunk);
//   }).on('end', function() {
//     body = Buffer.concat(body).toString();
//     // At this point, we have the headers, method, url and body, and can now
//     // do whatever we need to in order to respond to this request.
//     console.log(body);
//   });


  //console.log(body);
    // console.log(response.statusCode);
        // Object(usr.users).forEach(function (element, key, _array) {
        //   if(element['id'] != "" && element["_deleted"]){
        //    deactivateUser(element['slack-user:id']);
           
        //   }else if (element['id'] != "" && !element["_deleted"]) {
        //     setProfile(element);

        //   } else if (element['id'] == "" && !element["_deleted"]){
        //     inviteUser(element['email']);
        //   }
        // }

       // )}
}

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
