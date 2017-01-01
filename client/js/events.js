import { Template } from 'meteor/templating';

import '../templates/main.html';


Template.userButton.events({
  'click .logout': function(event) {
    event.preventDefault();
    Meteor.logout();
  }
});

Template.loginForm.events({
  'submit #login-form': function(event) {
    event.preventDefault();
    var username = event.target.loginUsername.value;
    var password = event.target.loginPassword.value;
    Meteor.loginWithPassword(username, password, function(error) {
      if(error) {
        if(username.length == 0) {
          Materialize.toast('No username entered', 3000);
        } else if(password.length == 0) {
          Materialize.toast('No password entered', 3000);
        } else {
          Materialize.toast('Invalid username or password', 3000);
        }
      }
    });
  }
});

Template.registerForm.events({
  'submit #register-form': function(event) {
    event.preventDefault();
    var registrationCode = event.target.registrationCode.value;
    var username = event.target.loginUsername.value;
    var password = event.target.loginPassword.value;
    var password1 = event.target.loginPassword1.value;

    if(password != password1) {
      Materialize.toast('Passwords do not match', 3000);
      return;
    }

    Meteor.call('createNewUser', username, password, registrationCode, function(error, res) {
      if(error) {
        Materialize.toast(error.reason, 3000);
      } else if(!res.success) {
        Materialize.toast(res.reason, 3000);
      } else {
        Meteor.loginWithPassword(username, password);
        Router.go('/');
      }
    });
  }
});

Template.main.events({
  "change .file-upload-input": function(event, template){
    var file = event.currentTarget.files[0];
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;
      console.log(contents);
    }
    r.readAsText(file);
    // console.log(file);
  }
});

Template.admin.events({
  'click #generate-comp-reg-code': function(event) {
    event.preventDefault();
    $('#add-code').trigger('autoresize');
    $('#add-code-modal').openModal();
    

  },
  'click #submit-add-code': function(event) {
    event.preventDefault();
    
    var code = "";
    if (document.getElementById('type-code').checked)
      code = $('#add-code').val();
    
    if (document.getElementById('type-code').checked && code == "")
      code = "invalid code.";


    Meteor.call('generateRegCode', code, function(err, res) {
      if (!res.success){
        alert(res.reason);
      }
      else {
        $('#registration-code-table').show();
        $('#registration-code-table-neg').hide();
      }
      document.getElementById('type-code').checked = false;
      $('#add-code').prop("disabled", true);
      $('#add-code').val(''); 
    });
    
  },
  'click #type-code': function(event) {

    if (document.getElementById('type-code').checked) {
      $('#add-code').prop("disabled", false);
    }
    else {
      $('#add-code').prop("disabled", true);
    }
  },
  'click #cancel-add-code': function(event) {
    event.preventDefault();

    $('#add-code').val('');
  },
  'click #clear-reg-codes': function(event) {
    event.preventDefault();

    Meteor.call('clearRegCodes', 'student-comp', function(err, res) {

    });
  },
  'click #show-reg-codes': function(event) {
    event.preventDefault();
    $('#registration-code-table').toggle();
    $('#registration-code-table-neg').toggle();
  },
  'click #scroll-up': function(event) {
    event.preventDefault();

    $("html, body").animate({ scrollTop: 0 }, 450);
  },
  'click #scroll-down': function(event) {
    event.preventDefault();
    var $target = $('html,body');

    $("html, body").animate({ scrollTop: $target.height() }, 450);
  },
  'click #clear-database': function(event) {
    event.preventDefault();
    var clear = confirm('Are you sure that you want to clear the database?');
    if (clear) {
      Meteor.call('clearDatabase', function(err, res) {

      });
    }
  }
});
