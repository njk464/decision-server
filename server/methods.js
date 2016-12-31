import { Meteor } from 'meteor/meteor';

app_settings = JSON.parse(Assets.getText('settings.json'));
task_hashes = JSON.parse(Assets.getText('tasks.json'));

Meteor.methods({
  'createNewUser': function(username, password, registrationCode) {
    
    var userId = rh.register(username, password, registrationCode, 'student');

    if(userId == null) {
      return {success: false, reason: 'Invalid Registration Code'};
    }

    sh.newTeam(username);

    console.log('Registered new user: (' + username + ', ' + registrationCode + ')');

    return {success: true, reason: 'Success!'};
    
  },
  'generateRegCode': function(RegCode) {

    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    var code = rh.generateRegCode(RegCode);
    if (code == "Code generation failed.")
      return {success: false, reason: "Code generation failed."};
    return {success: true, reason: 'Success!'};
    
  },
  'clearRegCodes': function() {
    if( !Roles.userIsInRole(this.userId, 'admin'))
      return;

    /* Remove unused registration codes and unnamed codes */
    RegistrationCodes.remove({used: false});

    RegistrationCodes.remove({usedBy: {$exists: false}});
  },
  'changeGameState': function(val) {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    Settings.update({option: 'gameRunning'}, {$set: {setting: val}});
  },
  'addAnnouncement': function(title, content) {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    var date = new Date().getTime();

    Announcements.insert({title: title, date: date, content: content});
  },
  'editAnnouncement': function(id, title, content) {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    if( !Announcements.findOne({_id: id}) )
      return;

    Announcements.update(id, {$set: {title: title, content: content}});
  },
  'deleteAnnouncement': function(id) {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    Announcements.remove({_id: id});
  },
  'clearScores': function() {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    Scores.remove({});
    ScoresArchive.remove({});
  },
  'clearTeams': function() {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    Teams.remove({});
    Meteor.users.remove({ username: { $ne: app_settings.private.admin_login } });
  },
  'clearDatabase': function() {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    console.log('this');
    Scores.remove({});
    ScoresArchive.remove({});
    Teams.remove({});
    Meteor.users.remove({ username: { $ne: app_settings.private.admin_login } });
  }
});
