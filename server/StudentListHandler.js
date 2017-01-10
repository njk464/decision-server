StudentListHandler = function() {

};

StudentListHandler.prototype.generateList = function(list, name, username, def) {
	if (!StudentLists.findOne({name: name, owner: username}))
	{
	  /* Unset flag and insert code into DB */
	  StudentLists.insert({
	    list: list,
	    owner: username,
	    name: name
	  });
	  var noDefault = Settings.find({owner: username, type: 'default-list'}).count() == 0;
	  if (noDefault) {
	  	Settings.insert({owner: username, type: 'default-list', value: name});
	  }
	  else {
	  	if (def) {
	  	  Settings.update({owner: username, type: 'default-list'}, {$set: {value: name}});
	  	}
	  }
	  if (def) {
	  }
	  return "Success";
	}
	else{
	  return "Name already exists";
	}
}