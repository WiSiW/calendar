var calendar = (function () {
	var that;

	var obj = function () {
		that = this;
        that.calendar = [];
		that.year = new Date().getFullYear();
		that.month = new Date().getMonth() + 1;
		that.day = new Date().getDate();
    	that.firstDay = 0;
		that.lunarYearArr = [
			    0x0b557, //1949
			    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
			    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
			    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
			    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
			    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
			    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
			    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
			    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
			    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
			    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
			    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
			    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
			    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
			    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
			    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
			    0x0d520 //2100
			   ];
		that.lunarMonth = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
		that.lunarDay = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿'];
		that.lunarYearArrDay = {};
		that.lunarYearArrMonth = {};
	};

	obj.prototype = {

        build: function () {
        	var lunarYearArr = that.lunarYearArr,
        		lunarYearArrDay = that.lunarYearArrDay,
        		lunarYearArrMonth = that.lunarYearArrMonth;
			for(var i in lunarYearArr){
				lunarYearArrDay[lunarYearArr[i]] = that._lunarYearDays(lunarYearArr[i]);
				lunarYearArrMonth[lunarYearArr[i]] = that._lunarYearMonths(lunarYearArr[i]);
			}
        	return that.getToday(that.year,that.month,that.sday);
        },

        // 获取今天
        getToday: function (year,month,day) {
		    that.year = year;
		    that.month = month;
		    that.day = day;
    		that.calendar = [];
		    that.firstDay = that._getFirstDay(year,month);
		    if(day !== 0) {
		        that.nowDate = year + "年" + month + "月";
		    }
		    that._buildCalendar(year,month,day);
        	that.calendar.map(function(item){
				var lc = that._getLunarDay(item.syear,item.smonth,item.sday);
				item.lyear = lc.lyear;
				item.lmonth = lc.lmonth;
				item.lday = lc.lday;
				return item;
			})
			return that.calendar;
        },

        // 跳转去年今月
        preYear:function () {
			return that.getToday(that.year-1,that.month,that.day);
        },

        // 跳转明年今月
        nextYear: function () {
			return that.getToday(that.year+1,that.month,that.day);
        },

        // 跳转上个月
        preMonth:function () {
			if(that.month == 1) {
				return that.getToday(that.year - 1,12,that.day);
			}else {
				return that.getToday(that.year,that.month - 1,that.day);
			}
        },

        // 跳转下个月
        nextMonth: function () {
			if(that.month == 12) {
				return that.getToday(that.year + 1,1,that.day);
			}else {
				return that.getToday(that.year,that.month + 1,that.day);
			}
        },

        _buildCalendar: function (year,month,day) {
        	var monthDayCount = that._getMonthDayCount(year,month),
        		preMonthDayCount = that._getMonthDayCount(year,month-1);
        	for(var i = 1;i < monthDayCount+1;i++){
        		that.calendar.push({syear:year,smonth:month,sday:i});
        	}
        	if(that.calendar.length == 35)return;
        	var preDayLength = that.firstDay-1;
        	for(var i = 0;i < preDayLength;i++){
        		that.calendar.unshift({syear:(month-1?year:year-1),smonth:(month-1 || 12),sday:preMonthDayCount-i});
        	}
        	var length = that.calendar.length;
        	if(length == 35 || length%7 == 0)return;
        	for(var i = 1;i < 43-length;i++){
        		that.calendar.push({syear:(month+1==13?year+1:year),smonth:(month+1==13?1:month+1),sday:i});
        	}
        	if(that.calendar[34].sday<7)that.calendar = that.calendar.slice(0,35);
        },

        // 判断是否是闰年
        _checkIsLeapYear: function (year) {
        	if(year%400 === 0 || (year%4 === 0 && year%100 !== 0) ) return true;
        },

        // 判断某年某月的1日是星期几
        _getFirstDay: function (year,month) {
        	var allDay = 0, y = year-1;
		    allDay = y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + 1;
		    for ( var i = 1;i < month; i++) {
		    	allDay += that._getMonthDayCount(year,i);
		    }
		    return allDay%7;
        },

        _getMonthDayCount: function (year,month) {
        	if(month==0){
        		year -= 1;
        		month = 12;
        	}
        	if(month==13){
        		year += 1;
        		month = 1;
        	}
        	switch (month) {
	            case 1: return 31; break;
	            case 2: 
	                if(that._checkIsLeapYear(year)) { return 29; }
	                else { return 28; }
	                break;
	            case 3: return 31; break;
	            case 4: return 30; break;
	            case 5: return 31; break;
	            case 6: return 30; break;
	            case 7: return 31; break;
	            case 8: return 31; break;
	            case 9: return 30; break;
	            case 10: return 31; break;
	            case 11: return 30; break;
	            case 12: return 31; break;
	        }
        },

        // 转换阴历
    	_getLunarDay: function (sy,sm,sd) {
    		var lunarYearArr = that.lunarYearArr,
    			lunarMonth = that.lunarMonth,
    			lunarDay = that.lunarDay;
    		sm -= 1;
    		// 计算与公历基准的相差天数
			// Date.UTC()返回的是距离公历1970年1月1日的毫秒数,传入的月份需要减1
			var daySpan = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;
			var ly, lm, ld;
			// 确定输出的农历年份
			for (var j = 0; j < lunarYearArr.length; j++) {
				daySpan -= that.lunarYearArrDay[lunarYearArr[j]];
				if (daySpan <= 0) {
					ly = 1949 + j;
					// 获取农历年份确定后的剩余天数
					daySpan += that.lunarYearArrDay[lunarYearArr[j]];
					break
				}
			}
			// 确定输出的农历月份
			var hasLeapMonth = that._hasLeapMonth(lunarYearArr[ly - 1949]);
			for (var k = 0; k < that.lunarYearArrMonth[lunarYearArr[ly - 1949]].length; k++) {
				daySpan -= that.lunarYearArrMonth[lunarYearArr[ly - 1949]][k];
				if (daySpan <= 0) {
					// 有闰月时，月份的数组长度会变成13，因此，当闰月月份小于等于k时，lm不需要加1
					if (hasLeapMonth && hasLeapMonth <= k) {
						if (hasLeapMonth < k) {
							lm = k;
						} else if (hasLeapMonth === k) {
							lm = '闰' + k;
						} else {
							lm = k + 1;
						}
					} else {
						lm = k + 1;
					}
					// 获取农历月份确定后的剩余天数
					daySpan += that.lunarYearArrMonth[lunarYearArr[ly - 1949]][k];
					break
				}
			}
			// 确定输出农历哪一天
			ld = daySpan;

			// 将计算出来的农历月份转换成汉字月份，闰月需要在前面加上闰字
			if (hasLeapMonth && (typeof (lm) === 'string' && lm.indexOf('闰') > -1)) {
				lm = `闰${lunarMonth[/\d/.exec(lm) - 1]}`
			} else {
				lm = lunarMonth[lm - 1];
			}

			// 将计算出来的农历年份转换为天干地支年
			ly = that._getTianGan(ly) + that._getDiZhi(ly);

			// 将计算出来的农历天数转换成汉字
			if (ld < 11) {
				ld = `${lunarDay[10]}${lunarDay[ld-1]}`
			} else if (ld > 10 && ld < 20) {
				ld = `${lunarDay[9]}${lunarDay[ld-11]}`
			} else if (ld === 20) {
				ld = `${lunarDay[1]}${lunarDay[9]}`
			} else if (ld > 20 && ld < 30) {
				ld = `${lunarDay[11]}${lunarDay[ld-21]}`
			} else if (ld === 30) {
				ld = `${lunarDay[2]}${lunarDay[9]}`
			}
			return {lyear:ly,lmonth:lm,lday:ld};
    	},

		// 计算农历年是否有闰月，参数为存储农历年的16进制
		// 农历年份信息用16进制存储，其中16进制的最后1位可以用于判断是否有闰月
		_hasLeapMonth: function (ly) {
			// 获取16进制的最后1位，需要用到&与运算符
			if (ly & 0xf) {
				return ly & 0xf
			} else {
				return false
			}
		},

		// 如果有闰月，计算农历闰月天数，参数为存储农历年的16进制
		// 农历年份信息用16进制存储，其中16进制的第1位（0x除外）可以用于表示闰月是大月还是小月
		_leapMonthDays: function (ly) {
			if (that._hasLeapMonth(ly)) {
				// 获取16进制的第1位（0x除外）
				return (ly & 0xf0000) ? 30 : 29
			} else {
				return 0
			}
		},

		// 计算农历一年的总天数，参数为存储农历年的16进制
		// 农历年份信息用16进制存储，其中16进制的第2-4位（0x除外）可以用于表示正常月是大月还是小月
		_lunarYearDays: function(ly) {
			var totalDays = 0;

			// 获取正常月的天数，并累加
			// 获取16进制的第2-4位，需要用到>>移位运算符
			for (var i = 0x8000; i > 0x8; i >>= 1) {
				var monthDays = (ly & i) ? 30 : 29;
				totalDays += monthDays;
			}
			// 如果有闰月，需要把闰月的天数加上
			if (that._hasLeapMonth(ly)) {
				totalDays += that._leapMonthDays(ly);
			}

			return totalDays
		},

		// 获取农历每个月的天数
		// 参数需传入16进制数值
		_lunarYearMonths: function(ly) {
			var monthArr = [];

			// 获取正常月的天数，并添加到monthArr数组中
			// 获取16进制的第2-4位，需要用到>>移位运算符
			for (var i = 0x8000; i > 0x8; i >>= 1) {
				monthArr.push((ly & i) ? 30 : 29);
			}
			// 如果有闰月，需要把闰月的天数加上
			var hasLeapMonth = that._hasLeapMonth(ly);
			if (hasLeapMonth) {
				monthArr.splice(hasLeapMonth, 0, that._leapMonthDays(ly));
			}

			return monthArr;
		},

		// 将农历年转换为天干，参数为农历年
		_getTianGan: function(ly) {
			var tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
			var tianGanKey = (ly - 3) % 10;
			if (tianGanKey === 0) tianGanKey = 10;
			return tianGan[tianGanKey - 1]
		},

		// 将农历年转换为地支，参数为农历年
		_getDiZhi: function(ly) {
			var diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
			var diZhiKey = (ly - 3) % 12;
			if (diZhiKey === 0) diZhiKey = 12;
			return diZhi[diZhiKey - 1]
		}
	};

	return new obj();
})()