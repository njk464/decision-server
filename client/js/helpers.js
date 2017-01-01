import { Template } from 'meteor/templating';

import '../templates/main.html';

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('h:mm A, ddd MMM Do, YYYY')
})

Template.main.helpers({
  'announcements': function() {
    return Announcements.find({}, {sort: {date: -1}});
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