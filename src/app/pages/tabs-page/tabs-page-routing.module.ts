import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';
import { CategoriesPage } from '../categories/categories.page';
import { CategorieslistPage } from '../categorieslist/categorieslist.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            //component: SchedulePage,
            component: CategorieslistPage,
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          }
        ]
      },
      {
        path: 'speakers',
        children: [
          {
            path: '',
            loadChildren: () => import('../speaker-list/speaker-list.module').then(m => m.SpeakerListModule)
          },
          {
            path: 'session/:sessionId',
            loadChildren: () => import('../session-detail/session-detail.module').then(m => m.SessionDetailModule)
          },
          {
            path: 'speaker-details/:speakerId',
            loadChildren: () => import('../speaker-detail/speaker-detail.module').then(m => m.SpeakerDetailModule)
          }
        ]
      },
      {
        path: 'tabcategorie',
        children: [
          {
            path: '',
            loadChildren: () => import('../categorieslist/categorieslist.module').then(m => m.CategorieslistPageModule)
          },
          {
            path: 'categoriesdetail/:categorieId',
            loadChildren: () => import('../categoriesdetail/categoriesdetail.module').then(m => m.CategoriesdetailPageModule)
          },
          {
            path: 'categoriescreate',
            loadChildren: () => import('../categoriescreate/categoriescreate.module').then(m => m.CategoriescreatePageModule)
          }
        ]
      },
      {
        path: 'tabdogwalk',
        children: [
          {
            path: '',
            loadChildren: () => import('../dogwalklist/dogwalklist-routing.module').then(m => m.DogwalklistPageRoutingModule)
          },
          {
            path: 'dogwalkdetail/:dogwalkId',
            loadChildren: () => import('../dogwalkdetail/dogwalkdetail-routing.module').then(m => m.DogwalkdetailPageRoutingModule)
          },
          {
            path: 'dogwalkcreate',
            loadChildren: () => import('../dogwalkcreate/dogwalkcreate-routing.module').then(m => m.DogwalkcreatePageRoutingModule)
          }
        ]
      },
      {
        path: 'tabboerse',
        children: [
          {
            path: '',
            loadChildren: () => import('../boerselist/boerselist-routing.module').then(m => m.BoerselistPageRoutingModule)
          },
          {
            path: 'boersedetail/:boerseId',
            loadChildren: () => import('../boersedetail/boersedetail-routing.module').then(m => m.BoersedetailPageRoutingModule)
          },
          {
            path: 'boersecreate',
            loadChildren: () => import('../boersecreate/boersecreate-routing.module').then(m => m.BoersecreatePageRoutingModule)
          }
        ]
      },
      {
        path: 'tabpetsitting',
        children: [
          {
            path: '',
            loadChildren: () => import('../petsittinglist/petsittinglist-routing.module').then(m => m.PetsittinglistPageRoutingModule)
          },
          {
            path: 'petsittingdetail/:petsittingId',
            loadChildren: () => import('../petsittingdetail/petsittingdetail-routing.module').then(m => m.PetsittingdetailPageRoutingModule)
          },
          {
            path: 'petsittingcreate',
            loadChildren: () => import('../petsittingcreate/petsittingcreate-routing.module').then(m => m.PetsittingcreatePageRoutingModule)
          }
        ]
      },
      {
        path: 'tabalert',
        children: [
          {
            path: '',
            loadChildren: () => import('../alertlist/alertlist-routing.module').then(m => m.AlertlistPageRoutingModule)
          },
          {
            path: 'alertdetail/:alertId',
            loadChildren: () => import('../alertdetail/alertdetail-routing.module').then(m => m.AlertdetailPageRoutingModule)
          },
          {
            path: 'alertcreate',
            loadChildren: () => import('../alertcreate/alertcreate-routing.module').then(m => m.AlertcreatePageRoutingModule)
          }
        ]
      },
      {
        path: 'taboverview',
        children: [
          {
            path: '',
            loadChildren: () => import('../overview/overview-routing.module').then(m => m.OverviewPageRoutingModule)
          }
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'about',
        children: [
          {
            path: '',
            loadChildren: () => import('../about/about.module').then(m => m.AboutModule)
          }
        ]
      },
      {
        path: '',
        //redirectTo: '/app/tabs/schedule',
        redirectTo: '/app/tabs/tabcategorie',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

