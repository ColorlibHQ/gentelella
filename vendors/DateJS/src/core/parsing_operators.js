(function () {
	var $P = Date.Parsing;
	var _ = $P.Operators = {
		//
		// Tokenizers
		//
		rtoken: function (r) { // regex token
			return function (s) {
				var mx = s.match(r);
				if (mx) {
					return ([ mx[0], s.substring(mx[0].length) ]);
				} else {
					throw new $P.Exception(s);
				}
			};
		},
		token: function () { // whitespace-eating token
			return function (s) {
				return _.rtoken(new RegExp("^\\s*" + s + "\\s*"))(s);
			};
		},
		stoken: function (s) { // string token
			return _.rtoken(new RegExp("^" + s));
		},

		// Atomic Operators

		until: function (p) {
			return function (s) {
				var qx = [], rx = null;
				while (s.length) {
					try {
						rx = p.call(this, s);
					} catch (e) {
						qx.push(rx[0]);
						s = rx[1];
						continue;
					}
					break;
				}
				return [ qx, s ];
			};
		},
		many: function (p) {
			return function (s) {
				var rx = [], r = null;
				while (s.length) {
					try {
						r = p.call(this, s);
					} catch (e) {
						return [ rx, s ];
					}
					rx.push(r[0]);
					s = r[1];
				}
				return [ rx, s ];
			};
		},

		// generator operators -- see below
		optional: function (p) {
			return function (s) {
				var r = null;
				try {
					r = p.call(this, s);
				} catch (e) {
					return [ null, s ];
				}
				return [ r[0], r[1] ];
			};
		},
		not: function (p) {
			return function (s) {
				try {
					p.call(this, s);
				} catch (e) {
					return [null, s];
				}
				throw new $P.Exception(s);
			};
		},
		ignore: function (p) {
			return p ?
			function (s) {
				var r = null;
				r = p.call(this, s);
				return [null, r[1]];
			} : null;
		},
		product: function () {
			var px = arguments[0],
			qx = Array.prototype.slice.call(arguments, 1), rx = [];
			for (var i = 0 ; i < px.length ; i++) {
				rx.push(_.each(px[i], qx));
			}
			return rx;
		},
		cache: function (rule) {
			var cache = {}, cache_length = 0, cache_keys = [], CACHE_MAX = Date.Config.CACHE_MAX || 100000, r = null;
			var cacheCheck = function () {
				if (cache_length === CACHE_MAX) {
					// kill several keys, don't want to have to do this all the time...
					for (var i=0; i < 10; i++) {
						var key = cache_keys.shift();
						if (key) {
							delete cache[key];
							cache_length--;
						}
					}
				}
			};
			return function (s) {
				cacheCheck();
				try {
					r = cache[s] = (cache[s] || rule.call(this, s));
				} catch (e) {
					r = cache[s] = e;
				}
				cache_length++;
				cache_keys.push(s);
				if (r instanceof $P.Exception) {
					throw r;
				} else {
					return r;
				}
			};
		},

		// vector operators -- see below
		any: function () {
			var px = arguments;
			return function (s) {
				var r = null;
				for (var i = 0; i < px.length; i++) {
					if (px[i] == null) {
						continue;
					}
					try {
						r = (px[i].call(this, s));
					} catch (e) {
						r = null;
					}
					if (r) {
						return r;
					}
				}
				throw new $P.Exception(s);
			};
		},
		each: function () {
			var px = arguments;
			return function (s) {
				var rx = [], r = null;
				for (var i = 0; i < px.length ; i++) {
					if (px[i] == null) {
						continue;
					}
					try {
						r = (px[i].call(this, s));
					} catch (e) {
						throw new $P.Exception(s);
					}
					rx.push(r[0]);
					s = r[1];
				}
				return [ rx, s];
			};
		},
		all: function () {
			var px = arguments, _ = _;
			return _.each(_.optional(px));
		},

		// delimited operators
		sequence: function (px, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			
			if (px.length === 1) {
				return px[0];
			}
			return function (s) {
				var r = null, q = null;
				var rx = [];
				for (var i = 0; i < px.length ; i++) {
					try {
						r = px[i].call(this, s);
					} catch (e) {
						break;
					}
					rx.push(r[0]);
					try {
						q = d.call(this, r[1]);
					} catch (ex) {
						q = null;
						break;
					}
					s = q[1];
				}
				if (!r) {
					throw new $P.Exception(s);
				}
				if (q) {
					throw new $P.Exception(q[1]);
				}
				if (c) {
					try {
						r = c.call(this, r[1]);
					} catch (ey) {
						throw new $P.Exception(r[1]);
					}
				}
				return [ rx, (r?r[1]:s) ];
			};
		},

		//
		// Composite Operators
		//

		between: function (d1, p, d2) {
			d2 = d2 || d1;
			var _fn = _.each(_.ignore(d1), p, _.ignore(d2));
			return function (s) {
				var rx = _fn.call(this, s);
				return [[rx[0][0], r[0][2]], rx[1]];
			};
		},
		list: function (p, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			return (p instanceof Array ?
				_.each(_.product(p.slice(0, -1), _.ignore(d)), p.slice(-1), _.ignore(c)) :
				_.each(_.many(_.each(p, _.ignore(d))), px, _.ignore(c)));
		},
		set: function (px, d, c) {
			d = d || _.rtoken(/^\s*/);
			c = c || null;
			return function (s) {
				// r is the current match, best the current 'best' match
				// which means it parsed the most amount of input
				var r = null, p = null, q = null, rx = null, best = [[], s], last = false;
				// go through the rules in the given set
				for (var i = 0; i < px.length ; i++) {

					// last is a flag indicating whether this must be the last element
					// if there is only 1 element, then it MUST be the last one
					q = null;
					p = null;
					r = null;
					last = (px.length === 1);
					// first, we try simply to match the current pattern
					// if not, try the next pattern
					try {
						r = px[i].call(this, s);
					} catch (e) {
						continue;
					}
					// since we are matching against a set of elements, the first
					// thing to do is to add r[0] to matched elements
					rx = [[r[0]], r[1]];
					// if we matched and there is still input to parse and 
					// we don't already know this is the last element,
					// we're going to next check for the delimiter ...
					// if there's none, or if there's no input left to parse
					// than this must be the last element after all ...
					if (r[1].length > 0 && ! last) {
						try {
							q = d.call(this, r[1]);
						} catch (ex) {
							last = true;
						}
					} else {
						last = true;
					}

					// if we parsed the delimiter and now there's no more input,
					// that means we shouldn't have parsed the delimiter at all
					// so don't update r and mark this as the last element ...
					if (!last && q[1].length === 0) {
						last = true;
					}


					// so, if this isn't the last element, we're going to see if
					// we can get any more matches from the remaining (unmatched)
					// elements ...
					if (!last) {
						// build a list of the remaining rules we can match against,
						// i.e., all but the one we just matched against
						var qx = [];
						for (var j = 0; j < px.length ; j++) {
							if (i !== j) {
								qx.push(px[j]);
							}
						}

						// now invoke recursively set with the remaining input
						// note that we don't include the closing delimiter ...
						// we'll check for that ourselves at the end
						p = _.set(qx, d).call(this, q[1]);

						// if we got a non-empty set as a result ...
						// (otw rx already contains everything we want to match)
						if (p[0].length > 0) {
							// update current result, which is stored in rx ...
							// basically, pick up the remaining text from p[1]
							// and concat the result from p[0] so that we don't
							// get endless nesting ...
							rx[0] = rx[0].concat(p[0]);
							rx[1] = p[1];
						}
					}

					// at this point, rx either contains the last matched element
					// or the entire matched set that starts with this element.

					// now we just check to see if this variation is better than
					// our best so far, in terms of how much of the input is parsed
					if (rx[1].length < best[1].length) {
						best = rx;
					}

					// if we've parsed all the input, then we're finished
					if (best[1].length === 0) {
						break;
					}
				}

				// so now we've either gone through all the patterns trying them
				// as the initial match; or we found one that parsed the entire
				// input string ...

				// if best has no matches, just return empty set ...
				if (best[0].length === 0) {
					return best;
				}

				// if a closing delimiter is provided, then we have to check it also
				if (c) {
					// we try this even if there is no remaining input because the pattern
					// may well be optional or match empty input ...
					try {
						q = c.call(this, best[1]);
					} catch (ey) {
						throw new $P.Exception(best[1]);
					}

					// it parsed ... be sure to update the best match remaining input
					best[1] = q[1];
				}
				// if we're here, either there was no closing delimiter or we parsed it
				// so now we have the best match; just return it!
				return best;
			};
		},
		forward: function (gr, fname) {
			return function (s) {
				return gr[fname].call(this, s);
			};
		},

		//
		// Translation Operators
		//
		replace: function (rule, repl) {
			return function (s) {
				var r = rule.call(this, s);
				return [repl, r[1]];
			};
		},
		process: function (rule, fn) {
			return function (s) {
				var r = rule.call(this, s);
				return [fn.call(this, r[0]), r[1]];
			};
		},
		min: function (min, rule) {
			return function (s) {
				var rx = rule.call(this, s);
				if (rx[0].length < min) {
					throw new $P.Exception(s);
				}
				return rx;
			};
		}
	};
	

	// Generator Operators And Vector Operators

	// Generators are operators that have a signature of F(R) => R,
	// taking a given rule and returning another rule, such as 
	// ignore, which parses a given rule and throws away the result.

	// Vector operators are those that have a signature of F(R1,R2,...) => R,
	// take a list of rules and returning a new rule, such as each.

	// Generator operators are converted (via the following _generator
	// function) into functions that can also take a list or array of rules
	// and return an array of new rules as though the function had been
	// called on each rule in turn (which is what actually happens).

	// This allows generators to be used with vector operators more easily.
	// Example:
	// each(ignore(foo, bar)) instead of each(ignore(foo), ignore(bar))

	// This also turns generators into vector operators, which allows
	// constructs like:
	// not(cache(foo, bar))
	
	var _generator = function (op) {
		function gen() {
			var args = null, rx = [], px, i;
			if (arguments.length > 1) {
				args = Array.prototype.slice.call(arguments);
			} else if (arguments[0] instanceof Array) {
				args = arguments[0];
			}
			if (args) {
				px = args.shift();
				if (px.length > 0) {
					args.unshift(px[i]);
					rx.push(op.apply(null, args));
					args.shift();
					return rx;
				}
			} else {
				return op.apply(null, arguments);
			}
		}

		return gen;
	};
	
	var gx = "optional not ignore cache".split(/\s/);
	
	for (var i = 0 ; i < gx.length ; i++) {
		_[gx[i]] = _generator(_[gx[i]]);
	}

	var _vector = function (op) {
		return function () {
			if (arguments[0] instanceof Array) {
				return op.apply(null, arguments[0]);
			} else {
				return op.apply(null, arguments);
			}
		};
	};
	
	var vx = "each any all".split(/\s/);
	
	for (var j = 0 ; j < vx.length ; j++) {
		_[vx[j]] = _vector(_[vx[j]]);
	}
	
}());