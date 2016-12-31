import { Template } from 'meteor/templating';

import '../templates/main.html';
import '../templates/scoreboard.html'
import '../../imports/startup/accounts-config.js';

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('h:mm A, ddd MMM Do, YYYY')
})

Template.main.helpers({
  'announcements': function() {
    return Announcements.find({}, {sort: {date: -1}});
  }
});

Template.tasksList.helpers({
  'taskTopics': function(image_name) {

    var topicsWithDuplicates = Tasks.find({image: image_name}).fetch();
    var topicsArray = [];

    for(var i = 0; i < topicsWithDuplicates.length; i++) {
      topicsArray.push(topicsWithDuplicates[i].topic);
    }

    return topicsArray.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    });

  },
  'userTasksFromTopic': function(topic, image_name) {
    return Tasks.find({topic: topic, image: image_name}, { sort: { createdAt: -1 } }).fetch();
  },
  'images': function() {
    var images = Settings.findOne({'option': 'images'});

    if(!images) {
      return [];
    }

    return images.setting;
  },
  'completedTasks': function(image_name) {

    return Tasks.find({'image': image_name, 'category': 'Tasks'}).count();
  },
  'completedStory': function(image_name) {
    return Tasks.find({'image': image_name, 'category': 'Story'}).count();
  },
  'totalTasks': function(image_name) {

    // TODO: Do for specific image?

    var totalTasksCategorySetting = Settings.findOne({'image': image_name, 'option': 'totalTasksCategory'});

    if(!totalTasksCategorySetting)
      return;

    return totalTasksCategorySetting.setting;
  },
  'totalStory': function(image_name) {

    // TODO: Do for specific image?

    var totalStoryCategorySetting = Settings.findOne({'image': image_name, 'option': 'totalStoryCategory'});

    if(!totalStoryCategorySetting)
      return;

    return totalStoryCategorySetting.setting;
  },
  'progress': function(image_name) {
    var totalTasks = Settings.findOne({'option': 'totalTasksForImage', 'image': image_name});
    var tasksForImage = Tasks.find({'image': image_name}).count();
    if(!totalTasks) {
      console.log('Invalid total tasks');
      return;
    }

    var res = (tasksForImage / totalTasks.setting) * 100.0;

    return res.toFixed(2);
  }
});

Template.scoreboard.helpers({
  'Teams': function() {
    // fetchs team and score data from the database
    var scores = Scores.find({}).fetch();
    // stores a list of team data included score, name, and place
    teams_list = [];
    for (var i = 0; i < scores.length; i++){
      var team = scores[i];
      teams_list.push({score: team.team_scores[team.team_scores.length - 1].score, name: team.team_username, place: 0});
    }
    // sort the teams_list by score
    teams_list.sort(function(a, b) {
      return b.score - a.score;
    });
    for (var i = 0; i < teams_list.length; i++){
      teams_list[i].place = i+1;
    }
    return teams_list;
  },
  'status': function(teamName) {
    var team = Teams.findOne({"username": teamName});

    if(!team) 
      return false

    return team.active;
  },
  'totalScore': function() {
    var totalPointsSetting = Settings.findOne({'option': 'totalScore'});

    if(!totalPointsSetting) {
      return 'total';
    }

    return totalPointsSetting.setting;
  }
});
Template.admin.helpers({
  current_image: function() {
    var image = Settings.findOne({'option': 'image'});
    if(!image)
      return 'undefined';

    return image.setting;
  },
  images: function() {
    var images = Settings.findOne({'option' : 'images'});

    if(!images)
      return [];

    return images.setting;
  },
  tasks: function() {

    return Tasks.find({}, {sort: { image: 1}}).fetch();
  },
  teamNameFromId: function(id) {
    var team = Teams.findOne({id: id});

    if(!team)
      return;
    return team.username;
  },
  backup: function() {
    return Backups.find({});
  },
  milliToDate: function(milli) {
    d = new Date(milli);
    return d.toString();
  },
  registrationCodes: function() {
    return RegistrationCodes.find({}, {sort: { used: 1 }});
  },
  noRegistrationCodes: function() {
    return RegistrationCodes.find().count() == 0;
  },
  teams: function() {
    return Teams.find({});
  },
  tasksFromTeam(team_id) {

    return Tasks.find({allowed: team_id}, {sort: {image: 1}}).fetch();
  },
  tasksFromImage(image) {
    return Tasks.find({image: image});
  },
  allowedFilter(task) {
    
    var id = Meteor.user()._id;
    return task.allowed.filter(function(obj) {
      return obj != id;
    });
  },
  gameStatus() {
    var gameRunningSetting = Settings.findOne({option: 'gameRunning'});

    if(!gameRunningSetting) {
      return 'Paused';
    }

    if(gameRunningSetting.setting) {
      return 'Running!';
    } else {
      return 'Paused';
    }
  },
  'announcements': function() {
    return Announcements.find({}, {sort: {date: 1}});
  }
});

Template.task.helpers({
  'pointsText': function(points) {
    if(points == 1) {
      return '1 point';
    }
    return points.toString() + ' points';
  }
});

Template.loginForm.helpers({
  registrationEnabled: function() {
    return true;
  }
});

Template.userButton.helpers({
  username: function() {
    return Meteor.user().username;
  },
  'isAdmin': function() {
    // This helper does not guarantee authentication!
    // Merely for showing admin button
    // Auth is handled in router
    return Roles.userIsInRole(Meteor.user()._id, 'admin');
  }
});

Template.infoBar.helpers({
  'score': function() {
    var image = Settings.findOne({'option': 'image'});
    if(!image)
      return;

    var tasks = Tasks.find({'image': image.setting}).fetch();
    var score = 0;

    for(var i = 0; i < tasks.length; i++) {
      score += tasks[i].points;
    }
    return score;
  },
  'maxScore': function() {
    var image = Settings.findOne({'option': 'image'});
    if(!image)
      return;

    var maxScore = Settings.findOne({'option': 'maxScore', 'image': image.setting});
    if(!maxScore)
      return;

    return maxScore.setting;
  },
  'completedTasks': function() {

    return Tasks.find({}).count();
  },
  'totalTasks': function() {
    var totalTasksSetting = Settings.findOne({'option': 'totalTasks'});
    if(!totalTasksSetting)
      return;

    return totalTasksSetting.setting;
  },
  'updatedRecently': function() {
    return Meteor.user().profile.active;
  },
  'progress': function() {

    var totalPointsSetting = Settings.findOne({'option': 'totalScore'});
    var points = Tasks.find({}).fetch().reduce(function(a, b){return a + b.points;}, 0);

    if(!totalPointsSetting)
      return;

    var percent = (points / totalPointsSetting.setting) * 100.0;
    return percent.toFixed(2).toString();
  },
  'task_progress': function() {
    var taskMaxScoreSetting = Settings.findOne({'option': 'taskMaxScore'});
    var taskPoints = Tasks.find({'category': 'Tasks'}).fetch().reduce(function(a, b){return a + b.points;}, 0);

    if(!taskMaxScoreSetting)
      return '0.00';

    var percent = (taskPoints / taskMaxScoreSetting.setting) * 100.0;
    return percent.toFixed(2).toString();
  },
  'story_progress': function() {
    var storyMaxScoreSetting = Settings.findOne({'option': 'storyMaxScore'});
    var storyPoints = Tasks.find({'category': 'Story'}).fetch()
                  .reduce(function(a, b){return a + b.points;}, 0);

    if(!storyMaxScoreSetting)
      return '0.00';

    var percent = (storyPoints / storyMaxScoreSetting.setting) * 100.0;
    return percent.toFixed(2).toString();
  }
});