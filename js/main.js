/**
 * THANGIT.COM — Main Script & Deep Linking Router
 * Handles direct URL hash navigation (e.g. #hoso, #profile) on page load.
 */

(function () {
  'use strict';

  /**
   * Check window.location.hash and activate Profile tab if matched
   */
  function handleProfileHashRouting() {
    const hash = (window.location.hash || '').toLowerCase();

    if (hash === '#hoso' || hash === '#profile') {
      const profileBtn = document.getElementById('nav-btn-cv') || document.querySelector('.top-nav-btn[data-target="tab-cv"]');
      const tabCv = document.getElementById('tab-cv');
      const paneProfile = document.getElementById('pane-profile');

      // If already displayed and active, do not re-trigger
      if (tabCv && tabCv.style.display !== 'none' && profileBtn && profileBtn.classList.contains('active')) {
        return;
      }

      // 1. Remove active states from other navigation buttons
      document.querySelectorAll('.top-nav-btn').forEach(btn => {
        if (btn !== profileBtn) {
          btn.classList.remove('active');
        }
      });

      // 2. Remove active states and hide other tab contents
      document.querySelectorAll('.home-tab-content').forEach(tab => {
        if (tab.id !== 'tab-cv') {
          tab.classList.remove('active');
          tab.style.display = 'none';
        }
      });

      // 3. Trigger click or activate Hồ Sơ tab button
      if (profileBtn) {
        if (!profileBtn.classList.contains('active')) {
          profileBtn.click();
        }
        profileBtn.classList.add('active');
      }

      // 4. Ensure tab-cv and #pane-profile are active and visible immediately
      if (tabCv) {
        tabCv.classList.add('active');
        tabCv.style.display = 'block';
      }

      if (paneProfile) {
        paneProfile.classList.add('active');
      }
    }
  }

  // Check when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleProfileHashRouting);
  } else {
    handleProfileHashRouting();
  }

  // Also support dynamic hash change without reload
  window.addEventListener('hashchange', handleProfileHashRouting);
})();
