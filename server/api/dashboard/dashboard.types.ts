// dashboard.types.ts
const TYPES_DASHBOARD = {
  DashboardController: Symbol.for('DashboardController'),
  DashboardService: Symbol.for('DashboardService'),
  DashboardRepository: Symbol.for('DashboardRepository'),
  databaseConnection: Symbol.for('DataBaseConnection')
};

export default TYPES_DASHBOARD;
