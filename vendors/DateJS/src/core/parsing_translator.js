(function () {
	var $D = Date;

	var flattenAndCompact = function (ax) {
		var rx = [];
		for (var i = 0; i < ax.length; i++) {
			if (ax[i] instanceof Array) {
				rx = rx.concat(flattenAndCompact(ax[i]));
			} else {
				if (ax[i]) {
					rx.push(ax[i]);
				}
			}
		}
		return rx;
	};

	var parseMeridian = function () {
		if (this.meridian && (this.hour || this.hour === 0)) {
			if (this.meridian === "a" && this.hour > 11 && Date.Config.strict24hr){
				throw "Invalid hour and meridian combination";
			} else if (this.meridian === "p" && this.hour < 12 && Date.Config.strict24hr){
				throw "Invalid hour and meridian combination";
			} else if (this.meridian === "p" && this.hour < 12) {
				this.hour = this.hour + 12;
			} else if (this.meridian === "a" && this.hour === 12) {
				this.hour = 0;
			}
		}
	};

	var setDefaults = function () {
		var now = new Date();
		if ((this.hour || this.minute) && (!this.month && !this.year && !this.day)) {
			this.day = now.getDate();
		}

		if (!this.year) {
			this.year = now.getFullYear();
		}
		
		if (!this.month && this.month !== 0) {
			this.month = now.getMonth();
		}
		
		if (!this.day) {
			this.day = 1;
		}
		
		if (!this.hour) {
			this.hour = 0;
		}
		
		if (!this.minute) {
			this.minute = 0;
		}

		if (!this.second) {
			this.second = 0;
		}
		if (!this.millisecond) {
			this.millisecond = 0;
		}
	};

	var finishUtils = {
		getToday: function () {
			 if (this.now || "hour minute second".indexOf(this.unit) !== -1) {
				return new Date();
			} else {
				return $D.today();
			}
		},
		setDaysFromWeekday: function (today, orient){
			var gap;
			orient = orient || 1;
			this.unit = "day";
			gap = ($D.getDayNumberFromName(this.weekday) - today.getDay());
			this.days = gap ? ((gap + (orient * 7)) % 7) : (orient * 7);
			return this;
		},
		setMonthsFromMonth: function (today, orient) {
			var gap;
			orient = orient || 1;
			this.unit = "month";
			gap = (this.month - today.getMonth());
			this.months = gap ? ((gap + (orient * 12)) % 12) : (orient * 12);
			this.month = null;
			return this;
		},
		setDMYFromWeekday: function () {
			var d = Date[this.weekday]();
			this.day = d.getDate();
			if (!this.month) {
				this.month = d.getMonth();
			}
			this.year = d.getFullYear();
			return this;
		},
		setUnitValue: function (orient) {
			if (!this.value && this.operator && this.operator !== null && this[this.unit + "s"] && this[this.unit + "s"] !== null) {
				this[this.unit + "s"] = this[this.unit + "s"] + ((this.operator === "add") ? 1 : -1) + (this.value||0) * orient;
			} else if (this[this.unit + "s"] == null || this.operator != null) {
				if (!this.value) {
					this.value = 1;
				}
				this[this.unit + "s"] = this.value * orient;
			}
		},
		generateDateFromWeeks: function () {
			var weekday = (this.weekday !== undefined) ? this.weekday : "today";
			var d = Date[weekday]().addWeeks(this.weeks);
			if (this.now) {
				d.setTimeToNow();
			}
			return d;
		}
	};

	$D.Translator = {
		hour: function (s) {
			return function () {
				this.hour = Number(s);
			};
		},
		minute: function (s) {
			return function () {
				this.minute = Number(s);
			};
		},
		second: function (s) {
			return function () {
				this.second = Number(s);
			};
		},
		/* for ss.s format */
		secondAndMillisecond: function (s) {
			return function () {
				var mx = s.match(/^([0-5][0-9])\.([0-9]{1,3})/);
				this.second = Number(mx[1]);
				this.millisecond = Number(mx[2]);
			};
		},
		meridian: function (s) {
			return function () {
				this.meridian = s.slice(0, 1).toLowerCase();
			};
		},
		timezone: function (s) {
			return function () {
				var n = s.replace(/[^\d\+\-]/g, "");
				if (n.length) {
					this.timezoneOffset = Number(n);
				} else {
					this.timezone = s.toLowerCase();
				}
			};
		},
		day: function (x) {
			var s = x[0];
			return function () {
				this.day = Number(s.match(/\d+/)[0]);
				if (this.day < 1) {
					throw "invalid day";
				}
			};
		},
		month: function (s) {
			return function () {
				this.month = (s.length === 3) ? "jan feb mar apr may jun jul aug sep oct nov dec".indexOf(s)/4 : Number(s) - 1;
				if (this.month < 0) {
					throw "invalid month";
				}
			};
		},
		year: function (s) {
			return function () {
				var n = Number(s);
				this.year = ((s.length > 2) ? n :
					(n + (((n + 2000) < Date.CultureInfo.twoDigitYearMax) ? 2000 : 1900)));
			};
		},
		rday: function (s) {
			return function () {
				switch (s) {
					case "yesterday":
						this.days = -1;
						break;
					case "tomorrow":
						this.days = 1;
						break;
					case "today":
						this.days = 0;
						break;
					case "now":
						this.days = 0;
						this.now = true;
						break;
				}
			};
		},
		finishExact: function (x) {
			var d;
			x = (x instanceof Array) ? x : [x];

			for (var i = 0 ; i < x.length ; i++) {
				if (x[i]) {
					x[i].call(this);
				}
			}
			
			setDefaults.call(this);
			parseMeridian.call(this);

			if (this.day > $D.getDaysInMonth(this.year, this.month)) {
				throw new RangeError(this.day + " is not a valid value for days.");
			}

			d = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
			if (this.year < 100) {
				d.setFullYear(this.year); // means years less that 100 are process correctly. JS will parse it otherwise as 1900-1999.
			}
			if (this.timezone) {
				d.set({ timezone: this.timezone });
			} else if (this.timezoneOffset) {
				d.set({ timezoneOffset: this.timezoneOffset });
			}
			
			return d;
		},
		finish: function (x) {
			var today, expression, orient, temp;

			x = (x instanceof Array) ? flattenAndCompact(x) : [ x ];

			if (x.length === 0) {
				return null;
			}

			for (var i = 0 ; i < x.length ; i++) {
				if (typeof x[i] === "function") {
					x[i].call(this);
				}
			}
			if (this.now && !this.unit && !this.operator) {
				return new Date();
			} else {
				today = finishUtils.getToday.call(this);
			}
			
			expression = !!(this.days && this.days !== null || this.orient || this.operator);
			orient = ((this.orient === "past" || this.operator === "subtract") ? -1 : 1);

			if (this.month && this.unit === "week") {
				this.value = this.month + 1;
				delete this.month;
				delete this.day;
			}

			if ((this.month || this.month === 0) && "year day hour minute second".indexOf(this.unit) !== -1) {
				if (!this.value) {
					this.value = this.month + 1;
				}
				this.month = null;
				expression = true;
			}

			if (!expression && this.weekday && !this.day && !this.days) {
				finishUtils.setDMYFromWeekday.call(this);
			}

			if (expression && this.weekday && this.unit !== "month" && this.unit !== "week") {
				finishUtils.setDaysFromWeekday.call(this, today, orient);
			}

			if (this.weekday && this.unit !== "week" && !this.day && !this.days) {
				temp = Date[this.weekday]();
				this.day = temp.getDate();
				if (temp.getMonth() !== today.getMonth()) {
					this.month = temp.getMonth();
				}
			}

			if (this.month && this.unit === "day" && this.operator) {
				if (!this.value) {
					this.value = (this.month + 1);
				}
				this.month = null;
			}

			if (this.value != null && this.month != null && this.year != null) {
				this.day = this.value * 1;
			}

			if (this.month && !this.day && this.value) {
				today.set({ day: this.value * 1 });
				if (!expression) {
					this.day = this.value * 1;
				}
			}

			if (!this.month && this.value && this.unit === "month" && !this.now) {
				this.month = this.value;
				expression = true;
			}

			if (expression && (this.month || this.month === 0) && this.unit !== "year") {
				finishUtils.setMonthsFromMonth.call(this, today, orient);
			}

			if (!this.unit) {
				this.unit = "day";
			}

			finishUtils.setUnitValue.call(this, orient);
			parseMeridian.call(this);
			
			if ((this.month || this.month === 0) && !this.day) {
				this.day = 1;
			}

			if (!this.orient && !this.operator && this.unit === "week" && this.value && !this.day && !this.month) {
				return Date.today().setWeek(this.value);
			}

			if (this.unit === "week" && this.weeks && !this.day && !this.month) {
				return finishUtils.generateDateFromWeeks.call(this);
			}

			if (expression && this.timezone && this.day && this.days) {
				this.day = this.days;
			}

			if (expression){
				today.add(this);
			} else {
				today.set(this);
			}
			
			if (this.timezone) {
				this.timezone = this.timezone.toUpperCase();
				var offset = $D.getTimezoneOffset(this.timezone);
				var timezone;
				if (today.hasDaylightSavingTime()) {
					// lets check that we're being sane with timezone setting
					timezone = $D.getTimezoneAbbreviation(offset, today.isDaylightSavingTime());
					if (timezone !== this.timezone) {
						// bugger, we're in a place where things like EST vs EDT matters.
						if (today.isDaylightSavingTime()) {
							today.addHours(-1);
						} else {
							today.addHours(1);
						}
					}
				}
				today.setTimezoneOffset(offset);
			}

			return today;
		}
	};
}());