
RegistrationHandler = function() {

};

function randomCode() {
  var code = "";
  var possible = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  var reg_code_length = 6;

  for(var i = 0; i < reg_code_length; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return code;
}
function isGoodCode(code) {
  var possible = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  if (code.length != 6)
    return false;
  for (var i = 0; i < code.length; i++) {
    var good = false;
    for (var j = 0; j < possible.length; j++) {
      if (possible.charAt(j) == code.charAt(i)){
        good = true;
        break;
      }
    }
    if (!good)
      return false;
  }
  return good;
}

/*
 * Generates a registration code.
 * 
 */
RegistrationHandler.prototype.generateRegCode = function(RegCode) {
  var code = "";
  var flag = true;

  if (RegCode != ""){
    if (isGoodCode(RegCode) && !RegistrationCodes.findOne({code: RegCode}))
    {
      /* Unset flag and insert code into DB */
      flag = false;
      RegistrationCodes.insert({
        code: RegCode,
        used: false,
        usedBy: ''
      });
      return RegCode;
    }
    else{
      return "Code generation failed.";
    }
  }

  /* Generate a code until we find one that isn't in DB */
  while(flag) {
    code = randomCode();

    /* Check that code doesn't exist yet */
    if(!RegistrationCodes.findOne({code: code})) {

      /* Unset flag and insert code into DB */
      flag = false;
      RegistrationCodes.insert({
        code: code,
        used: false,
        usedBy: ''
      });
    }
  }

  return code;
}

RegistrationHandler.prototype.register = function(username, password, code, role) {
  
  var startDate = new Date().getTime();

  var regCode = RegistrationCodes.findOne({code: code});

  if(!regCode)
    return null;

  var userId = Accounts.createUser({
    username: username,
    password: password,
    profile: {
      lastUpdate: startDate,
      code: code,
      active: true
    }
  });

  if(!userId)
    return null;

  RegistrationCodes.update(regCode._id, 
    {$set : {
      used: true,
      usedBy: username
    }});

  Roles.addUsersToRoles( userId, role );

  return userId;

}

RegistrationHandler.prototype.useCode = function(code, usedBy) {

  var code = RegistrationCodes.findOne({code: code});

  if(!code)
    return;

  RegistrationCodes.update(code._id, 
    {$set: 
      {
        used: true, 
        usedBy: usedBy
      }
    });

}


