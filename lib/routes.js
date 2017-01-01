// Main route for teams
Router.route('/', function() {
  this.render('main');
}, {name: 'main'});

Router.route('/login', function() {
  if(Meteor.user()) {
    this.redirect('main');
  } else {
    this.render('loginForm');
  }
  
}, {name: 'login'});

// Admin route
Router.route('/admin', function() {

  if(Meteor.user() && Roles.userIsInRole( Meteor.user()._id, 'admin' )) {
    this.render('admin');
  } else {
    this.redirect('main');
  }
}, {name: 'admin'});

Router.route('/about', function() {
  if(Meteor.user()) {
    this.render('about');
  } else {
    this.redirect('main');
  }
}, {name: 'about'});


Router.route('/register', function() {
  if(Meteor.user()) {
    this.redirect('main');
  } else {
    this.render('registerForm');
  }
}, {name: 'register'});

