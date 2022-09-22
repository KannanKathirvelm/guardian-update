import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { guardianRouterPath } from '@constants/router-constants';
import { routerPath } from '@shared/constants/router-constants';
import { AppAuthGuard } from './app.auth.guard';
import { LoginAuthGuardService } from './login.auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: guardianRouterPath('introSlider'),
    pathMatch: 'full'
  },
  {
    path: guardianRouterPath('introSlider'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/intro-slider/intro-slider.module').then(m => m.IntroSliderPageModule)
  },
  {
    path: guardianRouterPath('login'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: guardianRouterPath('signup'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/signup/signup.module').then(m => m.SignupPageModule),
    data: {
      isAllowInBrowser: true
    }
  },
  {
    path: guardianRouterPath('emailApproval'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/email-approval/email-approval.module').then(m => m.EmailApprovalPageModule),
    data: {
      isAllowInBrowser: true
    }
  },
  {
    path: guardianRouterPath('emailVerify'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/email-verify/email-verify.module').then(m => m.EmailVerifyPageModule),
    data: {
      isAllowInBrowser: true
    }
  },
  {
    path: guardianRouterPath('appDownload'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/download-app/download-app.module').then(m => m.DownloadAppPageModule),
    data: {
      isAllowInBrowser: true
    }
  },
  {
    path: guardianRouterPath('forgotPassword'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: guardianRouterPath('resetPassword'),
    canActivate: [LoginAuthGuardService],
    loadChildren: () => import('@pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
  {
    path: guardianRouterPath('guardianHome'),
    canActivate: [AppAuthGuard],
    loadChildren: () => import('@pages/guardian-home/guardian-home.module').then(m => m.GuardianHomePageModule)
  },
  {
    path: routerPath('class'),
    canActivate: [AppAuthGuard],
    loadChildren: () => import('@shared/pages/class/class.module').then(m => m.ClassPageModule)
  },
  {
    path: routerPath('portfolio'),
    canActivate: [AppAuthGuard],
    loadChildren: () => import('@shared/pages/portfolio/portfolio.module').then(m => m.PortfolioPageModule)
  },
  {
    path: routerPath('myLearnerIdentity'),
    canActivate: [AppAuthGuard],
    loadChildren: () => import('@shared/pages/my-learner-identity/my-learner-identity.module').then(m => m.MyLearnerIdentityPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
