import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: ` <div class="header-logo">
      <button class="logo-btn" routerLink="/">
        <h1 class="title">MARVEL</h1>
      </button>
    </div>

    <router-outlet> </router-outlet>`,
})
export class AppComponent {}
