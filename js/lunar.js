/**
 * THANGIT.COM — Vietnamese Lunar Calendar Algorithm (Lịch Âm Việt Nam)
 * Based on the astronomical formulas by Hồ Ngọc Đức (Múi giờ GMT+7)
 * 100% Client-Side • Runs Offline
 */

(function(global) {
  'use strict';

  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'];

  // Convert Gregorian Date to Julian Day Number
  function jdFromDate(d, m, y) {
    let a = Math.floor((14 - m) / 12);
    let y2 = y + 4800 - a;
    let m2 = m + 12 * a - 3;
    let jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
    if (jd < 2299161) {
      jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - 32083;
    }
    return jd;
  }

  // Convert Julian Day Number to Gregorian Date
  function jdToDate(jd) {
    let a, b, c, d, e, m, y, day;
    if (jd > 2299160) {
      let alpha = Math.floor((jd - 1867216.25) / 36524.25);
      a = jd + 1 + alpha - Math.floor(alpha / 4);
    } else {
      a = jd;
    }
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);
    day = b - d - Math.floor(30.6001 * e);
    m = e < 14 ? e - 1 : e - 13;
    y = m > 2 ? c - 4716 : c - 4715;
    return [day, m, y];
  }

  // Calculate New Moon (Điểm Sóc)
  function getNewMoonDay(k, timeZone) {
    let T = k / 1236.85;
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
    C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
    C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
    C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
    C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
    C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((M + 2 * Mpr) * dr);
    let deltat;
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.00000061 * T * T3;
    } else {
      deltat = -0.0000278 + 0.000265 * T + 0.000262 * T2;
    }
    let JdNew = Jd1 + C1 - deltat;
    return Math.floor(JdNew + 0.5 + timeZone / 24);
  }

  // Calculate Sun Longitude (Kinh độ mặt trời - Tiết khí)
  function getSunLongitude(dayNumber, timeZone) {
    let T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
    let T2 = T * T;
    let dr = Math.PI / 180;
    let M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    let L = L0 + DL;
    L = L * dr;
    L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
    return Math.floor(L / Math.PI * 6);
  }

  // Find Lunar month 11 of the year
  function getLunarMonth11(yy, timeZone) {
    let off = jdFromDate(31, 12, yy) - 2415021;
    let k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    let sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  // Convert Solar date to Lunar date
  function convertSolar2Lunar(dd, mm, yy, timeZone) {
    timeZone = timeZone || 7; // Vietnam GMT+7
    let dayNumber = jdFromDate(dd, mm, yy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yy, timeZone);
    let b11 = a11;
    let lunarYear;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarLeap = 0;
    let lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      let leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return {
      day: lunarDay,
      month: lunarMonth,
      year: lunarYear,
      isLeap: lunarLeap === 1,
      jd: dayNumber
    };
  }

  function getLeapMonthOffset(a11, timeZone) {
    let k = Math.floor((a11 - 2415021.076998695) / 29.530588853);
    let last = 0;
    let i = 1;
    let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }

  // Get Can Chi Strings
  function getCanChiYear(year) {
    let can = CAN[(year + 6) % 10];
    let chi = CHI[(year + 8) % 12];
    let conGiap = CON_GIAP[(year + 8) % 12];
    return `${can} ${chi} (${conGiap})`;
  }

  function getCanChiMonth(month, year) {
    let canYearIdx = (year + 6) % 10;
    let canIdx = (canYearIdx * 2 + month) % 10;
    let chiIdx = (month + 1) % 12;
    return `${CAN[canIdx]} ${CHI[chiIdx]}`;
  }

  function getCanChiDay(jd) {
    let can = CAN[(jd + 9) % 10];
    let chi = CHI[(jd + 1) % 12];
    let conGiap = CON_GIAP[(jd + 1) % 12];
    return `${can} ${chi} (${conGiap})`;
  }

  // Hoàng đạo / Hắc đạo calculation
  const HOANG_DAO_TABLE = {
    // Chi of month -> good days chi list
    'Tý': ['Tý', 'Sửu', 'Tỵ', 'Mùi'],
    'Sửu': ['Dần', 'Mão', 'Mùi', 'Dậu'],
    'Dần': ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],
    'Mão': ['Ngọ', 'Mùi', 'Hợi', 'Sửu'],
    'Thìn': ['Thân', 'Dậu', 'Sửu', 'Mão'],
    'Tỵ': ['Tuất', 'Hợi', 'Mão', 'Tỵ'],
    'Ngọ': ['Tý', 'Sửu', 'Tỵ', 'Mùi'],
    'Mùi': ['Dần', 'Mão', 'Mùi', 'Dậu'],
    'Thân': ['Thìn', 'Tỵ', 'Dậu', 'Hợi'],
    'Dậu': ['Ngọ', 'Mùi', 'Hợi', 'Sửu'],
    'Tuất': ['Thân', 'Dậu', 'Sửu', 'Mão'],
    'Hợi': ['Tuất', 'Hợi', 'Mão', 'Tỵ']
  };

  function getHoangDaoStatus(jd, monthChi) {
    let dayChi = CHI[(jd + 1) % 12];
    let goodList = HOANG_DAO_TABLE[monthChi] || [];
    return goodList.includes(dayChi) ? 'Hoàng Đạo (Ngày Tốt)' : 'Hắc Đạo (Bình Thường)';
  }

  // Solar Terms (24 Tiết Khí)
  const TIET_KHI = [
    'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
    'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
    'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
    'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập'
  ];

  function getTietKhi(jd, timeZone) {
    timeZone = timeZone || 7;
    let long = getSunLongitude(jd, timeZone);
    let index = Math.floor(long * 2);
    if (index >= 0 && index < 24) {
      return TIET_KHI[index];
    }
    return TIET_KHI[0];
  }

  // Expose API
  global.VietLunar = {
    convertSolar2Lunar: convertSolar2Lunar,
    getCanChiYear: getCanChiYear,
    getCanChiMonth: getCanChiMonth,
    getCanChiDay: getCanChiDay,
    getHoangDaoStatus: getHoangDaoStatus,
    getTietKhi: getTietKhi
  };

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
