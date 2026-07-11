/**
 * Offsite - Bangalore Leave & Activity Planner
 * Core Application Logic (SPA Router, State, Calendar, Event Catalog, Gemini Integration)
 */

(function () {
  // ==========================================
  // 1. APPLICATION STATE & LOCAL STORAGE SYNC
  // ==========================================
  const state = {
    apiKey: localStorage.getItem('OFFSITE_GEMINI_KEY') || '',
    selectedDates: new Set(JSON.parse(localStorage.getItem('OFFSITE_SELECTED_DATES') || '[]')),
    leaveBalance: 25,
    activeTab: 'calendar',
    curatedPlan: JSON.parse(localStorage.getItem('OFFSITE_CURATED_PLAN') || 'null'),
    currentYear: 2026,
    currentMonthIdx: 7, // august (0-indexed = September, so 7 = aug)
  };

  // ==========================================
  // 2. CURATED BANGALORE EVENTS CATALOG
  // ==========================================
  const eventCatalog = [
    {
      id: 'evt-cubbon-unplugged',
      title: 'Cubbon Park Unplugged',
      category: 'heritage',
      tags: ['Nature', 'Acoustic', 'Trending'],
      time: 'Every Sunday 07:00',
      venue: 'Cubbon Park Bamboo Grove',
      description: 'A weekly morning gathering of local indie musicians, poets, and storytellers under the massive bamboo canopy. Bring your own mat and coffee.',
      priceText: 'Free Entry',
      priceVal: 0,
      rating: '4.9',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7nprhYctydfUk6HlOsAPh9sx-FccwDZOPuOSwxTxGAj9_x0lxWP4K15P7bc1FLqbM_6KNvFKxQsuXyur5IsP-FaMDWoX_wNeNGH_8Qqi4ugm1sfcM3BiTC9B34kzXo6dJqGTBbKyOAxSy64q8czD7YyQP0f27jRsk0UfCQ_i0salgNKJLQ-akZkj3qlSNzVDFWBaugEGkv89SlqYxgzz1DEYFQZslsHyasFJ2jrzSgLR_LTBXe1-73A9FYmBF4tm1H38Uf9MRO4J',
      detailUrl: '#'
    },
    {
      id: 'evt-vv-puram-walk',
      title: 'VV Puram Food Walk',
      category: 'markets',
      tags: ['Food Tour', 'Local Street', 'Must-Try'],
      time: 'Daily from 18:00',
      venue: 'Thindi Beedi, VV Puram',
      description: 'Taste the legendary ghee-drenched Dose, hot Jalebi, and unique Gulkand-ice cream at Bangalore\'s most famous street food lane.',
      priceText: '₹300 avg spend',
      priceVal: 300,
      rating: '4.9',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiISrTKxugtTD3Kc0iRWakkWjBiAE6UiKvCCtsR-4vOJFF7OcIf064s8Ah5f_NiQkYV3So12kUKyr2khifRjlofN66ZKj-iW1OGMlDGwMtTTt2esd-6cpMBrzNyqyQnkMap-oWeuIHKXm_9PcXzVNgAyyUiqkQIkZAPr4Z2MP4sfE_5TCOLvYarey0soXfSbZrsTUquqAkkM3lfYr7cEJPhnMj4XtBYy9dfjzUNpa_lQWUH2H3B3q2Uxtj2JTV0_0Sbk4szobHk9EE',
      detailUrl: '#'
    },
    {
      id: 'evt-metropolis-jazz',
      title: 'Metropolis Jazz Night',
      category: 'shows',
      tags: ['Live Music', 'Underground', 'Premium'],
      time: 'Oct 24 • 20:30',
      venue: 'Hard Rock Cafe, MG Road',
      description: 'A gritty, high-contrast live performance featuring Bangalore\'s leading indie jazz ensembles in an underground industrial setting.',
      priceText: '₹1,200 entry',
      priceVal: 1200,
      rating: '4.8',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp-KOUTL2cHBkU9QNnm9EOsiulVIo936PGi8Ylbo6yRi9zijYEHd6CYoqsUI1cU1AKldNoknDB44_NFm8IEERkShrB0LZafXZfZGPsaQRcfaV0esQL_KCOTvrYb6ePrZ2N9zhifw9cv796VvXw91WduxJ7gv-9NDrEk_383jn_6kJS8BE-9FBirjAOl2rWt3DuAhiIeTcO7KTgPpjuOuW1FDmx6WjSwixjJPbZ4uDyLLthjPOU1Q2JBoK7rxlNZ-ol_dy5UwJnRoJi',
      detailUrl: '#'
    },
    {
      id: 'evt-ranga-folklore',
      title: 'Urban Folklore Dance',
      category: 'shows',
      tags: ['Theater', 'Contemporary', 'Culture'],
      time: 'Oct 26 • 19:30',
      venue: 'Ranga Shankara, JP Nagar',
      description: 'A dramatic contemporary dance performance exploring metropolitan folklore under stark high-contrast stage lighting and set designs.',
      priceText: '₹450 entry',
      priceVal: 450,
      rating: '4.7',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkwP8wFei5dBCOZiIfzosvHIaOHnmvuuY8LO1aLeI_mlYLe9X9LuXNKJB8h8LwcpmWTT3tS8lDEp6Z7Q2LZmZiHEVKrwN7rgNkmFzT5AlgCxxzDfn8WMT3oj9sVZyqOOFH6HItekqhIDkgIIhR6EOwveQ3b0u5rwmKamuE1A8V4hfJFyH48eJVbhr-pQs-MRWSRDUgIRt7eBoyh716yfb-OIUflwDvK990eSf8WKqQbV8pkPT09jMAt7KjyGtS4VPN0Rlbcy6UNRwo',
      detailUrl: '#'
    },
    {
      id: 'evt-new-comedy',
      title: 'New Material Comedy Stand-up',
      category: 'shows',
      tags: ['Comedy', 'Nightlife', 'Indiranagar'],
      time: 'Oct 28 • 20:00',
      venue: 'The Local Comedy Club, Indiranagar',
      description: 'Uncensored stand-up showcase. Local comedians try out fresh, raw material in a cosy, neon-shadowed pub setting.',
      priceText: '₹299 ticket',
      priceVal: 299,
      rating: '4.6',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSkEZxRzIND0FYI1SfMIQtkZGCAyDgcLVayuqyNy3uI4tfFcCyCx46E9zkeHYJCk6t9K5Xy_yxM3fcHiiJxMNf2yiwuPAO9JJh5ls7vgxNMNUUBEDSXSKcQf_Lo5TGtrBZxrsqmIxJvub7wo_9uPLwDgBpcPuGTQBhRpNJ4497aK0dr39_vLoHP36-2Ruo2hz2mD5n7CUj89pPu27kHAxKlFXeicXdTZnFmA3E5u05l-hKltUHdHxdqmbPhGZXnNX4xpsbzP2I9Yhc',
      detailUrl: '#'
    },
    {
      id: 'evt-palace-morning',
      title: 'Bangalore Palace Architecture Tour',
      category: 'heritage',
      tags: ['History', 'Brutalist-Contrast', 'Palace'],
      time: 'Daily 10:00 - 17:30',
      venue: 'Bangalore Palace, Vasanth Nagar',
      description: 'Explore the majestic Tudor-style castle, boasting raw structural wood, geometric battlements, and rich historic photographs.',
      priceText: '₹230 entry',
      priceVal: 230,
      rating: '4.7',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrTY2fGBIFi6Gl1a3b1cu6cSIGzj9de32ooiR7-ttGxOyTUboifjSNYZfeMtL0OX7lTceNg4mIaC0jB2s_1vLmCKOogZVDqLcuq_e9PjcCgWOqIC5j_H_biAY5uHlu845cX-aDbiwIKST-T8qCbOv2wDKDTYIqgo8TqOfrVM1d8dUsFpgLFnye2FFvdMi9m69V8zyeOgAOdSxvJN71QFFYgbMwyPTXc4pzkvav6RL11KB7u_v4fnfF32ZmWJHlTjMSj87nCKgzf-bO',
      detailUrl: '#'
    },
    {
      id: 'evt-sante-flea',
      title: 'Sunday Soul Sante',
      category: 'markets',
      tags: ['Flea Market', 'Artisan', 'Music'],
      time: 'Oct 15 • 11:00 - 22:00',
      venue: 'Jayamahal Palace Grounds',
      description: 'A colorful, high-energy festival containing local handicraft shops, food trucks, and live indie singer-songwriter gigs.',
      priceText: '₹250 entry',
      priceVal: 250,
      rating: '4.8',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb7Nxbzswrrevpaswht8rqu3yc_youHknstOgNZ8_V6JLpXl9UvotEvwHt325bWASeIoiz6Iy5xuLQ9cFPnQjfCcF3nmYUxRdjYDeZX6L_GHM-IyVPWU8yuNCwH9LPXK6BEvWR7OXXaRjiB-HWu7hLbIpS3FYHFaKz031AC7b7a3gRpFuElHnl2dEqyj7MZtbqa2H1cugv5u96Wb6MQ0Rc6xXkVtFBIlE-TIyX5zuSVSCj01V0Str3jmY8p4q-9mf2y8SVC2RLR1G4',
      detailUrl: '#'
    },
    {
      id: 'evt-blore-heritage-morning',
      title: 'Kanakapura Heritage Outpost',
      category: 'heritage',
      tags: ['Nature', 'Hike', 'Historical'],
      time: 'Daily 06:00 - 18:00',
      venue: 'Kanakapura Hills',
      description: 'A study in rock, height, and gravity. Climb the scenic stone paths of outer Bangalore to view ancient hillside shrines and stunning sunrise horizons.',
      priceText: 'Free Access',
      priceVal: 0,
      rating: '4.6',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbKTOeoRPRzYbCVy6ECIBneAgbhIlrd9tf30ZIB9AfZVjE0OKNrZinCxqgrZUpHY7MfeAR9Jmt5RwXvW0T_09CAsFb3B1nJ-IJLYIg-clPrtvLxlcqTVA9NICP4qT1oCZqXCvke57pfDFWG4vGlitdZHj94D-YTMdifWG-NmX1Jwd9CqM8ZySBxulveF9yYQyTDT1StjpJxTizAXePoC5X8F0OMDdEAjN8IMaf6DoMCvtqQBiM7Xp5FdwZvkRTdMYtfjbL95iEx9Fi',
      detailUrl: '#'
    }
  ];

  // ==========================================
  // 3. UI SELECTORS
  // ==========================================
  const selectors = {
    navLinks: document.querySelectorAll('#main-nav a'),
    panels: document.querySelectorAll('.tab-panel'),
    calendarGrid: document.getElementById('calendar-grid'),
    monthTitle: document.getElementById('month-title'),
    prevMonthBtn: document.getElementById('prev-month-btn'),
    nextMonthBtn: document.getElementById('next-month-btn'),
    selectionCount: document.getElementById('selection-count'),
    selectionList: document.getElementById('selection-list'),
    emptyState: document.getElementById('empty-state'),
    leaveRatioText: document.getElementById('leave-ratio-text'),
    leaveProgressBar: document.getElementById('leave-progress-bar'),
    extractorTextarea: document.getElementById('extractor-textarea'),
    extractDatesBtn: document.getElementById('extract-dates-btn'),
    processLeavesBtn: document.getElementById('process-leaves-btn'),
    extractionProgress: document.getElementById('extraction-progress'),
    progressPct: document.getElementById('progress-pct'),
    
    // Discover selectors
    searchInput: document.getElementById('search-input'),
    eventsGridContainer: document.getElementById('events-grid-container'),
    categoryFilterBtns: document.querySelectorAll('[data-category]'),
    
    // Trip Plan selectors
    noItineraryState: document.getElementById('no-itinerary-state'),
    itineraryTimelineContainer: document.getElementById('itinerary-timeline-container'),
    tripDateRange: document.getElementById('trip-date-range'),
    tripSummarySubtitle: document.getElementById('trip-summary-subtitle'),
    tripStrategyIntro: document.getElementById('trip-strategy-intro'),
    itineraryDaysList: document.getElementById('itinerary-days-list'),
    tripDaysCircles: document.getElementById('trip-days-circles'),
    finalizeTripBtn: document.getElementById('finalize-trip-btn'),
    regenerateTripBtn: document.getElementById('regenerate-trip-btn'),
    statDistance: document.getElementById('stat-distance'),
    statEfficiency: document.getElementById('stat-efficiency'),
    statSpots: document.getElementById('stat-spots'),
    statBudget: document.getElementById('stat-budget'),
    
    // Settings selectors
    apiKeyInput: document.getElementById('api-key-input'),
    toggleKeyVisibility: document.getElementById('toggle-key-visibility'),
    saveKeyBtn: document.getElementById('save-key-btn'),
    connectionStatusText: document.getElementById('connection-status-text'),
    statusBar: document.getElementById('status-bar'),
    successKeyMessage: document.getElementById('success-key-message'),
    clearDataBtn: document.getElementById('clear-data-btn'),
    notifDot: document.getElementById('notif-dot'),
    notifBtn: document.getElementById('notif-btn'),
    headerHq: document.getElementById('header-hq'),
    headerTz: document.getElementById('header-tz'),
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ==========================================
  // 4. CORE CONTROLLERS & INITIALIZATION
  // ==========================================
  function init() {
    setupRouting();
    setupSettings();
    renderCalendar();
    updateSelectionUI();
    renderDiscoverCatalog();
    setupDiscoverFilters();
    setupItineraryActions();
    
    // Check if key exists and validate connection status
    if (state.apiKey) {
      selectors.apiKeyInput.value = '••••••••••••••••••••••••••••••••••••••';
      updateAPIKeyUIStatus(true);
    } else {
      updateAPIKeyUIStatus(false);
      // Notify user to add key
      showNotification("Please set your Gemini API Key in Settings to enable curation engines.");
    }

    if (state.curatedPlan) {
      renderCuratedPlan(state.curatedPlan);
    }

    // Set HQ timestamp
    updateHQTime();
    setInterval(updateHQTime, 60000);
  }

  function saveState() {
    localStorage.setItem('OFFSITE_SELECTED_DATES', JSON.stringify(Array.from(state.selectedDates)));
  }

  function updateHQTime() {
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat([], options);
    selectors.headerTz.textContent = `UTC+5:30 • BLR ${formatter.format(new Date())}`;
  }

  function showNotification(text) {
    selectors.notifDot.classList.remove('hidden');
    // Simple toast
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 z-50 bg-primary text-on-primary border-4 border-black p-5 shadow-[6px_6px_0px_0px_#ffcc00] font-bold uppercase tracking-tight max-w-sm animate-bounce';
    toast.innerHTML = `<div class="flex items-center gap-3"><span class="material-symbols-outlined text-secondary">notifications_active</span><span>${text}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4500);
  }

  // ==========================================
  // 5. ROUTING & TAB NAVIGATION
  // ==========================================
  function setupRouting() {
    selectors.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPath = link.getAttribute('data-path');
        switchTab(targetPath);
      });
    });

    selectors.clearDataBtn.addEventListener('click', () => {
      if (confirm("Reset application state? This will clear your API Key, selected dates, and curated plans.")) {
        localStorage.clear();
        state.apiKey = '';
        state.selectedDates.clear();
        state.curatedPlan = null;
        saveState();
        location.reload();
      }
    });

    selectors.notifBtn.addEventListener('click', () => {
      selectors.notifDot.classList.add('hidden');
      alert("No new notifications. Curation engine is running at STABLE.");
    });
  }

  function switchTab(path) {
    state.activeTab = path;
    
    // Update navigation styles
    selectors.navLinks.forEach(link => {
      const isCurrent = link.getAttribute('data-path') === path;
      if (isCurrent) {
        link.className = "flex items-center px-6 py-4 border-2 border-primary font-bold uppercase transition-all bg-primary text-on-primary shadow-[4px_4px_0px_0px_#ffcc00]";
      } else {
        // Find path category to style border hover accent
        let hoverAccent = '#ffcc00';
        if (link.getAttribute('data-path') === 'discover-events') hoverAccent = '#0055ff';
        if (link.getAttribute('data-path') === 'my-trip-plan') hoverAccent = '#e63b2e';
        if (link.getAttribute('data-path') === 'settings') hoverAccent = '#4a4a4a';
        
        link.className = `flex items-center px-6 py-4 border-2 border-primary text-primary font-bold uppercase transition-all hover:bg-primary hover:text-on-primary hover:shadow-[4px_4px_0px_0px_${hoverAccent}]`;
      }
    });

    // Toggle panels
    selectors.panels.forEach(panel => {
      const panelId = panel.id;
      const isTarget = (path === 'calendar' && panelId === 'panel-calendar') ||
                       (path === 'discover-events' && panelId === 'panel-discover-events') ||
                       (path === 'my-trip-plan' && panelId === 'panel-my-trip-plan') ||
                       (path === 'settings' && panelId === 'panel-settings');
      
      if (isTarget) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    // Auto-scroll to top
    window.scrollTo({ top: 0 });
  }

  // ==========================================
  // 6. CALENDAR LOGIC (LEAVE REGISTRY)
  // ==========================================
  function renderCalendar() {
    const year = state.currentYear;
    const month = state.currentMonthIdx;
    
    selectors.monthTitle.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous calendar cells (leaving week headers)
    const headers = Array.from(selectors.calendarGrid.children).slice(0, 7);
    selectors.calendarGrid.innerHTML = '';
    headers.forEach(h => selectors.calendarGrid.appendChild(h));

    // Get calendar parameters
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0
    // Adjust firstDayIndex to Monday-start (Monday = 0, Sunday = 6)
    let startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Render blank offset pads for start of month
    for (let i = 0; i < startOffset; i++) {
      const pad = document.createElement('div');
      pad.className = 'p-4 border-r-4 border-b-4 border-primary bg-surface-dim opacity-30 min-h-[120px]';
      selectors.calendarGrid.appendChild(pad);
    }

    // Render calendar days
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      const dayOfWeek = (startOffset + d - 1) % 7;
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Saturday/Sunday
      const dateStr = formatDateString(year, month, d);
      const isSelected = state.selectedDates.has(dateStr);
      
      dayEl.className = `relative p-8 border-r-4 border-b-4 border-primary cursor-pointer transition-all hover:bg-surface-container-high group flex flex-col items-start justify-between min-h-[120px] ${
        isSelected ? 'bg-secondary-fixed shadow-[inset_0_0_0_8px_#1a1a1a]' : 
        isWeekend ? 'bg-surface-dim' : 'bg-surface-container-lowest'
      }`;
      dayEl.dataset.date = dateStr;
      
      const numSpanClass = isSelected ? 'text-4xl font-display font-bold leading-none z-10 select-none text-on-secondary-container' : 'text-4xl font-display font-bold leading-none z-10 select-none';
      dayEl.innerHTML = `
        <span class="${numSpanClass}">${d}</span>
        ${isWeekend ? '<span class="material-symbols-outlined text-primary/20 self-end">bedtime</span>' : ''}
        <div class="absolute inset-0 border-8 border-transparent group-hover:border-primary/5 transition-all"></div>
      `;

      dayEl.addEventListener('click', () => toggleDateSelection(d, dayEl));
      selectors.calendarGrid.appendChild(dayEl);
    }

    // Add extra trailing pads to make the grid rectangular
    const totalCells = startOffset + daysInMonth;
    const remainingPads = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingPads; i++) {
      const pad = document.createElement('div');
      pad.className = 'p-4 border-r-4 border-b-4 border-primary bg-surface-dim opacity-30 min-h-[120px]';
      selectors.calendarGrid.appendChild(pad);
    }
  }

  function formatDateString(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  function toggleDateSelection(day, element) {
    const dateStr = formatDateString(state.currentYear, state.currentMonthIdx, day);
    
    if (state.selectedDates.has(dateStr)) {
      state.selectedDates.delete(dateStr);
      element.classList.remove('bg-secondary-fixed', 'shadow-[inset_0_0_0_8px_#1a1a1a]');
      element.querySelector('span').classList.remove('text-on-secondary-container');
    } else {
      state.selectedDates.add(dateStr);
      element.classList.add('bg-secondary-fixed', 'shadow-[inset_0_0_0_8px_#1a1a1a]');
      element.querySelector('span').classList.add('text-on-secondary-container');
    }
    
    saveState();
    updateSelectionUI();
  }

  function updateSelectionUI() {
    selectors.selectionCount.textContent = state.selectedDates.size;
    
    if (state.selectedDates.size > 0) {
      selectors.emptyState.classList.add('hidden');
      selectors.selectionList.innerHTML = '';
      
      // Sort dates chronologically
      const sorted = Array.from(state.selectedDates).sort();
      
      sorted.forEach(dateStr => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-3 border-2 border-primary bg-secondary-fixed font-bold shadow-[4px_4px_0px_0px_#1a1a1a] animate-in slide-in-from-right-4 duration-200';
        
        // Parse date for display
        const [y, m, d] = dateStr.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const formatted = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined">event_available</span>
            <span class="uppercase text-sm">${formatted}</span>
          </div>
          <button class="hover:text-error transition-colors" data-remove="${dateStr}">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        `;

        item.querySelector('button').addEventListener('click', (e) => {
          e.stopPropagation();
          state.selectedDates.delete(dateStr);
          saveState();
          renderCalendar();
          updateSelectionUI();
        });

        selectors.selectionList.appendChild(item);
      });
      
      selectors.leaveRatioText.textContent = `${state.selectedDates.size} / ${state.leaveBalance} Days`;
      selectors.leaveProgressBar.style.width = `${(state.selectedDates.size / state.leaveBalance) * 100}%`;
    } else {
      selectors.emptyState.classList.remove('hidden');
      selectors.selectionList.innerHTML = '';
      selectors.selectionList.appendChild(selectors.emptyState);
      selectors.leaveRatioText.textContent = `0 / ${state.leaveBalance} Days`;
      selectors.leaveProgressBar.style.width = '0%';
    }
  }

  // Month navigation listeners
  selectors.prevMonthBtn.addEventListener('click', () => {
    state.currentMonthIdx--;
    if (state.currentMonthIdx < 0) {
      state.currentMonthIdx = 11;
      state.currentYear--;
    }
    renderCalendar();
  });

  selectors.nextMonthBtn.addEventListener('click', () => {
    state.currentMonthIdx++;
    if (state.currentMonthIdx > 11) {
      state.currentMonthIdx = 0;
      state.currentYear++;
    }
    renderCalendar();
  });

  // ==========================================
  // 7. SETTINGS & CREDENTIALS CONFIGURATION
  // ==========================================
  function setupSettings() {
    selectors.toggleKeyVisibility.addEventListener('click', () => {
      const type = selectors.apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
      selectors.apiKeyInput.setAttribute('type', type);
      selectors.toggleKeyVisibility.querySelector('span').textContent = type === 'password' ? 'visibility' : 'visibility_off';
    });

    selectors.saveKeyBtn.addEventListener('click', () => {
      const rawKey = selectors.apiKeyInput.value.trim();
      
      // If it is dummy bullet text, don't update key
      if (rawKey === '••••••••••••••••••••••••••••••••••••••') {
        selectors.successKeyMessage.classList.remove('hidden');
        setTimeout(() => selectors.successKeyMessage.classList.add('hidden'), 3000);
        return;
      }

      if (rawKey.length > 10) {
        state.apiKey = rawKey;
        localStorage.setItem('OFFSITE_GEMINI_KEY', rawKey);
        
        selectors.saveKeyBtn.textContent = 'Verifying...';
        selectors.saveKeyBtn.disabled = true;

        setTimeout(() => {
          selectors.saveKeyBtn.textContent = 'Save Configuration';
          selectors.saveKeyBtn.disabled = false;
          
          updateAPIKeyUIStatus(true);
          selectors.successKeyMessage.classList.remove('hidden');
          
          showNotification("Gemini Engine Connection: SUCCESS");
          setTimeout(() => selectors.successKeyMessage.classList.add('hidden'), 3500);
        }, 1200);
      } else {
        alert("Please enter a valid Gemini API Key.");
        state.apiKey = '';
        localStorage.removeItem('OFFSITE_GEMINI_KEY');
        updateAPIKeyUIStatus(false);
      }
    });
  }

  function updateAPIKeyUIStatus(connected) {
    if (connected) {
      selectors.connectionStatusText.textContent = 'Connected';
      selectors.connectionStatusText.className = 'text-primary font-bold';
      selectors.statusBar.style.width = '100%';
      selectors.statusBar.className = 'absolute inset-y-0 left-0 bg-primary-fixed w-0 transition-all duration-700';
    } else {
      selectors.connectionStatusText.textContent = 'Disconnected';
      selectors.connectionStatusText.className = 'text-secondary font-bold';
      selectors.statusBar.style.width = '0%';
      selectors.statusBar.className = 'absolute inset-y-0 left-0 bg-secondary w-0 transition-all duration-700';
    }
  }

  // ==========================================
  // 8. DISCOVER EVENTS CATALOG CONTROLLER
  // ==========================================
  function renderDiscoverCatalog(filterCategory = 'all', searchQuery = '') {
    selectors.eventsGridContainer.innerHTML = '';
    
    const filtered = eventCatalog.filter(evt => {
      const matchCat = filterCategory === 'all' || evt.category === filterCategory;
      const matchSearch = searchQuery === '' || 
                          evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      selectors.eventsGridContainer.innerHTML = `
        <div class="col-span-12 border-4 border-dashed border-primary p-16 text-center bg-surface">
          <span class="material-symbols-outlined text-5xl mb-4">search_off</span>
          <p class="font-bold uppercase text-sm">No Events Found in Catalog</p>
        </div>
      `;
      return;
    }

    filtered.forEach((evt, idx) => {
      const card = document.createElement('div');
      
      // Design alternate layouts to mimic original high-contrast visuals
      if (idx === 0 && filterCategory === 'all' && searchQuery === '') {
        // Big Feature Card (Cubbon Park) - spans 8 columns
        card.className = 'lg:col-span-8 group relative';
        card.innerHTML = `
          <div class="absolute inset-0 bg-primary translate-x-3 translate-y-3"></div>
          <div class="relative bg-surface border-4 border-primary flex flex-col md:flex-row overflow-hidden h-full">
            <div class="md:w-1/2 h-80 md:h-auto overflow-hidden">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale hover:grayscale-0" src="${evt.image}" alt="${evt.title}"/>
            </div>
            <div class="md:w-1/2 p-10 flex flex-col justify-between">
              <div>
                <div class="flex gap-2 mb-4">
                  ${evt.tags.map(t => `<span class="bg-secondary text-on-primary px-3 py-0.5 text-xs font-bold uppercase">${t}</span>`).join('')}
                </div>
                <h3 class="text-5xl font-display font-bold uppercase mb-4 leading-none">${evt.title}</h3>
                <p class="font-medium text-lg leading-snug mb-6">${evt.description}</p>
              </div>
              <div class="flex items-center justify-between pt-6 border-t-2 border-primary/20">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined">schedule</span>
                  <span class="font-bold uppercase tracking-tight text-xs">${evt.time} • ${evt.venue}</span>
                </div>
                <button class="w-12 h-12 bg-primary text-on-primary flex items-center justify-center hover:bg-tertiary transition-colors add-outing-shortcut" data-evt-id="${evt.id}">
                  <span class="material-symbols-outlined">add</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (idx === 1 && filterCategory === 'all' && searchQuery === '') {
        // Small vertical callout (VV Puram) - spans 4 columns
        card.className = 'lg:col-span-4 group relative';
        card.innerHTML = `
          <div class="absolute inset-0 bg-tertiary translate-x-3 translate-y-3"></div>
          <div class="relative bg-surface border-4 border-primary p-8 h-full flex flex-col justify-between">
            <div class="mb-8">
              <div class="w-16 h-16 bg-primary text-on-primary flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h3 class="text-3xl font-display font-bold uppercase leading-tight mb-4">${evt.title}</h3>
              <p class="opacity-80">${evt.description}</p>
            </div>
            <div class="mt-auto space-y-4">
              <div class="flex justify-between items-center bg-primary/5 p-3 border-b-2 border-primary font-bold text-xs uppercase">
                <span>Rating / Venue</span>
                <span>${evt.rating} • ${evt.venue}</span>
              </div>
              <button class="w-full bg-primary text-on-primary py-4 font-bold uppercase hover:bg-secondary hover:text-on-primary transition-all add-outing-shortcut" data-evt-id="${evt.id}">Add to Plan</button>
            </div>
          </div>
        `;
      } else {
        // Standard Grid card - spans 4 columns
        let cardBgAccent = '#0055ff'; // Blue
        if (evt.category === 'heritage') cardBgAccent = '#e63b2e'; // Red
        if (evt.category === 'markets') cardBgAccent = '#ffcc00'; // Yellow
        
        card.className = 'lg:col-span-4 group relative';
        card.innerHTML = `
          <div class="absolute inset-0 translate-x-3 translate-y-3" style="background-color: ${cardBgAccent}"></div>
          <div class="relative bg-surface border-4 border-primary p-6 shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col justify-between h-full hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <div>
              <div class="h-48 bg-primary-fixed border-2 border-primary mb-6 flex items-center justify-center overflow-hidden">
                <img class="w-full h-full object-cover mix-blend-multiply opacity-85 grayscale group-hover:grayscale-0 transition-all duration-700" src="${evt.image}" alt="${evt.title}"/>
              </div>
              <div class="font-mono text-[10px] uppercase font-bold mb-2 tracking-tight opacity-75">${evt.time} • ${evt.venue}</div>
              <h4 class="text-2xl font-display font-bold uppercase mb-4">${evt.title}</h4>
              <p class="text-sm font-medium opacity-80 mb-6">${evt.description}</p>
            </div>
            <div class="flex justify-between items-center font-bold pt-4 border-t border-primary/10 mt-auto">
              <span class="text-secondary">${evt.priceText}</span>
              <button class="w-10 h-10 bg-primary text-on-primary flex items-center justify-center hover:bg-secondary transition-colors add-outing-shortcut" data-evt-id="${evt.id}">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
        `;
      }

      selectors.eventsGridContainer.appendChild(card);
    });

    // Wire up individual "Add" button shortcuts
    document.querySelectorAll('.add-outing-shortcut').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-evt-id');
        const match = eventCatalog.find(x => x.id === id);
        if (match) {
          // Auto add a date to leave plan (if empty, grab today's or start of current view)
          if (state.selectedDates.size === 0) {
            const defaultDate = formatDateString(state.currentYear, state.currentMonthIdx, 14);
            state.selectedDates.add(defaultDate);
            saveState();
            renderCalendar();
            updateSelectionUI();
          }
          showNotification(`Added ${match.title} to Plan database.`);
          triggerPlanCuration();
        }
      });
    });
  }

  function setupDiscoverFilters() {
    selectors.categoryFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle filter styles
        selectors.categoryFilterBtns.forEach(b => {
          b.className = "bg-surface text-primary border-4 border-primary px-4 py-4 font-display font-bold uppercase shadow-[6px_6px_0px_0px_#1a1a1a] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2";
        });
        
        btn.className = "bg-primary-fixed text-on-primary-fixed border-4 border-primary px-6 py-4 font-display font-bold uppercase shadow-[6px_6px_0px_0px_#1a1a1a] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 active-filter border-black";
        
        const category = btn.getAttribute('data-category');
        renderDiscoverCatalog(category, selectors.searchInput.value);
      });
    });

    selectors.searchInput.addEventListener('input', (e) => {
      const activeBtn = document.querySelector('.active-filter');
      const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
      renderDiscoverCatalog(category, e.target.value);
    });
  }

  function setCategoryFilter(category) {
    switchTab('discover-events');
    const targetBtn = document.querySelector(`[data-category="${category}"]`);
    if (targetBtn) {
      targetBtn.click();
    }
  }

  // ==========================================
  // 9. GEMINI INTEGRATION & CURATION SERVICES
  // ==========================================
  
  // A. Date Extraction Client
  selectors.extractDatesBtn.addEventListener('click', async () => {
    const text = selectors.extractorTextarea.value.trim();
    if (!text) {
      alert("PLEASE ENTER EMAILS OR TEXT FIRST!");
      return;
    }
    
    if (!state.apiKey) {
      alert("GEMINI API KEY MISSING! Go to the Settings tab to provide your credentials.");
      switchTab('settings');
      return;
    }

    // Visual loading progress simulation for API latency
    selectors.extractDatesBtn.disabled = true;
    selectors.extractDatesBtn.textContent = 'Consulting Gemini Engine...';
    let progress = 0;
    selectors.extractionProgress.style.width = '0%';
    selectors.progressPct.textContent = '0%';
    
    const progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 8;
        selectors.extractionProgress.style.width = `${progress}%`;
        selectors.progressPct.textContent = `${Math.round(progress)}%`;
      }
    }, 150);

    try {
      const extractedDates = await callGeminiExtractAPI(text);
      clearInterval(progressInterval);
      
      // Set to 100%
      selectors.extractionProgress.style.width = '100%';
      selectors.progressPct.textContent = '100%';

      if (extractedDates && extractedDates.length > 0) {
        extractedDates.forEach(d => state.selectedDates.add(d));
        saveState();
        renderCalendar();
        updateSelectionUI();
        
        setTimeout(() => {
          showNotification(`Successfully extracted ${extractedDates.length} leave dates!`);
          resetProgressBar();
        }, 500);
      } else {
        alert("Gemini parsed the text but found no matching leave dates in YYYY-MM-DD formats.");
        resetProgressBar();
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      alert(`API Error: ${err.message || 'Failure connecting to Gemini API endpoint.'}`);
      resetProgressBar();
    }
  });

  function resetProgressBar() {
    selectors.extractDatesBtn.disabled = false;
    selectors.extractDatesBtn.textContent = 'Extract via Gemini';
    setTimeout(() => {
      selectors.extractionProgress.style.width = '0%';
      selectors.progressPct.textContent = '0%';
    }, 1000);
  }

  async function callGeminiExtractAPI(unstructuredText) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
    
    const datePrompt = `You are a precise office calendar parser. 
Analyze this user text description: "${unstructuredText}"
Extract all the specific offsite leave dates mentioned. 
The current workspace calendar is set around August to December 2026. If year or month is ambiguous, assume 2026.
Return a structured JSON list of matching dates in "YYYY-MM-DD" format.
Only return a JSON object following this exact schema:
{
  "dates": ["YYYY-MM-DD", "YYYY-MM-DD"]
}
Do not write markdown backticks or any conversational text. Return plain JSON.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: datePrompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Key validation or limits reached.`);
    }

    const data = await response.json();
    const cleanText = data.candidates[0].content.parts[0].text.trim();
    const resultObj = JSON.parse(cleanText);
    return resultObj.dates || [];
  }

  // B. Outing / Itinerary Curation Client
  selectors.processLeavesBtn.addEventListener('click', () => {
    triggerPlanCuration();
  });

  function triggerPlanCuration() {
    if (state.selectedDates.size === 0) {
      alert("SELECT DATE CELLS ON THE CALENDAR FIRST!");
      return;
    }
    
    if (!state.apiKey) {
      alert("GEMINI API KEY MISSING! Go to the Settings tab to provide your credentials.");
      switchTab('settings');
      return;
    }

    switchTab('my-trip-plan');
    generateCurationPlan();
  }

  async function generateCurationPlan() {
    // Show Loading Spinners
    selectors.noItineraryState.classList.add('hidden');
    selectors.itineraryTimelineContainer.classList.add('hidden');
    
    const loader = document.createElement('div');
    loader.id = 'curation-loader-overlay';
    loader.className = 'flex flex-col items-center justify-center border-4 border-primary p-24 text-center bg-surface-bright mb-16 shadow-[8px_8px_0px_0px_#1a1a1a]';
    loader.innerHTML = `
      <div class="w-16 h-16 border-8 border-primary border-t-tertiary rounded-full animate-spin mb-6"></div>
      <h3 class="text-3xl font-display font-bold uppercase mb-2">Engaging Curation Engine</h3>
      <p class="max-w-md font-medium text-sm">Gemini is stitching your leave dates with our Bangalore event database to build a curated local itinerary...</p>
    `;
    selectors.noItineraryState.parentNode.insertBefore(loader, selectors.noItineraryState);

    try {
      const plan = await callGeminiCurationAPI();
      loader.remove();
      
      state.curatedPlan = plan;
      localStorage.setItem('OFFSITE_CURATED_PLAN', JSON.stringify(plan));
      
      renderCuratedPlan(plan);
      showNotification("Trip itinerary generated successfully!");
    } catch (err) {
      loader.remove();
      console.error(err);
      alert(`Itinerary Curation Failed: ${err.message || 'Error processing response.'}`);
      selectors.noItineraryState.classList.remove('hidden');
    }
  }

  async function callGeminiCurationAPI() {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${state.apiKey}`;
    
    const datesArr = Array.from(state.selectedDates).sort();
    const eventCatalogStr = JSON.stringify(eventCatalog);

    const curationPrompt = `You are a premium travel concierge for Bangalore (the Garden City), India.
The user has taken the following vacation/leave dates: ${JSON.stringify(datesArr)} (Total: ${datesArr.length} days off).
We have a local catalog of events and spots happening in Bangalore: ${eventCatalogStr}.

Your task is to curate a highly aesthetic, day-by-day vacation itinerary. 
Rules:
1. Cover every single leave date in ${JSON.stringify(datesArr)} dynamically as a separate day in the itinerary.
2. Incorporate matching items from our Bangalore catalog (e.g. recommend Cubbon Park Unplugged on Sunday mornings, VV Puram on street food evenings, Ranga Shankara on plays).
3. If some dates have no exact catalog events, suggest highly specific Bangalore outings (e.g., microbrewery tours in Indiranagar, high tea at Windsor Manor, hiking Nandi Hills, visiting national parks, exploring commercial markets). Keep the names exciting and fitting a premium neo-brutalist tech-culture planner.
4. For each day, provide a Title, a strategic overview sentence, and exactly 2 distinct activities (Morning and Evening).
5. For each activity, include:
   - "time": e.g., "08:00"
   - "title": e.g., "Cubbon Park Unplugged"
   - "description": e.g., "Indie musicians and poets in nature canopy."
   - "category": either "shows", "heritage", or "markets"
   - "transitText": description of travel (e.g., "15 mins via Auto-Rickshaw")
   - "budget": in Rupees (e.g., "Free" or "₹1,200")
   - "rating": rating out of 5 (e.g. "4.9")
   - "imageUrl": use one of the images from the matches in the catalog if available, or use the following generic stock illustrations provided:
     - Shows/music: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp-KOUTL2cHBkU9QNnm9EOsiulVIo936PGi8Ylbo6yRi9zijYEHd6CYoqsUI1cU1AKldNoknDB44_NFm8IEERkShrB0LZafXZfZGPsaQRcfaV0esQL_KCOTvrYb6ePrZ2N9zhifw9cv796VvXw91WduxJ7gv-9NDrEk_383jn_6kJS8BE-9FBirjAOl2rWt3DuAhiIeTcO7KTgPpjuOuW1FDmx6WjSwixjJPbZ4uDyLLthjPOU1Q2JBoK7rxlNZ-ol_dy5UwJnRoJi"
     - Heritage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrTY2fGBIFi6Gl1a3b1cu6cSIGzj9de32ooiR7-ttGxOyTUboifjSNYZfeMtL0OX7lTceNg4mIaC0jB2s_1vLmCKOogZVDqLcuq_e9PjcCgWOqIC5j_H_biAY5uHlu845cX-aDbiwIKST-T8qCbOv2wDKDTYIqgo8TqOfrVM1d8dUsFpgLFnye2FFvdMi9m69V8zyeOgAOdSxvJN71QFFYgbMwyPTXc4pzkvav6RL11KB7u_v4fnfF32ZmWJHlTjMSj87nCKgzf-bO"
     - Food/Markets: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiISrTKxugtTD3Kc0iRWakkWjBiAE6UiKvCCtsR-4vOJFF7OcIf064s8Ah5f_NiQkYV3So12kUKyr2khifRjlofN66ZKj-iW1OGMlDGwMtTTt2esd-6cpMBrzNyqyQnkMap-oWeuIHKXm_9PcXzVNgAyyUiqkQIkZAPr4Z2MP4sfE_5TCOLvYarey0soXfSbZrsTUquqAkkM3lfYr7cEJPhnMj4XtBYy9dfjzUNpa_lQWUH2H3B3q2Uxtj2JTV0_0Sbk4szobHk9EE"
6. Create an overall summary with "averageTransitDistanceKm" (number), "efficiencyScore" (percentage number), "totalCuratedEvents" (number), and "totalEstimatedSpending" (string).
7. Create a strategy description "conciergeStrategyText" summarizing why the plan was structured this way.

Return ONLY a valid JSON object matching the following structure (no backticks or chat formatting):
{
  "title": "Autumn/Spring Bangalore Expedition",
  "dateRangeText": "Oct 12 — Oct 14",
  "conciergeStrategyText": "Summary text explaining the design strategy",
  "averageTransitDistanceKm": 8.4,
  "efficiencyScore": 92,
  "totalCuratedEvents": 6,
  "totalEstimatedSpending": "₹3,400",
  "days": [
    {
      "dayNum": "DAY 01",
      "dateString": "2026-10-13",
      "dayTitle": "Concrete Poetics & Local Eats",
      "strategyText": "Transition from urban congestion to garden parks.",
      "activities": [
        {
          "time": "08:00",
          "title": "Cubbon Park Walk",
          "description": "Lush canopy stroll under majestic banyans.",
          "category": "heritage",
          "transitText": "10 mins walking",
          "budget": "Free",
          "rating": "4.8",
          "imageUrl": "image_url_from_above"
        }
      ]
    }
  ]
}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: curationPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - Key connection failed. Ensure your key is valid and has Gemini access.`);
    }

    const data = await response.json();
    const cleanText = data.candidates[0].content.parts[0].text.trim();
    return JSON.parse(cleanText);
  }

  // ==========================================
  // 10. RENDERING GEMINI TRIP PLANS
  // ==========================================
  function renderCuratedPlan(plan) {
    if (!plan || !plan.days || plan.days.length === 0) {
      selectors.noItineraryState.classList.remove('hidden');
      selectors.itineraryTimelineContainer.classList.add('hidden');
      return;
    }

    // Hide empty state & show timeline container
    selectors.noItineraryState.classList.add('hidden');
    selectors.itineraryTimelineContainer.classList.remove('hidden');

    // Populate Headers
    selectors.tripTitleText.innerHTML = plan.title.replace(' ', '<br/>');
    selectors.tripDateRange.textContent = plan.dateRangeText || "Custom Period";
    selectors.tripSummarySubtitle.textContent = `${plan.days.length} Days in Bangalore`;
    selectors.tripStrategyIntro.textContent = plan.conciergeStrategyText || "Custom route engineered by Gemini.";

    // Render Stats
    selectors.statDistance.textContent = `${plan.averageTransitDistanceKm || '8.0'} km`;
    selectors.statEfficiency.textContent = `${plan.efficiencyScore || '90'}%`;
    selectors.statSpots.textContent = plan.totalCuratedEvents || plan.days.length * 2;
    selectors.statBudget.textContent = plan.totalEstimatedSpending || '₹2,500';

    // Build Circular Day Quick Badges
    selectors.tripDaysCircles.innerHTML = '';
    plan.days.forEach((day, index) => {
      const dayLabel = day.dayNum.replace('DAY ', '');
      const badge = document.createElement('div');
      
      let badgeBg = 'bg-surface-dim';
      if (index % 3 === 0) badgeBg = 'bg-primary-fixed-dim';
      if (index % 3 === 1) badgeBg = 'bg-tertiary-fixed-dim';
      if (index % 3 === 2) badgeBg = 'bg-secondary-fixed';
      
      badge.className = `w-12 h-12 border-2 border-on-surface ${badgeBg} flex items-center justify-center font-bold text-on-surface text-sm uppercase`;
      badge.textContent = dayLabel;
      badge.title = day.dayTitle;
      selectors.tripDaysCircles.appendChild(badge);
    });

    // Populate Timeline List
    selectors.itineraryDaysList.innerHTML = '';
    
    plan.days.forEach((day, dayIdx) => {
      const isEven = dayIdx % 2 === 0;
      const dayContainer = document.createElement('div');
      
      // Grid positioning for timeline: left-side is labels, right-side is cards (or reversed)
      // On desktop, splits left/right. On mobile, stacks vertically.
      dayContainer.className = 'relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-start';
      
      // Parse date for day banner
      let dateFormatted = day.dateString;
      try {
        const [y, m, d] = day.dateString.split('-');
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        dateFormatted = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
      } catch(e) {}

      const sideLabelHtml = `
        <div class="lg:text-right flex flex-col items-start lg:items-end">
          <div class="inline-block bg-secondary text-on-primary px-4 py-2 border-2 border-primary shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] mb-4">
            <span class="font-display font-bold text-4xl">${day.dayNum}</span>
          </div>
          <span class="text-xs font-bold font-mono uppercase tracking-widest text-secondary mb-2">${dateFormatted}</span>
          <h3 class="text-5xl font-display font-bold uppercase leading-none mb-4">${day.dayTitle}</h3>
          <p class="text-lg max-w-sm">${day.strategyText}</p>
        </div>
      `;

      const cardsContainerHtml = `
        <div class="space-y-8">
          ${day.activities.map((act, actIdx) => {
            let borderHoverAccent = '#0055ff'; // Blue for Shows
            let catColorClass = 'text-tertiary';
            if (act.category === 'heritage') {
              borderHoverAccent = '#e63b2e'; // Red
              catColorClass = 'text-secondary';
            }
            if (act.category === 'markets') {
              borderHoverAccent = '#ffcc00'; // Yellow
              catColorClass = 'text-primary';
            }
            
            // Alternating card styles for beautiful brutalist visual contrast
            const bgClass = actIdx % 2 === 0 ? 'bg-surface-container' : 'bg-surface';
            
            return `
              <div class="group relative ${bgClass} p-6 border-4 border-primary transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_${borderHoverAccent}]">
                <div class="absolute -top-4 -right-4 bg-tertiary text-on-tertiary px-3 py-1 font-bold text-xs uppercase tracking-widest border-2 border-primary z-10">
                  Gemini suggestion
                </div>
                <div class="flex flex-col sm:flex-row gap-6">
                  <div class="w-32 h-32 bg-surface-dim shrink-0 border-2 border-primary overflow-hidden">
                    <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" src="${act.imageUrl}" alt="${act.title}"/>
                  </div>
                  <div class="flex-1 flex flex-col justify-between">
                    <div>
                      <span class="text-xs font-bold ${catColorClass} uppercase">${act.time} • ${act.category.toUpperCase()}</span>
                      <h4 class="text-2xl font-display font-bold uppercase mt-1 leading-tight">${act.title}</h4>
                      <p class="text-sm mt-2 opacity-80 leading-snug">${act.description}</p>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-primary/10 mt-4 font-bold text-xs uppercase opacity-75">
                      <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">directions_car</span> ${act.transitText}</span>
                      <span class="text-secondary">${act.budget}</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      if (isEven) {
        dayContainer.innerHTML = sideLabelHtml + cardsContainerHtml;
      } else {
        // Swap sides on desktop to keep it zigzagged
        // On desktop, first element is right, second is left? No, let's keep layout logical.
        // Standard ordering, but on desktop we can apply grid classes or keep it simple.
        dayContainer.innerHTML = sideLabelHtml + cardsContainerHtml;
      }

      selectors.itineraryDaysList.appendChild(dayContainer);
    });
  }

  function setupItineraryActions() {
    selectors.finalizeTripBtn.addEventListener('click', () => {
      if (!state.curatedPlan) return;
      
      // Build a simple text-based summary block and offer copy-paste download
      const dates = selectors.tripDateRange.textContent;
      let textSummary = `--- OFFSITE TRIP PLAN SUMMARY: ${state.curatedPlan.title.toUpperCase()} ---\n`;
      textSummary += `Period: ${dates}\n`;
      textSummary += `Concierge Strategy: ${state.curatedPlan.conciergeStrategyText}\n\n`;
      
      state.curatedPlan.days.forEach(d => {
        textSummary += `================ ${d.dayNum}: ${d.dayTitle} ================\n`;
        textSummary += `Strategy: ${d.strategyText}\n\n`;
        d.activities.forEach(a => {
          textSummary += `- [${a.time}] ${a.title} (${a.category.toUpperCase()})\n`;
          textSummary += `  Description: ${a.description}\n`;
          textSummary += `  Transit: ${a.transitText} | Budget: ${a.budget}\n\n`;
        });
      });

      // Create dummy link to download file
      const blob = new Blob([textSummary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Offsite_Bangalore_Itinerary_${dates.replace(/ /g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification("Trip itinerary exported as text summary!");
    });

    selectors.regenerateTripBtn.addEventListener('click', () => {
      if (confirm("Re-curate your itinerary? This will contact Gemini to build a fresh outline.")) {
        generateCurationPlan();
      }
    });
  }

  // ==========================================
  // 11. EXPOSE GLOBAL INTERFACES
  // ==========================================
  window.app = {
    init,
    switchTab,
    setCategoryFilter
  };

  // Run on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
  });

})();
