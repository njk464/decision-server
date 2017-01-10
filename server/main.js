import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

admin_username = "white";
admin_password = "R3C01LL@B";
rh = new RegistrationHandler();
slh = new StudentListHandler();

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
  Meteor.users.remove({ username: { $ne: admin_username} });

}


function setupPub() {
  Meteor.publish('registrationcodes', function() {
    if( Roles.userIsInRole(this.userId, 'admin')) {
      return RegistrationCodes.find({});
    } else {
      return this.ready();
    }
  });

  Meteor.publish('studentlists', function() {
    var username = Meteor.users.findOne({_id: this.userId}).username;
    return StudentLists.find({owner: username});
  });

  Meteor.publish('settings', function() {
    var username = Meteor.users.findOne({_id: this.userId}).username;
    return Settings.find({owner: username});
  });

  Meteor.publish('teams', function teamsPublication() {
    return Teams.find({});
  });
}


Meteor.startup(() => {

  // Clear databases at startup
  // clearDatabase();  
  setupAdminUser();
  setupTeams();
  setupPub();

});