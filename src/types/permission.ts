export interface PermissionState {
  module_name: string;
  permissions: string;
  is_select: true;
  is_disable: false;
}

export interface Permission {
  permissions: PermissionState[];
}
