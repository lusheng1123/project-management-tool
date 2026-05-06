// ============================================================
// app.js — Main application initialization & navigation
// ============================================================

(function() {
  // Initialize seed data on first load
  if (typeof seedData !== 'undefined' && seedData) {
    // Already seeded via script tag
  }

  const tabs = [
    { id: 'resource', label: '👥 Resources', icon: '👥' },
    { id: 'capability', label: '🎯 Capabilities', icon: '🎯' },
    { id: 'product', label: '📦 Products', icon: '📦' },
    { id: 'requirement', label: '📋 Requirements', icon: '📋' },
    { id: 'project', label: '📁 Projects', icon: '📁' },
    { id: 'epic', label: '⚡ Epics', icon: '⚡' },
    { id: 'risk', label: '⚠️ Risks', icon: '⚠️' },
    { id: 'dependency', label: '🔗 Dependencies', icon: '🔗' },
    { id: 'roadmap', label: '🗓️ Roadmap', icon: '🗓️' },
    { id: 'userstory', label: '📝 Stories', icon: '📝' }
  ];

  let currentTab = 'resource';

  // Build navigation
  function renderNav() {
    const navEl = document.getElementById('tabNav');
    navEl.innerHTML = tabs.map(t =>
      `<button class="tab-btn ${currentTab === t.id ? 'active' : ''}" onclick="switchTab('${t.id}')">${t.label}</button>`
    ).join('');
  }

  // Switch tab
  window.switchTab = async function(tabId) {
    currentTab = tabId;
    renderNav();
    await Views.render(tabId);
    window.scrollTo(0, 0);
    setupActionHandlers(tabId);
  };

  // Setup action handlers based on current tab
  function setupActionHandlers(tabId) {
    window._actions = {};

    switch (tabId) {
      case 'resource':
        window._actions['editResource'] = (e) => Views._editResource(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteResource(e.target.dataset.id);
        break;
      case 'requirement':
        window._actions['editResource'] = (e) => Views._editRequirement(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteRequirement(e.target.dataset.id);
        break;
      case 'project':
        window._actions['editResource'] = (e) => Views._editProject(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteProject(e.target.dataset.id);
        break;
      case 'epic':
        window._actions['editResource'] = (e) => Views._editEpic(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteEpic(e.target.dataset.id);
        break;
      case 'risk':
        window._actions['editResource'] = (e) => Views._editRisk(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteRisk(e.target.dataset.id);
        break;
      case 'dependency':
        window._actions['editResource'] = (e) => Views._editDependency(e.target.dataset.id);
        window._actions['deleteResource'] = (e) => Views._deleteDependency(e.target.dataset.id);
        break;
    }

    // Delegate all button clicks with data-action and data-id
    document.getElementById('mainContent').addEventListener('click', function(e) {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      const handler = window._actions[`${action}_${id}`];
      if (handler) {
        handler(e);
      } else {
        // Try direct handler
        const directHandler = window._actions[action];
        if (directHandler) {
          e.target.dataset.id = id;
          directHandler(e);
        }
      }
    });
  }

  // Init app
  async function init() {
    renderNav();
    await Views.render(currentTab);
    setupActionHandlers(currentTab);

    // Expose require method globally for edit/delete in other dashboards
    Views._editResource = Views._editResource || (async (id) => {
      await Views._editResource(id);
    });
  }

  // Start
  document.addEventListener('DOMContentLoaded', init);
})();

// Global dashboard search filter
window._filterDashboard = function(term) {
  const tbody = document.querySelector('.data-table tbody');
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  const t = term.toLowerCase().trim();
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = (!t || text.includes(t)) ? '' : 'none';
  });
};
