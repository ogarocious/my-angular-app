import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // Ensure routing is set up
import { AppComponent } from './app.component'; // Root component of your app
import { HttpClientModule } from '@angular/common/http'; // For HTTP requests

@NgModule({
  declarations: [
    AppComponent, // Declare the root component (and others as you add them)
  ],
  imports: [
    BrowserModule, // Provides browser-specific services
    AppRoutingModule, // Handles application routing
    HttpClientModule, // Enables HTTP requests
  ],
  providers: [], // Add services or dependency injection here
  bootstrap: [AppComponent], // Root component to bootstrap
})
export class AppModule {}
