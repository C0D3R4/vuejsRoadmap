/* JS Properties
JavaScript has a feature Object.defineProperty. It can do quite a bit but let's focus on one thing:
*/
var person = {};

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
