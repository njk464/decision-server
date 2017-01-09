import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'createNewUser': function(username, password, registrationCode) {
    
    var userId = rh.register(username, password, registrationCode, 'student');

    if(userId == null) {
      return {success: false, reason: 'Invalid Registration Code'};
    }

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
  'clearTeams': function() {
    if( !Roles.userIsInRole(this.userId, 'admin') )
      return;

    Teams.remove({});
    Meteor.users.remove({ username: { $ne: app_settings.private.admin_login } });
  }
});
