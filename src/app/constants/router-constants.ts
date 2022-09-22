const ROUTER_PATH = {
  introSlider: 'intro-slider',
  login: 'login',
  guardianHome: 'guardian-home',
  studentClass: 'class/:id/student',
  portfolio: 'portfolio/:id',
  emailApproval: 'approval',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
  signup: 'signup',
  emailVerify: 'email/verify',
  appDownload: 'download-app'
};

export function guardianRouterPath(pathname) {
  return ROUTER_PATH[pathname];
}

export function guardianRouterPathStartWithSlash(pathname) {
  return '/' + ROUTER_PATH[pathname];
}

export function guardianRouterPathIdReplace(pathname, id) {
  const path = ROUTER_PATH[pathname];
  return '/' + path.replace(':id', id);
}
