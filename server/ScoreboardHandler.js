ScoreboardHandler = function() {

};

ScoreboardHandler.prototype.newTeam = function(teamName) {
  var team_cursor = Meteor.users.findOne({username: teamName});

  if(!team_cursor) {
    return;
  }

  var existingScores = Scores.findOne({});
  var startingArray = [];
  var startdate = new Date().getTime();

  if(!existingScores) {
    startingArray.push({"time": startdate, "score": 0});
  } else {
    startingArray.push({"time": existingScores.team_scores[0].time, "score": 0});
  }

  if(!Scores.findOne({"team_username": teamName})) {
    Scores.insert({"team_scores": startingArray, "team_username": teamName});
  }
  
  if(!Teams.findOne({"username": teamName})) {
    Teams.insert({"username": teamName, "active": true, "id": team_cursor._id});
  }
  
}
