import { Template } from 'meteor/templating';

import '../templates/main.html';
import '../templates/scoreboard.html'
import '../../imports/startup/accounts-config.js';

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

Template.tasksList.onRendered(function() {
  Meteor.subscribe('tasks');
  Meteor.subscribe('scores');
  Meteor.subscribe('settings');

  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
});

Template.scoreGraph.helpers({
  numberOfScores: function() {
    var scores = Scores.find({}).fetch();

    if(scores.length == 0)
      return;

    var first_team = scores[0];
    rerenderGraph();
    return first_team["team_scores"].length;
  }
});

function rerenderGraph() {
    var scores = [];
    var traces = [];
    scores = Scores.find({}).fetch();
    if (scores.length == 0 ){
        return;
    }

    
    for (var i = 0; i < scores.length; i++) {
      var team_scores = [];
      var times = [];
      for (var x = 0; x < scores[i].team_scores.length; x++) {
        team_scores.push(scores[i].team_scores[x].score);
        times.push(time_to_date(scores[i].team_scores[x].time));
      }

      var trace = {
        x: times,
        y: team_scores,
        mode: 'lines+markers',
        name: scores[i].team_username
      }
      traces.push(trace);
    }
    var layout = {
      title: 'Tbird Teams'
    };
    Plotly.newPlot('score-graph', traces, layout);
    $('#score-graph').show();

}

Template.scoreGraph.onRendered(function() {
  rerenderGraph();
  $(window).resize(function(evt) {
    Plotly.Plots.resize(document.getElementById('score-graph'));
  });
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

Template.scoreboard.onRendered(function() {
  /* Subscriptions for public scoreboard */
  Meteor.subscribe('teams');
  Meteor.subscribe('scores');
  Meteor.subscribe('settings');
});
