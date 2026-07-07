function clearActiveSubmenu() {
  var activeItems = document.querySelectorAll('#menuPrimary li.active');
  activeItems.forEach(function (item) {
    item.classList.remove('active');
  });

  document.querySelectorAll('.submenu-panel.active').forEach(function (panel) {
    panel.classList.remove('active');
  });
}

function initNewsTabs() {
  var tabs = document.querySelectorAll('.tabs .tab');
  var rows = document.querySelectorAll('.news-row');

  if (!tabs.length || !rows.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var filter = tab.getAttribute('data-filter') || 'all';

      tabs.forEach(function (item) {
        item.classList.toggle('active', item === tab);
      });

      rows.forEach(function (row) {
        var category = row.getAttribute('data-category') || 'all';
        var isMatch = filter === 'all' || category === filter;
        row.classList.toggle('is-hidden', !isMatch);
      });
    });
  });
}

function initJournalCarousel() {
  var journalGrid = document.getElementById('journalGrid');
  if (!journalGrid) return;

  var cards = Array.from(journalGrid.children);
  if (cards.length === 0) return;

  var clonesBefore = cards.slice(-2).map(function (card) {
    var clone = card.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });
  var clonesAfter = cards.slice(0, 2).map(function (card) {
    var clone = card.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });

  clonesBefore.forEach(function (clone) {
    journalGrid.insertBefore(clone, journalGrid.firstChild);
  });
  clonesAfter.forEach(function (clone) {
    journalGrid.appendChild(clone);
  });

  var cardWidth = cards[0].getBoundingClientRect().width;
  var gap = parseFloat(getComputedStyle(journalGrid).gap) || 22;
  var step = cardWidth + gap;
  var currentIndex = 2;
  var isAutoScrolling = false;
  var interval = null;

  function setInitialPosition() {
    journalGrid.scrollLeft = step * currentIndex;
  }

  function moveToIndex(index) {
    if (isAutoScrolling) return;
    isAutoScrolling = true;
    journalGrid.scrollTo({ left: step * index, behavior: 'smooth' });

    setTimeout(function () {
      isAutoScrolling = false;
      if (index <= 1) {
        currentIndex = cards.length + index;
        journalGrid.scrollLeft = step * currentIndex;
      } else if (index >= cards.length + 2) {
        currentIndex = index - cards.length;
        journalGrid.scrollLeft = step * currentIndex;
      } else {
        currentIndex = index;
      }
    }, 600);
  }

  function startAutoScroll() {
    stopAutoScroll();
    interval = setInterval(function () {
      moveToIndex(currentIndex + 1);
    }, 3500);
  }

  function stopAutoScroll() {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  }

  setInitialPosition();
  startAutoScroll();

  journalGrid.addEventListener('mouseenter', stopAutoScroll);
  journalGrid.addEventListener('mouseleave', startAutoScroll);

  window.addEventListener('resize', function () {
    cardWidth = cards[0].getBoundingClientRect().width;
    step = cardWidth + gap;
    setInitialPosition();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initNewsTabs();
    initJournalCarousel();

    var sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function () {
        if (document.body.classList.contains('sidebar-collapsed')) {
          clearActiveSubmenu();
        }
      });
    }
  });
} else {
  initNewsTabs();
  initJournalCarousel();

  var sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function () {
      if (document.body.classList.contains('sidebar-collapsed')) {
        clearActiveSubmenu();
      }
    });
  }
}
