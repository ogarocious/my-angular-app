import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistIndexComponent } from './components/artist-index/artist-index.component';
import { AppComponent } from './app.component'; // Import AppComponent here

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: AppComponent }, // Replace with your actual home component
  { path: 'artists', component: ArtistIndexComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
