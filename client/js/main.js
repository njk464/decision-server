import { Template } from 'meteor/templating';

import '../templates/main.html';

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
  Meteor.subscribe('teams');
  Meteor.subscribe('registrationcodes');
  Meteor.subscribe('studentlists');
  Meteor.subscribe('settings');
});

Template.loginForm.onRendered(function() {
  $('username').focus();
});

Template.admin.onRendered(function() {
  Meteor.subscribe('teams');
  Meteor.subscribe('registrationcodes');
  $('select').material_select();
  $('.modal-trigger').leanModal();
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});

Template.settings.onRendered(function() {
  Meteor.subscribe('teams');
  Meteor.subscribe('studentlists');
  Meteor.subscribe('settings');
  $('select').material_select();
  $('.modal-trigger').leanModal();
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});

Template.navbar.onRendered(function() {
  $(".button-collapse").sideNav();
});