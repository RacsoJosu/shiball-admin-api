// role.types.ts
const TYPES_ROLE = {
  RoleController: Symbol.for('RoleController'),
  RoleService: Symbol.for('RoleService'),
  RoleRepository: Symbol.for('RoleRepository'),
  databaseConnection: Symbol.for('DataBaseConnection')
};

export default TYPES_ROLE;
