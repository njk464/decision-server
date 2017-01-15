Wheel = function() {

};

function add_to_wheel(names) {
  var url = "https://wheeldecide.com/e.php?";
  for (var i = 0; i < names.length; i++) {
    url += "c" + (i+1) + "=" + names[i] + "&";
  }
  url += "time=5&remove=1";
  $('#wheel').attr('src', url);
  return url;
}
Wheel.prototype.add_to_wheel = function(names){
  return add_to_wheel(names);
}

Wheel.prototype.processData = function(csv) {
  var allTextLines = csv.replace(/"/g,'').split(/\r\n|\n/);
  var lines = [];
  for (var i=1; i<allTextLines.length; i++) {
    var data = allTextLines[i].split(',');
    var tarr = data[1] + " " + data[0];
    if (tarr !== undefined && tarr !== "undefined ")
      lines.push(tarr);
  }
  add_to_wheel(lines);
}

$( document ).ready(function() {
  var wheel = new Wheel();
  $(".file-upload-input").change(function(event) {
    var file = event.currentTarget.files[0];
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;
      wheel.processData(contents);
    }
    r.readAsText(file);
  });
});
