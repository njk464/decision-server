import { Template } from 'meteor/templating';

import '../templates/main.html';
import './wheel.js';
var wheel = new Wheel();

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('h:mm A, ddd MMM Do, YYYY')
});

Template.main.helpers({
  wheel_default_url: function() {
    var list_name = Settings.findOne({owner: Meteor.user().username, type: 'default-list'});
    if (list_name === undefined)
      return "http://wheeldecide.com/e.php?c1=uploadAFile&remove=1";
    list_name = list_name.value;
    var noList = StudentLists.find({owner: Meteor.user().username, name: list_name}).count() == 0;
    if (noList)
      return "http://wheeldecide.com/e.php?c1=uploadAFile&remove=1"
    var name_list = StudentLists.findOne({owner: Meteor.user().username, name: list_name}).list;
    return wheel.add_to_wheel(name_list);
  }
});


Template.admin.helpers({
  registrationCodes: function() {
    return RegistrationCodes.find({}, {sort: { used: 1 }});
  },
  noRegistrationCodes: function() {
    return RegistrationCodes.find().count() == 0;
  }
});

Template.settings.helpers({
  noStudentLists: function() {
    return StudentLists.find({owner: Meteor.user().username}).count() == 0;
  },
  studentLists: function() {
    var defaultList = Settings.findOne({owner: Meteor.user().username, type: 'default-list'}).value;
    var studentLists = StudentLists.find({owner: Meteor.user().username}).fetch();
    for (var i = 0; i < studentLists.length; i++) {
      studentLists[i].default = studentLists[i].name == defaultList;
    }
    return studentLists;
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
