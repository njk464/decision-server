import { Template } from 'meteor/templating';

import '../templates/main.html';

// milliseconds to a readable date
function time_to_date(time) {
  var cur_date = new Date(time);
  // 'yyyy-mm-dd HH:MM:SS.ssssss'
  var date_string = cur_date.getFullYear();
  date_string += "-"  + (cur_date.getMonth()+1);
  date_string += "-" + cur_date.getDate();
  date_string += " " + cur_date.getHours();
  if (cur_date.getMinutes() < 10)
    date_string += ":0" + cur_date.getMinutes();
  else
    date_string += ":" + cur_date.getMinutes();
  if (cur_date.getSeconds() < 10)
    date_string += ":0" + cur_date.getSeconds();
  else
    date_string += ":" + cur_date.getSeconds();
  return date_string;
}

Template.userButton.onRendered(function() {
  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: false, // Does not change width of dropdown to that of the activator
    hover: true, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'right' // Displays dropdown with edge aligned to the left of button
  });
});

Template.main.onRendered(function() {
  Meteor.subscribe('tasks');
  Meteor.subscribe('teams');
  Meteor.subscribe('scores');
  Meteor.subscribe('settings');
  Meteor.subscribe('registrationcodes');
  Meteor.subscribe('announcements');
});

Template.loginForm.onRendered(function() {
  $('username').focus();
});

Template.admin.onRendered(function() {
  Meteor.subscribe('tasks');
  Meteor.subscribe('teams');
  Meteor.subscribe('scores');
  Meteor.subscribe('settings');
  Meteor.subscribe('registrationcodes');
  Meteor.subscribe('announcements');
  $('select').material_select();
  $('.modal-trigger').leanModal();
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});

Template.navbar.onRendered(function() {
  $(".button-collapse").sideNav();
});