import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HubsComponent } from './components/hubs/hubs.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminScholarsComponent } from './components/admin-scholars/admin-scholars.component';
import { MorePeopleComponent } from './components/more-people/more-people.component';
import { AdminApplicationsComponent } from './components/admin-applications/admin-applications.component';
import { AdminAwardedComponent } from './components/admin-awarded/admin-awarded.component';
import { UserProfileHomeComponent } from './components/user-profile-home/user-profile-home.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { AdminChaptersComponent } from './components/admin-chapters/admin-chapters.component';
import { AdminChapterHomeComponent } from './components/admin-chapter-home/admin-chapter-home.component';
import { AdminEventsHomeComponent } from './components/admin-events-home/admin-events-home.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { AdminRolesComponent } from './components/admin-roles/admin-roles.component';
import { AdminWftsTableComponent } from './components/admin-wfts-table/admin-wfts-table.component';
import { AdminElpsTableComponent } from './components/admin-elps-table/admin-elps-table.component';
import { SideBarMenuHomeComponent } from './components/side-bar-menu-home/side-bar-menu-home.component';
import { UserEventsComponent } from './components/user-events/user-events.component';
import { UserChapterHomeComponent } from './components/user-chapter-home/user-chapter-home.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AdminJobsComponent } from './components/admin-jobs/admin-jobs.component';
import { AdminJobProfileComponent } from './components/admin-job-profile/admin-job-profile.component';
import { AdminJobcardListComponent } from './components/admin-jobcard-list/admin-jobcard-list.component';
import { permissionGuardGuard } from './guards/permission-guard.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminElimuTableComponent } from './components/admin-elimu-table/admin-elimu-table.component';
import { AdminTVETTableComponent } from './components/admin-tvet-table/admin-tvet-table.component';
import { AdminHubsComponent } from './components/admin-hubs/admin-hubs.component';
import { HubComponent } from './components/hub/hub.component';
// import { AdminEducationTableComponent } from './components/admin-education-table/admin-education-table.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AdminRegionalChaptersComponent } from './components/admin-regional-chapters/admin-regional-chapters.component';
import { AdminUserfeebackComponent } from './components/admin-userfeeback/admin-userfeeback.component';
import { AdminAddSpoltlightComponent } from './components/admin-add-spoltlight/admin-add-spoltlight.component';
import { AdminScholarsTableComponent } from './components/admin-scholars-table/admin-scholars-table.component';
import { OtpFormComponent } from './components/otp-form/otp-form.component';
import { OtpVerificationFormComponent } from './components/otp-verification-form/otp-verification-form.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { InstitutionsComponent } from './components/institutions/institutions.component';
import { AdminSurveyComponent } from './components/admin-survey/admin-survey.component';
import { AdminNewsUdateComponent } from './components/admin-news-udate/admin-news-udate.component';
import { AdminNewsletterComponent } from './components/admin-newsletter/admin-newsletter.component';
import { InternsHomeComponent } from './InternsModule/interns-home/interns-home.component';
import { DetailsFormComponent } from './InternsModule/details-form/details-form.component';
import { AdminUsersTableComponent } from './components/admin-users-table/admin-users-table.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminTvetScholarsComponent } from './components/admin-tvet-scholars/admin-tvet-scholars.component';
import { AdminLocalScholarsComponent } from './components/admin-local-scholars/admin-local-scholars.component';
import { AdminGlobalScholarsComponent } from './components/admin-global-scholars/admin-global-scholars.component';
import { AdminDonorsViewComponent } from './components/admin-donors-view/admin-donors-view.component';
import { AdminViewSholarsTableComponent } from './components/admin-view-scholars-table/admin-view-sholars-table.component';
import { AdminHubHomeComponent } from './components/admin-hub-home/admin-hub-home.component';
import { ChapterListComponent } from './components/chapter-list/chapter-list.component';
import { AllOurNewsComponent } from './components/all-our-news/all-our-news.component';
import { NewsReadMoreComponent } from './components/news-read-more/news-read-more.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { ChapterEventsComponent } from './components/chapter-events/chapter-events.component';
import { MoreVideosComponent } from './more-videos/more-videos.component';
import { AdminReportsComponent } from './components/admin-reports/admin-reports.component';
import { AdminMaleScholarsTableComponent } from './components/admin-male-scholars-table/admin-male-scholars-table.component';
import { AdminFemaleScholarsTableComponent } from './components/admin-female-scholars-table/admin-female-scholars-table.component';
import { AdminEventsApproveRequestsComponent } from './components/admin-events-approve-requests/admin-events-approve-requests.component';
// import { EventDialogComponent } from './path-to-child/event-dialog.component';
import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { AdminScheduledEventsCardComponent } from './components/admin-scheduled-events-card/admin-scheduled-events-card.component';
import { ScholarHomeComponent } from './components/scholar-home/scholar-home.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  // { path: 'user/:id', component: AdminScholarsTableComponent },
  { path: 'adminlogin', component: AdminLoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [permissionGuardGuard],
    data: { permission: 'PROFILE_VIEW' },

    children: [
      { path: '', redirectTo: 'sidebarhome', pathMatch: 'full' },
      {
        path: 'sidebarhome',
        component: ScholarHomeComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'PROFILE_VIEW' },
      },
      {
        path: 'hubs',
        component: HubsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'PROFILE_VIEW' },
      },
      {
        path: 'hub',
        component: HubComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'PROFILE_VIEW' },
      },
      {path:'chapter-list', 
      component:ChapterListComponent,
      canActivate: [permissionGuardGuard],
      data: { permission: 'PROFILE_VIEW' },
    },
      {
        path: 'events',
        component: UserEventsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'EVENTS_VIEW' },
      },
      {
        path: 'activities',
        component: UserActivitiesComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ACTIVITY_VIEW' },
      },
      {
        path: 'chapterid',
        component: UserChapterHomeComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'CHAPTER_VIEW' },
      },
      {
        path: 'jobs',
        component: AdminJobcardListComponent,

        canActivate: [permissionGuardGuard],
        data: { name: 'jobs', permission: 'PROFILE_VIEW' },
      },
      {
        path: 'jobs/jobprofile',
        component: AdminJobProfileComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'PROFILE_VIEW' },
      },
      {
        path: 'people',
        component: MorePeopleComponent,
        // canActivate: [permissionGuardGuard],
        // data: { permission: 'PROFILE_VIEW' },
      },
      
    ],
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
      {
        path:'scholarsviewtable',
        component: AdminViewSholarsTableComponent,
        canActivate:[permissionGuardGuard],
        data:{permission: 'ELPS_VIEW_ALL'}, 

      },
      {
        path: 'scholarstable',
        component: AdminScholarsTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'tvetscholarstable',
        component: AdminTvetScholarsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'localscholarstable',
        component: AdminLocalScholarsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'malescholarstable',
        component: AdminMaleScholarsTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'femalescholarstable',
        component: AdminFemaleScholarsTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'globalscholarstable',
        component: AdminGlobalScholarsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'donorstable',
        component: AdminDonorsViewComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'scholars',
        component: AdminScholarsComponent,
      },
      {
        path: 'applications',
        component: AdminApplicationsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
      // {
      //   path: 'education',
      //   component: AdminEducationTableComponent,
      // },
      {
        path: 'awarded',
        component: AdminAwardedComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
      {
        path: 'chapters',
        component: AdminChaptersComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'CHAPTER_VIEW_ALL' },
      },
      {
        path: 'regional-chapters',
        component: AdminRegionalChaptersComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'CHAPTER_VIEW_ALL' },
      },

      { path: 'hubs', component: AdminHubsComponent },

      {
        path: 'chapterhome',
        component: AdminChapterHomeComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'CHAPTER_VIEW' },
      },
      {
        path: 'hubhome/:id',
        component: AdminHubHomeComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'CHAPTER_VIEW' },
      },
      {
        path: 'eventshome',
        component: AdminEventsHomeComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'EVENTS_VIEW_ALL' },
      },
      {
        path: 'adminsview',
        component: AdminViewComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'USER_VIEW_ALL' },
      },
      {
        path: 'roles',
        component: AdminRolesComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ROLES_VIEW_ALL' },
      },
      {
        path: 'reports',
        component: AdminReportsComponent,
        // canActivate: [permissionGuardGuard],
        // data: { permission: 'REPORTS_VIEW_ALL' },
      },
      {
        path: 'wtfstable',
        component: AdminWftsTableComponent,
        // canActivate: [permissionGuardGuard],
        // data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
      {
        path: 'elpstable',
        component: AdminElpsTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },

      {
        path: 'elimutable',
        component: AdminElimuTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'tvettable',
        component: AdminTVETTableComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'ELPS_VIEW_ALL' },
      },
      {
        path: 'jobs',
        component: AdminJobsComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },
      {
        path: 'userfeedback',
        component: AdminUserfeebackComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },
      
    {
      path: 'NewsLetter',
      component: AdminNewsletterComponent,
      data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
      canActivate: [permissionGuardGuard],
    },

      {
        path: 'survey',
        component: AdminSurveyComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },

      {
        path: 'users',
        component: AdminUsersComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },
     
      {
        path: 'spotlight',
        component: AdminAddSpoltlightComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },

      {
        path: 'newsUpdate',
        component: AdminNewsUdateComponent,
        data: { name: 'jobs', permission: 'APPLICATIONS_VIEW_ALL' },
        canActivate: [permissionGuardGuard],
      },
      {
        path: 'jobs/jobprofile',
        component: AdminJobProfileComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
      {
        path: 'events-approval',
        component: AdminEventsApproveRequestsComponent,
        canActivate: [permissionGuardGuard],
        data: { permission: 'APPLICATIONS_VIEW_ALL' },
      },
    ],
  },



  {
    path: 'interns-2024',
    component: InternsHomeComponent
  },
  {
    path: 'intern-details',
    component: DetailsFormComponent
  },

  {
    path: 'allnews',
    component: AllOurNewsComponent
  },
  
  {
    path: 'news-read-more',
    component: NewsReadMoreComponent
  },

  {
    path: 'people',
    component: MorePeopleComponent,
    canActivate: [permissionGuardGuard],
    data: { permission: 'PROFILE_VIEW' },
  },
  {
    path: 'user_profile',
    component: UserProfileHomeComponent,
    canActivate: [permissionGuardGuard],
    data: { permission: 'PROFILE_VIEW' },
  },
  {
    path: 'userprofile/:id',
    component: UserProfileHomeComponent,
    canActivate: [permissionGuardGuard],
    data: { permission: 'PROFILE_VIEW' },
  },
  {
    path: 'register',
    component: UserRegisterComponent,
  },
  { path: 'newpassword/:token', component: PasswordResetFormComponent },
  { path: 'login/resetpassword', component: ForgotPasswordFormComponent },
  { path: 'otpver', component:OtpVerificationFormComponent},
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    canActivate: [permissionGuardGuard],
  },
  {
    path: 'institution/:id',
    component: InstitutionsComponent,
    canActivate: [permissionGuardGuard],
  },
  { path: 'otp', component: OtpFormComponent},
  {path: 'admin-userfeedback', component: AdminUserfeebackComponent},
  {path: 'feeds', component:FeedsComponent},
  { path: 'otpver', component:OtpVerificationFormComponent},
  {path:'chapter-list', component:ChapterListComponent},
  {path:'more-videos', component:MoreVideosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}