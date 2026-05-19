var App = {};

/* ===== UTILITIES ===== */
App.sanitize = function(str) {
  var d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
};

App.toast = function(msg, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(function() {
    t.classList.add('out');
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
};

App.showLoading = function(el, msg) {
  msg = App.sanitize(msg || 'جارٍ التحميل...');
  el.innerHTML = '<div class="hadith-loading"><i class="fa-solid fa-circle-notch"></i><p>' + msg + '</p></div>';
};

App.debounce = function(fn, delay) {
  var timer;
  return function() {
    var ctx = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
  };
};

App.formatTime = function(str) {
  if (!str) return '--:--';
  var parts = str.split(':');
  var h = parseInt(parts[0]), m = parts[1];
  var ampm = h >= 12 ? 'م' : 'ص';
  if (h > 12) h = h - 12;
  if (h === 0) h = 12;
  return h + ':' + m + ' ' + ampm;
};

/* ===== LOADER ===== */
App.loaderTips = [
  '﷽ — «اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ» سورة العلق ١',
  '«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» رواه البخاري',
  '«مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ» رواه مسلم',
  '«أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ» رواه البخاري ومسلم',
  '«الْكَيِّسُ مَنْ دَانَ نَفْسَهُ وَعَمِلَ لِمَا بَعْدَ الْمَوْتِ» رواه الترمذي',
  '«الدُّعَاءُ هُوَ الْعِبَادَةُ» رواه الترمذي',
  '«أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ» رواه الترمذي',
  '«إِنَّ اللَّهَ يُحِبُّ إِذَا عَمِلَ أَحَدُكُمْ عَمَلًا أَنْ يُتْقِنَهُ» رواه الطبراني',
  '«وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ» سورة الطلاق ٣',
  '«إِنَّ مَعَ الْعُسْرِ يُسْرًا» سورة الشرح ٦',
  '«فَاذْكُرُونِي أَذْكُرْكُمْ» سورة البقرة ١٥٢',
  '«وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ» سورة البقرة ١٩٥'
];

(function initLoader() {
  var loader = document.getElementById('pageLoader');
  if (!loader) return;
  var tipEl = document.getElementById('loaderTip');
  if (tipEl) tipEl.textContent = App.loaderTips[Math.floor(Math.random() * App.loaderTips.length)];
  window.addEventListener('load', function() {
    setTimeout(function() { loader.classList.add('hide'); }, 200);
  });
  setTimeout(function() {
    if (loader && !loader.classList.contains('hide')) loader.classList.add('hide');
  }, 3000);
})();

/* ===== SETTINGS ===== */
App.Settings = {
  defaults: {
    theme: 'default', fontSize: 'medium', zoom: 'medium', headerSize: 'medium',
    highContrast: false, reduceMotion: false, lineSpacing: false, performanceMode: false, counterSize: 'medium',
    repeatAyah: false, showTafsir: false
  },
  state: {},

  init: function() {
    this.load();
    this.bindUI();
    this.initThemeToggle();
  },

  load: function() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem('noorSettings')); } catch(e) {}
    var s = saved || this.defaults;
    var d = document.documentElement;
    d.setAttribute('data-theme', s.theme || 'default');
    d.setAttribute('data-font-size', s.fontSize || 'medium');
    d.setAttribute('data-contrast', s.highContrast ? 'high' : 'normal');
    d.setAttribute('data-motion', s.reduceMotion ? 'reduce' : 'normal');
    d.setAttribute('data-spacing', s.lineSpacing ? 'wide' : 'normal');
    d.setAttribute('data-performance', s.performanceMode ? 'on' : 'off');
    d.setAttribute('data-counter-size', s.counterSize || 'medium');
    d.setAttribute('data-zoom', s.zoom || 'medium');
    d.setAttribute('data-header-size', s.headerSize || 'medium');

    this.state = s;
  },

  save: function() {
    try { localStorage.setItem('noorSettings', JSON.stringify(this.state)); } catch(e) {}
    this.load();
  },

  bindUI: function() {
    var s = this.state;
    document.querySelectorAll('.theme-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.theme-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        App.Settings.state.theme = btn.dataset.theme;
        App.Settings.save();
      });
      if (btn.dataset.theme === s.theme) btn.classList.add('active');
    });

    document.querySelectorAll('#fontSizeGrid .size-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#fontSizeGrid .size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        App.Settings.state.fontSize = btn.dataset.size;
        App.Settings.save();
      });
      if (btn.dataset.size === s.fontSize) btn.classList.add('active');
    });

    document.querySelectorAll('#zoomGrid .size-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#zoomGrid .size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        App.Settings.state.zoom = btn.dataset.size;
        App.Settings.save();
      });
      if (btn.dataset.size === (s.zoom || 'medium')) btn.classList.add('active');
    });

    document.querySelectorAll('#headerSizeGrid .size-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#headerSizeGrid .size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        App.Settings.state.headerSize = btn.dataset.size;
        App.Settings.save();
      });
      if (btn.dataset.size === (s.headerSize || 'medium')) btn.classList.add('active');
    });

    document.querySelectorAll('#counterSizeGrid .size-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#counterSizeGrid .size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        App.Settings.state.counterSize = btn.dataset.size;
        App.Settings.save();
      });
      if (btn.dataset.size === (s.counterSize || 'medium')) btn.classList.add('active');
    });

    var toggles = { highContrast: 'highContrast', reduceMotion: 'reduceMotion', lineSpacing: 'lineSpacing', performanceMode: 'performanceMode', repeatAyah: 'repeatAyah', showTafsir: 'showTafsir' };
    Object.keys(toggles).forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.checked = s[toggles[id]] || false;
      el.addEventListener('change', function() {
        App.Settings.state[toggles[id]] = this.checked;
        App.Settings.save();
      });
    });

    var resetBtn = document.getElementById('resetSettingsBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        App.Settings.state = JSON.parse(JSON.stringify(App.Settings.defaults));
        App.Settings.save();
        document.querySelectorAll('.theme-btn').forEach(function(b) {
          b.classList.toggle('active', b.dataset.theme === App.Settings.defaults.theme);
        });
        document.querySelectorAll('.size-btn').forEach(function(b) {
          var grid = b.closest('[id]');
          if (!grid) return;
          var key = grid.id.replace('Grid', '');
          var defaults = { fontSize: 'medium', zoom: 'medium', headerSize: 'medium', counterSize: 'medium' };
          b.classList.toggle('active', b.dataset.size === defaults[key]);
        });
        ['highContrast','reduceMotion','lineSpacing','performanceMode','repeatAyah','showTafsir'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.checked = false;
        });
        App.toast('تم إعادة تعيين الإعدادات');
      });
    }
  },

  initThemeToggle: function() {
    var btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    var icon = btn.querySelector('i');
    if (icon) icon.className = this.state.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    btn.addEventListener('click', function() {
      var current = App.Settings.state.theme;
      if (current === 'default' || current === 'emerald' || current === 'sapphire' || current === 'monochrome') {
        App.Settings.state.theme = 'light';
      } else {
        App.Settings.state.theme = 'default';
      }
      App.Settings.save();
      App.Settings.syncToggleIcon();
    });
  },

  syncToggleIcon: function() {
    var btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    var icon = btn.querySelector('i');
    if (icon) icon.className = this.state.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
};

/* ===== PRAYER TIMES ===== */
App.Prayer = {
  elements: null,
  state: { timings: null, location: null, nextPrayerIndex: -1, countdownInterval: null, coords: null, city: null, country: null },

  init: function() {
    var section = document.getElementById('prayerSection');
    if (!section) return;
    this.elements = {
      section: section, location: document.getElementById('prayerLocationDisplay'),
      nextName: document.getElementById('nextPrayerName'), nextTime: document.getElementById('nextPrayerTimeDisplay'),
      countdown: document.getElementById('countdownDisplay'), hijriDate: document.getElementById('prayerHijri'),
      gregDate: document.getElementById('prayerGreg')
    };
    var saved = this.loadState();
    if (saved && saved.coords) {
      this.state.coords = saved.coords;
      this.fetchTimings(saved.coords.lat, saved.coords.lng);
      if (saved.city) this.updateLocationDisplay(saved.city);
    } else if (saved && saved.city && saved.country) {
      this.fetchTimingsByCity(saved.city, saved.country);
      this.updateLocationDisplay(saved.city + ', ' + saved.country);
    } else {
      this.detectLocation();
    }
    var changeBtn = document.getElementById('prayerChangeBtn');
    if (changeBtn) changeBtn.addEventListener('click', function() { App.Prayer.showCityPicker(); });
  },

  loadState: function() {
    try { return JSON.parse(localStorage.getItem('noorPrayerState')); } catch(e) { return null; }
  },

  saveState: function() {
    try {
      localStorage.setItem('noorPrayerState', JSON.stringify({
        coords: this.state.coords, city: this.state.city, country: this.state.country, updated: Date.now()
      }));
    } catch(e) {}
  },

  detectLocation: function() {
    if (!navigator.geolocation) { this.showCityPicker(); return; }
    this.updateLocationDisplay('جاري تحديد موقعك...');
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        App.Prayer.state.coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        App.Prayer.fetchTimings(pos.coords.latitude, pos.coords.longitude);
        App.Prayer.saveState();
      },
      function() { App.Prayer.showCityPicker(); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  },

  fetchTimings: function(lat, lng) {
    var now = new Date();
    var ts = Math.floor(now.getTime() / 1000);
    fetch('https://api.aladhan.com/v1/timings/' + ts + '?latitude=' + lat + '&longitude=' + lng + '&method=5')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.code === 200) {
          App.Prayer.state.timings = data.data.timings;
          App.Prayer.state.date = data.data.date;
          App.Prayer.render();
          App.Prayer.reverseGeocode(lat, lng);
        }
      })
      .catch(function() { App.Prayer.updateLocationDisplay('تعذر تحميل مواقيت الصلاة'); });
  },

  fetchTimingsByCity: function(city, country) {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=' + encodeURIComponent(city) + '&country=' + encodeURIComponent(country) + '&method=5')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.code === 200) {
          App.Prayer.state.timings = data.data.timings;
          App.Prayer.state.date = data.data.date;
          App.Prayer.state.city = city;
          App.Prayer.state.country = country;
          App.Prayer.render();
          App.Prayer.updateLocationDisplay(city + ', ' + country);
          App.Prayer.saveState();
        }
      })
      .catch(function() { App.Prayer.updateLocationDisplay('تعذر تحميل المواقيت'); });
  },

  reverseGeocode: function(lat, lng) {
    fetch('https://api.aladhan.com/v1/hToG?latitude=' + lat + '&longitude=' + lng)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.code === 200 && data.data) {
          var loc = data.data;
          App.Prayer.state.city = loc.city || '';
          App.Prayer.state.country = loc.country || '';
          App.Prayer.updateLocationDisplay((loc.city || '') + ', ' + (loc.country || ''));
          App.Prayer.saveState();
        }
      })
      .catch(function() {});
  },

  updateLocationDisplay: function(text) {
    var el = this.elements.location;
    if (el) el.textContent = text;
  },

  render: function() {
    if (!this.state.timings) return;
    var t = this.state.timings;
    var prayerNames = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };
    var prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    var grid = document.getElementById('prayerTimesGrid');
    if (grid) {
      grid.innerHTML = '';
      prayerOrder.forEach(function(key) {
        var item = document.createElement('div');
        item.className = 'prayer-time-item';
        item.dataset.prayer = key;
        var icons = { Fajr: 'sun', Sunrise: 'sun', Dhuhr: 'sun', Asr: 'cloud-sun', Maghrib: 'moon', Isha: 'moon' };
        item.innerHTML = '<div class="prayer-icon"><i class="fa-solid fa-' + (icons[key] || 'clock') + '"></i></div>' +
          '<span class="prayer-name">' + prayerNames[key] + '</span>' +
          '<span class="prayer-time">' + App.formatTime(t[key]) + '</span>';
        grid.appendChild(item);
      });
    }
    var now = new Date();
    var currentMinutes = now.getHours() * 60 + now.getMinutes();
    var prayerTimes = prayerOrder.map(function(key) {
      var parts = t[key].split(':');
      return { key: key, minutes: parseInt(parts[0]) * 60 + parseInt(parts[1]), name: prayerNames[key], time: t[key] };
    });
    var nextPrayer = null, nextIndex = -1;
    for (var i = 0; i < prayerTimes.length; i++) {
      if (prayerTimes[i].minutes > currentMinutes) { nextPrayer = prayerTimes[i]; nextIndex = i; break; }
    }
    if (!nextPrayer) { nextPrayer = prayerTimes[0]; nextIndex = 0; }
    this.state.nextPrayerIndex = nextIndex;
    if (this.elements.nextName) this.elements.nextName.textContent = nextPrayer.name;
    if (this.elements.nextTime) this.elements.nextTime.textContent = App.formatTime(nextPrayer.time);
    if (grid) {
      grid.querySelectorAll('.prayer-time-item').forEach(function(el) { el.classList.remove('active'); });
      var activeEl = grid.querySelector('[data-prayer="' + nextPrayer.key + '"]');
      if (activeEl) activeEl.classList.add('active');
    }
    if (this.elements.hijriDate && this.state.date) {
      var d = this.state.date.hijri;
      this.elements.hijriDate.textContent = d.day + ' ' + d.month.ar + ' ' + d.year + ' هـ';
    }
    if (this.elements.gregDate && this.state.date) {
      var g = this.state.date.gregorian;
      this.elements.gregDate.textContent = g.weekday.ar + ' — ' + g.day + ' ' + g.month.ar + ' ' + g.year + ' م';
    }
    this.startCountdown(nextPrayer);
  },

  startCountdown: function(nextPrayer) {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    var self = this;
    function tick() {
      var now = new Date();
      var target = new Date();
      var parts = nextPrayer.time.split(':');
      target.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      var diff = target - now;
      var hours = Math.floor(diff / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      var display = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
      if (self.elements.countdown) {
        self.elements.countdown.textContent = display;
        self.elements.countdown.classList.toggle('warning', diff < 600000);
      }
    }
    tick();
    this.countdownInterval = setInterval(tick, 1000);
  },

  showCityPicker: function() {
    var existing = document.querySelector('.city-picker-overlay');
    if (existing) { existing.classList.toggle('active'); return; }
    var overlay = document.createElement('div');
    overlay.className = 'city-picker-overlay';
    var cities = [
      'مكة|المملكة العربية السعودية','المدينة|المملكة العربية السعودية','الرياض|المملكة العربية السعودية','جدة|المملكة العربية السعودية',
      'القاهرة|مصر','الإسكندرية|مصر','الدار البيضاء|المغرب','الرباط|المغرب','تونس|تونس','الجزائر|الجزائر',
      'طرابلس|ليبيا','الخرطوم|السودان','عمّان|الأردن','دمشق|سوريا','بغداد|العراق','الكويت|الكويت',
      'الدوحة|قطر','أبو ظبي|الإمارات','مسقط|عُمان','صنعاء|اليمن','أنقرة|تركيا','إسطنبول|تركيا',
      'كوالالمبور|ماليزيا','جاكرتا|إندونيسيا','دكا|بنغلاديش','نيودلهي|الهند','بكين|الصين',
      'لندن|المملكة المتحدة','باريس|فرنسا','برلين|ألمانيا','روما|إيطاليا','مدريد|إسبانيا',
      'موسكو|روسيا','واشنطن|الولايات المتحدة','نيويورك|الولايات المتحدة','لوس أنجلوس|الولايات المتحدة',
      'تورونتو|كندا','سيدني|أستراليا','سنغافورة|سنغافورة','طوكيو|اليابان','كيب تاون|جنوب أفريقيا',
      'لاغوس|نيجيريا','نيروبي|كينيا','كراتشي|باكستان','كابل|أفغانستان','طهران|إيران'
    ];
    overlay.innerHTML = '<div class="city-picker-modal">' +
      '<h3>اختر مدينتك</h3>' +
      '<p>اختر المدينة الأقرب إليك للحصول على مواقيت الصلاة الدقيقة</p>' +
      '<input class="city-search-input" id="citySearchInput" type="text" placeholder="ابحث عن مدينة..." dir="rtl" autofocus>' +
      '<div class="city-list" id="cityList">' +
      cities.map(function(c) {
        var parts = c.split('|');
        return '<div class="city-item" data-city="' + parts[0] + '" data-country="' + parts[1] + '">' + parts[0] + ' <span style="color:var(--text-tertiary);font-size:11px;">(' + parts[1] + ')</span></div>';
      }).join('') +
      '</div>' +
      '<div class="city-picker-actions">' +
      '<button class="btn btn-accent" id="useLocationBtn"><i class="fa-solid fa-location-crosshairs"></i> استخدم موقعي</button>' +
      '<button class="btn btn-outline" id="closeCityPicker">إلغاء</button>' +
      '</div></div>';
    document.body.appendChild(overlay);
    setTimeout(function() { overlay.classList.add('active'); }, 10);
    overlay.querySelector('#citySearchInput').addEventListener('input', function() {
      var q = this.value.trim();
      overlay.querySelectorAll('.city-item').forEach(function(item) {
        item.style.display = (!q || item.textContent.indexOf(q) !== -1) ? 'block' : 'none';
      });
    });
    overlay.querySelectorAll('.city-item').forEach(function(item) {
      item.addEventListener('click', function() {
        App.Prayer.state.coords = null;
        App.Prayer.state.city = this.dataset.city;
        App.Prayer.state.country = this.dataset.country;
        App.Prayer.fetchTimingsByCity(this.dataset.city, this.dataset.country);
        overlay.classList.remove('active');
        setTimeout(function() { overlay.remove(); }, 300);
      });
    });
    overlay.querySelector('#useLocationBtn').addEventListener('click', function() {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.remove(); }, 300);
      App.Prayer.detectLocation();
    });
    overlay.querySelector('#closeCityPicker').addEventListener('click', function() {
      overlay.classList.remove('active');
      setTimeout(function() { overlay.remove(); }, 300);
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        setTimeout(function() { overlay.remove(); }, 300);
      }
    });
  }
};

/* ===== HEADER SCROLL EFFECT ===== */
(function initHeaderScroll() {
  var header = document.querySelector('.main-header');
  if (!header) return;
  window.addEventListener('scroll', function() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
})();

/* ===== HOME PAGE ===== */
(function initHome() {
  if (!document.getElementById('heroDate')) return;
  var now = new Date();
  var hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  var greg = now.toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  var heroDate = document.getElementById('heroDate');
  if (heroDate) heroDate.textContent = hijri + ' هـ — ' + greg;

  var surahNum = Math.floor(Math.random() * 114) + 1;
  function loadDailyVerse() {
    fetch('https://api.alquran.cloud/v1/surah/' + surahNum + '/editions/ar,en.sahih')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var verses = data.data[0].ayahs;
        var ri = Math.floor(Math.random() * verses.length);
        var ayah = verses[ri], trans = data.data[1].ayahs[ri];
        ['verseArabic','verseTranslation','verseReference'].forEach(function(id, i) {
          var el = document.getElementById(id);
          if (!el) return;
          if (i === 0) el.textContent = ayah.text;
          else if (i === 1) el.textContent = trans.text;
          else el.textContent = 'سورة ' + data.data[0].englishName + ' — الآية ' + ayah.numberInSurah;
        });
      })
      .catch(function() {
        var fbs = [
          { ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', en: 'Indeed, with hardship comes ease.', ref: 'سورة الشرح — الآية ٦' },
          { ar: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', en: 'And whoever relies upon Allah — then He is sufficient for him.', ref: 'سورة الطلاق — الآية ٣' },
          { ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', en: 'Our Lord, give us in this world good and in the Hereafter good...', ref: 'سورة البقرة — الآية ٢٠١' }
        ];
        var fb = fbs[Math.floor(Math.random() * fbs.length)];
        ['verseArabic','verseTranslation','verseReference'].forEach(function(id, i) {
          var el = document.getElementById(id);
          if (!el) return;
          if (i === 0) el.textContent = fb.ar;
          else if (i === 1) el.textContent = fb.en;
          else el.textContent = fb.ref;
        });
      });
  }
  loadDailyVerse();
  App.Prayer.init();
})();

/* ===== QURAN PAGE ===== */
(function initQuran() {
  var surahGrid = document.getElementById('surahGrid');
  var surahSearch = document.getElementById('surahSearch');
  var reciterSelect = document.getElementById('reciterSelect');
  var quranReader = document.getElementById('quranReader');
  var readerTitle = document.getElementById('readerTitle');
  var readerInfo = document.getElementById('readerInfo');
  var ayahList = document.getElementById('ayahList');
  var playBtn = document.getElementById('playBtn');
  var playIcon = document.getElementById('playIcon');
  var prevBtn = document.getElementById('prevAyahBtn');
  var nextBtn = document.getElementById('nextAyahBtn');
  var tafsirToggle = document.getElementById('tafsirToggle');
  var repeatToggle = document.getElementById('repeatToggle');

  if (!surahGrid) return;

  var allSurahs = [], currentSurah = null, currentAyahs = [], currentAudio = null;
  var currentAyahIndex = -1, isPlaying = false, isLoadingAudio = false;
  var repeatEnabled = false, showTafsir = false;
  try { var s = JSON.parse(localStorage.getItem('noorSettings')); if (s) { repeatEnabled = s.repeatAyah || false; showTafsir = s.showTafsir || false; } } catch(e) {}

  var reciters = [
    { id: 8, name: 'مشاري راشد العفاسي' }, { id: 3, name: 'عبد الرحمن السديس' },
    { id: 6, name: 'ماهر المعيقلي' }, { id: 5, name: 'سعد الغامدي' },
    { id: 7, name: 'محمد صديق المنشاوي' }, { id: 1, name: 'عبد الباسط عبد الصمد' },
    { id: 2, name: 'عبد الله بصفر' }, { id: 9, name: 'أحمد العجمي' },
    { id: 10, name: 'هزاع البلوشي' }, { id: 11, name: 'ناصر القطامي' }
  ];

  reciters.forEach(function(r) {
    var opt = document.createElement('option');
    opt.value = r.id; opt.textContent = r.name;
    reciterSelect.appendChild(opt);
  });

  var volume = 1;
  try { var sv = localStorage.getItem('noorQuranVolume'); if (sv !== null) volume = parseFloat(sv); } catch(e) {}

  if (repeatToggle) repeatToggle.checked = repeatEnabled;
  if (tafsirToggle) tafsirToggle.checked = showTafsir;

  fetch('https://api.alquran.cloud/v1/surah')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      allSurahs = data.data;
      renderSurahs(allSurahs);
    })
    .catch(function() {
      surahGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-secondary);">تعذر تحميل السور</div>';
    });

  function renderSurahs(surahs) {
    surahGrid.innerHTML = '';
    surahs.forEach(function(s) {
      var card = document.createElement('div');
      card.className = 'surah-card';
      card.dataset.number = s.number;
      card.innerHTML = '<div class="surah-number">' + s.number + '</div><div class="surah-name">' + s.name + '</div><div class="surah-name-en">' + s.englishName + '</div><div class="surah-info">' + s.revelationType + ' — ' + s.numberOfAyahs + ' آيات</div>';
      card.addEventListener('click', function() { loadSurah(s.number); });
      surahGrid.appendChild(card);
    });
  }

  if (surahSearch) {
    surahSearch.addEventListener('input', App.debounce(function() {
      var q = surahSearch.value.trim().toLowerCase();
      if (!q) { renderSurahs(allSurahs); return; }
      renderSurahs(allSurahs.filter(function(s) {
        return s.name.toLowerCase().indexOf(q) !== -1 || s.englishName.toLowerCase().indexOf(q) !== -1 || String(s.number).indexOf(q) !== -1;
      }));
    }, 200));
  }

  function loadSurah(number) {
    if (currentSurah && currentSurah.number !== number) { stopAudio(); quranReader.classList.remove('active'); }
    ayahList.innerHTML = '<div class="ayah-loading"><i class="fa-solid fa-circle-notch"></i><p>جارٍ تحميل السورة...</p></div>';
    quranReader.classList.add('active');
    fetch('https://api.alquran.cloud/v1/surah/' + number + '/editions/ar,en.sahih')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (!data.data || data.data.length < 2) throw new Error('Missing data');
        currentSurah = data.data[0];
        currentAyahs = currentSurah.ayahs;
        var translation = data.data[1].ayahs;
        readerTitle.textContent = currentSurah.name + ' — ' + currentSurah.englishName;
        readerInfo.textContent = currentSurah.numberOfAyahs + ' آيات — ' + currentSurah.revelationType;
        ayahList.innerHTML = '';
        currentAyahs.forEach(function(ayah, i) {
          var div = document.createElement('div');
          div.className = 'ayah-item';
          div.dataset.index = i;
          div.innerHTML = '<div class="ayah-number">' + ayah.numberInSurah + '</div><div class="ayah-text">' + ayah.text + '</div><div class="ayah-translation">' + translation[i].text + '</div><div class="ayah-tafsir" id="tafsir-' + i + '"></div>';
          div.addEventListener('click', function() { playAyah(i); });
          ayahList.appendChild(div);
          if (showTafsir) loadTafsir(number, ayah.numberInSurah, i);
        });
        quranReader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        playAyah(0);
      })
      .catch(function() {
        ayahList.innerHTML = '<div class="ayah-loading error"><i class="fa-solid fa-exclamation-triangle"></i><p>تعذر تحميل السورة</p></div>';
      });
  }

  function loadTafsir(surahNum, ayahNum, index) {
    fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + ayahNum + '/ar.muyassar')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var el = document.getElementById('tafsir-' + index);
        if (el && data.data && data.data.text) {
          el.textContent = 'التفسير: ' + data.data.text;
          if (showTafsir) el.classList.add('visible');
        }
      })
      .catch(function() {});
  }

  function playAyah(index) {
    if (!currentAyahs || index < 0 || index >= currentAyahs.length) return;
    stopAudio();
    if (isLoadingAudio) return;
    currentAyahIndex = index;
    isLoadingAudio = true;
    if (playBtn) playBtn.classList.add('loading');
    ayahList.querySelectorAll('.ayah-item').forEach(function(el) { el.classList.remove('playing'); });
    var ayahItem = ayahList.querySelector('[data-index="' + index + '"]');
    if (ayahItem) {
      ayahItem.classList.add('playing');
      ayahItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    tryPlayAyah(index, 0);
  }

  function tryPlayAyah(index, urlIdx) {
    urlIdx = urlIdx || 0;
    var ayah = currentAyahs[index];
    if (!ayah) return;
    var reciterId = reciterSelect.value;
    var urls = [
      'https://cdn.islamic.network/quran/audio/128/' + reciterId + '/' + ayah.number + '.mp3',
      'https://download.islamic.network/quran/audio/128/' + reciterId + '/' + ayah.number + '.mp3'
    ];
    if (urlIdx >= urls.length) {
      isLoadingAudio = false;
      if (playBtn) playBtn.classList.remove('loading');
      isPlaying = false;
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      return;
    }
    currentAudio = new Audio(urls[urlIdx]);
    currentAudio.volume = volume;
    var playTimeout = setTimeout(function() {
      if (currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
      tryPlayAyah(index, urlIdx + 1);
    }, 8000);
    currentAudio.addEventListener('canplaythrough', function() { clearTimeout(playTimeout); }, { once: true });
    currentAudio.addEventListener('ended', function() {
      isPlaying = false;
      if (playIcon) playIcon.className = 'fa-solid fa-play';
      if (repeatEnabled) {
        playAyah(currentAyahIndex);
      } else if (currentAyahIndex < currentAyahs.length - 1) {
        playAyah(currentAyahIndex + 1);
      }
    });
    currentAudio.addEventListener('error', function() {
      clearTimeout(playTimeout);
      if (currentAudio) { currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
      tryPlayAyah(index, urlIdx + 1);
    }, { once: true });
    currentAudio.play().then(function() {
      isPlaying = true;
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (playBtn) playBtn.classList.remove('loading');
      isLoadingAudio = false;
      clearTimeout(playTimeout);
    }).catch(function() {
      clearTimeout(playTimeout);
      if (currentAudio) { currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
      tryPlayAyah(index, urlIdx + 1);
    });
  }

  function stopAudio() {
    if (currentAudio) { currentAudio.pause(); currentAudio.removeAttribute('src'); currentAudio.load(); currentAudio = null; }
    isPlaying = false;
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (playBtn) playBtn.classList.remove('loading');
    isLoadingAudio = false;
  }

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      if (currentAyahIndex === -1 || !currentAudio || isLoadingAudio) return;
      if (isPlaying) { currentAudio.pause(); isPlaying = false; if (playIcon) playIcon.className = 'fa-solid fa-play'; }
      else { currentAudio.play().catch(function() {}); isPlaying = true; if (playIcon) playIcon.className = 'fa-solid fa-pause'; }
    });
  }
  if (nextBtn) nextBtn.addEventListener('click', function() { if (currentAyahIndex < currentAyahs.length - 1) playAyah(currentAyahIndex + 1); });
  if (prevBtn) prevBtn.addEventListener('click', function() { if (currentAyahIndex > 0) playAyah(currentAyahIndex - 1); });
  reciterSelect.addEventListener('change', function() { if (currentSurah) loadSurah(currentSurah.number); });

  var volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.value = volume;
    volumeSlider.addEventListener('input', function() {
      volume = parseFloat(this.value);
      localStorage.setItem('noorQuranVolume', volume);
      if (currentAudio) currentAudio.volume = volume;
    });
  }

  if (repeatToggle) {
    repeatToggle.addEventListener('change', function() {
      repeatEnabled = this.checked;
      var s = JSON.parse(localStorage.getItem('noorSettings')) || {};
      s.repeatAyah = repeatEnabled;
      localStorage.setItem('noorSettings', JSON.stringify(s));
    });
  }

  if (tafsirToggle) {
    tafsirToggle.addEventListener('change', function() {
      showTafsir = this.checked;
      var s = JSON.parse(localStorage.getItem('noorSettings')) || {};
      s.showTafsir = showTafsir;
      localStorage.setItem('noorSettings', JSON.stringify(s));
      document.querySelectorAll('.ayah-tafsir').forEach(function(el) { el.classList.toggle('visible', showTafsir); });
    });
  }
})();

/* ===== HADITH PAGE ===== */
(function initHadith() {
  var hadithBooks = document.getElementById('hadithBooks');
  var hadithContainer = document.getElementById('hadithContainer');
  var hadithSearch = document.getElementById('hadithSearch');
  var randomBtn = document.getElementById('randomHadithBtn');
  var gradeFilters = document.getElementById('gradeFilters');
  if (!hadithBooks) return;

  var books = [
    { id: 'bukhari', name: 'صحيح البخاري' }, { id: 'muslim', name: 'صحيح مسلم' },
    { id: 'abudawud', name: 'سنن أبو داود' }, { id: 'tirmidhi', name: 'سنن الترمذي' },
    { id: 'nasai', name: 'سنن النسائي' }, { id: 'ibnumajah', name: 'سنن ابن ماجه' },
    { id: 'malik', name: 'موطأ مالك' }, { id: 'musnadahmad', name: 'مسند أحمد' }
  ];

  var currentBook = 'bukhari', currentGrade = 'all', allHadiths = [];

  books.forEach(function(b) {
    var btn = document.createElement('button');
    btn.className = 'hadith-book-btn' + (b.id === currentBook ? ' active' : '');
    btn.textContent = b.name;
    btn.dataset.book = b.id;
    btn.addEventListener('click', function() {
      hadithBooks.querySelectorAll('.hadith-book-btn').forEach(function(el) { el.classList.remove('active'); });
      btn.classList.add('active');
      currentBook = b.id;
      currentGrade = 'all';
      updateGradeButtons();
      loadHadiths(currentBook);
    });
    hadithBooks.appendChild(btn);
  });

  ['all|الكل','sahih|صحيح','hasan|حسن','daif|ضعيف'].forEach(function(g) {
    var parts = g.split('|');
    var btn = document.createElement('button');
    btn.className = 'grade-btn' + (parts[0] === currentGrade ? ' active' : '');
    btn.textContent = parts[1];
    btn.dataset.grade = parts[0];
    btn.addEventListener('click', function() {
      currentGrade = parts[0];
      updateGradeButtons();
      filterHadiths();
    });
    if (gradeFilters) gradeFilters.appendChild(btn);
  });

  function updateGradeButtons() {
    if (!gradeFilters) return;
    gradeFilters.querySelectorAll('.grade-btn').forEach(function(el) {
      el.classList.toggle('active', el.dataset.grade === currentGrade);
    });
  }

  function getGradeDisplay(hadith) {
    var grade = (hadith.grade || hadith.status || '').toLowerCase();
    if (grade.indexOf('صحيح') !== -1 || grade.indexOf('sahih') !== -1) return 'sahih';
    if (grade.indexOf('حسن') !== -1 || grade.indexOf('hasan') !== -1) return 'hasan';
    if (grade.indexOf('ضعيف') !== -1 || grade.indexOf('daif') !== -1) return 'daif';
    if (hadith.book && (hadith.book.id === 'bukhari' || hadith.book.id === 'muslim')) return 'sahih';
    return '';
  }

  function loadHadiths(book) {
    App.showLoading(hadithContainer, 'جاري تحميل الأحاديث...');
    var pageNum = Math.floor(Math.random() * 8) + 1;
    fetch('https://api.hadith.gading.dev/books/' + book + '?range=' + pageNum + '-' + (pageNum + 49))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.data && data.data.length) { allHadiths = data.data; filterHadiths(); }
        else { hadithContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">لا توجد أحاديث متاحة حاليًا.</div>'; }
      })
      .catch(function() { allHadiths = getFallbackHadiths(book); filterHadiths(); });
  }

  function filterHadiths() {
    var q = hadithSearch ? hadithSearch.value.trim().toLowerCase() : '';
    var filtered = allHadiths.filter(function(h) {
      if (currentGrade !== 'all') { var g = getGradeDisplay(h); if (g !== currentGrade) return false; }
      if (q) { var text = (h.arab || h.text || '').toLowerCase(); if (text.indexOf(q) === -1) return false; }
      return true;
    });
    renderHadiths(filtered);
  }

  function renderHadiths(hadiths) {
    if (!hadiths.length) { hadithContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">لا توجد نتائج.</div>'; return; }
    hadithContainer.innerHTML = '';
    hadiths.forEach(function(h) {
      var card = document.createElement('div');
      card.className = 'hadith-card';
      var arabic = h.arab || h.text || '';
      var id = h.id || h.number || '';
      var bookName = h.book ? (h.book.name || h.book.id) : (books.filter(function(b) { return b.id === currentBook; })[0]?.name || currentBook);
      var grade = getGradeDisplay(h);
      var gradeLabels = { sahih: 'صحيح', hasan: 'حسن', daif: 'ضعيف' };
      var sanad = h.sanad || '';
      card.innerHTML = '<div class="hadith-header"><span class="hadith-book-label">' + bookName + '</span><div style="display:flex;align-items:center;gap:6px;">' +
        (grade ? '<span class="hadith-grade ' + grade + '">' + (gradeLabels[grade] || '') + '</span>' : '') +
        '<span class="hadith-number">#' + id + '</span></div></div>' +
        '<div class="hadith-text"' + (sanad ? '><span style="color:var(--text-tertiary);font-size:12px;display:block;margin-bottom:6px;">' + sanad + '</span>' : '>') + arabic + '</div>' +
        '<button class="hadith-copy-btn" data-text="' + escapeHtml(arabic) + '"><i class="fa-solid fa-copy"></i> نسخ</button>';
      hadithContainer.appendChild(card);
      var copyBtn = card.querySelector('.hadith-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          var text = this.dataset.text;
          if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { App.toast('تم نسخ الحديث'); }).catch(function() {}); }
          else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); App.toast('تم نسخ الحديث'); }
        });
      }
    });
  }

  function escapeHtml(str) { var d = document.createElement('div'); d.appendChild(document.createTextNode(str)); return d.innerHTML; }

  if (hadithSearch) hadithSearch.addEventListener('input', App.debounce(filterHadiths, 200));
  if (randomBtn) randomBtn.addEventListener('click', function() { loadHadiths(currentBook); });

  function getFallbackHadiths(book) {
    var bName = books.filter(function(b) { return b.id === book; })[0]?.name || book;
    return [
      { number: 1, id: book + '.1', book: { id: book, name: bName }, arab: 'عَنْ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ ﷺ يَقُولُ: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»', grade: 'Sahih' },
      { number: 2, id: book + '.2', book: { id: book, name: bName }, arab: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ: «مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللَّهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ الْقِيَامَةِ»', grade: 'Sahih' },
      { number: 3, id: book + '.3', book: { id: book, name: bName }, arab: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ: «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ»', grade: 'Sahih' },
      { number: 4, id: book + '.4', book: { id: book, name: bName }, arab: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ: «مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ»', grade: 'Sahih' },
      { number: 5, id: book + '.5', book: { id: book, name: bName }, arab: 'عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ ﷺ: «أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا»', grade: 'Sahih' }
    ];
  }
  loadHadiths(currentBook);
})();

/* ===== TASBIH PAGE ===== */
(function initTasbih() {
  var tasbihCircle = document.getElementById('tasbihCircle'), tasbihCount = document.getElementById('tasbihCount');
  var tasbihTarget = document.getElementById('tasbihTarget'), dhikrLabel = document.getElementById('dhikrLabel');
  var dhikrMeaning = document.getElementById('dhikrMeaning'), progressCircle = document.getElementById('progressCircle');
  var resetBtn = document.getElementById('resetTasbih');
  if (!tasbihCircle) return;

  var dhikrData = {
    subhanallah: { text: 'سُبْحَانَ اللَّهِ', meaning: 'تنزيه الله عن كل نقص' },
    alhamdulillah: { text: 'الْحَمْدُ لِلَّهِ', meaning: 'الثناء على الله بصفات الكمال' },
    allahuakbar: { text: 'اللَّهُ أَكْبَرُ', meaning: 'الله أكبر من كل شيء' },
    laillaha: { text: 'لا إِلَهَ إِلَّا اللَّهُ', meaning: 'توحيد الله وإفراده بالعبادة' },
    astaghfirullah: { text: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'طلب المغفرة من الله' },
    subhanallahwbihamdihi: { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', meaning: 'تنزيه الله مع الثناء عليه' },
    subhanallahalazim: { text: 'سُبْحَانَ اللَّهِ الْعَظِيمِ', meaning: 'تنزيه الله عن كل نقص' },
    lahawlawala: { text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', meaning: 'اعتراف بالعجز والاستعانة بالله' }
  };

  var state = { dhikr: 'subhanallah', count: 0, target: 33 };
  try { var saved = JSON.parse(localStorage.getItem('tasbihState')); if (saved) { state.dhikr = saved.dhikr || 'subhanallah'; state.count = saved.count || 0; state.target = saved.target || 33; } } catch(e) {}
  var circumference = 2 * Math.PI * 94;

  function saveState() { try { localStorage.setItem('tasbihState', JSON.stringify(state)); } catch(e) {} }

  function updateDisplay() {
    tasbihCount.textContent = state.count;
    tasbihTarget.textContent = 'من ' + state.target;
    var d = dhikrData[state.dhikr] || dhikrData.subhanallah;
    dhikrLabel.textContent = d.text;
    dhikrMeaning.textContent = d.meaning;
    var percent = Math.min(state.count / state.target, 1);
    progressCircle.style.strokeDashoffset = String(circumference * (1 - percent));
    progressCircle.style.stroke = state.count >= state.target ? 'var(--green)' : 'var(--accent)';
    tasbihCount.classList.toggle('complete', state.count >= state.target);
    document.querySelectorAll('.dhikr-btn').forEach(function(btn) { btn.classList.toggle('active', btn.dataset.dhikr === state.dhikr); });
    document.querySelectorAll('.target-btn').forEach(function(btn) { btn.classList.toggle('active', Number(btn.dataset.target) === state.target); });
  }

  tasbihCircle.addEventListener('click', function() {
    state.count += 1;
    if (navigator.vibrate) navigator.vibrate(15);
    if (state.count >= state.target) {
      state.count = state.target;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
    updateDisplay();
    saveState();
  });

  document.querySelectorAll('.dhikr-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { state.dhikr = btn.dataset.dhikr; state.count = 0; updateDisplay(); saveState(); });
  });
  document.querySelectorAll('.target-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { state.target = Number(btn.dataset.target); state.count = 0; updateDisplay(); saveState(); });
  });
  if (resetBtn) resetBtn.addEventListener('click', function() { state.count = 0; updateDisplay(); saveState(); });
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.target.matches('input, textarea, select, button')) {
      e.preventDefault();
      state.count += 1;
      if (state.count >= state.target) state.count = state.target;
      updateDisplay();
      saveState();
    }
  });
  updateDisplay();
})();

/* ===== ADHKAR PAGE ===== */
(function initAdhkar() {
  var tabsContainer = document.getElementById('adhkarTabs');
  var container = document.getElementById('adhkarContainer');
  var searchInput = document.getElementById('adhkarSearch');
  if (!tabsContainer) return;

  var adhkarData = {
    morning: [
      { group: 'القرآن الكريم', items: [
        { content: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... آية الكرسي', repeat: 1, source: 'سورة البقرة ٢٥٥', note: 'من قرأها حين يصبح حفظه الله حتى يمسي' },
        { content: 'قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', repeat: 3, source: 'سورة الإخلاص', note: 'ثلاث مرات تكفيه من كل شيء' },
        { content: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • مِن شَرِّ مَا خَلَقَ...', repeat: 3, source: 'سورة الفلق' },
        { content: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ • مَلِكِ النَّاسِ...', repeat: 3, source: 'سورة الناس' }
      ]},
      { group: 'أدعية الصباح', items: [
        { content: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', repeat: 1, source: 'رواه مسلم (٢٧٢٣)' },
        { content: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ', repeat: 1, source: 'رواه الترمذي (٣٣٩١)' },
        { content: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ... سيد الاستغفار', repeat: 1, source: 'رواه البخاري (٦٣٠٦)', note: 'من قالها موقناً حين يصبح فمات من يومه دخل الجنة' }
      ]},
      { group: 'أذكار الحفظ والتحصين', items: [
        { content: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', repeat: 3, source: 'رواه أبو داود (٥٠٨٨)', note: 'من قالها ثلاثاً لم يضره شيء حتى يمسي' },
        { content: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', repeat: 3, source: 'رواه أبو داود (٥٠٧٢)' },
        { content: 'يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ', repeat: 3, source: 'رواه النسائي (١٠٣٠)' }
      ]},
      { group: 'أذكار التسبيح', items: [
        { content: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ', repeat: 3, source: 'رواه مسلم (٢٧٢٦)' },
        { content: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', repeat: 10, source: 'رواه البخاري (٣٢٩٣)' },
        { content: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', repeat: 100, source: 'رواه مسلم (٢٧٢٢)', note: 'من قالها مائة مرة غفرت ذنوبه ولو كانت مثل زبد البحر' }
      ]}
    ],
    evening: [
      { group: 'القرآن الكريم', items: [
        { content: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... آية الكرسي', repeat: 1, source: 'سورة البقرة ٢٥٥', note: 'من قرأها حين يمسي أجر من حفظه الله حتى يصبح' },
        { content: 'قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ...', repeat: 3, source: 'سورة الإخلاص' },
        { content: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ...', repeat: 3, source: 'سورة الفلق' },
        { content: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ...', repeat: 3, source: 'سورة الناس' }
      ]},
      { group: 'أدعية المساء', items: [
        { content: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ', repeat: 1, source: 'رواه مسلم (٢٧٢٣)' },
        { content: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', repeat: 1, source: 'رواه الترمذي (٣٣٩١)' },
        { content: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ... سيد الاستغفار', repeat: 1, source: 'رواه البخاري (٦٣٠٦)', note: 'من قالها موقناً حين يمسي فمات من ليلته دخل الجنة' }
      ]},
      { group: 'أذكار الحفظ', items: [
        { content: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ', repeat: 3, source: 'رواه أبو داود (٥٠٨٨)', note: 'من قالها ثلاثاً لم يضره شيء حتى يصبح' },
        { content: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا', repeat: 3, source: 'رواه أبو داود (٥٠٧٢)' }
      ]},
      { group: 'أذكار التسبيح', items: [
        { content: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...', repeat: 10, source: 'رواه البخاري (٣٢٩٣)' },
        { content: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', repeat: 100, source: 'رواه مسلم (٢٧٢٢)' }
      ]}
    ],
    sleep: [
      { group: 'أدعية النوم', items: [
        { content: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', repeat: 1, source: 'رواه البخاري (٦٣١٢)' },
        { content: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ...', repeat: 1, source: 'رواه البخاري (٦٣١٣)', note: 'من قاله ثم مات مات على الفطرة' },
        { content: 'سُبْحَانَ اللَّهِ (٣٣) • الْحَمْدُ لِلَّهِ (٣٣) • اللَّهُ أَكْبَرُ (٣٤)', repeat: 1, source: 'رواه البخاري (٦٣١٨)' }
      ]},
      { group: 'أذكار الاستيقاظ', items: [
        { content: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', repeat: 1, source: 'رواه البخاري (٦٣٢٤)' },
        { content: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ', repeat: 1, source: 'رواه الترمذي (٣٤٠١)' }
      ]}
    ],
    general: [
      { group: 'أذكار وأدعية مأثورة', items: [
        { content: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ', repeat: 1, source: 'رواه البخاري ومسلم', note: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان' },
        { content: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', repeat: 1, source: 'رواه البخاري ومسلم', note: 'كنز من كنوز الجنة' },
        { content: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ', repeat: 3, source: 'رواه أبو داود (١٥١٧)' }
      ]},
      { group: 'الصلاة على النبي ﷺ', items: [
        { content: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ...', repeat: 1, source: 'رواه البخاري (٣٣٧٠)' }
      ]},
      { group: 'أدعية متنوعة', items: [
        { content: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا', repeat: 1, source: 'رواه ابن ماجه (٩٢٥)' },
        { content: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', repeat: 1, source: 'رواه أبو داود (١٥٢٢)' },
        { content: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', repeat: 7, source: 'سورة التوبة ١٢٩' }
      ]}
    ]
  };

  var currentTab = 'morning';

  function renderAdhkar(tab) {
    var groups = adhkarData[tab];
    if (!groups || !groups.length) { container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">لا توجد أذكار في هذا القسم.</div>'; return; }
    container.innerHTML = '';
    var itemIndex = 0;
    var filter = searchInput ? searchInput.value.trim().toLowerCase() : '';
    groups.forEach(function(group) {
      var filteredItems = filter ? group.items.filter(function(item) { return (item.content + ' ' + (item.source || '') + ' ' + (item.note || '')).toLowerCase().indexOf(filter) !== -1; }) : group.items;
      if (!filteredItems.length) return;
      var header = document.createElement('div');
      header.style.cssText = 'padding:6px 0 10px;margin-top:14px;border-bottom:1px solid var(--border);';
      header.innerHTML = '<h3 style="font-size:15px;font-weight:700;color:var(--accent);font-family:var(--font-arabic);">' + group.group + '</h3>';
      if (tab === 'morning' && groups.indexOf(group) === 0 && !filter) header.style.marginTop = '0';
      container.appendChild(header);
      filteredItems.forEach(function(item) {
        itemIndex++;
        var card = document.createElement('div');
        card.className = 'adhkar-card';
        var repeatText = item.repeat === 1 ? 'مرة' : item.repeat < 10 ? item.repeat + ' مرات' : item.repeat + ' مرة';
        card.innerHTML = '<div class="adhkar-card-header"><div style="display:flex;align-items:center;gap:8px;"><span class="adhkar-number">' + itemIndex + '</span><span class="adhkar-repeat"><i class="fa-solid fa-arrows-rotate"></i> ' + repeatText + '</span></div></div><div class="adhkar-text">' + item.content + '</div><div class="adhkar-source"><i class="fa-solid fa-bookmark"></i> ' + item.source + '</div>' + (item.note ? '<div class="adhkar-source" style="margin-top:3px;color:var(--accent);"><i class="fa-solid fa-star"></i> ' + item.note + '</div>' : '');
        container.appendChild(card);
      });
    });
  }

  tabsContainer.querySelectorAll('.adhkar-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabsContainer.querySelectorAll('.adhkar-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderAdhkar(currentTab);
    });
  });

  if (searchInput) searchInput.addEventListener('input', App.debounce(function() { renderAdhkar(currentTab); }, 200));
  renderAdhkar('morning');
})();

/* ===== DATES PAGE ===== */
(function initDates() {
  var datesContainer = document.getElementById('datesContainer');
  var hijriDisplay = document.getElementById('hijriDateDisplay');
  var gregDisplay = document.getElementById('gregDateDisplay');
  if (!datesContainer) return;

  var hijriMonthNames = ['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];

  var events = [
    { name: 'رأس السنة الهجرية', month: 1, day: 1, icon: 'fa-solid fa-calendar' },
    { name: 'عاشوراء', month: 1, day: 10, icon: 'fa-solid fa-heart', highlight: true },
    { name: 'ليلة الإسراء والمعراج', month: 7, day: 27, icon: 'fa-solid fa-mosque' },
    { name: 'النصف من شعبان', month: 8, day: 15, icon: 'fa-solid fa-calendar' },
    { name: 'بداية رمضان', month: 9, day: 1, icon: 'fa-solid fa-star', highlight: true },
    { name: 'ليلة القدر', month: 9, day: 27, icon: 'fa-solid fa-star', note: 'في العشر الأواخر' },
    { name: 'عيد الفطر', month: 10, day: 1, icon: 'fa-solid fa-hands-praying', highlight: true },
    { name: 'يوم عرفة', month: 12, day: 9, icon: 'fa-solid fa-mountain', highlight: true },
    { name: 'عيد الأضحى', month: 12, day: 10, icon: 'fa-solid fa-kaaba', highlight: true },
    { name: 'أيام التشريق', month: 12, day: 11, icon: 'fa-solid fa-calendar', note: '١١-١٣ ذو الحجة' }
  ];

  function fetchHijriDate() {
    var today = new Date();
    var url = 'https://api.aladhan.com/v1/gToH?date=' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    fetch(url).then(function(r) { return r.json(); }).then(function(data) {
      if (data.code === 200 && data.data) {
        var h = data.data.hijri;
        var hYear = parseInt(h.year), hMonth = parseInt(h.month.number), hDay = parseInt(h.day);
        if (hijriDisplay) hijriDisplay.textContent = hDay + ' ' + hijriMonthNames[hMonth - 1] + ' ' + hYear + ' هـ';
        if (gregDisplay) gregDisplay.textContent = h.gregorian.date;
        renderDates(hDay, hMonth, hYear);
      } else { fallbackRender(); }
    }).catch(function() { fallbackRender(); });
  }

  function parseGDate(dateStr) { var p = dateStr.split('-'); return new Date(parseInt(p[2]), parseInt(p[1]) - 1, parseInt(p[0])); }

  function renderDates(curDay, curMonth, curYear) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    datesContainer.innerHTML = '';
    var cards = [];
    var promises = events.map(function(ev) {
      var evYear = ev.month < curMonth || (ev.month === curMonth && ev.day <= curDay) ? curYear + 1 : curYear;
      return fetch('https://api.aladhan.com/v1/hToG?date=' + ev.day + '-' + ev.month + '-' + evYear).then(function(r) { return r.json(); }).then(function(data) {
        if (data.code !== 200 || !data.data) return null;
        var g = data.data.gregorian;
        var gDate = parseGDate(g.date);
        var diffDays = Math.ceil((gDate - now) / (1000 * 60 * 60 * 24));
        var countdownText = diffDays < 0 ? 'مضى' : diffDays === 0 ? 'اليوم' : diffDays === 1 ? 'غدًا' : 'بعد ' + diffDays + ' يوم';
        return { diffDays: Math.abs(diffDays), html: '<div class="date-card-icon"><i class="' + ev.icon + '"></i></div><div class="date-card-info"><div class="date-card-name">' + ev.name + '</div><div class="date-card-date">' + (g.weekday.ar || '') + ' — ' + g.date + ' — ' + ev.day + ' ' + hijriMonthNames[ev.month - 1] + ' ' + evYear + ' هـ' + (ev.note ? ' (' + ev.note + ')' : '') + '</div></div><div class="date-card-countdown">' + countdownText + '</div>', highlight: ev.highlight };
      }).catch(function() { return null; });
    });
    Promise.all(promises).then(function(results) {
      results.forEach(function(r) { if (r) cards.push(r); });
      cards.sort(function(a, b) { return a.diffDays - b.diffDays; });
      cards.forEach(function(c) {
        var card = document.createElement('div');
        card.className = 'date-card' + (c.highlight ? ' highlight' : '');
        card.innerHTML = c.html;
        datesContainer.appendChild(card);
      });
      if (!cards.length) datesContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">تعذر تحميل التواريخ.</div>';
    });
  }

  function fallbackRender() {
    datesContainer.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-secondary);">تعذر تحميل التواريخ. تحقق من اتصالك بالإنترنت.</div>';
    if (hijriDisplay) hijriDisplay.textContent = '--';
  }
  fetchHijriDate();
})();

/* ===== QUICK ACCESS ===== */
App.QuickAccess = {
  defaults: ['الرئيسية','القرآن','الأذكار','التسبيح'],

  init: function() {
    this.render();
    this.bindToggle();
  },

  getFavorites: function() {
    try { return JSON.parse(localStorage.getItem('noorQuickAccess')) || this.defaults; } catch(e) { return this.defaults; }
  },

  saveFavorites: function(favs) {
    try { localStorage.setItem('noorQuickAccess', JSON.stringify(favs)); } catch(e) {}
  },

  addFavorite: function(name) {
    var favs = this.getFavorites();
    if (favs.indexOf(name) === -1) { favs.push(name); this.saveFavorites(favs); this.render(); }
  },

  removeFavorite: function(name) {
    var favs = this.getFavorites().filter(function(f) { return f !== name; });
    this.saveFavorites(favs);
    this.render();
  },

  render: function() {
    var container = document.getElementById('quickAccessItems');
    if (!container) return;
    var favs = this.getFavorites();
    container.innerHTML = '';
    favs.forEach(function(name) {
      var href = name === 'الرئيسية' ? 'index.html' : name + '.html';
      var item = document.createElement('div');
      item.className = 'quick-access-item';
      item.innerHTML = '<a href="' + href + '" style="flex:1;">' + name + '</a><span class="remove-fav" data-name="' + name + '"><i class="fa-solid fa-xmark"></i></span>';
      container.appendChild(item);
    });
    container.querySelectorAll('.remove-fav').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        App.QuickAccess.removeFavorite(this.dataset.name);
      });
    });
  },

  bindToggle: function() {
    var toggle = document.getElementById('quickAccessToggle');
    var items = document.getElementById('quickAccessItems');
    if (!toggle || !items) return;
    toggle.addEventListener('click', function() {
      items.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.quick-access-panel')) items.classList.remove('open');
    });
  }
};

/* ===== COPY PROTECTION ===== */
(function initCopyProtection() {
  if (document.body.classList.contains('copy-protected')) {
    document.addEventListener('copy', function(e) {
      e.preventDefault();
      App.toast('تم تعطيل النسخ في هذه الصفحة');
    });
    document.addEventListener('contextmenu', function(e) {
      if (e.target.closest('.ayah-text') || e.target.closest('.hadith-text') || e.target.closest('.dua-arabic') || e.target.closest('.adhkar-text')) {
        e.preventDefault();
      }
    });
  }
})();

/* ===== LANGUAGE MESSAGE ===== */
(function initLanguageMessage() {
  var el = document.getElementById('languageMessage');
  if (!el) return;
  el.textContent = 'متوفر حالياً باللغة العربية — قريباً سيتم توفير دعم للغات أخرى';
})();

/* ===== MOBILE MENU ===== */
(function initMobileMenu() {
  var header = document.querySelector('.header-inner');
  if (!header) return;
  if (document.getElementById('mobileMenuBtn')) return;
  var btn = document.createElement('button');
  btn.className = 'mobile-menu-btn';
  btn.id = 'mobileMenuBtn';
  btn.setAttribute('aria-label', 'القائمة');
  btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  var nav = header.querySelector('.nav-links');
  if (!nav) return;
  header.insertBefore(btn, nav);
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    nav.classList.toggle('nav-open');
    btn.innerHTML = nav.classList.contains('nav-open') ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.main-header')) {
      nav.classList.remove('nav-open');
      btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
  var links = nav.querySelectorAll('a');
  links.forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('nav-open');
      btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
})();

/* Initialize settings and quick access on every page */
App.Settings.init();
App.QuickAccess.init();
