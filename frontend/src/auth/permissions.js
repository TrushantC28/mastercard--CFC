export const ROLES = {
  VOLUNTEER: 'Volunteer',
  SPOC: 'Corporate SPOC',
  ADMIN: 'Admin'
};

export const checkPermission = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
