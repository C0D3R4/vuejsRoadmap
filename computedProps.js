/* JS Properties
JavaScript has a feature Object.defineProperty. It can do quite a bit but let's focus on one thing:
*/
var person = {};
//  Object.defineProperty(obj, prop, descriptor)
Object.defineProperty (person, 'age', {
  get: function () {
    console.log ("Getting the age");
    return 25;
  }
});

console.log ("The age is ", person.age);

// Prints:
//
// Getting the age
// The age is 25

/* A basic Vue.js Observable
Vue.js has a basic construct which lets you turn a regular object into an "observed" value called an "observable". Here's an over-simplified version of how to add a reactive property */

function defineReactive (obj, key, val) {
  Object.defineProperty (obj, key, {
    get: function () {
      return val;
    },
    set: function (newValue) {
      val = newValue;
    }
  })
};

// create an object
var person = {};

// add a reactive property called 'age' and 'country'
defineReactive (person, 'age', 25);
defineReactive (person, 'country', 'Brazil');

// now you can use `person.age` any way you please
if (person.age < 18) {
  return 'minor';
}
else {
  return 'adult';
}

// Set a value as well.
person.country = 'Russia';
/* Interestingly, the actual value 25 and 'Brazil' is still inside a "closure variable" val and is modified when you set the value. person.country doesn't contain the actual value, instead the getter function's closure contains the value. */


// Singleton to track dependencies
var Dep = {
  // current target
  target: null
}

var trace = function (message) {
  // change to true to log trace messages
  if (false)
    console.log ("[ TRACE ] " + message);
}

function defineReactive (obj, key, val) {
  var deps = [];
  Object.defineProperty (obj, key, {
    get: function () {

      // Check if there is a target and it hasn't been linked
      // as a dependency already
      if (Dep.target && deps.indexOf (Dep.target) == -1) {
        trace ("Adding target to deps for " + key)
        deps.push (Dep.target);
      }

      trace ("Getting value of " + key);
      return val;
    },
    set: function (newValue) {
      trace ("Setting value of " +  key + ". value: " + newValue);
      val = newValue;

      for (var i = 0; i < deps.length; i ++) {
        // call the target's callback
        deps[i]();
      }
    }
  })
};

function defineComputed (obj, key, computeFunc, callbackFunc) {
  var onDependencyUpdated = function () {
    trace ("Dependency updated for " + key + ". Recomputing.");
    var value = computeFunc ();
    callbackFunc (value);
  };

  Object.defineProperty (obj, key, {
    get: function () {
      trace("Getting computed property :" + key);

      // Set current update callback
      Dep.target = onDependencyUpdated;

      // Compute the value
      var value = computeFunc ();

      // Reset the target so no more property adds this as dependency
      Dep.target = null;

      return value;
    },
    set: function () {
      console.warn ('nope!');
    }
  })
}


var person = {};
defineReactive (person, 'age', 16);
defineReactive (person, 'country', 'Brazil');

defineComputed (person, 'status', function () {
  if (person.age > 18) {
    return 'Adult'
  }
  else {
    return 'Minor'
  }
}, function (newValue) {
  console.log ("CHANGED!! The person's status is now: " + newValue)
});

console.log ("Current age: " + person.age)
console.log ("Current status: " + person.status)

// change age
console.log ("Changing age");
person.age = 22;


// change country. Note that status update doesn't trigger
// since status doesn't depend on country
console.log ("Changing country");
person.country = "Chile";
