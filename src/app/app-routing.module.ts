import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'categorieslist',
    loadChildren: () => import('./pages/categorieslist/categorieslist.module').then( m => m.CategorieslistPageModule)
  },
  {
    path: 'categoriesdetail/:categorieId',
    loadChildren: () => import('./pages/categoriesdetail/categoriesdetail.module').then( m => m.CategoriesdetailPageModule)
  },
  {
    path: 'categoriescreate',
    loadChildren: () => import('./pages/categoriescreate/categoriescreate.module').then( m => m.CategoriescreatePageModule)
  },
  {
    path: 'dogwalklist',
    loadChildren: () => import('./pages/dogwalklist/dogwalklist.module').then( m => m.DogwalklistPageModule)
  },
  {
    path: 'dogwalkdetail/:dogwalkId',
    loadChildren: () => import('./pages/dogwalkdetail/dogwalkdetail.module').then( m => m.DogwalkdetailPageModule)
  },
  {
    path: 'dogwalkcreate',
    loadChildren: () => import('./pages/dogwalkcreate/dogwalkcreate.module').then( m => m.DogwalkcreatePageModule)
  },
  {
    path: 'boersecreate',
    loadChildren: () => import('./pages/boersecreate/boersecreate.module').then( m => m.BoersecreatePageModule)
  },
  {
    path: 'boerselist',
    loadChildren: () => import('./pages/boerselist/boerselist.module').then( m => m.BoerselistPageModule)
  },
  {
    path: 'boersedetail/:boerseId',
    loadChildren: () => import('./pages/boersedetail/boersedetail.module').then( m => m.BoersedetailPageModule)
  },
  {
    path: 'petsittingdetail/:petsittingId',
    loadChildren: () => import('./pages/petsittingdetail/petsittingdetail.module').then( m => m.PetsittingdetailPageModule)
  },
  {
    path: 'petsittingcreate',
    loadChildren: () => import('./pages/petsittingcreate/petsittingcreate.module').then( m => m.PetsittingcreatePageModule)
  },
  {
    path: 'petsittinglist',
    loadChildren: () => import('./pages/petsittinglist/petsittinglist.module').then( m => m.PetsittinglistPageModule)
  },
  {
    path: 'alertlist',
    loadChildren: () => import('./pages/alertlist/alertlist.module').then( m => m.AlertlistPageModule)
  },
  {
    path: 'alertdetail/:alertId',
    loadChildren: () => import('./pages/alertdetail/alertdetail.module').then( m => m.AlertdetailPageModule)
  },
  {
    path: 'alertcreate',
    loadChildren: () => import('./pages/alertcreate/alertcreate.module').then( m => m.AlertcreatePageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./pages/overview/overview.module').then( m => m.OverviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
