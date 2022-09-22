import { guardianRouterPathStartWithSlash } from '@constants/router-constants';
import { environment } from '@environment/environment';
import { EmailApprovalPage } from '@pages/email-approval/email-approval.page';
import { EmailVerifyPage } from '@pages/email-verify/email-verify.page';
import { ResetPasswordPage } from '@pages/reset-password/reset-password.page';
import { formUrlQueryParameters } from '@shared/utils/global';

const DEEPLINK_ROUTES = [
  {
    route: 'resetPassword',
    component: ResetPasswordPage
  },
  {
    route: 'emailApproval',
    component: EmailApprovalPage
  },
  {
    route: 'emailVerify',
    component: EmailVerifyPage
  }
];

export const NO_AUTHENTICATION_NEED_ROUTES = [
  guardianRouterPathStartWithSlash('emailApproval'),
  guardianRouterPathStartWithSlash('resetPassword'),
  guardianRouterPathStartWithSlash('emailVerify')
];

export function deeplinkRoutes() {
  const deeplinkObj = {};
  DEEPLINK_ROUTES.forEach((item) => {
    const routePath = guardianRouterPathStartWithSlash(item.route);
    deeplinkObj[routePath] = item.component;
  });
  return deeplinkObj;
}

export function formShareUrl(pathName, context) {
  const routePath = guardianRouterPathStartWithSlash(pathName);
  const queryParams = formUrlQueryParameters(context);
  return `${environment.API_END_POINT}${routePath}?${queryParams}`;
}
