import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/heroes-list/heroes-list.component').then(
        (m) => m.HeroesListComponent,
      ),
  },
  {
    path: 'heroe/:id',
    loadComponent: () =>
      import('./components/heores-detail/heroes-detail.component').then(
        (m) => m.HeroesDetailComponent,
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./components/heroes-team/heroes-team.component').then(
        (m) => m.HeroesTeamComponent,
      ),
  },
];
