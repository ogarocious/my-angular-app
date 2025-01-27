import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient(), provideAnimationsAsync()],
})
  .then((appRef) => {
    const router = appRef.injector.get(Router);
    console.log('Angular app initialized with routing and HTTP client');

    // Enable router event tracing for debugging
    router.events.subscribe((event) => {
      console.log('Router event:', event);
    });
  })
  .catch((err) => console.error(err));
