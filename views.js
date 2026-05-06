// ============================================================
// views.js — All 8 dashboard views
// ============================================================

class Views {

  static async render(tab) {
    const container = document.getElementById('mainContent');
    container.innerHTML = '<div class="loading">Loading...</div>';

    switch (tab) {
      case 'resource': container.innerHTML = await this.resource(); break;
      case 'capability': container.innerHTML = await this.capability(); break;
      case 'product': container.innerHTML = await this.product(); break;
      case 'requirement': container.innerHTML = await this.requirement(); break;
      case 'project': container.innerHTML = await this.project(); break;
      case 'epic': container.innerHTML = await this.epic(); break;
      case 'risk': container.innerHTML = await this.risk(); break;
      case 'dependency': container.innerHTML = await this.dependency(); break;
      case 'roadmap': container.innerHTML = await this.roadmap(); break;
      case 'userstory': container.innerHTML = await this.userstory(); break;
      default: container.innerHTML = await this.resource();
    }
  }

  // ========================================
  // 1. RESOURCE DASHBOARD
  // ========================================
  static async resource() {
    const data = await ds.getAll('pm_resource');
    const active = data.filter(r => r.pm_status === 'Active').length;
    const itCount = data.filter(r => r.pm_department === 'IT').length;
    const bizCount = data.filter(r => r.pm_department === 'Business').length;

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Total Resources' },
      { value: active, label: 'Active' },
      { value: itCount, label: 'IT' },
      { value: bizCount, label: 'Business' }
    ]);

    return `
      <div class="dashboard-header">
        <h2>👥 Resource Management</h2>
        <button class="btn btn-primary" onclick="Views._newResource()">+ New Resource</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      <div id="filterArea"></div>
      <div id="tableArea">${this._buildResourceTable(data)}</div>
    `;
  }

  static _buildResourceTable(data) {
    const columns = [
      { field: 'pm_name', label: 'Name' },
      { field: 'pm_role', label: 'Role' },
      { field: 'pm_department', label: 'Department' },
      { field: 'pm_status', label: 'Status', format: 'badge' },
      { field: 'pm_cost', label: 'Cost' },
      { field: 'pm_joineddate', label: 'Joined Date' }
    ];
    const actions = [
      { id: 'editResource', label: '✏️ Edit', cls: 'edit' },
      { id: 'deleteResource', label: '🗑️', cls: 'delete' }
    ];

    if (data.length === 0) {
      return `<div class="empty-state">No resources found. Click [+ New Resource] to add one.</div>`;
    }

    return Components.renderTable({ columns, data, actions });
  }

  static async _newResource() {
    Components.modal.open({
      title: 'New Resource',
      fields: getFields('pm_resource'),
      onSave: async (formData) => {
        await ds.create('pm_resource', formData);
        Components.modal.close();
        Components.toast('Resource created!');
        Views.render('resource');
      }
    });
  }

  static async _editResource(id) {
    const record = await ds.getById('pm_resource', id);
    Components.modal.open({
      title: 'Edit Resource',
      fields: getFields('pm_resource'),
      data: record,
      onSave: async (formData) => {
        await ds.update('pm_resource', id, formData);
        Components.modal.close();
        Components.toast('Resource updated!');
        Views.render('resource');
      },
      onDelete: async () => {
        await ds.delete('pm_resource', id);
        Components.modal.close();
        Components.toast('Resource deleted!');
        Views.render('resource');
      }
    });
  }

  // ========================================
  // 2. CAPABILITY DASHBOARD
  // ========================================
  static async capability() {
    const data = await ds.getAll('pm_capability');
    const products = await ds.getAll('pm_product');
    const requirements = await ds.getAll('pm_requirement');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Capabilities' },
      { value: products.length, label: 'Products' },
      { value: requirements.length, label: 'Requirements' }
    ]);

    let rows = '';
    for (const cap of data) {
      const linkedProducts = await ds.getProductsByCapability(cap.id);
      const productNames = linkedProducts.map(p => p.pm_name).join(', ') || 'None';
      const reqCount = requirements.filter(r => r.pm_capabilityid === cap.id).length;
      rows += `
        <tr>
          <td><strong>${cap.pm_name}</strong><br><small>${cap.pm_description || ''}</small></td>
          <td>${productNames}</td>
          <td>${reqCount} reqs</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editCapability('${cap.id}')">✏️ Edit</button>
            <button class="btn-sm btn-link" onclick="Views._linkProductsToCapability('${cap.id}')">🔗 Link Products</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteCapability('${cap.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>🎯 Capability Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newCapability()">+ New Capability</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      <div id="filterArea"></div>
      ${data.length === 0 ? '<div class="empty-state">No capabilities found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Capability</th><th>Linked Products</th><th>Requirements</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newCapability() {
    Components.modal.open({
      title: 'New Capability',
      fields: getFields('pm_capability'),
      onSave: async (formData) => {
        await ds.create('pm_capability', formData);
        Components.modal.close();
        Components.toast('Capability created!');
        Views.render('capability');
      }
    });
  }

  static async _editCapability(id) {
    const record = await ds.getById('pm_capability', id);
    Components.modal.open({
      title: 'Edit Capability',
      fields: getFields('pm_capability'),
      data: record,
      onSave: async (formData) => {
        await ds.update('pm_capability', id, formData);
        Components.modal.close();
        Components.toast('Capability updated!');
        Views.render('capability');
      },
      onDelete: async () => {
        await ds.delete('pm_capability', id);
        Components.modal.close();
        Components.toast('Capability deleted!');
        Views.render('capability');
      }
    });
  }

  static async _deleteCapability(id) {
    if (confirm('Delete this capability?')) {
      await ds.delete('pm_capability', id);
      Components.toast('Capability deleted!');
      Views.render('capability');
    }
  }

  static async _linkProductsToCapability(capabilityId) {
    const allProducts = await ds.getAll('pm_product');
    const linkedProducts = await ds.getProductsByCapability(capabilityId);
    const linkedIds = linkedProducts.map(p => p.id);

    const productCheckboxes = allProducts.map(p => `
      <label class="checkbox-label">
        <input type="checkbox" value="${p.id}" ${linkedIds.includes(p.id) ? 'checked' : ''}>
        ${p.pm_name} (${p.pm_shortname || 'N/A'})
      </label>
    `).join('');

    Components.modal.open({
      title: 'Link Products to Capability',
      fields: [],
      extraContent: `
        <div class="checkbox-group">${productCheckboxes}</div>
      `,
      onSave: async () => {
        // Remove existing links
        const existing = await ds.query('pm_capabilityproduct', { pm_capabilityid: capabilityId });
        for (const link of existing) {
          await ds.delete('pm_capabilityproduct', link.id);
        }
        // Add new checked products
        const checked = document.querySelectorAll('#modalForm input[type=checkbox]:checked');
        for (const cb of checked) {
          await ds.create('pm_capabilityproduct', {
            pm_capabilityid: capabilityId,
            pm_productname: cb.value
          });
        }
        Components.modal.close();
        Components.toast('Products linked!');
        Views.render('capability');
      }
    });
  }

  // ========================================
  // 3. PRODUCT DASHBOARD
  // ========================================
  static async product() {
    const data = await ds.getAll('pm_product');
    const links = await ds.getAll('pm_capabilityproduct');
    const projects = await ds.getAll('pm_project');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Products' },
      { value: projects.length, label: 'Projects' },
      { value: data.filter(p => p.pm_governancestatus === 'Approved').length, label: 'Approved' }
    ]);

    let rows = '';
    for (const prod of data) {
      const capabilities = await ds.getCapabilitiesByProduct(prod.id);
      const capNames = capabilities.map(c => c.pm_name).join(', ') || 'None';
      const prodProjects = projects.filter(p => p.pm_productname === prod.id);

      let projectsHtml = '';
      if (prodProjects.length === 0) {
        projectsHtml = '<span class="text-muted">—</span>';
      } else {
        projectsHtml = prodProjects.map(p => `
          <div class="product-project-item" onclick="Views._editProject('${p.id}')" title="Click to edit">
            <span class="badge ${Components._getBadgeClass(p.pm_status)}">${p.pm_status}</span>
            <span class="product-project-name">${p.pm_name}</span>
            <span class="product-project-pct">${p.pm_overallcompletion || 0}%</span>
          </div>
        `).join('');
      }

      rows += `
        <tr>
          <td><strong>${prod.pm_name}</strong><br><small>${prod.pm_journeyname || ''} (${prod.pm_shortname || ''})</small></td>
          <td>${capNames}</td>
          <td><span class="badge ${Components._getBadgeClass(prod.pm_governancestatus)}">${prod.pm_governancestatus || 'N/A'}</span></td>
          <td><div class="product-projects-list">${projectsHtml}</div></td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editProduct('${prod.id}')">✏️ Edit</button>
            <button class="btn-sm btn-link" onclick="Views._viewProductPipeline('${prod.id}')">📊 Pipeline</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteProduct('${prod.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>📦 Product Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newProduct()">+ New Product</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${data.length === 0 ? '<div class="empty-state">No products found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Product</th><th>Capabilities</th><th>Governance</th><th>Projects</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newProduct() {
    Components.modal.open({
      title: 'New Product',
      fields: getFields('pm_product'),
      onSave: async (formData) => {
        await ds.create('pm_product', formData);
        Components.modal.close();
        Components.toast('Product created!');
        Views.render('product');
      }
    });
  }

  static async _editProduct(id) {
    const record = await ds.getById('pm_product', id);
    Components.modal.open({
      title: 'Edit Product',
      fields: getFields('pm_product'),
      data: record,
      onSave: async (formData) => {
        await ds.update('pm_product', id, formData);
        Components.modal.close();
        Components.toast('Product updated!');
        Views.render('product');
      },
      onDelete: async () => {
        await ds.delete('pm_product', id);
        Components.modal.close();
        Components.toast('Product deleted!');
        Views.render('product');
      }
    });
  }

  static async _deleteProduct(id) {
    if (confirm('Delete this product?')) {
      await ds.delete('pm_product', id);
      Components.toast('Product deleted!');
      Views.render('product');
    }
  }

  static async _viewProductPipeline(productId) {
    const product = await ds.getById('pm_product', productId);
    const allProjects = await ds.getAll('pm_project');
    const projects = allProjects.filter(p => p.pm_productname === productId);

    const stages = ['Onboarding', 'Development Phase 1', 'Development Phase 2', 'Review', 'Live'];
    const stageColors = {
      'Onboarding': 'pipeline-amber',
      'Development Phase 1': 'pipeline-blue',
      'Development Phase 2': 'pipeline-blue',
      'Review': 'pipeline-amber',
      'Live': 'pipeline-green'
    };

    const stageIcons = {
      'Onboarding': '🚀',
      'Development Phase 1': '💻',
      'Development Phase 2': '⚙️',
      'Review': '🔍',
      'Live': '✅'
    };

    let columnsHtml = '';
    for (const stage of stages) {
      const stageProjects = projects.filter(p => p.pm_status === stage);
      const count = stageProjects.length;

      let cardsHtml = '';
      if (stageProjects.length === 0) {
        cardsHtml = '<div class="pipeline-card-empty">—</div>';
      } else {
        cardsHtml = stageProjects.map(p => `
          <div class="pipeline-card ${stageColors[stage]}" onclick="Views._editProject('${p.id}'); Components.modal.close();">
            <div class="pipeline-card-name">${p.pm_name}</div>
            <div class="pipeline-card-meta">
              <span>${p.pm_overallcompletion || 0}% done</span>
              <span>${p.pm_startdate || '?'} → ${p.pm_targetdeliverydate || '?'}</span>
            </div>
            ${p.pm_priority ? `<div class="pipeline-card-priority">⚡ ${p.pm_priority}</div>` : ''}
          </div>
        `).join('');
      }

      columnsHtml += `
        <div class="pipeline-column">
          <div class="pipeline-column-header ${stageColors[stage]}">
            <span>${stageIcons[stage]} ${stage}</span>
            <span class="pipeline-count">${count}</span>
          </div>
          <div class="pipeline-column-body">${cardsHtml}</div>
        </div>
      `;
    }

    Components.modal.open({
      title: `📦 Pipeline: ${product.pm_name}`,
      fields: [],
      wide: true,
      extraContent: `
        <div class="detail-section">
          <p><strong>Journey:</strong> ${product.pm_journeyname || '—'} | <strong>Short:</strong> ${product.pm_shortname || '—'}</p>
          <p><strong>Governance:</strong> <span class="badge ${Components._getBadgeClass(product.pm_governancestatus)}">${product.pm_governancestatus || 'N/A'}</span> | <strong>Contact:</strong> ${product.pm_contact || '—'}</p>
          <p><strong>Dates:</strong> ${product.pm_startdate || '—'} → ${product.pm_targetdate || '—'}</p>
        </div>
        <div class="pipeline-board">${columnsHtml}</div>
      `,
      onSave: () => Components.modal.close()
    });
  }

  // ========================================
  // 4. REQUIREMENT DASHBOARD (with PSC)
  // ========================================
  static async requirement() {
    const data = await ds.getAll('pm_requirement');
    const capabilities = await ds.getAll('pm_capability');
    const products = await ds.getAll('pm_product');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Requirements' },
      { value: data.filter(r => r.pm_status === 'Linked').length, label: 'Linked' },
      { value: data.filter(r => r.pm_pscapprovalrequired === 'Yes').length, label: 'Need PSC Approval' },
      { value: data.filter(r => r.pm_pscapprovalstatus === 'Approved').length, label: 'PSC Approved' }
    ]);

    let rows = '';
    for (const req of data) {
      const capName = capabilities.find(c => c.id === req.pm_capabilityid)?.pm_name || '—';
      const prodName = products.find(p => p.id === req.pm_productname)?.pm_name || '—';
      const pscBadge = req.pm_pscapprovalrequired === 'Yes'
        ? `<span class="badge ${Components._getBadgeClass(req.pm_pscapprovalstatus)}">${req.pm_pscapprovalstatus}</span>`
        : '<span class="badge badge-gray">N/A</span>';

      rows += `
        <tr>
          <td>${req.pm_detail}</td>
          <td>${capName}</td>
          <td>${prodName}</td>
          <td><span class="badge ${Components._getBadgeClass(req.pm_status)}">${req.pm_status}</span></td>
          <td>${pscBadge}</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editRequirement('${req.id}')">✏️ Edit</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteRequirement('${req.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>📋 Requirement Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newRequirement()">+ New Requirement</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${data.length === 0 ? '<div class="empty-state">No requirements found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Detail</th><th>Capability</th><th>Product</th><th>Status</th><th>PSC Approval</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newRequirement() {
    const capabilities = await ds.getAll('pm_capability');
    const projects = await ds.getAll('pm_project');

    const capOptions = capabilities.map(c => `<option value="${c.id}">${c.pm_name}</option>`).join('');
    const projOptions = projects.map(p => `<option value="${p.id}">${p.pm_name}</option>`).join('');

    Components.modal.open({
      title: 'New Requirement',
      fields: getFields('pm_requirement').filter(f => f.name !== 'pm_capabilityid' && f.name !== 'pm_productname' && f.name !== 'pm_projectname'),
      extraContent: `
        <label>Capability *</label>
        <select id="reqCapability" data-extra onchange="Views._onCapabilityChange()">
          <option value="">Select Capability...</option>
          ${capOptions}
        </select>
        <label>Product *</label>
        <select id="reqProduct" data-extra>
          <option value="">Select Capability first...</option>
        </select>
        <label>Project</label>
        <select id="reqProject" data-extra>
          <option value="">None</option>
          ${projOptions}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_capabilityid = document.getElementById('reqCapability').value;
        formData.pm_productname = document.getElementById('reqProduct').value;
        formData.pm_projectname = document.getElementById('reqProject').value;
        await ds.create('pm_requirement', formData);
        Components.modal.close();
        Components.toast('Requirement created!');
        Views.render('requirement');
      }
    });
  }

  static async _onCapabilityChange() {
    const capId = document.getElementById('reqCapability').value;
    const productSelect = document.getElementById('reqProduct');
    productSelect.innerHTML = '<option value="">Loading...</option>';
    if (capId) {
      const products = await ds.getProductsByCapability(capId);
      productSelect.innerHTML = products.map(p => `<option value="${p.id}">${p.pm_name}</option>`).join('');
      if (products.length === 0) {
        productSelect.innerHTML = '<option value="">No products linked to this capability</option>';
      }
    } else {
      productSelect.innerHTML = '<option value="">Select Capability first...</option>';
    }
  }

  static async _editRequirement(id) {
    const record = await ds.getById('pm_requirement', id);
    const capabilities = await ds.getAll('pm_capability');
    const projects = await ds.getAll('pm_project');

    let productSelect = '';
    if (record.pm_capabilityid) {
      const products = await ds.getProductsByCapability(record.pm_capabilityid);
      productSelect = products.map(p => `<option value="${p.id}" ${record.pm_productname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('');
    } else {
      const allProducts = await ds.getAll('pm_product');
      productSelect = allProducts.map(p => `<option value="${p.id}" ${record.pm_productname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('');
    }

    Components.modal.open({
      title: 'Edit Requirement',
      fields: getFields('pm_requirement').filter(f => f.name !== 'pm_capabilityid' && f.name !== 'pm_productname' && f.name !== 'pm_projectname'),
      data: record,
      extraContent: `
        <label>Capability</label>
        <select id="reqCapability" data-extra onchange="Views._onCapabilityChange()">
          <option value="">None</option>
          ${capabilities.map(c => `<option value="${c.id}" ${record.pm_capabilityid === c.id ? 'selected' : ''}>${c.pm_name}</option>`).join('')}
        </select>
        <label>Product</label>
        <select id="reqProduct" data-extra>
          ${productSelect}
        </select>
        <label>Project</label>
        <select id="reqProject" data-extra>
          <option value="">None</option>
          ${projects.map(p => `<option value="${p.id}" ${record.pm_projectname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('')}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_capabilityid = document.getElementById('reqCapability').value;
        formData.pm_productname = document.getElementById('reqProduct').value;
        formData.pm_projectname = document.getElementById('reqProject').value;
        await ds.update('pm_requirement', id, formData);
        Components.modal.close();
        Components.toast('Requirement updated!');
        Views.render('requirement');
      },
      onDelete: async () => {
        await ds.delete('pm_requirement', id);
        Components.modal.close();
        Components.toast('Requirement deleted!');
        Views.render('requirement');
      }
    });
  }

  static async _deleteRequirement(id) {
    if (confirm('Delete this requirement?')) {
      await ds.delete('pm_requirement', id);
      Components.toast('Requirement deleted!');
      Views.render('requirement');
    }
  }

  // ========================================
  // 5. PROJECT DASHBOARD
  // ========================================
  static async project() {
    const data = await ds.getAll('pm_project');
    const epics = await ds.getAll('pm_epic');
    const risks = await ds.getAll('pm_risk');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Projects' },
      { value: data.filter(p => p.pm_status === 'In Progress').length, label: 'In Progress' },
      { value: data.filter(p => p.pm_status === 'Completed').length, label: 'Completed' },
      { value: epics.length, label: 'Epics' }
    ]);

    let rows = '';
    for (const proj of data) {
      const epicCount = epics.filter(e => e.pm_projectname === proj.id).length;
      const riskCount = risks.filter(r => r.pm_projectname === proj.id).length;
      rows += `
        <tr>
          <td><strong>${proj.pm_name}</strong><br><small>${proj.pm_scope ? proj.pm_scope.substring(0, 80) + '...' : ''}</small></td>
          <td>${proj.pm_productname ? await ds.getLookupName('pm_product', proj.pm_productname) : '—'}</td>
          <td><span class="badge ${Components._getBadgeClass(proj.pm_status)}">${proj.pm_status}</span></td>
          <td>${proj.pm_overallcompletion || 0}%</td>
          <td>${epicCount} epics, ${riskCount} risks</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editProject('${proj.id}')">✏️ Edit</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteProject('${proj.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>📁 Project Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newProject()">+ New Project</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${data.length === 0 ? '<div class="empty-state">No projects found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Project</th><th>Product</th><th>Status</th><th>Completion</th><th>Related</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newProject() {
    const products = await ds.getAll('pm_product');
    const resources = await ds.getAll('pm_resource');

    Components.modal.open({
      title: 'New Project',
      fields: getFields('pm_project').filter(f => !f.name.startsWith('pm_productname') && !f.name.startsWith('pm_connectopo') && !f.name.startsWith('pm_productteampo') && !f.name.startsWith('pm_productteamdeliverylead') && !f.name.startsWith('pm_productteamitlead') && !f.name.startsWith('pm_productteamba') && !f.name.startsWith('pm_connectoba')),
      extraContent: `
        <label>Product</label>
        <select id="projProduct" data-extra>
          <option value="">None</option>
          ${products.map(p => `<option value="${p.id}">${p.pm_name}</option>`).join('')}
        </select>
        ${['Connecto PO', 'Product Team PO', 'Delivery Lead', 'IT Lead', 'Business Analyst', 'Connecto BA'].map((role, i) => {
          const names = ['pm_connectopo', 'pm_productteampo', 'pm_productteamdeliverylead', 'pm_productteamitlead', 'pm_productteamba', 'pm_connectoba'];
          return `<label>${role}</label><select id="proj${names[i]}" data-extra><option value="">None</option>${resources.map(r => `<option value="${r.id}">${r.pm_name} (${r.pm_role})</option>`).join('')}</select>`;
        }).join('')}
      `,
      onSave: async (formData) => {
        formData.pm_productname = document.getElementById('projProduct').value;
        ['pm_connectopo','pm_productteampo','pm_productteamdeliverylead','pm_productteamitlead','pm_productteamba','pm_connectoba'].forEach(f => {
          formData[f] = document.getElementById(`proj${f}`).value;
        });
        await ds.create('pm_project', formData);
        Components.modal.close();
        Components.toast('Project created!');
        Views.render('project');
      }
    });
  }

  static async _editProject(id) {
    const record = await ds.getById('pm_project', id);
    const products = await ds.getAll('pm_product');
    const resources = await ds.getAll('pm_resource');

    const projectFields = getFields('pm_project').filter(f => !f.name.startsWith('pm_productname') && !f.name.startsWith('pm_connectopo') && !f.name.startsWith('pm_productteampo') && !f.name.startsWith('pm_productteamdeliverylead') && !f.name.startsWith('pm_productteamitlead') && !f.name.startsWith('pm_productteamba') && !f.name.startsWith('pm_connectoba'));

    Components.modal.open({
      title: 'Edit Project',
      fields: projectFields,
      data: record,
      extraContent: `
        <label>Product</label>
        <select id="projProduct" data-extra>
          <option value="">None</option>
          ${products.map(p => `<option value="${p.id}" ${record.pm_productname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('')}
        </select>
        ${['Connecto PO', 'Product Team PO', 'Delivery Lead', 'IT Lead', 'Business Analyst', 'Connecto BA'].map((role, i) => {
          const names = ['pm_connectopo', 'pm_productteampo', 'pm_productteamdeliverylead', 'pm_productteamitlead', 'pm_productteamba', 'pm_connectoba'];
          return `<label>${role}</label><select id="proj${names[i]}" data-extra><option value="">None</option>${resources.map(r => `<option value="${r.id}" ${record[names[i]] === r.id ? 'selected' : ''}>${r.pm_name} (${r.pm_role})</option>`).join('')}</select>`;
        }).join('')}
      `,
      onSave: async (formData) => {
        formData.pm_productname = document.getElementById('projProduct').value;
        ['pm_connectopo','pm_productteampo','pm_productteamdeliverylead','pm_productteamitlead','pm_productteamba','pm_connectoba'].forEach(f => {
          formData[f] = document.getElementById(`proj${f}`).value;
        });
        await ds.update('pm_project', id, formData);
        Components.modal.close();
        Components.toast('Project updated!');
        Views.render('project');
      },
      onDelete: async () => {
        await ds.delete('pm_project', id);
        Components.modal.close();
        Components.toast('Project deleted!');
        Views.render('project');
      }
    });
  }

  static async _deleteProject(id) {
    if (confirm('Delete this project and all related data?')) {
      await ds.delete('pm_project', id);
      Components.toast('Project deleted!');
      Views.render('project');
    }
  }

  // ========================================
  // 6. EPIC DASHBOARD
  // ========================================
  static async epic() {
    const data = await ds.getAll('pm_epic');
    const stories = await ds.getAll('pm_userstory');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Epics' },
      { value: data.filter(e => e.pm_ragstatus === 'G').length, label: 'Green' },
      { value: data.filter(e => e.pm_ragstatus === 'A').length, label: 'Amber' },
      { value: data.filter(e => e.pm_ragstatus === 'R').length, label: 'Red' }
    ]);

    let rows = '';
    for (const epic of data) {
      const projectName = epic.pm_projectname ? await ds.getLookupName('pm_project', epic.pm_projectname) : '—';
      const storyCount = stories.filter(s => s.pm_epicid === epic.id).length;
      const ragClass = epic.pm_ragstatus === 'G' ? 'badge-green' : epic.pm_ragstatus === 'A' ? 'badge-amber' : 'badge-red';

      rows += `
        <tr>
          <td><strong>${epic.pm_title}</strong><br><small>${(epic.pm_detail || '').substring(0, 60)}</small></td>
          <td>${projectName}</td>
          <td><span class="badge ${ragClass}">${epic.pm_ragstatus || '—'}</span></td>
          <td>${epic.pm_effort || '—'}</td>
          <td>${storyCount} stories</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editEpic('${epic.id}')">✏️ Edit</button>
            <button class="btn-sm btn-link" onclick="Views._viewEpicDetails('${epic.id}')">📋 View</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteEpic('${epic.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>⚡ Epic Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newEpic()">+ New Epic</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${data.length === 0 ? '<div class="empty-state">No epics found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Epic</th><th>Project</th><th>RAG</th><th>Effort</th><th>Stories</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _viewEpicDetails(epicId) {
    const epic = await ds.getById('pm_epic', epicId);
    const stories = await ds.getUserStoriesByEpic(epicId);
    const assignments = await ds.getAssignmentsByEpic(epicId);

    let assignmentsHtml = '<p>No assignments</p>';
    if (assignments.length > 0) {
      assignmentsHtml = '<ul>';
      for (const a of assignments) {
        const name = await ds.getResourceName(a.pm_assignee);
        assignmentsHtml += `<li>${name}: ${a.pm_startdate || 'N/A'} → ${a.pm_enddate || 'Ongoing'}</li>`;
      }
      assignmentsHtml += '</ul>';
    }

    let storiesHtml = '<p>No user stories</p>';
    if (stories.length > 0) {
      storiesHtml = '<ul>';
      for (const s of stories) {
        storiesHtml += `<li><strong>${s.pm_detail}</strong><br><em>Acceptance: ${s.pm_acceptancecriteria || 'N/A'}</em></li>`;
      }
      storiesHtml += '</ul>';
    }

    Components.modal.open({
      title: `Epic: ${epic.pm_title}`,
      fields: [],
      extraContent: `
        <div class="detail-section">
          <p><strong>Project:</strong> ${epic.pm_projectname ? await ds.getLookupName('pm_project', epic.pm_projectname) : '—'}</p>
          <p><strong>Effort:</strong> ${epic.pm_effort || '—'} days | <strong>Release:</strong> ${epic.pm_releasedate || '—'}</p>
          <p><strong>RAG:</strong> ${epic.pm_ragstatus || '—'} | <strong>Jira:</strong> ${epic.pm_jiralink || '—'}</p>
          <p><strong>BA:</strong> ${await ds.getResourceName(epic.pm_businessba)} | <strong>IT BA:</strong> ${await ds.getResourceName(epic.pm_itba)}</p>
          <p><strong>Developers:</strong> ${epic.pm_developers || '—'}</p>
          <h4>👤 Assignments</h4>
          ${assignmentsHtml}
          <h4>📝 User Stories</h4>
          ${storiesHtml}
        </div>
      `,
      onSave: () => Components.modal.close()
    });
  }

  static async _newEpic() {
    const projects = await ds.getAll('pm_project');
    const resources = await ds.getAll('pm_resource');

    Components.modal.open({
      title: 'New Epic',
      fields: getFields('pm_epic').filter(f => !f.name.startsWith('pm_projectname') && !f.name.startsWith('pm_businessba') && !f.name.startsWith('pm_itba') && f.name !== 'pm_developers'),
      extraContent: `
        <label>Project</label>
        <select id="epicProject" data-extra>
          <option value="">None</option>
          ${projects.map(p => `<option value="${p.id}">${p.pm_name}</option>`).join('')}
        </select>
        <label>Business BA</label>
        <select id="epicBusinessBA" data-extra>
          <option value="">None</option>
          ${resources.filter(r => r.pm_department === 'Business').map(r => `<option value="${r.id}">${r.pm_name} (${r.pm_role})</option>`).join('')}
        </select>
        <label>IT BA</label>
        <select id="epicITBA" data-extra>
          <option value="">None</option>
          ${resources.filter(r => r.pm_department === 'IT').map(r => `<option value="${r.id}">${r.pm_name} (${r.pm_role})</option>`).join('')}
        </select>
        <label>Developers</label>
        <div class="checkbox-group" id="epicDevelopers">
          ${resources.filter(r => r.pm_department === 'IT').map(r => `<label class="checkbox-label"><input type="checkbox" value="${r.pm_name}"> ${r.pm_name} (${r.pm_role})</label>`).join('')}
        </div>
      `,
      onSave: async (formData) => {
        formData.pm_projectname = document.getElementById('epicProject').value;
        formData.pm_businessba = document.getElementById('epicBusinessBA').value;
        formData.pm_itba = document.getElementById('epicITBA').value;
        const devChecks = document.querySelectorAll('#epicDevelopers input:checked');
        formData.pm_developers = Array.from(devChecks).map(c => c.value).join(', ');
        await ds.create('pm_epic', formData);
        Components.modal.close();
        Components.toast('Epic created!');
        Views.render('epic');
      }
    });
  }

  static async _editEpic(id) {
    const record = await ds.getById('pm_epic', id);
    const projects = await ds.getAll('pm_project');
    const resources = await ds.getAll('pm_resource');
    const existingDevs = (record.pm_developers || '').split(',').map(s => s.trim());

    Components.modal.open({
      title: 'Edit Epic',
      fields: getFields('pm_epic').filter(f => !f.name.startsWith('pm_projectname') && !f.name.startsWith('pm_businessba') && !f.name.startsWith('pm_itba') && f.name !== 'pm_developers'),
      data: record,
      extraContent: `
        <label>Project</label>
        <select id="epicProject" data-extra>
          <option value="">None</option>
          ${projects.map(p => `<option value="${p.id}" ${record.pm_projectname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('')}
        </select>
        <label>Business BA</label>
        <select id="epicBusinessBA" data-extra>
          <option value="">None</option>
          ${resources.filter(r => r.pm_department === 'Business').map(r => `<option value="${r.id}" ${record.pm_businessba === r.id ? 'selected' : ''}>${r.pm_name} (${r.pm_role})</option>`).join('')}
        </select>
        <label>IT BA</label>
        <select id="epicITBA" data-extra>
          <option value="">None</option>
          ${resources.filter(r => r.pm_department === 'IT').map(r => `<option value="${r.id}" ${record.pm_itba === r.id ? 'selected' : ''}>${r.pm_name} (${r.pm_role})</option>`).join('')}
        </select>
        <label>Developers</label>
        <div class="checkbox-group" id="epicDevelopers">
          ${resources.filter(r => r.pm_department === 'IT').map(r => `<label class="checkbox-label"><input type="checkbox" value="${r.pm_name}" ${existingDevs.includes(r.pm_name) ? 'checked' : ''}> ${r.pm_name} (${r.pm_role})</label>`).join('')}
        </div>
      `,
      onSave: async (formData) => {
        formData.pm_projectname = document.getElementById('epicProject').value;
        formData.pm_businessba = document.getElementById('epicBusinessBA').value;
        formData.pm_itba = document.getElementById('epicITBA').value;
        const devChecks = document.querySelectorAll('#epicDevelopers input:checked');
        formData.pm_developers = Array.from(devChecks).map(c => c.value).join(', ');
        await ds.update('pm_epic', id, formData);
        Components.modal.close();
        Components.toast('Epic updated!');
        Views.render('epic');
      },
      onDelete: async () => {
        await ds.delete('pm_epic', id);
        Components.modal.close();
        Components.toast('Epic deleted!');
        Views.render('epic');
      }
    });
  }

  static async _deleteEpic(id) {
    if (confirm('Delete this epic?')) {
      await ds.delete('pm_epic', id);
      Components.toast('Epic deleted!');
      Views.render('epic');
    }
  }

  // ========================================
  // 7. RISK DASHBOARD
  // ========================================
  static async risk() {
    const data = await ds.getAll('pm_risk');
    const deps = await ds.getAll('pm_dependency');

    const statsHtml = Components.renderStats([
      { value: data.length, label: 'Risks' },
      { value: deps.length, label: 'Dependencies' }
    ]);

    let rows = '';
    for (const risk of data) {
      const projectName = risk.pm_projectname ? await ds.getLookupName('pm_project', risk.pm_projectname) : '—';
      const depCount = deps.filter(d => d.pm_riskid === risk.id).length;

      rows += `
        <tr>
          <td><strong>${risk.pm_summary}</strong><br><small>${(risk.pm_detail || '').substring(0, 80)}</small></td>
          <td>${projectName}</td>
          <td>${depCount}</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editRisk('${risk.id}')">✏️ Edit</button>
            <button class="btn-sm btn-link" onclick="Views._viewRiskDeps('${risk.id}')">🔗 Deps</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteRisk('${risk.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>⚠️ Risk Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newRisk()">+ New Risk</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${data.length === 0 ? '<div class="empty-state">No risks found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Risk</th><th>Project</th><th>Dependencies</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newRisk() {
    const projects = await ds.getAll('pm_project');
    Components.modal.open({
      title: 'New Risk',
      fields: getFields('pm_risk').filter(f => f.name !== 'pm_projectname'),
      extraContent: `
        <label>Project</label>
        <select id="riskProject" data-extra>
          <option value="">None</option>
          ${projects.map(p => `<option value="${p.id}">${p.pm_name}</option>`).join('')}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_projectname = document.getElementById('riskProject').value;
        await ds.create('pm_risk', formData);
        Components.modal.close();
        Components.toast('Risk created!');
        Views.render('risk');
      }
    });
  }

  static async _editRisk(id) {
    const record = await ds.getById('pm_risk', id);
    const projects = await ds.getAll('pm_project');
    Components.modal.open({
      title: 'Edit Risk',
      fields: getFields('pm_risk').filter(f => f.name !== 'pm_projectname'),
      data: record,
      extraContent: `
        <label>Project</label>
        <select id="riskProject" data-extra>
          <option value="">None</option>
          ${projects.map(p => `<option value="${p.id}" ${record.pm_projectname === p.id ? 'selected' : ''}>${p.pm_name}</option>`).join('')}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_projectname = document.getElementById('riskProject').value;
        await ds.update('pm_risk', id, formData);
        Components.modal.close();
        Components.toast('Risk updated!');
        Views.render('risk');
      },
      onDelete: async () => {
        await ds.delete('pm_risk', id);
        Components.modal.close();
        Components.toast('Risk deleted!');
        Views.render('risk');
      }
    });
  }

  static async _deleteRisk(id) { if (confirm('Delete?')) { await ds.delete('pm_risk', id); Components.toast('Deleted!'); Views.render('risk'); } }

  static async _viewRiskDeps(riskId) {
    const deps = await ds.getDependenciesByRisk(riskId);
    let depsHtml = deps.map(d => `<li><strong>${d.pm_summary}</strong>: ${d.pm_detail}</li>`).join('') || '<li>No dependencies</li>';
    Components.modal.open({
      title: 'Dependencies for Risk',
      fields: [],
      extraContent: `<ul>${depsHtml}</ul>`,
      onSave: () => Components.modal.close()
    });
  }

  // ========================================
  // 8. DEPENDENCY DASHBOARD
  // ========================================
  static async dependency() {
    const data = await ds.getAll('pm_dependency');

    let rows = '';
    for (const dep of data) {
      let riskName = '—';
      if (dep.pm_riskid) {
        const risk = await ds.getById('pm_risk', dep.pm_riskid);
        riskName = risk ? risk.pm_summary : '—';
      }

      rows += `
        <tr>
          <td><strong>${dep.pm_summary}</strong><br><small>${(dep.pm_detail || '').substring(0, 80)}</small></td>
          <td>${riskName}</td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editDependency('${dep.id}')">✏️ Edit</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteDependency('${dep.id}')">🗑️</button>
          </td>
        </tr>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>🔗 Dependency Dashboard</h2>
        <button class="btn btn-primary" onclick="Views._newDependency()">+ New Dependency</button>
      </div>
      ${data.length === 0 ? '<div class="empty-state">No dependencies found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Dependency</th><th>Linked Risk</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `}
    `;
  }

  static async _newDependency() {
    const risks = await ds.getAll('pm_risk');
    Components.modal.open({
      title: 'New Dependency',
      fields: getFields('pm_dependency').filter(f => f.name !== 'pm_riskid'),
      extraContent: `
        <label>Risk</label>
        <select id="depRisk" data-extra>
          <option value="">None</option>
          ${risks.map(r => `<option value="${r.id}">${r.pm_summary}</option>`).join('')}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_riskid = document.getElementById('depRisk').value;
        await ds.create('pm_dependency', formData);
        Components.modal.close();
        Components.toast('Dependency created!');
        Views.render('dependency');
      }
    });
  }

  static async _editDependency(id) {
    const record = await ds.getById('pm_dependency', id);
    const risks = await ds.getAll('pm_risk');
    Components.modal.open({
      title: 'Edit Dependency',
      fields: getFields('pm_dependency').filter(f => f.name !== 'pm_riskid'),
      data: record,
      extraContent: `
        <label>Risk</label>
        <select id="depRisk" data-extra>
          <option value="">None</option>
          ${risks.map(r => `<option value="${r.id}" ${record.pm_riskid === r.id ? 'selected' : ''}>${r.pm_summary}</option>`).join('')}
        </select>
      `,
      onSave: async (formData) => {
        formData.pm_riskid = document.getElementById('depRisk').value;
        await ds.update('pm_dependency', id, formData);
        Components.modal.close();
        Components.toast('Dependency updated!');
        Views.render('dependency');
      },
      onDelete: async () => {
        await ds.delete('pm_dependency', id);
        Components.modal.close();
        Components.toast('Dependency deleted!');
        Views.render('dependency');
      }
    });
  }

  static async _deleteDependency(id) { if (confirm('Delete?')) { await ds.delete('pm_dependency', id); Components.toast('Deleted!'); Views.render('dependency'); } }

  // ========================================
  // 8.5 USER STORY DASHBOARD
  // ========================================
  static async userstory() {
    const stories = await ds.getAll('pm_userstory');
    const epics = await ds.getAll('pm_epic');

    const statsHtml = Components.renderStats([
      { value: stories.length, label: 'Stories' },
      { value: [...new Set(stories.map(s => s.pm_epicid).filter(Boolean))].length, label: 'Epics' },
      { value: stories.filter(s => s.pm_acceptancecriteria).length, label: 'With AC' }
    ]);

    let rows = '';
    for (const story of stories) {
      const epic = epics.find(e => e.id === story.pm_epicid);
      rows += `
        <tr>
          <td>${story.pm_detail}</td>
          <td>${epic ? epic.pm_title : '—'}</td>
          <td><small>${story.pm_acceptancecriteria || '—'}</small></td>
          <td class="actions-cell">
            <button class="btn-sm btn-edit" onclick="Views._editUserStory('${story.id}')">✏️ Edit</button>
            <button class="btn-sm btn-delete" onclick="Views._deleteUserStory('${story.id}')">🗑️</button>
          </td>
        </tr>`;
    }

    return `
      <div class="dashboard-header">
        <h2>📝 User Stories</h2>
        <button class="btn btn-primary" onclick="Views._newUserStory()">+ New Story</button>
      </div>
      <div class="stats-row">${statsHtml}</div>
      ${stories.length === 0 ? '<div class="empty-state">No stories found.</div>' : `
        <table class="data-table">
          <thead><tr><th>Story</th><th>Epic</th><th>Acceptance Criteria</th><th>Actions</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`}`;
  }

  static async _newUserStory() {
    const epics = await ds.getAll('pm_epic');
    Components.modal.open({
      title: 'New User Story',
      fields: getFields('pm_userstory').filter(f => f.name !== 'pm_epicid'),
      extraContent: `
        <label>Epic</label>
        <select id="storyEpic" data-extra>
          <option value="">None</option>
          ${epics.map(e => `<option value="${e.id}">${e.pm_title}</option>`).join('')}
        </select>`,
      onSave: async (formData) => {
        formData.pm_epicid = document.getElementById('storyEpic').value;
        await ds.create('pm_userstory', formData);
        Components.modal.close();
        Components.toast('Story created!');
        Views.render('userstory');
      }
    });
  }

  static async _editUserStory(id) {
    const record = await ds.getById('pm_userstory', id);
    const epics = await ds.getAll('pm_epic');
    Components.modal.open({
      title: 'Edit User Story',
      fields: getFields('pm_userstory').filter(f => f.name !== 'pm_epicid'),
      data: record,
      extraContent: `
        <label>Epic</label>
        <select id="storyEpic" data-extra>
          <option value="">None</option>
          ${epics.map(e => `<option value="${e.id}" ${record.pm_epicid === e.id ? 'selected' : ''}>${e.pm_title}</option>`).join('')}
        </select>`,
      onSave: async (formData) => {
        formData.pm_epicid = document.getElementById('storyEpic').value;
        await ds.update('pm_userstory', id, formData);
        Components.modal.close();
        Components.toast('Story updated!');
        Views.render('userstory');
      },
      onDelete: async () => {
        await ds.delete('pm_userstory', id);
        Components.modal.close();
        Components.toast('Story deleted!');
        Views.render('userstory');
      }
    });
  }

  static async _deleteUserStory(id) {
    if (confirm('Delete this story?')) {
      await ds.delete('pm_userstory', id);
      Components.toast('Story deleted!');
      Views.render('userstory');
    }
  }

  // ========================================
  // 9. ROADMAP / CALENDAR VIEW
  // ========================================
  static async roadmap() {
    const products = await ds.getAll('pm_product');
    const projects = await ds.getAll('pm_project');
    const epics = await ds.getAll('pm_epic');

    // Determine state from stored or default
    if (!window._roadmapState) {
      const now = new Date();
      window._roadmapState = { view: 'month', currentDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01` };
    }
    const state = window._roadmapState;
    const [y, m, d] = state.currentDate.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    // Build timeline items from products and projects
    const items = [];

    for (const p of products) {
      if (p.pm_startdate || p.pm_targetdate) {
        items.push({
          id: p.id,
          name: p.pm_name,
          type: 'product',
          shortName: p.pm_shortname || '',
          status: p.pm_governancestatus || 'N/A',
          start: p.pm_startdate || p.pm_targetdate,
          end: p.pm_targetdate || p.pm_startdate,
          contact: p.pm_contact || ''
        });
      }
    }

    for (const p of projects) {
      if (p.pm_startdate || p.pm_targetdeliverydate) {
        const projEpics = epics.filter(e => e.pm_projectname === p.id);
        items.push({
          id: p.id,
          name: p.pm_name,
          type: 'project',
          status: p.pm_status || 'Not Started',
          start: p.pm_startdate || p.pm_targetdeliverydate,
          end: p.pm_targetdeliverydate || p.pm_startdate,
          completion: p.pm_overallcompletion || 0,
          priority: p.pm_priority || '',
          productId: p.pm_productname || '',
          epics: projEpics
        });
      }
    }

    // Items without dates
    const noDateProducts = products.filter(p => !p.pm_startdate && !p.pm_targetdate);
    const noDateProjects = projects.filter(p => !p.pm_startdate && !p.pm_targetdeliverydate);

    // Stats
    const today = new Date();
    const statsHtml = Components.renderStats([
      { value: items.length, label: 'On Roadmap' },
      { value: items.filter(i => i.type === 'product').length, label: 'Products' },
      { value: items.filter(i => i.type === 'project').length, label: 'Projects' },
      { value: items.filter(i => { const [ey, em, ed] = (i.end || '').split('-').map(Number); const endDate = new Date(ey, (em || 1) - 1, ed || 1); return endDate < today && i.status !== 'Live' && i.status !== 'Approved'; }).length, label: 'Overdue' }
    ]);

    // View toggle
    const views = ['month', 'week', 'day'];
    const viewToggle = views.map(v =>
      `<button class="btn-sm ${state.view === v ? 'btn-primary' : 'btn-reset'}" onclick="Views._roadmapSetView('${v}')">${v.charAt(0).toUpperCase() + v.slice(1)}</button>`
    ).join('');

    // Navigation
    const navLabel = Views._getRoadmapNavLabel(state.view, currentDate);

    // Calendar body
    let calendarHtml = '';
    switch (state.view) {
      case 'month': calendarHtml = Views._renderMonthCalendar(items, currentDate); break;
      case 'week': calendarHtml = Views._renderWeekCalendar(items, currentDate); break;
      case 'day': calendarHtml = Views._renderDayCalendar(items, currentDate); break;
    }

    // No-dates section
    let noDateHtml = '';
    const noDateItems = [...noDateProducts.map(p => ({ name: p.pm_name, type: 'Product' })), ...noDateProjects.map(p => ({ name: p.pm_name, type: 'Project' }))];
    if (noDateItems.length > 0) {
      noDateHtml = `
        <div class="roadmap-nodates">
          <h4>📌 Items Without Dates (${noDateItems.length})</h4>
          <div class="roadmap-nodates-list">${noDateItems.map(i => `<span class="roadmap-nodate-item"><span class="badge badge-gray">${i.type}</span> ${i.name}</span>`).join('')}</div>
        </div>
      `;
    }

    return `
      <div class="dashboard-header">
        <h2>🗓️ Roadmap</h2>
        <div class="roadmap-controls">
          <div class="roadmap-nav">
            <button class="btn-sm btn-reset" onclick="Views._roadmapPrev()">◀</button>
            <span class="roadmap-nav-label">${navLabel}</span>
            <button class="btn-sm btn-reset" onclick="Views._roadmapNext()">▶</button>
            <button class="btn-sm btn-reset" onclick="Views._roadmapToday()">Today</button>
          </div>
          <div class="roadmap-views">${viewToggle}</div>
        </div>
      </div>
      <div class="stats-row">${statsHtml}</div>
      <div class="roadmap-legend">
        <span class="legend-item"><span class="legend-dot legend-product"></span> Product</span>
        <span class="legend-item"><span class="legend-dot legend-project"></span> Project</span>
        <span class="legend-item"><span class="legend-dot legend-completed"></span> Completed</span>
        <span class="legend-item"><span class="legend-dot legend-inprogress"></span> In Progress</span>
        <span class="legend-item"><span class="legend-dot legend-pending"></span> Pending</span>
      </div>
      <div id="roadmapCalendar">${calendarHtml}</div>
      ${noDateHtml}
    `;
  }

  static _getRoadmapNavLabel(view, date) {
    const m = date.toLocaleString('default', { month: 'long' });
    const y = date.getFullYear();
    switch (view) {
      case 'month': return `${m} ${y}`;
      case 'week': {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay() + 1);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${start.toLocaleString('default', { month: 'short', day: 'numeric' })} – ${end.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      case 'day': return date.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  static _renderMonthCalendar(items, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday start

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let html = `<div class="calendar-month"><div class="calendar-header">`;
    html += dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    html += `</div><div class="calendar-grid">`;

    // Empty cells before first day
    for (let i = 0; i < startOffset; i++) {
      html += `<div class="calendar-cell calendar-cell-empty"></div>`;
    }

    // Day cells
    const today = new Date();
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const cellDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const isWeekend = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6;

      // Find items that span this day
      const dayItems = items.filter(item => {
        if (!item.start || !item.end) return false;
        const s = item.start.slice(0, 10);
        const e = item.end.slice(0, 10);
        return cellDate >= s && cellDate <= e;
      });

      // Determine first/last day for each item in this month view
      const dayItemBars = dayItems.map((item, idx) => {
        const s = item.start.slice(0, 10);
        const e = item.end.slice(0, 10);
        const isFirst = cellDate === s || (cellDate === `${year}-${String(month + 1).padStart(2, '0')}-01` && s < cellDate);
        const isLast = cellDate === e || (cellDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}` && e > cellDate);
        const cls = Views._getRoadmapItemClass(item);
        return { item, isFirst, isLast, cls };
      });

      html += `<div class="calendar-cell${isToday ? ' calendar-cell-today' : ''}${isWeekend ? ' calendar-cell-weekend' : ''}">
        <div class="calendar-cell-num">${d}</div>
        <div class="calendar-cell-items">
          ${dayItemBars.map(b => {
            const label = b.isFirst ? `<span class="roadmap-bar-label">${b.item.type === 'product' ? '📦' : '📁'} ${b.item.name.substring(0, 15)}</span>` : '';
            return `<div class="roadmap-bar ${b.cls} ${b.isFirst ? 'roadmap-bar-first' : ''} ${b.isLast ? 'roadmap-bar-last' : ''}" title="${b.item.name} (${b.item.type})" onclick="Views._roadmapItemDetail('${b.item.id}', '${b.item.type}')">${label}</div>`;
          }).join('')}
        </div>
      </div>`;
    }

    html += `</div></div>`;
    return html;
  }

  static _renderWeekCalendar(items, date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    let html = `<div class="calendar-week"><div class="calendar-week-header">`;
    html += `<div class="calendar-week-label">Item</div>`;
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const isToday = dateStr === new Date().toISOString().slice(0, 10);
      html += `<div class="calendar-week-day${isToday ? ' calendar-week-today' : ''}">
        <div>${dayNames[i]}</div>
        <div class="calendar-week-date">${d.getDate()}</div>
      </div>`;
    }
    html += `</div><div class="calendar-week-body">`;

    // Filter items that overlap with this week
    const weekEnd = new Date(startOfWeek);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekStartStr = startOfWeek.toISOString().slice(0, 10);
    const weekEndStr = weekEnd.toISOString().slice(0, 10);

    const weekItems = items.filter(item => {
      if (!item.start || !item.end) return false;
      return item.start <= weekEndStr && item.end >= weekStartStr;
    });

    // Sort by start date
    weekItems.sort((a, b) => (a.start || '').localeCompare(b.start || ''));

    for (const item of weekItems) {
      const cls = Views._getRoadmapItemClass(item);
      const itemStart = item.start.slice(0, 10);
      const itemEnd = item.end.slice(0, 10);

      html += `<div class="calendar-week-row">
        <div class="calendar-week-label">
          <span class="roadmap-bar-label">${item.type === 'product' ? '📦' : '📁'} ${item.name}</span>
        </div>`;

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const inRange = dateStr >= itemStart && dateStr <= itemEnd;
        const isFirst = dateStr === itemStart || (i === 0 && itemStart < weekStartStr);
        const isLast = dateStr === itemEnd || (i === 6 && itemEnd > weekEndStr);

        html += `<div class="calendar-week-cell">
          ${inRange ? `<div class="roadmap-bar roadmap-bar-week ${cls} ${isFirst ? 'roadmap-bar-first' : ''} ${isLast ? 'roadmap-bar-last' : ''}" title="${item.name}" onclick="Views._roadmapItemDetail('${item.id}', '${item.type}')"></div>` : ''}
        </div>`;
      }
      html += `</div>`;
    }

    if (weekItems.length === 0) {
      html += `<div class="calendar-week-row"><div class="calendar-week-label" style="grid-column:1/-1;text-align:center;padding:20px;color:var(--text-muted)">No items this week</div></div>`;
    }

    html += `</div></div>`;
    return html;
  }

  static _renderDayCalendar(items, date) {
    const dateStr = date.toISOString().slice(0, 10);
    const dayName = date.toLocaleString('default', { weekday: 'long' });

    // Filter items for this day
    const dayItems = items.filter(item => {
      if (!item.start || !item.end) return false;
      return item.start.slice(0, 10) <= dateStr && item.end.slice(0, 10) >= dateStr;
    });

    let html = `<div class="calendar-day">
      <h3>${dayName}, ${date.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>`;

    if (dayItems.length === 0) {
      html += `<div class="empty-state">No items scheduled for this day</div>`;
    } else {
      html += `<div class="calendar-day-list">`;
      for (const item of dayItems) {
        const cls = Views._getRoadmapItemClass(item);
        const icon = item.type === 'product' ? '📦' : '📁';
        const dates = `${item.start} → ${item.end}`;
        const extra = item.type === 'project' ? `<br><small>${item.completion}% complete | Priority: ${item.priority || '—'}</small>` : '';
        html += `<div class="calendar-day-item ${cls}" onclick="Views._roadmapItemDetail('${item.id}', '${item.type}')">
          <div class="calendar-day-item-header">
            <span class="calendar-day-item-icon">${icon}</span>
            <strong>${item.name}</strong>
            <span class="badge ${cls}">${item.status}</span>
          </div>
          <div class="calendar-day-item-dates">${dates}${extra}</div>
        </div>`;
      }
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  }

  static _getRoadmapItemClass(item) {
    const st = item.status || '';
    if (st === 'Live' || st === 'Approved') return 'badge-green';
    if (st === 'Development Phase 1' || st === 'Development Phase 2') return 'badge-blue';
    if (st === 'Onboarding' || st === 'Review' || st === 'Pending') return 'badge-amber';
    if (st === 'Rejected' || st === 'N/A') return 'badge-gray';
    return 'badge-blue';
  }

  // Roadmap navigation
  static _roadmapPrev() {
    const state = window._roadmapState;
    const [y, m, d] = state.currentDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    switch (state.view) {
      case 'month': dt.setMonth(dt.getMonth() - 1); dt.setDate(1); break;
      case 'week': dt.setDate(dt.getDate() - 7); break;
      case 'day': dt.setDate(dt.getDate() - 1); break;
    }
    state.currentDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    Views.render('roadmap');
  }

  static _roadmapNext() {
    const state = window._roadmapState;
    const [y, m, d] = state.currentDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    switch (state.view) {
      case 'month': dt.setMonth(dt.getMonth() + 1); dt.setDate(1); break;
      case 'week': dt.setDate(dt.getDate() + 7); break;
      case 'day': dt.setDate(dt.getDate() + 1); break;
    }
    state.currentDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    Views.render('roadmap');
  }

  static _roadmapToday() {
    const now = new Date();
    window._roadmapState.currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    Views.render('roadmap');
  }

  static _roadmapSetView(view) {
    window._roadmapState.view = view;
    Views.render('roadmap');
  }

  static async _roadmapItemDetail(id, type) {
    let record;
    if (type === 'project') {
      record = await ds.getById('pm_project', id);
    } else {
      record = await ds.getById('pm_product', id);
    }

    if (!record) { Components.toast('Item not found', 'error'); return; }

    let extraHtml = `<div class="detail-section">`;
    if (type === 'project') {
      extraHtml += `
        <p><strong>Status:</strong> ${record.pm_status || '—'}</p>
        <p><strong>Start:</strong> ${record.pm_startdate || '—'} → <strong>Target:</strong> ${record.pm_targetdeliverydate || '—'}</p>
        <p><strong>Completion:</strong> ${record.pm_overallcompletion || 0}% | <strong>Priority:</strong> ${record.pm_priority || '—'}</p>
        <p><strong>PSC:</strong> ${record.pm_psc || '—'} | <strong>Q:</strong> ${record.pm_yearquarter || '—'}</p>
        ${record.pm_scope ? `<p><strong>Scope:</strong> ${record.pm_scope}</p>` : ''}
      `;
    } else {
      extraHtml += `
        <p><strong>Governance:</strong> ${record.pm_governancestatus || '—'}</p>
        <p><strong>Start:</strong> ${record.pm_startdate || '—'} → <strong>Target:</strong> ${record.pm_targetdate || '—'}</p>
        <p><strong>Contact:</strong> ${record.pm_contact || '—'}</p>
        <p><strong>Journey:</strong> ${record.pm_journeyname || '—'} (${record.pm_shortname || ''})</p>
      `;
    }
    extraHtml += `</div>`;

    Components.modal.open({
      title: `${type === 'project' ? '📁' : '📦'} ${record.pm_name || record.pm_title}`,
      fields: [],
      extraContent: extraHtml,
      onSave: () => Components.modal.close()
    });
  }
}
