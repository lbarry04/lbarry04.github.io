$(document).ready(function() {
  var search = window.location.search;
  var queryObj = queryToObject(search.slice(1));
  window.runInPreview = queryObj.config && queryObj.config === "preview";
  $.ajax({
    url: "config.json?config=" + Date.now(),
    dataType: "json"
  }).done(function(data) {
    window.configObj = data;
    var injector = dataInjector(configObj);
    var hash=window.location.hash?window.location.hash:'#intro';
    injector.injectData(hash);

    $('#slide-container').bjqs({
        'height' : 500,
        'width' : $('#slide-container').width(),
        responsive : false,
        showcontrols : true, // show next and prev controls
    centercontrols : true, // center controls verically
    nexttext : '<img src="assets/icons/chevron-right.png" width="16px" height="30px">', // Text for 'next' button (can use HTML)
    prevtext : '<img src="assets/icons/chevron-left.png" width="16px" height="30px">', // Text for 'previous' button (can use HTML)
    showmarkers : true, // Show individual slide markers
    centermarkers : true // Center markers horizontally
    });
  });
});