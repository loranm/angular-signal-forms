import { Routes } from '@angular/router';
import { Home } from './home/home';
import { PageNotFound } from './page-not-found';

const SubscribeFeature = async () =>
  (await import('./newsletter/subscribe-form/subscribe-form')).SubscribeForm;

export const routes: Routes = [
  { path: 'home', component: Home },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./vehicles/vehicle-shell/vehicle-shell').then((c) => c.VehicleShell),
  },
  {
    path: 'subscribe',
    loadComponent: SubscribeFeature,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFound },
];
