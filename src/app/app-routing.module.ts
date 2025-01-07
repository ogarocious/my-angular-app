import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = []; // Define your routes here

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure routing
  exports: [RouterModule], // Export RouterModule to make it available in the app
})
export class AppRoutingModule {}
