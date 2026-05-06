// ============================================================
// models.js — All 12 entity schemas & relationships
// ============================================================

const MODELS = {
  pm_resource: {
    name: 'Resource',
    fields: [
      { name: 'pm_name', label: 'Name', type: 'text', required: true },
      { name: 'pm_role', label: 'Role', type: 'text', required: true },
      { name: 'pm_department', label: 'Department', type: 'choice', choices: ['IT', 'Business'], required: true },
      { name: 'pm_email', label: 'Email', type: 'email' },
      { name: 'pm_joineddate', label: 'Joined Date', type: 'date', required: true },
      { name: 'pm_leavedate', label: 'Leave Date', type: 'date' },
      { name: 'pm_cost', label: 'Cost (Monthly)', type: 'number', step: '0.01' },
      { name: 'pm_status', label: 'Status', type: 'choice', choices: ['Active', 'Inactive', 'On Leave'], required: true }
    ],
    relationships: {
      hasMany: ['pm_assignment'],
      linkedTo: ['pm_project', 'pm_epic', 'pm_requirement']
    }
  },

  pm_capability: {
    name: 'Capability',
    fields: [
      { name: 'pm_name', label: 'Capability Name', type: 'text', required: true },
      { name: 'pm_description', label: 'Description', type: 'multiline' }
    ]
  },

  pm_product: {
    name: 'Product',
    fields: [
      { name: 'pm_name', label: 'Product Name', type: 'text', required: true },
      { name: 'pm_journeyname', label: 'Journey Name', type: 'text' },
      { name: 'pm_shortname', label: 'Short Name', type: 'text' },
      { name: 'pm_governancestatus', label: 'Governance Status', type: 'choice', choices: ['Approved', 'Pending', 'Rejected', 'N/A'] },
      { name: 'pm_contact', label: 'Contact', type: 'text' }
    ]
  },

  pm_capabilityproduct: {
    name: 'Capability-Product Link',
    fields: [
      { name: 'pm_capabilityid', label: 'Capability', type: 'lookup', target: 'pm_capability', required: true },
      { name: 'pm_productname', label: 'Product', type: 'lookup', target: 'pm_product', required: true }
    ],
    isLinkingTable: true
  },

  pm_requirement: {
    name: 'Requirement',
    fields: [
      { name: 'pm_detail', label: 'Requirement Detail', type: 'multiline', required: true },
      { name: 'pm_capabilityid', label: 'Capability', type: 'lookup', target: 'pm_capability' },
      { name: 'pm_productname', label: 'Product', type: 'lookup', target: 'pm_product' },
      { name: 'pm_projectname', label: 'Project', type: 'lookup', target: 'pm_project' },
      { name: 'pm_controlid', label: 'Control ID', type: 'text' },
      { name: 'pm_status', label: 'Status', type: 'choice', choices: ['New', 'Prioritized', 'Linked'], required: true },
      { name: 'pm_supportingdocs', label: 'Supporting Documents', type: 'multiline' },
      { name: 'pm_pscapprovalrequired', label: 'PSC Approval Required', type: 'choice', choices: ['Yes', 'No'], required: true },
      { name: 'pm_pscapprovalstatus', label: 'PSC Approval Status', type: 'choice', choices: ['Pending', 'Approved', 'Rejected', 'N/A'] }
    ]
  },

  pm_project: {
    name: 'Project',
    fields: [
      { name: 'pm_name', label: 'Project Name', type: 'text', required: true },
      { name: 'pm_productname', label: 'Product', type: 'lookup', target: 'pm_product' },
      { name: 'pm_startdate', label: 'Start Date', type: 'date' },
      { name: 'pm_targetdeliverydate', label: 'Target Delivery Date', type: 'date' },
      { name: 'pm_status', label: 'Project Status', type: 'choice', choices: ['Not Started', 'In Progress', 'Completed', 'On Hold'], required: true },
      { name: 'pm_estimateeffort', label: 'Estimate Effort (days)', type: 'number' },
      { name: 'pm_overallcompletion', label: 'Overall Completion (%)', type: 'number', min: 0, max: 100 },
      { name: 'pm_enhancementtype', label: 'Enhancement Type', type: 'choice', choices: ['New Integration', 'BAU Enhancement'] },
      { name: 'pm_connectopo', label: 'Connecto PO', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_productteampo', label: 'Product Team PO', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_productteamdeliverylead', label: 'Product Team Delivery Lead', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_productteamitlead', label: 'Product Team IT Lead', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_productteamba', label: 'Product Team Business Analyst', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_connectoba', label: 'Connecto Business Analyst', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_scope', label: 'Scope', type: 'multiline' },
      { name: 'pm_psc', label: 'PSC', type: 'text' },
      { name: 'pm_priority', label: 'Priority', type: 'choice', choices: ['Low', 'Medium', 'High', 'Critical'] },
      { name: 'pm_yearquarter', label: 'Year/Quarter', type: 'text' }
    ]
  },

  pm_control: {
    name: 'Control',
    fields: [
      { name: 'pm_detail', label: 'Control Detail', type: 'multiline', required: true },
      { name: 'pm_projectname', label: 'Project', type: 'lookup', target: 'pm_project' }
    ]
  },

  pm_epic: {
    name: 'Epic',
    fields: [
      { name: 'pm_title', label: 'Epic Title', type: 'text', required: true },
      { name: 'pm_detail', label: 'Epic Detail', type: 'multiline' },
      { name: 'pm_projectname', label: 'Project', type: 'lookup', target: 'pm_project' },
      { name: 'pm_jiralink', label: 'Jira Link', type: 'text' },
      { name: 'pm_effort', label: 'Effort (days)', type: 'number' },
      { name: 'pm_releasedate', label: 'Release Date', type: 'date' },
      { name: 'pm_startdate', label: 'Start Date', type: 'date' },
      { name: 'pm_completeddate', label: 'Completed Date', type: 'date' },
      { name: 'pm_ragstatus', label: 'RAG Status', type: 'choice', choices: ['G', 'A', 'R'] },
      { name: 'pm_businessba', label: 'Business BA', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_itba', label: 'IT BA', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_developers', label: 'Developer(s)', type: 'text' }
    ]
  },

  pm_userstory: {
    name: 'User Story',
    fields: [
      { name: 'pm_detail', label: 'User Story Detail', type: 'multiline', required: true },
      { name: 'pm_epicid', label: 'Epic', type: 'lookup', target: 'pm_epic' },
      { name: 'pm_acceptancecriteria', label: 'Acceptance Criteria', type: 'multiline' }
    ]
  },

  pm_assignment: {
    name: 'Assignment',
    fields: [
      { name: 'pm_epicid', label: 'Epic', type: 'lookup', target: 'pm_epic' },
      { name: 'pm_assignee', label: 'Assignee', type: 'lookup', target: 'pm_resource' },
      { name: 'pm_startdate', label: 'Start Date', type: 'date' },
      { name: 'pm_enddate', label: 'End Date', type: 'date' }
    ]
  },

  pm_risk: {
    name: 'Risk',
    fields: [
      { name: 'pm_summary', label: 'Risk Summary', type: 'text', required: true },
      { name: 'pm_detail', label: 'Risk Detail', type: 'multiline' },
      { name: 'pm_projectname', label: 'Project', type: 'lookup', target: 'pm_project' }
    ]
  },

  pm_dependency: {
    name: 'Dependency',
    fields: [
      { name: 'pm_summary', label: 'Dependency Summary', type: 'text', required: true },
      { name: 'pm_detail', label: 'Dependency Detail', type: 'multiline' },
      { name: 'pm_riskid', label: 'Risk', type: 'lookup', target: 'pm_risk' }
    ]
  }
};

// Relationship mapping
const RELATIONSHIPS = {
  pm_resource: { hasMany: ['pm_assignment'], refersIn: ['pm_project', 'pm_epic', 'pm_requirement'] },
  pm_capability: { hasMany: ['pm_capabilityproduct', 'pm_requirement'] },
  pm_product: { hasMany: ['pm_capabilityproduct', 'pm_requirement', 'pm_project'] },
  pm_capabilityproduct: { belongsTo: ['pm_capability', 'pm_product'] },
  pm_requirement: { belongsTo: ['pm_capability', 'pm_product', 'pm_project'] },
  pm_project: { belongsTo: ['pm_product'], hasMany: ['pm_control', 'pm_epic', 'pm_risk', 'pm_requirement'] },
  pm_control: { belongsTo: ['pm_project'] },
  pm_epic: { belongsTo: ['pm_project'], hasMany: ['pm_userstory', 'pm_assignment'] },
  pm_userstory: { belongsTo: ['pm_epic'] },
  pm_assignment: { belongsTo: ['pm_epic', 'pm_resource'] },
  pm_risk: { belongsTo: ['pm_project'], hasMany: ['pm_dependency'] },
  pm_dependency: { belongsTo: ['pm_risk'] }
};

// Get field definition helper
function getFields(tableName) {
  return MODELS[tableName] ? MODELS[tableName].fields : [];
}

function getModelName(tableName) {
  return MODELS[tableName] ? MODELS[tableName].name : tableName;
}
