// ============================================================
// data.js — Data layer with DEV (localStorage) & PROD (Dataverse) modes
// ============================================================

const APP_CONFIG = {
  // 🔄 Change to 'PROD' when deploying to Power Apps
  MODE: 'DEV',

  TABLES: {
    RESOURCE: 'pm_resource',
    CAPABILITY: 'pm_capability',
    PRODUCT: 'pm_product',
    CAPABILITY_PRODUCT: 'pm_capabilityproduct',
    REQUIREMENT: 'pm_requirement',
    PROJECT: 'pm_project',
    CONTROL: 'pm_control',
    EPIC: 'pm_epic',
    USERSTORY: 'pm_userstory',
    ASSIGNMENT: 'pm_assignment',
    RISK: 'pm_risk',
    DEPENDENCY: 'pm_dependency'
  }
};

class DataService {
  constructor() {
    this.mode = APP_CONFIG.MODE;
  }

  // ========== CREATE ==========
  async create(table, record) {
    if (this.mode === 'DEV') return this._createLocal(table, record);
    if (this.mode === 'PROD') return this._createDataverse(table, record);
  }

  // ========== READ ALL ==========
  async getAll(table) {
    if (this.mode === 'DEV') return this._getAllLocal(table);
    if (this.mode === 'PROD') return this._getAllDataverse(table);
  }

  // ========== READ BY ID ==========
  async getById(table, id) {
    if (this.mode === 'DEV') return this._getByIdLocal(table, id);
    if (this.mode === 'PROD') return this._getByIdDataverse(table, id);
  }

  // ========== UPDATE ==========
  async update(table, id, data) {
    if (this.mode === 'DEV') return this._updateLocal(table, id, data);
    if (this.mode === 'PROD') return this._updateDataverse(table, id, data);
  }

  // ========== DELETE ==========
  async delete(table, id) {
    if (this.mode === 'DEV') return this._deleteLocal(table, id);
    if (this.mode === 'PROD') return this._deleteDataverse(table, id);
  }

  // ========== QUERY (filter) ==========
  async query(table, filters = {}) {
    const all = await this.getAll(table);
    return all.filter(record => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true;
        const val = record[key];
        const filterVal = filters[key];
        if (typeof filterVal === 'string') {
          return val && val.toString().toLowerCase().includes(filterVal.toLowerCase());
        }
        return val === filterVal;
      });
    });
  }

  // ========== SPECIAL QUERIES ==========

  // Get products linked to a capability via the linking table
  async getProductsByCapability(capabilityId) {
    const links = await this.query('pm_capabilityproduct', { pm_capabilityid: capabilityId });
    const allProducts = await this.getAll('pm_product');
    return links.map(link => {
      return allProducts.find(p => p.id === link.pm_productname);
    }).filter(Boolean);
  }

  // Get capabilities linked to a product
  async getCapabilitiesByProduct(productId) {
    const links = await this.query('pm_capabilityproduct', { pm_productname: productId });
    const allCapabilities = await this.getAll('pm_capability');
    return links.map(link => {
      return allCapabilities.find(c => c.id === link.pm_capabilityid);
    }).filter(Boolean);
  }

  // Get requirements by capability
  async getRequirementsByCapability(capabilityId) {
    return this.query('pm_requirement', { pm_capabilityid: capabilityId });
  }

  // Get requirements by project
  async getRequirementsByProject(projectId) {
    return this.query('pm_requirement', { pm_projectname: projectId });
  }

  // Get epics by project
  async getEpicsByProject(projectId) {
    return this.query('pm_epic', { pm_projectname: projectId });
  }

  // Get user stories by epic
  async getUserStoriesByEpic(epicId) {
    return this.query('pm_userstory', { pm_epicid: epicId });
  }

  // Get assignments by epic
  async getAssignmentsByEpic(epicId) {
    return this.query('pm_assignment', { pm_epicid: epicId });
  }

  // Get risks by project
  async getRisksByProject(projectId) {
    return this.query('pm_risk', { pm_projectname: projectId });
  }

  // Get dependencies by risk
  async getDependenciesByRisk(riskId) {
    return this.query('pm_dependency', { pm_riskid: riskId });
  }

  // Get all linked items for a resource
  async getResourceWorkload(resourceId) {
    const assignments = await this.query('pm_assignment', { pm_assignee: resourceId });
    return assignments;
  }

  // Get resource name by ID
  async getResourceName(resourceId) {
    if (!resourceId) return '—';
    const r = await this.getById('pm_resource', resourceId);
    return r ? r.pm_name : '—';
  }

  // Get lookup display name (generic)
  async getLookupName(table, id) {
    if (!id) return '—';
    const record = await this.getById(table, id);
    return record ? (record.pm_name || record.pm_title || record.pm_detail || record.pm_summary || record.id) : '—';
  }

  // ========== DEV MODE (localStorage) ==========

  _createLocal(table, record) {
    const data = JSON.parse(localStorage.getItem(table) || '[]');
    record.id = `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    data.push(record);
    localStorage.setItem(table, JSON.stringify(data));
    return record;
  }

  _getAllLocal(table) {
    return JSON.parse(localStorage.getItem(table) || '[]');
  }

  _getByIdLocal(table, id) {
    const data = this._getAllLocal(table);
    return data.find(r => r.id === id) || null;
  }

  _updateLocal(table, id, updates) {
    const data = this._getAllLocal(table);
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...updates };
    localStorage.setItem(table, JSON.stringify(data));
    return data[index];
  }

  _deleteLocal(table, id) {
    const data = this._getAllLocal(table);
    const filtered = data.filter(r => r.id !== id);
    localStorage.setItem(table, JSON.stringify(filtered));
    return true;
  }

  // ========== PROD MODE (Dataverse Xrm.WebApi) ==========

  async _createDataverse(table, record) {
    const result = await Xrm.WebApi.createRecord(table, record);
    return result;
  }

  async _getAllDataverse(table) {
    const result = await Xrm.WebApi.retrieveMultipleRecords(table, '?$select=*');
    return result.entities;
  }

  async _getByIdDataverse(table, id) {
    return await Xrm.WebApi.retrieveRecord(table, id, '?$select=*');
  }

  async _updateDataverse(table, id, data) {
    return await Xrm.WebApi.updateRecord(table, id, data);
  }

  async _deleteDataverse(table, id) {
    return await Xrm.WebApi.deleteRecord(table, id);
  }
}

// Global instance
const ds = new DataService();
console.log(`🗄️ DataService initialized in ${ds.mode} mode`);
