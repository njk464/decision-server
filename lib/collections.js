import { Meteor } from 'meteor/meteor';

Teams = new Mongo.Collection("teams");
RegistrationCodes = new Mongo.Collection('registrationcodes');

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

