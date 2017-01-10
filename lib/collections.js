import { Meteor } from 'meteor/meteor';

Teams = new Mongo.Collection("teams");
RegistrationCodes = new Mongo.Collection('registrationcodes');
Settings = new Mongo.Collection('settings');
StudentLists = new Mongo.Collection('studentlists');

RegistrationCodes.allow({
  insert: function (userId, doc) {
    return false;
  }
});

Meteor.users.deny({
  update: function (userId, doc) {
    return true;
  }
});

