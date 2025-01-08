import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h3>Angular V19 Material</h3>
    <router-outlet />
  `,
})
export class AppComponent {}
