angular.module('ngCsvReader').directive('ngCsvReader', function() {
  return {
    scope: {
      ngCsvReader:"="     },     link: function(scope, element) {
      $(element).on('change', function(changeEvent) {
        var files = changeEvent.target.files;
        if (files.length) {
          var r = new FileReader();
          r.onload = function(e) {
              var contents = e.target.result;
              console.log(contents);
              scope.$apply(function () {
                 var content = {
                  csv: contents,
                  header: true,
                  separator: ';'
                };
                scope.ngCsvReader = csvToJSON(content);
              });
          };
           r.readAsText(files[0], 'ISO-8859-1');
        }
      });

      var csvToJSON = function(content) {
                var lines=content.csv.split('\n');
                var result = [];
                var start = 0;
                var columnCount = lines[0].split(content.separator).length;

                var headers = [];
                if (content.header) {
                  headers=lines[0].split(content.separator);
                  start = 1;
                }

                for (var i=start; i<lines.length; i++) {
                  var obj = {};
                  var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
                  if ( currentline.length === columnCount ) {
                    if (content.header) {
                      for (var j=0; j<headers.length; j++) {
                        obj[headers[j]] = currentline[j];
                      }
                    } else {
                      for (var k=0; k<currentline.length; k++) {
                        obj[k] = currentline[k];
                      }
                    }
                    result.push(obj);
                  }
                }
                return result;
        };
    }
  };
});