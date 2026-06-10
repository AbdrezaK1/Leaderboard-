# YAPL

Yet another promise library. It wraps the native ES6 Promise to provide syntax similar to jQuery.Deferred

Example:
```javascript
var y = require('yapl');

function setTimeoutWrite(str){
    var deferred = y();
    setTimeout(function(){
        deferred.resolve(str);
    }, 1000);
    return deferred;
}

setTimeoutWrite('Hello World').then(console.log);
```
