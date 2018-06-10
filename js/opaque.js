/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}.call(this));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(3);

window.onLoad = function () {
    let canvas = window.document.getElementById('world');

    window.game = new Game({
        canvas: canvas,
        width: parseInt(window.getComputedStyle(canvas).width),
        height: parseInt(window.getComputedStyle(canvas).height)
    });

    window.game.start();
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const TC = __webpack_require__(4);

const Game = TC.Engine.Game.extend({
    initialize(options) {
        let world = new TC.Engine.World({
            fps: 30,
            width: options.width,
            height: options.height
        });
        this.viewport = new TC.Engine.View({
            canvas: options.canvas,
            bounding: new TC.Engine.BoundingBox({
                width: options.width,
                height: options.height,
                origin_x: 0,
                origin_y: 0
            })
        });
        world.addView(this.viewport);
        world.setBackground(new TC.Engine.Background({ color: '#691E3E' }));

        this.setWorld(world);
    }
});

module.exports = Game;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory(__webpack_require__(0));
    } else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        root["TwoCylinder"] = factory(root._);
    }
})(this, function (_) {
    return new function () {
        var TwoCylinder = this;this.Engine = {};this.Entities = {};this.IO = {};this.Sprites = {};this.Utilities = {};
        /*
            This script contains helper objects and functions that can be used by all classes
        */

        (function () {
            function x() {};

            /* 
             * This extend function was based off of Backbone's extend function because it's so beautiful
             * http://backbonejs.org/
             * It uses the Surrogate pattern to inherit objects 
             * The biggest difference is that this version maintains a complete inheritance chain
             * in conjunction with the _super function, we can simulate true OOP inheritance
             */
            x.extend = function (protoProps, staticProps) {
                var parent = this;
                var child;

                // The constructor function for the new subclass is either defined by you
                // (the "initialize" property in your `extend` definition), or defaulted
                // by us to simply call the parent constructor.
                child = function () {
                    if (protoProps && _.has(protoProps, 'initialize')) {
                        return protoProps.initialize.apply(this, arguments);
                    } else {
                        return parent.apply(this, arguments);
                    }
                };

                // Add static properties to the constructor function, if supplied.
                _.extend(child, parent, staticProps);

                // Set the prototype chain to inherit from `parent`, without calling
                // `parent`'s constructor function and add the prototype properties.
                child.prototype = _.create(parent.prototype, protoProps);
                child.prototype.constructor = child;

                // here we construct the complete inheritance chain for this new class 
                child.parents = [];
                if (parent.parents) {
                    for (var i = 0; i < parent.parents.length; i++) {
                        child.parents.push(parent.parents[i]);
                    }
                }

                // we don't want x, we want Root to be the origin class
                if (parent !== x) {
                    child.parents.push(parent);
                }

                return child;
            };

            TwoCylinder.Engine.Root = x.extend({
                _super: function (functionName) {
                    this.parentalCount = this.parentalCount ? this.parentalCount : 1;

                    var thisParentPosition = this.constructor.parents.length - this.parentalCount;

                    if (thisParentPosition >= 0 && this.constructor.parents[thisParentPosition].prototype[functionName]) {
                        this.parentalCount++;
                        var retVal = this.constructor.parents[thisParentPosition].prototype[functionName].apply(this, _.rest(arguments));
                        this.parentalCount = null;
                        return retVal;
                    } else {
                        this.parentalCount = null;
                    }
                }
            });
        })();
        // TODO:
        // lineCollidesBox
        // lineCollidesLine
        // boxCollidesLine

        TwoCylinder.Engine.Geometry = function () {
            var Geometry = {
                /***************************************************
                 * BOXES
                 ***************************************************/
                boxCollidesBox: function (box1, box2) {
                    // both box1 and box 2 must have { x, y, width, height } properties
                    // if any part of box1's X is within box2's
                    var xOverlap = box1.origin_x <= box2.origin_x && box1.origin_x + box1.width > box2.origin_x || box2.origin_x <= box1.origin_x && box2.origin_x + box2.width > box1.origin_x;
                    var yOverlap = box1.origin_y <= box2.origin_y && box1.origin_y + box1.height > box2.origin_y || box2.origin_y <= box1.origin_y && box2.origin_y + box2.height > box1.origin_y;

                    return xOverlap && yOverlap;
                },
                boxCollidesCircle: function (box, circle) {
                    var point1 = { x: box.origin_x, y: box.origin_y };
                    var point2 = { x: box.origin_x + box.width, y: box.origin_y };
                    var point3 = { x: box.origin_x + box.width, y: box.origin_y + box.height };
                    var point4 = { x: box.origin_x, y: box.origin_y + box.height };

                    var line1 = [point1, point2];
                    var line2 = [point2, point3];
                    var line3 = [point3, point4];
                    var line4 = [point4, point1];

                    var retVal = Geometry.pointCollidesBox(circle, box) || Geometry.lineCollidesCircle(line1, circle, true) || Geometry.lineCollidesCircle(line2, circle, true) || Geometry.lineCollidesCircle(line3, circle, true) || Geometry.lineCollidesCircle(line4, circle, true);

                    return retVal;
                },
                boxCollidesPoint: function (box, point) {
                    return point.x >= box.origin_x && box.origin_x + box.width >= point.x && point.y >= box.origin_y && box.origin_y + box.height >= point.y;
                }

                /***************************************************
                 * CIRCLES
                 ***************************************************/
                , circleCollidesCircle: function (circle1, circle2) {
                    return this.distanceToPoint(circle1, circle2) < circle1.radius + circle2.radius;
                },
                circleCollidesBox: function (circle, box) {
                    return Geometry.boxCollidesCircle(box, circle);
                },
                circleCollidesLine: function (circle, line, isSegment) {
                    return Geometry.lineCollidesCircle(line, cricle, isSegment);
                },
                circleCollidesPoint: function (circle, point) {
                    return Geometry.pointCollidesCircle(point, circle);
                }

                /***************************************************
                 * LINES
                 ***************************************************/
                // This function returns an array of up to length 2 with points indicating at what points
                // the given circle is intersected by the given line
                , lineIntersectsCircle: function (line, circle, isSegment) {
                    var b = line[0];
                    var a = line[1];

                    // Calculate the euclidean distance between a & b
                    var eDistAtoB = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

                    // compute the direction vector d from a to b
                    var d = { x: (b.x - a.x) / eDistAtoB, y: (b.y - a.y) / eDistAtoB };

                    // Now the line equation is x = dx*t + ax, y = dy*t + ay with 0 <= t <= 1.

                    // compute the value t of the closest point to the circle center (cx, cy)
                    var t = d.x * (circle.x - a.x) + d.y * (circle.y - a.y);

                    // compute the coordinates of the point e on line and closest to c
                    var e = {
                        x: t * d.x + a.x,
                        y: t * d.y + a.y

                        // Calculate the euclidean distance between circle & e
                    };eDistCtoE = Math.sqrt(Math.pow(e.x - circle.x, 2) + Math.pow(e.y - circle.y, 2));

                    var retVal = [];

                    // test if the line intersects the circle
                    if (eDistCtoE < circle.radius) {
                        // compute distance from t to circle intersection point
                        var dt = Math.sqrt(Math.pow(circle.radius, 2) - Math.pow(eDistCtoE, 2));

                        // compute first intersection point
                        var f = {
                            x: (t - dt) * d.x + a.x,
                            y: (t - dt) * d.y + a.y
                        };

                        if (!isSegment || Geometry.lineCollidesPoint(line, f, true)) {
                            retVal.push(f);
                        }

                        // compute second intersection point
                        var g = {
                            x: (t + dt) * d.x + a.x,
                            y: (t + dt) * d.y + a.y
                        };

                        if (!isSegment || Geometry.lineCollidesPoint(line, g, true)) {
                            retVal.push(g);
                        }
                    } else if (parseInt(eDistCtoE) === parseInt(circle.radius)) {
                        if (!isSegment || Geometry.lineCollidesPoint(line, e, true)) {
                            retVal.push(e);
                        }
                    } else {
                        // do nothing, no intersection
                    }

                    return retVal;
                }

                // true IFF a line passes through or tangent to a given circle
                , lineCollidesCircle: function (line, circle, isSegment) {
                    var intersects = Geometry.lineIntersectsCircle(line, circle, isSegment);
                    return intersects.length > 0 || Geometry.pointCollidesCircle(line[0], circle);
                },

                lineCollidesPoint: function (line, point, isSegment) {
                    var angleToPoint1 = Geometry.angleToPoint(line[0], point);
                    var angleToPoint2 = Geometry.angleToPoint(line[1], point);

                    var retVal = angleToPoint1 == angleToPoint2;

                    // if the angle is off, we swap the order of two of the points for one of the measurements
                    // this simulates the 180 degree check
                    if (!retVal) {
                        angleToPoint2 = Geometry.angleToPoint(point, line[1]);
                        retVal = angleToPoint1 == angleToPoint2;
                    }

                    if (retVal && isSegment) {
                        retVal = Geometry.distanceToPoint(line[0], point) + Geometry.distanceToPoint(line[1], point) == Geometry.distanceToPoint(line[0], line[1]);
                    }

                    return retVal;
                }

                /***************************************************
                 * POINTS
                 ***************************************************/
                , pointCollidesCircle: function (point, circle) {
                    return Geometry.distanceToPoint(point, circle) <= circle.radius;
                },
                pointCollidesBox: function (point, box) {
                    return Geometry.boxCollidesPoint(box, point);
                },
                pointCollidesPoint: function (point1, point2) {
                    return point1.x == point2.x && point1.y == point2.y;
                },
                pointCollidesLine: function (point, line) {
                    return Geometry.lineCollidesPoint(line, point);
                }

                /***************************************************
                 * ANGLES AND DISTANCES
                 ***************************************************/
                , distanceToPoint: function (point1, point2) {
                    var x = point1.x - point2.x;
                    var y = point1.y - point2.y;

                    return Math.sqrt(x * x + y * y);
                },
                angleToPoint: function (point1, point2, inDegrees) {
                    var radians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
                    return inDegrees ? radians * 180 / Math.PI : radians;
                }
                /**
                 * @param {{x:*. y:*}} point1
                 * @param {{x:*. y:*}} point2
                 * @returns {Vector}
                 */
                , pointToPoint: function (point1, point2) {
                    return new TwoCylinder.Engine.Vector({
                        speed: Geometry.distanceToPoint(point1, point2),
                        direction: Geometry.angleToPoint(point1, point2)
                    });
                }
                /**
                 * @param {{x:*,y:*}} point1
                 * @param {Vector} vector
                 * @returns {{x: *, y: *}}
                 */
                , pointFromVector: function (point1, vector) {
                    return {
                        x: point1.x + Math.cos(vector.getDirection()) * vector.getSpeed(),
                        y: point1.y + Math.sin(vector.getDirection()) * vector.getSpeed()
                    };
                },
                getRandomDirection: function (inDegrees) {
                    return Math.random() * 2 * Math.PI;
                }
            };

            return Geometry;
        }();

        /*
            This script contains helper objects and functions that can be used by all classes
        */

        TwoCylinder.Engine.Generic = TwoCylinder.Engine.Root.extend({
            initialize: function (options) {
                this.setBounding(options.bounding);
            },
            collides: function (bounding) {
                return this._bounding && this._bounding.collides(bounding);
            },
            getBounding: function () {
                return this._bounding;
            },
            setBounding: function (b) {
                if (!b && !(b instanceof TwoCylinder.Engine.Bounding)) {
                    throw "All objects must have a true bounding";
                }
                return this._bounding = b;
            }
        });

        /*
            This script defines an appearance.
            Appearances are attached to instances and define how that instance should be drawn in the world
        */

        TwoCylinder.Engine.Appearance = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                this._super('initialize', options);
            },

            draw: function (canvas, x, y, rotation, scale, entity) {
                var context = canvas.getContext('2d');
                context.beginPath();
                context.arc(x, y, 20, 0, 2 * Math.PI, false);
                context.fillStyle = 'grey';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#333333';
                context.stroke();
            }
        });
        /*
            This script defines a game object
            This is an abstract class that ducktypes what a "game" must be able to do.
            
            
            
            THINGS TO WORK OUT
            - Instance to instance collision checking
            - World backgrounds?
                - Scaling and rotating world backgrounds consistently between views
            - TEST
        */

        TwoCylinder.Engine.Game = TwoCylinder.Engine.Generic.extend({
            start: function () {
                return this.getWorld().start();
            },

            exit: function () {
                return this.getWorld().exit();
            },

            setWorld: function (w) {
                this.__world = w;
            },

            getWorld: function () {
                return this.__world;
            }
        });
        /*
            This script defines a this.__world's view.
            Views are attached to this.__worlds and help determine which instances should be drawn to the this.__canvas and where
        */

        TwoCylinder.Engine.View = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                this._super('initialize', options);
                this.__canvas = options.canvas;

                this._rotation = options.rotation || 0;
                this._scale = options.scale || 1;
                this._resolution = options.resolution || 1;

                this.__canvas.width = this.getBounding().width * this._resolution;
                this.__canvas.height = this.getBounding().height * this._resolution;
                this.__canvas.style.width = this.getBounding().width + "px";
                this.__canvas.style.height = this.getBounding().height + "px";

                this.__followInstance = false;

                this.__ios = [];
                this.__toRemoveIOs = [];
                this.__ioKey = 0;

                // id is set by the world when it's inserted
                this.__id = null;
            },
            clearCanvas: function () {
                this.__canvas.getContext('2d').clearRect(0, 0, this.__canvas.width, this.__canvas.height);
            },
            draw: function (time) {
                var i;
                var instances;
                var particles;
                var ios;
                var that = this;

                // before we draw, we want to re-center on our tracked instance if we have one
                if (this.__followInstance) {
                    this.getBounding().setCenterWithinBounding(this.__followInstance.getBounding().getCenter(), this.__world.getBounding());
                }

                // prepare to draw
                this.clearCanvas();

                // first draw the world's background
                this.__world.getBackground().draw(this);

                // get all instances and loop through them
                instances = this.__world.getInstances();
                _.each(instances, function (inst) {
                    // skip invisible instances
                    if (!inst.isVisible()) {
                        return;
                    }
                    // if this instance's appearance is inside this view box
                    // NOTE: we check the appearance's bounding because it may be desirable for the calculated collision box
                    // to be different from what is considered visible. for example, if the appearance draws shadows
                    // those shadows might not be collidable with other entities, but should be included in
                    // determining whether or not to draw the entity to a view.
                    if (that.collides(inst.getAppearance().getBounding())) {
                        //then we draw the instance and pass the view so it can reference the view's
                        //transitions and transformation (rotation, scale, etc)
                        inst.draw(that, inst.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x, inst.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y);
                    }
                });

                // Draw each particle emitter
                particles = this.__world.getParticleEmitters();
                _.each(particles, function (part) {
                    if (that.collides(part.getBounding())) {
                        part.draw(that, part.getBounding().getCenter().x - that.getBounding().getContainingRectangle().origin_x, part.getBounding().getCenter().y - that.getBounding().getContainingRectangle().origin_y);
                    }
                });

                // check if any IOs have been removed
                this.__removeIOs();

                //now we loop through the IO handlers for this view
                ios = this.getIOs();
                for (i = 0; i < ios.length; i++) {
                    ios[i].draw();
                }
            }
            /****************************************************************************
            GETTER AND SETTER FUNCTIONS
            ****************************************************************************/
            , getCanvas: function () {
                return this.__canvas;
            },
            getWorld: function () {
                return this.__world;
            },
            setWorld: function (world) {
                this.__world = world;
            },
            getRotation: function () {
                return this._rotation;
            },
            setRotation: function (r) {
                this._rotation = r;
            },
            getScale: function () {
                return this._scale;
            },
            setScale: function (s) {
                this._scale = s;
            }
            /****************************************************************************
            IO FUNCTIONS
            ****************************************************************************/
            , removeIO: function (io) {
                if (io.__id) {
                    this.__toRemoveIOs.push(io.__id);
                }

                return io;
            },
            __removeIOs: function () {
                if (!this.__toRemoveIOs.length) {
                    return;
                }
                var i;
                var j;
                for (i = 0; i < this.__toRemoveIOs.length; i++) {
                    for (j = 0; j < this.__ios.length; j++) {
                        if (this.__ios[j].__id == this.__toRemoveIOs[i]) {
                            delete this.__ios[j].__id;
                            this.__ios.splice(j, 1);
                            break;
                        }
                    }
                }

                this.__toRemoveIOs = [];
            },
            addIO: function (io) {
                if (io.__id) {
                    throw "IO already added";
                }
                io.__id = ++this.__ioKey;

                this.__ios.push(io);

                return io;
            },

            getIOs: function () {
                return this.__ios;
            }

            // this gets the mouse position by world, view, and device OR any one of them as an x,y tuple
            , getMousePosition: function (evt) {
                return new TwoCylinder.IO.Event(evt, this);
            },

            followInstance: function (instance) {
                if (instance) {
                    this.__followInstance = instance;
                } else {
                    this.__followInstance = false;
                }
            }
        });
        /*
            This script sets up the world canvas.
            Pass options to this object defining things like framerate, dimensions, etc
        */

        TwoCylinder.Engine.World = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                options.bounding = new TwoCylinder.Engine.BoundingBox({
                    origin_x: 0,
                    origin_y: 0,
                    width: options.width,
                    height: options.height
                });
                this._super('initialize', options);
                this._fps = options.fps || 30;

                this.__instances = [];
                this.__particleEmitters = [];
                this.__views = [];

                this.__toRemoveParticleEmitters = [];
                this.__toRemoveInstances = [];
                this.__toRemoveViews = [];

                this.__collisionGroups = {};
                this.__background = options.background || new TwoCylinder.Engine.Background();

                this.__instanceKey = 0;
                this.__viewKey = 0;
                this.__emitterKey = 0;
                this.__clock = 0;
            }

            /****************************************************************************
             CONTROLLER FUNCTIONS
             ****************************************************************************/
            //TODO: Needs to somehow sync touch events up with the game clock
            , start: function () {
                var that = this;
                this.__intervalId = setInterval(function () {
                    try {
                        that.loop.apply(that, []);
                    } catch (e) {
                        that.exit(e);
                    }
                }, 1000 / this._fps);
            },

            __preStep: function (time) {
                // we have each instance perform a frame step.
                _.each(this.__instances, function (inst) {
                    inst.preStep(time);
                });
            },

            __postStep: function (time) {
                // we have each instance perform a frame step.
                _.each(this.__instances, function (inst) {
                    inst.postStep(time);
                });

                this.__removeParticleEmitters();
                this.__removeViews();
                this.__removeInstances();
            },

            loop: function () {
                this.__preStep(++this.__clock);
                var that = this;

                // we have each instance perform a frame step.
                _.each(this.__particleEmitters, function (part) {
                    part.step(that.__clock);
                });

                // we have each instance perform a frame step.
                _.each(this.__instances, function (inst) {
                    inst.step(that.__clock);
                });

                // check for collisions
                _.each(this.__instances, function (me) {
                    if (me.hasCollisionChecking()) {
                        var myCollisionGroups = me.getCollidableGroups();
                        _.each(myCollisionGroups, function (group) {
                            // if there are instances that match the groups im listening for
                            if (that.__collisionGroups[group] && that.__collisionGroups[group].length) {

                                // for each of those matching instance types,
                                _.each(that.__collisionGroups[group], function (other) {

                                    // if they're not me, and I collide with them
                                    if (me.__id != other.__id && me.collides(other.getBounding())) {
                                        me.handleCollidedWith(other);
                                    }
                                });
                            }
                        });
                    }
                });

                // draw the views
                _.each(this.__views, function (view) {
                    view.draw(that.__clock);
                });

                this.__postStep(this.__clock);
            },

            exit: function () {
                clearInterval(this.__intervalId);

                //TODO: handle exit
            }

            /****************************************************************************
             INSTANCE FUNCTIONS
             ****************************************************************************/
            , removeInstance: function (instance) {
                if (instance.__id) {
                    // we add their id to the array of instances to remove
                    this.__toRemoveInstances.push(instance.__id);
                }
                return instance;
            },
            __removeInstances: function () {
                if (!this.__toRemoveInstances.length) {
                    return;
                }
                var i;
                var j;
                for (i = 0; i < this.__toRemoveInstances.length; i++) {
                    for (j = 0; j < this.__instances.length; j++) {
                        if (this.__instances[j].__id == this.__toRemoveInstances[i]) {
                            this.__removeFromCollisionGroup(this.__instances[j]);
                            delete this.__instances[j].__id;
                            this.__instances.splice(j, 1);
                            break;
                        }
                    }
                }

                this.__toRemoveInstances = [];
            },

            addInstance: function (instance) {
                if (instance.__id) {
                    throw "Instance already added";
                }
                instance.__id = ++this.__instanceKey;
                // add it to the big list
                this.__instances.push(instance);
                // also add it according to its collision group
                this.__addToCollisionGroup(instance);

                return instance;
            },

            getInstances: function () {
                return this.__instances;
            }

            /****************************************************************************
             VIEW FUNCTIONS
             ****************************************************************************/
            , addView: function (view) {
                if (view.__id) {
                    throw "View already added";
                }
                view.__id = ++this.__viewKey;
                view.setWorld(this);
                this.__views.push(view);

                return view;
            },

            getViews: function () {
                return this.__views;
            },

            __removeViews: function () {
                if (!this.__toRemoveViews.length) {
                    return;
                }
                var i;
                var j;
                for (i = 0; i < this.__toRemoveViews.length; i++) {
                    for (j = 0; j < this.__views.length; j++) {
                        if (this.__views[j].__id == this.__toRemoveViews[i]) {
                            delete this.__views[j].__id;
                            this.__views.splice(j, 1);
                            break;
                        }
                    }
                }

                this.__toRemoveViews = [];
            },

            removeView: function (view) {
                if (view.__id) {
                    // we add their id to the array of views to remove
                    this.__toRemoveViews.push(view.__id);
                }
                return view;
            }

            /****************************************************************************
            PARTICLE FUNCTIONS
            ****************************************************************************/
            , addParticleEmitter: function (emitter) {
                if (emitter.__id) {
                    throw "Emitter already added";
                }
                emitter.__id = ++this.__emitterKey;
                this.__particleEmitters.push(emitter);
                return emitter;
            },

            removeParticleEmitter: function (emitter) {
                if (emitter.__id) {
                    // we add their id to the array of emitters to remove
                    this.__toRemoveParticleEmitters.push(emitter.__id);
                }
                return emitter;
            },
            __removeParticleEmitters: function () {
                if (!this.__toRemoveParticleEmitters.length) {
                    return;
                }
                var i;
                var j;
                for (i = 0; i < this.__toRemoveParticleEmitters.length; i++) {
                    for (j = 0; j < this.__particleEmitters.length; j++) {
                        if (this.__particleEmitters[j].__id == this.__toRemoveParticleEmitters[i]) {
                            delete this.__particleEmitters[j].__id;
                            this.__particleEmitters.splice(j, 1);
                            break;
                        }
                    }
                }

                this.__toRemoveParticleEmitters = [];
            },
            getParticleEmitters: function () {
                return this.__particleEmitters;
            }
            /****************************************************************************
            BACKGROUND FUNCTIONS
            ****************************************************************************/
            , setBackground: function (background) {
                this.__background = background;
            },

            getBackground: function () {
                return this.__background;
            }
            /****************************************************************************
            HELPER FUNCTIONS
            ****************************************************************************/
            , __addToCollisionGroup: function (instance) {
                var group = instance.getCollisionGroup();

                if (!this.__collisionGroups[group]) {
                    this.__collisionGroups[group] = [];
                }
                this.__collisionGroups[group].push(instance);
            },
            __removeFromCollisionGroup: function (instance) {
                var i;
                var group = instance.getCollisionGroup();

                for (i = 0; i < this.__collisionGroups[group].length; i++) {
                    if (this.__collisionGroups[group][i].__id == instance.__id) {
                        this.__collisionGroups[group].splice(i, 1);
                        break;
                    }
                }
            }
        });
        /*
            Backgrounds are objects that control how the game background should appear. 
            At most, there should be one per world. 
        */

        TwoCylinder.Engine.Background = TwoCylinder.Engine.Root.extend({
            initialize: function (options) {
                options = _.extend({
                    color: 'transparent'
                }, options);
                this._color = options.color;
            },
            draw: function (view) {
                var canvas = view.getCanvas();
                var containingRectangle = view.getBounding().getContainingRectangle();
                var context = canvas.getContext('2d');
                context.beginPath();
                context.fillStyle = this._color;
                context.fillRect(0, 0, containingRectangle.width, containingRectangle.height);
                context.fill();
                context.stroke();
            }
        });

        /*
         This script defines the Vector object
         */

        TwoCylinder.Engine.Vector = TwoCylinder.Engine.Root.extend({
            initialize: function (options) {
                options = _.extend({
                    direction: 0,
                    speed: 0
                }, options);

                this.__direction = options.direction;
                this.__speed = options.speed;
            }
            // ------------------------------------
            // GETTERS / SETTERS
            // ------------------------------------
            , getDirection: function () {
                return this.__direction;
            },
            getSpeed: function () {
                return this.__speed;
            },
            setDirection: function (dir) {
                this.__direction = dir;
            },
            setSpeed: function (speed) {
                this.__speed = speed;
            }
            // ------------------------------------
            // CONVENIENCE FUNCTIONS
            // ------------------------------------
            , rotateTowards: function (dir, friction) {
                var currentDirection = this.getDirection();
                var TAU = 2 * Math.PI;
                var directionDiff = (dir + TAU - currentDirection) % TAU;

                friction = friction ? friction : 1;
                if (directionDiff <= Math.PI) {
                    this.setDirection(currentDirection + directionDiff / friction);
                } else {
                    this.setDirection(currentDirection - (directionDiff - Math.PI) / friction);
                }
            }
        });

        /*
            Profiles are used to remove the ambiguity with determining bounding box
        */

        TwoCylinder.Engine.Bounding = TwoCylinder.Engine.Root.extend({
            initialize: function (options) {
                this._properties = [];
                this.rotation = 0;

                var that = this;
                _.each(options, function (v, k) {
                    that._properties.push(k);
                });

                this.updateBounding(options);
            },
            getCenter: function () {
                return { x: null, y: null };
            },
            setCenter: function (tuple) {
                return null;
            },
            setCenterWithinContainer: function (tuple, bounding) {
                // if not implemented, just set the center normal style
                return this.setCenter(tuple);
            },
            getContainingRectangle: function () {
                return { origin_x: null, origin_y: null, width: null, height: null };
            },
            getRotation: function () {
                return null;
            },
            setRotation: function (r) {
                this.rotation = r;
            },
            updateBounding: function (key, value) {
                if (typeof key == 'object') {
                    var that = this;
                    _.each(key, function (v, k) {
                        if (~_.indexOf(that._properties, k)) {
                            that[k] = v;
                        }
                    });
                } else {
                    if (~_.indexOf(this._properties, key)) {
                        this[key] = value;
                    }
                }
                return this;
            },
            collides: function (bounding) {
                return false;
            }
        });

        // RectangleProfiles need an origin x,y and a width and height
        TwoCylinder.Engine.BoundingBox = TwoCylinder.Engine.Bounding.extend({
            getCenter: function () {
                return {
                    x: this.origin_x + this.width / 2,
                    y: this.origin_y + this.height / 2
                };
            },
            setCenter: function (tuple) {
                this.origin_x = tuple.x - this.width / 2;
                this.origin_y = tuple.y - this.height / 2;
            }
            // TODO: This won't work properly with circles... Perhaps move it to the Geometry function and treat it like collisions
            , setCenterWithinBounding: function (tuple, bounding) {
                var containingBox = bounding.getContainingRectangle();
                var myBox = this.getContainingRectangle();

                var targetX = tuple.x;
                var targeyY = tuple.y;

                if (containingBox.width < myBox.width) {
                    targetX = bounding.getCenter().x;
                } else {
                    // to center within we take the min between x and the containingbox edge - 1/2 my width
                    targetX = Math.min(tuple.x, containingBox.origin_x + containingBox.width - myBox.width / 2);
                    // then max it with the same on the other end
                    targetX = Math.max(targetX, containingBox.origin_x + myBox.width / 2);
                    // this ensures, when centered, our left and right edges do not cross the containingBox borders 
                }

                // Then, do it again for height

                if (containingBox.height < myBox.height) {
                    targetY = bounding.getCenter().y;
                } else {
                    // to center within we take the min between x and the containingbox edge - 1/2 my width
                    targetY = Math.min(tuple.y, containingBox.origin_y + containingBox.height - myBox.height / 2);
                    // then max it with the same on the other end
                    targetY = Math.max(targetY, containingBox.origin_y + myBox.height / 2);
                    // this ensures, when centered, our left and right edges do not cross the containingBox borders
                }

                this.setCenter({ x: targetX, y: targetY });
            },
            getContainingRectangle: function () {
                return {
                    origin_x: this.origin_x,
                    origin_y: this.origin_y,
                    width: this.width,
                    height: this.height
                };
            },
            collides: function (bounding) {
                if (bounding instanceof TwoCylinder.Engine.BoundingBox) {
                    return TwoCylinder.Engine.Geometry.boxCollidesBox(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.BoundingCircle) {
                    return TwoCylinder.Engine.Geometry.boxCollidesCircle(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.BoundingPoint) {
                    return TwoCylinder.Engine.Geometry.boxCollidesPoint(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.Bounding) {
                    // if it's not a rectangle, circle, or point, it could be a new type of bounding
                    // in which case we let it handle the collision checking
                    return bounding.collides(this);
                } else {
                    // treat bounding like a tuple
                    return TwoCylinder.Engine.Geometry.boxCollidesPoint(this, bounding);
                }
            }
        });

        // CircleProfiles need a center point and a radius
        TwoCylinder.Engine.BoundingCircle = TwoCylinder.Engine.Bounding.extend({
            getCenter: function () {
                return { x: this.x, y: this.y };
            },
            setCenter: function (tuple) {
                this.x = tuple.x;
                this.y = tuple.y;
            },
            getContainingRectangle: function () {
                return {
                    origin_x: this.x - radius,
                    origin_y: this.y - radiuis,
                    width: 2 * this.radius,
                    height: 2 * this.radius
                };
            },
            collides: function (bounding) {
                if (bounding instanceof TwoCylinder.Engine.BoundingBox) {
                    return TwoCylinder.Engine.Geometry.circleCollidesBox(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.BoundingCircle) {
                    return TwoCylinder.Engine.Geometry.circleCollidesCircle(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.BoundingPoint) {
                    return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.Bounding) {
                    // if it's not a rectangle, circle, or point, it could be a new type of bounding
                    // in which case we let it handle the collision checking
                    return bounding.collides(this);
                } else {
                    // treat bounding like a tuple
                    return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
                }
            }
        });

        // CircleProfiles need a center point and a radius
        TwoCylinder.Engine.BoundingPoint = TwoCylinder.Engine.Bounding.extend({
            getCenter: function () {
                return { x: this.x, y: this.y };
            },
            setCenter: function (tuple) {
                this.x = tuple.x;
                this.y = tuple.y;
            },
            getContainingRectangle: function () {
                return {
                    origin_x: this.x,
                    origin_y: this.y,
                    width: 0,
                    height: 0
                };
            },
            collides: function (bounding) {
                if (bounding instanceof TwoCylinder.Engine.BoundingBox) {
                    return TwoCylinder.Engine.Geometry.pointCollidesBox(this, bounding);
                } else if (bounding instanceof TwoCylinder.Enginer.BoudingCircle) {
                    return TwoCylinder.Engine.Geometry.pointCollidesCircle(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.BoundingPoint) {
                    return TwoCylinder.Engine.Geometry.pointCollidesPoint(this, bounding);
                } else if (bounding instanceof TwoCylinder.Engine.Bounding) {
                    // if it's not a rectangle, circle, or point, it could be a new type of bounding
                    // in which case we let it handle the collision checking
                    return bounding.collides(this);
                } else {
                    // treat bounding like a tuple
                    return TwoCylinder.Engine.Geometry.circleCollidesPoint(this, bounding);
                }
            }
        });

        /*
            This script defines a single generic object that can be inserted into the world
        */

        TwoCylinder.Engine.Entity = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                this._super('initialize', options);

                // -------------------------------
                this.__appearance = null;

                options = _.extend({
                    velocity: null // Vector :: the instance's velocity vector
                    , rotation: 0 // float :: the instance's this.__appearance rotation
                    , rotation_lag: 20 // int :: the number of steps it will take to turnTowards a target direction
                }, options);

                if (options.appearance) {
                    this.setAppearance(options.appearance);
                }

                this._velocity = options.velocity;
                this._rotationLag = options.rotation_lag;
                this._rotation = options.rotation;
                this._collisionGroup = 'ENTITY';

                // -------------------------------

                // id is set by the world when it's inserted
                this.__id = null;
                this.__collisionGroupListening = {};

                this.__visible = true; // boolean  :: is this instance visible
            }

            // draw is called by a view.
            // the view passes a callback function which is called IFF this instance is to be drawn
            // passed to that function is important information that will be forwarded to the Instance's this.__appearance
            , draw: function (view, center_x, center_y) {
                this.getAppearance().draw(view.getCanvas(), center_x, center_y, view.getRotation() * this._rotation, view.getScale(), this);
            },
            preStep: function (worldClock) {
                return;
            },
            step: function (worldClock) {
                if (this.getSpeed()) {
                    this.getBounding().setCenter({
                        x: this.getBounding().getCenter().x + this.getSpeed() * Math.cos(this.getDirection()),
                        y: this.getBounding().getCenter().y + this.getSpeed() * Math.sin(this.getDirection())
                    });

                    if (this.getAppearance()) {
                        this.getAppearance().getBounding().setCenter(this.getBounding().getCenter());
                    }
                }
            },
            postStep: function (worldClock) {
                return;
            }
            /****************************************************************************
            COLLISIONS AND COLLISION CHECKING
            ****************************************************************************/

            // this will return what collision group this entity belongs to
            , getCollisionGroup: function () {
                return this._collisionGroup;
            },

            getCollidableGroups: function () {
                return Object.keys(this.__collisionGroupListening);
            }

            // this function passes an other instance and signifies a collision has occurred
            // this instance then determines if it should react to the collision or not
            , handleCollidedWith: function (other) {
                var collisionFunction = this.objectIsCollidable(other);
                if (collisionFunction) {
                    collisionFunction.apply(this, [other]);
                }
            },

            groupIsCollidable: function (group) {
                retVal = false;
                if (this.__collisionGroupListening[other]) {
                    retVal = this.__collisionGroupListening[other];
                }
                return retVal;
            }

            // this function will return the collision function for a passed Entity instance
            // or false IFF there is no corresponding collision function
            , objectIsCollidable: function (other) {
                var retVal = false;

                if (other instanceof TwoCylinder.Engine.Entity) {
                    _.each(this.__collisionGroupListening, function (collisionFunction, key) {
                        if (other.getCollisionGroup() == key) {
                            retVal = collisionFunction;
                            return false;
                        }
                    });
                }

                return retVal;
            }

            // this will return true IFF this object is listening for collisions
            , hasCollisionChecking: function () {
                return !_.isEmpty(this.__collisionGroupListening);
            }

            // ----------------------

            // this collision function handles collisions between this instance and instances of a specified Group
            , onCollideGroup: function (group, callback) {
                this.__collisionGroupListening[group] = callback;
            },

            offCollideGroup: function (group) {
                delete this.__collisionGroupListening[group];
            }

            /****************************************************************************
             GETERS AND SETTERS
             ****************************************************************************/

            , getPosition: function () {
                return this.getBounding().getCenter();
            }

            /**
             * tuple can either be a boundingPoint, tuple (x & y) or just x (in which case y is y)
             */
            , setPosition: function (tuple, y) {
                if (tuple instanceof TwoCylinder.Engine.BoundingPoint) {
                    this.getBounding().updateBounding(tuple.getCenter());
                } else if (typeof tuple == 'object') {
                    this.getBounding().updateBounding({ x: tuple.x, y: tuple.y });
                } else {
                    this.getBounding().updateBounding(tuple, y);
                }
            }

            // ----------------------

            /**
             * app is an Appearance object
             * when setting an this.__appearance object, you can also change the collision box by passing new collision dimensions
             * "box" can either be a tuple (width & height) or just width in which case h is height
             */
            , setAppearance: function (app, h) {
                this.__appearance = app;
            }

            // This function defines how to draw this instance
            , getAppearance: function () {
                return this.__appearance;
            }

            // ----------------------

            , getDirection: function () {
                return this.getVelocity().getDirection();
            },
            rotateTowards: function (dir) {
                this.getVelocity().rotateTowards(dir, this._rotationLag);
            },
            setDirection: function (dir) {
                this.getVelocity().setDirection(dir);

                return this.getDirection();
            },

            getSpeed: function () {
                return this.getVelocity().getSpeed();
            },

            setSpeed: function (speed) {
                this.getVelocity().setSpeed(speed);
            },

            setVelocity: function (velocity) {
                this._velocity = velocity;
            },
            getVelocity: function () {
                if (!this._velocity) {
                    this._velocity = new TwoCylinder.Engine.Vector();
                }
                return this._velocity;
            }

            // ----------------------

            , getVisible: function () {
                return this.isVisible();
            },

            isVisible: function () {
                // must be in the world, visible, and with an appearance
                return this.__id && this.__visible && !!this.__appearance;
            },

            setVisible: function (vis) {
                this.__visible = vis;
            }
        });
        /*
            This script defines a single generic object that can be inserted into the world
        */

        TwoCylinder.Engine.ParticleEmitter = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                this._super('initialize', options);

                // -------------------------------
                this.__particles = [];
                this.__toRemove = [];

                // by default, newly created emitters do not emit until told to
                this.__isEmitting = false;

                // an internal id counter
                this.__particleKey = 0;

                // id is set by the world when it's inserted
                this.__id = null;
            }
            // an emitter drawing basically just calls draw on all its particles
            // particles are like appearances, but without bounding boxes - they just get drawn if the emitter is in
            // collision with the view
            , draw: function (view, center_x, center_y) {
                _.each(this.getParticles(), function (p) {
                    p.draw(view.getCanvas(), center_x, center_y, view.getRotation() * this._rotation, view.getScale(), this);
                });
            },
            step: function (clock) {
                _.each(this.getParticles(), function (p) {
                    p.step(clock);
                });

                this.__removeParticles();
            },
            destroy: function () {
                this.__particles = [];
            },
            setIsEmitting: function (isEmitting) {
                this.__isEmitting = isEmitting;
            },
            getIsEmitting: function () {
                return this.__isEmitting;
            }

            /****************************************************************************
             PARTICLES
             ****************************************************************************/
            , getParticles: function () {
                return this.__particles;
            },
            removeParticle: function (particle) {
                this.__toRemove.push(particle);
            },

            __removeParticles: function (particle) {
                if (!this.__toRemove.length) {
                    return;
                }

                var i;
                var j;
                for (i = 0; i < this.__toRemove.length; i++) {
                    for (j = 0; j < this.__particles.length; j++) {
                        if (this.__particles[j].__id == this.__toRemove[i]) {
                            delete this.__particles[j].__id;
                            this.__particles.splice(j, 1);
                            break;
                        }
                    }
                }

                this.__toRemove = [];
            }
            /**
             * It may be advantageous for particle emitters to emit particles one at a time
             * rather than repeatedly. In that case, this function can be used
             * @param {function} particleType
             */
            , emitParticle: function (particleType, options) {
                var newParticle;
                var defaultOptions = {
                    id: ++this.__particleKey,
                    emitter: this
                };

                options = options ? _.extend(options, defaultOptions) : defaultOptions;
                newParticle = new particleType(options);
                this.__particles.push(newParticle);

                return newParticle;
            }
        });
        /*
         This script defines the particle object
         */

        TwoCylinder.Engine.Particle = TwoCylinder.Engine.Root.extend({
            initialize: function (options) {
                options = _.extend({}, options);
                this.__id = options.id;
                this.__emitter = options.emitter;
            }
            // This function is responsible for moving the particle or otherwise tracking its lifecycle
            , step: function (clock) {
                return null;
            },
            draw: function (canvas, x, y, rotation, scale, emitter) {
                var context = canvas.getContext('2d');
                context.beginPath();
                context.arc(x, y, 20, 0, 2 * Math.PI, false);
                context.fillStyle = 'grey';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#333333';
                context.stroke();
            },
            destroy: function () {
                this.__emitter.removeParticle(this);
            }
        });

        TwoCylinder.IO.EVENT_TYPES = {};
        TwoCylinder.IO.EVENT_TYPES.TAP = 'tap';
        TwoCylinder.IO.EVENT_TYPES.DOUBLE = 'doubletap';
        TwoCylinder.IO.EVENT_TYPES.LONG = 'longtap';
        TwoCylinder.IO.EVENT_TYPES.MOVE = 'mousemove';
        TwoCylinder.IO.EVENT_TYPES.UP = 'mouseup';
        TwoCylinder.IO.EVENT_TYPES.DOWN = 'mousedown';

        /*
            This script creates a basic user interface
        */

        TwoCylinder.IO.Event = TwoCylinder.Engine.BoundingPoint.extend({
            initialize: function (evt, view) {
                // -----------------------------------------------------
                // This part was taken from Stack Overflow
                // http://stackoverflow.com/questions/8389156
                var el = evt.target,
                    x = 0,
                    y = 0;

                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    x += el.offsetLeft - el.scrollLeft;
                    y += el.offsetTop - el.scrollTop;
                    el = el.offsetParent;
                }
                // -----------------------------------------------------

                this._super('initialize', {
                    x: evt.clientX - x,
                    y: evt.clientY - y
                });

                if (view) {
                    this.world_x = this.x + view.getBounding().origin_x;
                    this.world_y = this.y + view.getBounding().origin_y;
                    var rect = view.getCanvas().getBoundingClientRect();
                    this.device_x = this.x + rect.left;
                    this.device_y = this.y + rect.top;
                }

                this.timestamp = Date.now();
            },
            linkEvent: function (evt) {
                // we want them to only link events
                if (evt instanceof TwoCylinder.IO.Event) {
                    this.linked_event = evt;
                    this.velocity = TwoCylinder.Engine.Geometry.pointToPoint(this.linked_event, this);
                }

                return this;
            },
            setType: function (eventType) {
                if (_.indexOf(_.values(TwoCylinder.IO.EVENT_TYPES), eventType) !== -1) {
                    this.type = eventType;
                    return this;
                } else {
                    return false;
                }
            },
            getType: function () {
                if (this.type) {
                    return this.type;
                } else {
                    return null;
                }
            }
        });

        /*
            This script creates a basic user interface
        */
        TwoCylinder.IO.Touch = TwoCylinder.Engine.Generic.extend({
            initialize: function (options) {
                this.__view = options.view;

                //by default the touch location is the full canvas
                options = _.extend({
                    bounding: this.__view.getBounding(),
                    double: 300,
                    tap: 300,
                    tap_distance: 20
                }, options);

                this.setBounding(options.bounding);

                this._doubleTapThreshold = options.double;
                this._tapThreshold = options.tap;
                this._tapDistanceThreshold = options.tap_distance;
                this._longTapCancel = 2 * this._tapThreshold;

                // absolute touch boxes are bound to the world which means the calculate touching
                // via worldy coordinate systems as opposed to the view's relative coordinates [default]
                if (options.absolute) {
                    this.__boundToWorld = true;
                }

                // these events store the last events -- TODO : Maybe make them arrays? Store the trailing events?
                this._lastUp = null;
                this._lastDown = null;
                this._lastMove = null;

                var that = this;
                // create a listener for each type of event
                _.each(TwoCylinder.IO.EVENT_TYPES, function (val) {
                    that.__getListenersByType.call(that, val);
                });

                // id is set by the view when the touch object is inserted
                this.__id = null;

                // key is used to track touch listeners
                this.__key = 0;

                // used to check if the touch is currently down
                this.__isDown = false;

                // What follows are the browser event binding calls
                this.__view.getCanvas().addEventListener('mousedown', function (evt) {
                    that._handleDown.apply(that, arguments);
                }, false);
                this.__view.getCanvas().addEventListener('touchstart', function (evt) {
                    evt.preventDefault();
                    that._handleDown.apply(that, arguments);
                }, false);

                this.__view.getCanvas().addEventListener('mouseup', function (evt) {
                    that._handleUp.apply(that, arguments);
                }, false);
                this.__view.getCanvas().addEventListener('touchend', function (evt) {
                    evt.preventDefault();
                    that._handleUp.apply(that, arguments);
                }, false);

                this.__view.getCanvas().addEventListener('mousemove', function (evt) {
                    that._handleMove.apply(that, arguments);
                }, false);
                this.__view.getCanvas().addEventListener('touchmove', function (evt) {
                    evt.preventDefault();
                    that._handleMove.apply(that, arguments);
                }, false);
            }
            /*
             * If this touch has an appearance, we draw it
             */
            , draw: function () {
                if (this.getAppearance()) {
                    this.getAppearance().draw(this.__view.getCanvas(), this.getBounding().getCenter().x, this.getBounding().getCenter().y, this.__view.getRotation(), this.__view.getScale(), this);
                }
            }
            /*
             * Appearance will be important for extended objects wishing to give the touch zones a visual represenation
             */
            , setAppearance: function (app) {
                this.__appearance = app;
            },

            getAppearance: function (app) {
                return this.__appearance;
            }

            /*
             * These function receive a browser event and determin whether or not
             * to fire an IO event to listeners based on collision type, location, and touch state
             * They are also responsible with properly formatting the IO event (determining if it's
             * a single tap, double tap, move, etc...)
             */
            , _handleDown: function (evt) {
                var event = this.__formatTouchEvent(evt);
                if (!event) {
                    return;
                }
                event.setType(TwoCylinder.IO.EVENT_TYPES.DOWN);

                this.__isDown = true;
                this.__lastDown = event;
                this.__fireEvent(event);
            },
            _handleUp: function (evt) {
                var event = this.__formatTouchEvent(evt);
                if (!event) {
                    return;
                }

                if (!this.isDown()) {
                    return;
                }

                // found is used to determine if we've already assigned a type to this event before checking for others
                // it's really just a helper variable so we can avoid deeply nested if / else ifs
                var found = false;

                // first we check for DOUBLE tap
                if (this.__lastUp && this.__lastUp.type == TwoCylinder.IO.EVENT_TYPES.TAP && this.__lastUp.timestamp - event.timestamp <= this._doubleTapThreshold) {
                    event.setType(TwoCylinder.IO.EVENT_TYPES.DOUBLE);
                    found = true;
                }

                // next we check for LONG tap
                if (!found && this.__lastDown && TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold) {
                    var lastDownDiff = event.timestamp - this.__lastDown.timestamp;
                    if (lastDownDiff <= this._tapThreshold) {
                        event.setType(TwoCylinder.IO.EVENT_TYPES.TAP);
                        found = true;
                    } else if (lastDownDiff <= this._longTapCancel) {
                        event.setType(TwoCylinder.IO.EVENT_TYPES.LONG);
                        found = true;
                    } else {
                        // do nothing, we're cancelling the long click
                    }
                }

                // at this point, it must be the end of a move, so we give it a default
                if (!found) {
                    event.setType(TwoCylinder.IO.EVENT_TYPES.UP);
                }

                event.linkEvent(this.__lastDown);
                this.__lastUp = event;
                this.__fireEvent(event);
                this.__isDown = false;
            },
            _handleMove: function (evt) {
                if (!this.isDown()) {
                    return;
                }

                var event = this.__formatTouchEvent(evt);
                if (!event) {
                    return;
                }

                if (event.timestamp - this.__lastDown.timestamp <= this._longTapCancel && TwoCylinder.Engine.Geometry.distanceToPoint(this.__lastDown, event) < this._tapDistanceThreshold) {
                    // if they haven't moved their finger enough and we're within the longtap threshold
                    return;
                }

                event.setType(TwoCylinder.IO.EVENT_TYPES.MOVE);
                event.linkEvent(this.__lastMove);
                this.__lastMove = event;
                this.__fireEvent(event);
            }
            /*
             * This function takes an IO Event and fires it to all bound listeners of its type
             */
            , __fireEvent: function (event) {
                var handlers = this.__getListenersByType(event.getType());
                if (handlers.length) {
                    for (var i = 0; i < handlers.length; i++) {
                        handlers[i].callback(event);
                    }
                }
            }
            /*
             * This function will be used to queue previous events to  store a history rather than just
             * the last one (lastMove, lastUp, lastDown)
             */
            , __queueHistory: function (group, event) {
                group[0] = group[0].toUpperCase();
                this['__last' + group].push(event);
                this['__last' + group].shift();
                return null;
            }

            /*
             * This function might be uneeded? It basically adds all listeners to an array so we can
             * potentially more easily track them (by key)
             */
            , __formatListener: function (callback) {
                return {
                    key: ++this.__key,
                    callback: callback
                };
            }
            /*
             * This function takes a browser event (mouse or touch) and converts it into a TwoCylinder IO event
             * IFF it registered a collision with this touch space else it returns false 
             */
            , __formatTouchEvent: function (evt) {
                //TODO: I'm not sure if this.collides will work for views that are not origin_x = 0, origin_y = 0
                // BECAUSE, I think the event's x and y is relative to the device and the touch instance is relative
                // to the world view (I THINK)

                // changed Touches is used for multitouch... ?
                // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches

                var touches = evt.changedTouches ? evt.changedTouches : touches;

                if (touches && touches.length) {
                    var event = false;
                    var step = 0;

                    do {
                        if (step < touches.length) {
                            evt.clientX = touches[step].clientX;
                            evt.clientY = touches[step].clientY;
                        } else {
                            return false;
                        }
                        event = new TwoCylinder.IO.Event(evt, this.__view);
                        step++;
                    } while (!this.collides(event));
                } else {
                    event = new TwoCylinder.IO.Event(evt, this.__view);
                    if (!this.collides(event)) {
                        return false;
                    }
                }

                return event;
            }
            /*
             * This function returns all bound listeners based on type
             */
            , __getListenersByType: function (type) {
                if (!type) {
                    return null;
                }
                if (!_.has(this, '__' + type + 'Listeners')) {
                    this['__' + type + 'Listeners'] = [];
                }
                return this['__' + type + 'Listeners'];
            }

            /*
             * This function is used to bind a handler to a certain type of IO event
             */
            , __on: function (type, callback) {
                var array = this.__getListenersByType(type);
                array.push(this.__formatListener(callback));
            }
            /*
             * This function removes a passed binding
             */
            , __off: function (type, callback) {
                var array = this.__getListenersByType(type);
                for (var i = 0; i < array.length; i++) {
                    if (array[i].callback === callback) {
                        delete array[i];
                    }
                }
            }

            /*
             * The following are helper functions to make calling __on and __off more semantic
             */
            , onDouble: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.DOUBLE, callback);
            },
            offDouble: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.DOUBLE, callback);
            },
            onLong: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.LONG, callback);
            },
            offLong: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.LONG, callback);
            },

            onTap: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.TAP, callback);
            },
            offTap: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.TAP, callback);
            },

            onDown: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.DOWN, callback);
            },
            offDown: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.DOWN, callback);
            },

            onMove: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.MOVE, callback);
            },
            offMove: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.MOVE, callback);
            },

            onUp: function (callback) {
                this.__on(TwoCylinder.IO.EVENT_TYPES.UP, callback);
            },
            offUp: function (callback) {
                this.__off(TwoCylinder.IO.EVENT_TYPES.UP, callback);
            }

            /*
             * This function can determine if this touch instance is being actively engaged
             */
            , isDown: function () {
                return this.__isDown;
            }
        });

        /*
            This script handles drawing the joystick appearance
        */
        TwoCylinder.IO.Joystick = TwoCylinder.IO.Touch.extend({
            initialize: function (options) {
                this._defaultRadius = 40;
                options.tap_distance = 0;
                options.bounding = new TwoCylinder.Engine.BoundingCircle({
                    x: options.x,
                    y: options.y,
                    radius: this._defaultRadius
                });
                this._super('initialize', options);

                this.__isHeld = false;

                this.__pullRatio = 1.8;

                // the operate function is what we will pass joystick motions to
                this.__operateFunction = null;

                this.__appearance = new TwoCylinder.Sprites.Joystick();

                var that = this;

                this._previousEvent = null;

                this.onDown(function (evt) {
                    that._previousEvent = evt; //initialize evt

                    // we link to itself so that the joystick draws properly
                    that._previousEvent.linkEvent(evt);

                    that.getBounding().updateBounding({
                        radius: 4 * that._defaultRadius
                    });

                    if (typeof that.__operateFunction == 'function') {
                        if (evt.velocity) {
                            evt.velocity.setSpeed(0);
                        }
                        that.__operateFunction(evt);
                    }
                });

                this.onUp(function (evt) {
                    that.getBounding().updateBounding({
                        radius: that._defaultRadius
                    });
                    delete that._previousEvent;

                    if (typeof that.__operateFunction == 'function') {
                        if (evt.velocity) {
                            evt.velocity.setSpeed(0);
                        }
                        that.__operateFunction(evt);
                    }
                });

                this.onMove(function (evt) {
                    if (that.isDown()) {
                        evt.linkEvent(that.__lastDown);
                        if (typeof that.__operateFunction == 'function') {
                            //want to make the max speed the distance we allow the joystick to move
                            if (evt.velocity) {
                                evt.velocity.setSpeed(Math.min(evt.velocity.getSpeed(), that._defaultRadius / that.__pullRatio));
                            }
                            that.__operateFunction(evt);
                        }
                        that._previousEvent = evt;
                    }
                });
            },
            onOperate: function (callback) {
                this.__operateFunction = callback;
            },
            offOperate: function () {
                delete this.__operateFunction;
            },
            getDrawOptions: function () {
                var options = {
                    stick: this.getBounding().getCenter(),
                    operating: this.isDown()
                };

                if (this._previousEvent && this._previousEvent.velocity) {
                    var vector = _.clone(this._previousEvent.velocity);
                    vector.setSpeed(Math.min(this._defaultRadius / this.__pullRatio, this._previousEvent.velocity.getSpeed()));
                    options.stick = TwoCylinder.Engine.Geometry.pointFromVector(options.stick, vector);
                }

                return options;
            }
        });
        /*
            This script handles drawing the joystick appearance
        */
        TwoCylinder.Sprites.Joystick = TwoCylinder.Engine.Appearance.extend({
            initialize: function () {
                options = {
                    bounding: new TwoCylinder.Engine.BoundingCircle({
                        x: 0,
                        y: 0,
                        radius: 20
                    })
                };

                this._super('initialize', options);
            },
            draw: function (canvas, x, y, rotation, scale, joystick) {
                var options = joystick.getDrawOptions();
                var context = canvas.getContext('2d');

                // if the joystick is being operated, we draw the binding circle
                if (options.operating) {
                    context.beginPath();
                    context.arc(x, y, 160, 0, 2 * Math.PI, false);
                    context.fillStyle = 'rgba(0,255,0,0.1)';
                    context.fill();
                    context.lineWidth = 3;
                    context.strokeStyle = 'rgba(0,255,0,0.3)';
                    context.stroke();
                }

                context.beginPath();
                context.arc(x, y, 20, 0, 2 * Math.PI, false);
                context.fillStyle = '#000000';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#303030';
                context.stroke();

                context.beginPath();
                context.lineWidth = 18;
                context.strokeStyle = '#333333';
                context.lineCap = 'round';
                context.moveTo(options.stick.x, options.stick.y);
                context.lineTo(x, y);
                context.stroke();

                context.beginPath();
                context.arc(options.stick.x, options.stick.y, 18, 0, 2 * Math.PI, false);
                context.fillStyle = '#dd2222';
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = '#aa1111';
                context.stroke();

                context.beginPath();
                context.arc(options.stick.x + 6, options.stick.y - 6, 4, 0, 2 * Math.PI, false);
                context.fillStyle = '#ffcccc';
                context.fill();
            }
        });
        /**
         * Color Transition is a helper class that will smoothly transition one color to another
         */
        TwoCylinder.Utilities.ColorTransition = function () {
            /**
             * colors should be either an array or an object keyd to where in the transition percentage it should shift
             * ie, {0:red, 25:blue, 75:orange} will start red, shift to blue by 25%, then to orange by 75%
             * NOTE: Must use same the number of digits for each or else 5 will preempt 1.25
             */
            var singleColorTransition = function (startColor, stopColor, duration) {
                this.getColorAtStep = function (step) {
                    return this.getColorAtPercent(step / duration);
                };

                this.getColorAtPercent = function (percent) {
                    //TODO: How do you mix 2 colors?
                    return stopColor * percent + startColor * (1 - percent);
                };
            };

            return function (colors, duration) {
                this._colors = [];
                this._transitions = [];
                var that = this;

                // we convert the colors array into a usable form and save it is this._transition
                if (Array.isArray(colors)) {
                    var length = colors.length;
                    _.each(colors, function (c, index) {
                        that._colors.push({
                            keypoint: parseFloat(index / length),
                            color: c
                        });
                    });
                } else {
                    _.sortedIndex(colors);
                    _.each(colors, function (c, index) {
                        that._colors.push({
                            keypoint: parseFloat(index),
                            color: c
                        });
                    });
                }

                // this creates the transitions array (converting all single colors and keypoints
                // into transition objects
                for (var i = 1; i < this._colors.length; i++) {
                    this._transitions.push(new singleColorTransition(this._colors[i - 1].color, this._colors[i].color, this._colors[i].keypoint * duration / 100 - this._colors[i - 1].keypoint * duration / 100));
                }

                this._step = 0;

                // this function iterates the step counter
                // TODO: This can be improved using some momoization to record current transitions
                // TODO: so we don't have to keep searching for it
                this.step = function () {
                    return this.getColorAtStep(this._step++);
                };

                // this function will return a color at a given step
                this.getColorAtStep = function (step) {
                    var i;
                    // we find the color that is to start directly after the color at this step finishes
                    // transitioning, we know this will be our stop point
                    for (i = 0; i < this._colors.length; i++) {
                        if (this._colors[i].keypoint > step) {
                            // we decrement by 1 because we don't want the stoppoint transition, we want the one
                            // directly before it
                            i--;
                            break;
                        }
                    }

                    // we get the transition
                    var transition = this._transitions[i];

                    // we determine when this transition started (to work back the relative step)
                    var startPoint = this._colors[i].keypoint;

                    // we return the color at this transitions relative step
                    return transition.getColorAtStep(step - startPoint);
                };
            };
        }();
    }();
});

/***/ })
/******/ ]);