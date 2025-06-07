import { Routes } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component'
import { DetailPageComponent } from './pages/detail-page/detail-page.component';
import { ListSearchComponent } from './pages/list-search/list-search.component';
import { SettingsComponent } from './pages/settings/settings.component';
export const routes: Routes = [
    {path : '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path : 'dashboard', component: DashboardComponent},
    {path: 'detail-form', component: DetailPageComponent },
    {path : 'list-search', component: ListSearchComponent},
    {path : 'settings', component: SettingsComponent},
    {path : '**', redirectTo: 'dashboard'},
];
