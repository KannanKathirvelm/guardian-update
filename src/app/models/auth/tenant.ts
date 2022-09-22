export interface TenantModel {
  tenantId: string;
  imageUrl?: string;
  loginType?: string;
  tenantName?: string;
  shortName?: string;
  tenantShortName?: string;
  tenantRoot?: string;
  settings?: {
    allowMultiGradeClass: string;
    enableClsVideoConfSetup: string;
  };
}
