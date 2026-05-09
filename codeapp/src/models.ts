export type FieldDef = {
  name: string
  label: string
  type?: string
  required?: boolean
  choices?: string[]
  target?: string
}

export type Model = {
  name: string
  fields: FieldDef[]
}

export type TableMeta = {
  entitySet?: string
  pk?: string
}

export const MODELS: Record<string, Model> = {
  pm_resource: {
    name: 'Resource',
    fields: [
      { name: 'pm_name', label: 'Name', type: 'text', required: true },
      { name: 'pm_role', label: 'Role', type: 'text', required: true },
      { name: 'pm_department', label: 'Department', type: 'choice', choices: ['IT', 'Business'], required: true },
      { name: 'pm_team', label: 'Team', type: 'choice', choices: ['Alpha','Beta','Gamma','Delta','Platform','Business'] },
      { name: 'pm_email', label: 'Email', type: 'email' },
      { name: 'pm_joineddate', label: 'Joined Date', type: 'date', required: true },
      { name: 'pm_leavedate', label: 'Leave Date', type: 'date' },
      { name: 'pm_cost', label: 'Cost (Monthly)', type: 'number' },
      { name: 'pm_status', label: 'Status', type: 'choice', choices: ['Active','Inactive','On Leave'], required: true }
    ]
  }
  ,
  pm_product: {
    name: 'Product',
    fields: [
      { name: 'pm_name', label: 'Product Name', type: 'text', required: true },
      { name: 'pm_journeyname', label: 'Journey Name', type: 'text' },
      { name: 'pm_shortname', label: 'Short Name', type: 'text' },
      { name: 'pm_governancestatus', label: 'Governance Status', type: 'choice', choices: ['Approved','Pending','Rejected','N/A'] }
    ]
  },
  pm_project: {
    name: 'Project',
    fields: [
      { name: 'pm_name', label: 'Project Name', type: 'text', required: true },
      { name: 'pm_productname', label: 'Product', type: 'lookup', target: 'pm_product' },
      { name: 'pm_startdate', label: 'Start Date', type: 'date' },
      { name: 'pm_targetdeliverydate', label: 'Target Delivery Date', type: 'date' },
      { name: 'pm_status', label: 'Project Status', type: 'choice', choices: ['Onboarding','Development Phase 1','Development Phase 2','Review','Live'] }
    ]
  },
  pm_capability: {
    name: 'Capability',
    fields: [
      { name: 'pm_name', label: 'Capability Name', type: 'text', required: true },
      { name: 'pm_description', label: 'Description', type: 'multiline' }
    ]
  },
  pm_requirement: {
    name: 'Requirement',
    fields: [
      { name: 'pm_detail', label: 'Requirement Detail', type: 'multiline', required: true },
      { name: 'pm_capabilityid', label: 'Capability', type: 'lookup', target: 'pm_capability' },
      { name: 'pm_productname', label: 'Product', type: 'lookup', target: 'pm_product' },
      { name: 'pm_status', label: 'Status', type: 'choice', choices: ['New','Prioritized','Linked'] },
      { name: 'pm_pscapprovalrequired', label: 'PSC Approval Required', type: 'choice', choices: ['Yes','No'] },
      { name: 'pm_pscapprovalstatus', label: 'PSC Approval Status', type: 'choice', choices: ['Pending','Approved','Rejected','N/A'] }
    ]
  },
  pm_epic: {
    name: 'Epic',
    fields: [
      { name: 'pm_title', label: 'Epic Title', type: 'text', required: true },
      { name: 'pm_detail', label: 'Epic Detail', type: 'multiline' },
      { name: 'pm_projectname', label: 'Project', type: 'lookup', target: 'pm_project' },
      { name: 'pm_ragstatus', label: 'RAG Status', type: 'choice', choices: ['G','A','R'] }
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
  },
  pm_capabilityproduct: {
    name: 'Capability-Product Link',
    fields: [
      { name: 'pm_capability', label: 'Capability', type: 'lookup', target: 'pm_capability', required: true },
      { name: 'pm_product', label: 'Product', type: 'lookup', target: 'pm_product', required: true }
    ]
  },
  pm_control: {
    name: 'Control',
    fields: [
      { name: 'pm_name', label: 'Control Name', type: 'text', required: true },
      { name: 'pm_description', label: 'Description', type: 'multiline' },
      { name: 'pm_type', label: 'Type', type: 'choice', choices: ['Gate','Review','Audit','Checklist','Sign-off'] },
      { name: 'pm_status', label: 'Status', type: 'choice', choices: ['Planned','In Progress','Passed','Failed','Waived'] },
      { name: 'pm_project', label: 'Project', type: 'lookup', target: 'pm_project', required: true },
      { name: 'pm_responsible', label: 'Responsible', type: 'lookup', target: 'pm_resource' }
    ]
  },
  pm_assignment: {
    name: 'Assignment',
    fields: [
      { name: 'pm_resource', label: 'Resource', type: 'lookup', target: 'pm_resource', required: true },
      { name: 'pm_epic', label: 'Epic', type: 'lookup', target: 'pm_epic', required: true },
      { name: 'pm_role', label: 'Role', type: 'text' },
      { name: 'pm_allocationpct', label: 'Allocation %', type: 'number' }
    ]
  }
}

export function getFields(tableName: string) {
  return MODELS[tableName] ? MODELS[tableName].fields : []
}

export const TABLE_META: Record<string, TableMeta> = {
  pm_resource:  { pk: 'pm_resourceid',  entitySet: 'pm_resources' },
  pm_capability:{ pk: 'pm_capabilityid', entitySet: 'pm_capabilities' },
  pm_product:   { pk: 'pm_productid',   entitySet: 'pm_products' },
  pm_capabilityproduct: { pk: 'pm_capabilityproductid', entitySet: 'pm_capabilityproducts' },
  pm_requirement:{ pk: 'pm_requirementid', entitySet: 'pm_requirements' },
  pm_project:   { pk: 'pm_projectid',   entitySet: 'pm_projects' },
  pm_control:   { pk: 'pm_controlid',   entitySet: 'pm_controls' },
  pm_epic:      { pk: 'pm_epicid',      entitySet: 'pm_epics' },
  pm_userstory: { pk: 'pm_userstoryid', entitySet: 'pm_userstories' },
  pm_assignment:{ pk: 'pm_assignmentid', entitySet: 'pm_assignments' },
  pm_risk:      { pk: 'pm_riskid',      entitySet: 'pm_risks' },
  pm_dependency:{ pk: 'pm_dependencyid', entitySet: 'pm_dependencies' },
}

export function getTableMeta(tableName: string): TableMeta{
  return TABLE_META[tableName] || { pk: `${tableName}id`, entitySet: `${tableName}s` }
}
