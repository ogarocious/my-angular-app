import { Routes } from '@angular/router';
import { ArtistIndexComponent } from './components/artist-index/artist-index.component'; // Import ArtistIndexComponent
import { HomeComponent } from './components/home/home.component'; // Import HomeComponent

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect root to /home
  { path: 'home', component: HomeComponent }, // Home page route
  { path: 'artists', component: ArtistIndexComponent }, // Artist Index route
];
