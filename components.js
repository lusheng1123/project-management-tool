// ============================================================
// components.js — Reusable UI components
// ============================================================

class Components {

  // ========== MODAL ==========
  static modal = {
    _overlay: null,

    open({ title, fields, data, onSave, onDelete, extraContent, wide }) {
      this.close();
      this._overlay = document.createElement('div');
      this._overlay.className = 'modal-overlay';

      let formHtml = '';
      if (fields) {
        formHtml = fields.map(f => {
          if (f.type === 'lookup') {
            return this._renderLookup(f, data);
          } else if (f.type === 'choice') {
            return this._renderChoice(f, data);
          } else if (f.type === 'multiline') {
            return `<label>${f.label}${f.required ? ' *' : ''}</label><textarea name="${f.name}" rows="3">${(data && data[f.name]) || ''}</textarea>`;
          } else if (f.type === 'date') {
            return `<label>${f.label}${f.required ? ' *' : ''}</label><input type="date" name="${f.name}" value="${(data && data[f.name]) || ''}">`;
          } else if (f.type === 'number') {
            return `<label>${f.label}${f.required ? ' *' : ''}</label><input type="number" name="${f.name}" value="${(data && data[f.name]) || ''}" step="${f.step || '1'}" min="${f.min !== undefined ? f.min : ''}" max="${f.max !== undefined ? f.max : ''}">`;
          } else if (f.type === 'email') {
            return `<label>${f.label}${f.required ? ' *' : ''}</label><input type="email" name="${f.name}" value="${(data && data[f.name]) || ''}">`;
          } else {
            return `<label>${f.label}${f.required ? ' *' : ''}</label><input type="text" name="${f.name}" value="${(data && data[f.name]) || ''}">`;
          }
        }).join('');
      }

      const deleteBtn = onDelete ? `<button class="btn btn-delete" id="modalDeleteBtn">🗑️ Delete</button>` : '';
      const extra = extraContent || '';

      this._overlay.innerHTML = `
        <div class="modal${wide ? ' modal-wide' : ''}">
          <div class="modal-header">
            <h3>${title}</h3>
            <button class="modal-close" id="modalCloseBtn">✕</button>
          </div>
          <div class="modal-body">
            <form id="modalForm">
              ${formHtml}
              ${extra}
            </form>
          </div>
          <div class="modal-footer">
            ${deleteBtn}
            <button class="btn btn-cancel" id="modalCancelBtn">Cancel</button>
            <button class="btn btn-save" id="modalSaveBtn">💾 Save</button>
          </div>
        </div>
      `;

      document.body.appendChild(this._overlay);

      this._overlay.querySelector('#modalCloseBtn').onclick = () => this.close();
      this._overlay.querySelector('#modalCancelBtn').onclick = () => this.close();
      this._overlay.querySelector('#modalSaveBtn').onclick = () => {
        const form = this._overlay.querySelector('#modalForm');
        const formData = new FormData(form);
        const result = {};
        if (fields) {
          fields.forEach(f => { result[f.name] = formData.get(f.name) || ''; });
        }
        // Also get extra inputs
        if (extraContent) {
          const extraInputs = form.querySelectorAll('input[data-extra], textarea[data-extra], select[data-extra]');
          extraInputs.forEach(inp => { result[inp.name] = inp.value; });
        }
        onSave && onSave(result);
      };

      if (onDelete) {
        this._overlay.querySelector('#modalDeleteBtn').onclick = () => {
          if (confirm('Are you sure you want to delete this record?')) {
            onDelete();
          }
        };
      }
    },

    _renderLookup(f, data) {
      const currentId = (data && data[f.name]) || '';
      return `<label>${f.label}${f.required ? ' *' : ''}</label><input type="text" name="${f.name}" value="${currentId}" placeholder="Enter ${f.target} ID" data-lookup="${f.target}">`;
    },

    _renderChoice(f, data) {
      const currentVal = (data && data[f.name]) || '';
      const options = f.choices.map(c =>
        `<option value="${c}" ${currentVal === c ? 'selected' : ''}>${c}</option>`
      ).join('');
      return `<label>${f.label}${f.required ? ' *' : ''}</label><select name="${f.name}">${options}</select>`;
    },

    close() {
      if (this._overlay) {
        this._overlay.remove();
        this._overlay = null;
      }
    }
  };

  // ========== TABLE ==========
  static renderTable({ columns, data, actions, emptyMessage }) {
    if (!data || data.length === 0) {
      return `<div class="empty-state">${emptyMessage || 'No records found'}</div>`;
    }

    const headerRow = columns.map(c => `<th>${c.label}</th>`).join('');
    const actionHeader = actions ? '<th>Actions</th>' : '';

    const bodyRows = data.map(record => {
      const cells = columns.map(c => {
        let val = record[c.field];
        if (c.render) val = c.render(record);
        if (c.format === 'badge') {
          const cls = this._getBadgeClass(val);
          return `<td><span class="badge ${cls}">${val || '—'}</span></td>`;
        }
        if (c.format === 'rag') {
          const ragClass = val === 'G' ? 'badge-green' : val === 'A' ? 'badge-amber' : val === 'R' ? 'badge-red' : '';
          return `<td><span class="badge ${ragClass}">${val || '—'}</span></td>`;
        }
        return `<td>${val || '—'}</td>`;
      }).join('');

      let actionCells = '';
      if (actions) {
        actionCells = '<td class="actions-cell">' + actions.map(a => {
          return `<button class="btn-sm btn-${a.cls || 'edit'}" onclick="window._actions['${a.id}_${record.id}'](event)" data-action="${a.id}" data-id="${record.id}">${a.label}</button>`;
        }).join(' ') + '</td>';
      }

      return `<tr>${cells}${actionCells}</tr>`;
    }).join('');

    return `
      <table class="data-table">
        <thead><tr>${headerRow}${actionHeader}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    `;
  }

  static _getBadgeClass(val) {
    const v = (val || '').toLowerCase();
    if (['active', 'approved', 'completed', 'linked', 'new', 'live', 'g'].includes(v)) return 'badge-green';
    if (['in progress', 'prioritized', 'pending', 'on leave', 'onboarding', 'review', 'a'].includes(v)) return 'badge-amber';
    if (['inactive', 'rejected', 'on hold', 'critical', 'r', 'development phase 1', 'development phase 2'].includes(v)) return 'badge-blue';
    if (['medium', 'n/a'].includes(v)) return 'badge-gray';
    return 'badge-blue';
  }

  // ========== STATS CARDS ==========
  static renderStats(stats) {
    return stats.map(s => `
      <div class="stat-card">
        <div class="stat-number">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>
    `).join('');
  }

  // ========== FILTER BAR ==========
  static renderFilterBar(filters, onChange) {
    return `
      <div class="filter-bar">
        <input type="text" placeholder="🔍 Search..." id="filterSearch" oninput="window._filterChange()">
        ${filters.map(f => this._renderFilterDropdown(f)).join('')}
        <button class="btn btn-reset" onclick="window._filterReset()">🔄 Reset</button>
      </div>
    `;
  }

  _renderFilterDropdown(filter) {
    let options = filter.options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    return `
      <select id="filter_${filter.field}" onchange="window._filterChange()">
        <option value="">All ${filter.label}</option>
        ${options}
      </select>
    `;
  }

  // ========== TOAST ==========
  static toast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
  }
}

// Registry for action handlers
window._actions = {};
window._filterChange = () => {};
window._filterReset = () => {};
