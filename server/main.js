import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

admin_username = "white";
admin_password = "R3C01LL@B";
rh = new RegistrationHandler();
sh = new ScoreboardHandler();

function setupAdminUser() {

  var adminUser = Meteor.users.findOne({username: admin_username});

  if(!adminUser) {
    console.log("[+] No Admin user, making new one.");

    var adminId = rh.register(admin_username,
                              admin_password,
                              rh.generateRegCode(""), 'admin');

    
  }
}

function setupTeams() {

  if(Teams.find({}).count() != 0) {
    return;
  }

  Teams.remove({});
  Meteor.users.remove({ username: { $ne: app_settings.private.admin_login } });

}


function setupPub() {

  var adminLogin = Meteor.users.findOne({username: app_settings.private.admin_login});

  Meteor.publish('registrationcodes', function() {
    if( Roles.userIsInRole(this.userId, 'admin')) {
      return RegistrationCodes.find({});
    } else {
      return this.ready();
    }
  });

  Meteor.publish('teams', function teamsPublication() {
    return Teams.find({});
  });
}


Meteor.startup(() => {

  // Clear databases at startup
  clearDatabase();  
  setupAdminUser();
  setupTeams();
  setupPub();

});

function clearDatabase() {
  Teams.remove({});
  RegistrationCodes.remove({});
  Meteor.users.remove({});
}
