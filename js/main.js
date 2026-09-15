/**
 * THANGIT.COM — Main Script & Deep Linking Router
 * Handles hash-based routing:
 * - Default: Tools view (Speedtest / DNS / Network Tools) on thangit.com
 * - ONLY activates Profile tab on #hoso or #profile
 */

(function () {
  'use strict';

  /**
   * Check window.location.hash and activate appropriate tab
   */
  function handleHashRouting() {
    const hash = (window.location.hash || '').toLowerCase();
    const profileBtn = document.getElementById('nav-btn-cv') || document.querySelector('.top-nav-btn[data-target="tab-cv"]');
    const tabCv = document.getElementById('tab-cv');
    const tabTools = document.getElementById('tab-tools');
    const paneProfile = document.getElementById('pane-profile');

    if (hash === '#hoso' || hash === '#profile') {
      // Deactivate other buttons
      document.querySelectorAll('.top-nav-btn').forEach(btn => {
        if (btn === profileBtn) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Hide other tab contents
      document.querySelectorAll('.home-tab-content').forEach(tab => {
        if (tab.id !== 'tab-cv') {
          tab.classList.remove('active');
          tab.style.display = 'none';
        }
      });

      // Show tab-cv
      if (tabCv) {
        tabCv.classList.add('active');
        tabCv.style.display = 'flex';
      }
      if (paneProfile) {
        paneProfile.classList.add('active');
      }
    } else {
      // Default: Ensure Tools view is active and Profile tab is hidden
      if (profileBtn) {
        profileBtn.classList.remove('active');
      }
      if (tabCv) {
        tabCv.classList.remove('active');
        tabCv.style.display = 'none';
      }
      if (tabTools) {
        tabTools.classList.add('active');
        tabTools.style.display = 'block';
      }
    }
  }

  // Check when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleHashRouting);
  } else {
    handleHashRouting();
  }

  // Listen for hash and popstate changes
  window.addEventListener('hashchange', handleHashRouting);
  window.addEventListener('popstate', handleHashRouting);
})();
