// global variable to keep track of score
scores_persist = {};

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9 
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

// if the score has changed then it will return true, false otherwise
function scores_update(username){
  var scores = Scores.find({}).fetch();
  var team, u, team_score, tasks;
  var changed;

  for (var i = 0; i < scores.length; i++) {
    team = scores[i];
    if (username == team.team_username) {
      u = Meteor.users.findOne({'username': team.team_username});
      team_score = 0;
      tasks = Tasks.find({allowed: u._id}).fetch();

      for(var j = 0; j < tasks.length; j++) {
        if(tasks[j] != null)
          team_score += tasks[j].points;
      }
      if (scores_persist[team.team_username] != team_score){
        changed = true;
        scores_persist[team.team_username] = team_score;
        var updateTime = new Date().getTime();
        Scores.update({team_username: team.team_username}, 
        { $push: 
          {team_scores: 
            {
              score: team_score, 
              time: updateTime
            }
          }
        });
      }
    }
  }

}

function scores_changed_test() {
  var scores = Scores.find({}).fetch();

  for (var i = 0; i < scores.length; i++) {
    var team = scores[i];
    var u = Meteor.users.findOne({'username': scores[i].team_username});
    var team_score = 0;
    var tasks = Tasks.find({allowed: u._id}).fetch();

    for(var j = 0; j < tasks.length; j++) {
      if(tasks[j] != null)
        team_score += tasks[j].points;
    }
    scores_persist[team.team_username] = team_score;
  }

  return true;
}


function isGameRunning() {
  var gameRunningSetting = Settings.findOne({option: 'gameRunning'});

  if(!gameRunningSetting) {
    return false;
  }

  return gameRunningSetting.setting;
}

// API Hooks for Thunderbird Cup Client
Router.route('/api', { where : 'server' })
  .get(function() {
    // GET routes
  })
  .post(function() {

    // TODO: This is a temporary route.
    // Actual route will be posted as application/json
    // or as a JSON file and all state will need to be updated

    if(!isGameRunning()) {
      this.response.end('Error: Game not running');
      return;
    }

    for(userId in this.request.body) {

      if(this.request.body[userId]["token"] == "token") {
        if(this.request.body[userId] != app_settings.private.token) {
          this.response.end('Error: Auth');
          console.log('[-] Error: Auth Token');
          return;
        }
        continue;
      }

      var user = Meteor.users.findOne({'profile.code': userId});

      if(!user) {
        console.log('[-] Error: User with id ' + userId + ' not found.');
        continue;
      }

      var tasksObj = this.request.body[userId];

      th.updateUserTasks(user, tasksObj);

      // Update user profile to show that they have received update
      Meteor.users.update(user._id, {$set: {'profile.lastUpdate': new Date().getTime(), 'profile.active': true}});

      var team = Teams.findOne({"username": user.username});

      Teams.update({"username": user.username}, {$set: {active: true}});

      // update the scores if there has been a change
      scores_update(user.username);     
    }

    this.response.end('Success');
    
  });
