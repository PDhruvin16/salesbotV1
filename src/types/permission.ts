import { ModulePermission as PermissionState } from '../lib/authApi';

export interface Permission {
  permissions: PermissionState[];
}

export { PermissionState };
