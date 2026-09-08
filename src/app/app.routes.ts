import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'CineCrew — Your Crew, Your Screen',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
    title: 'Entrar | CineCrew',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [guestGuard],
    title: 'Criar Conta | CineCrew',
  },
  {
    path: 'oauth2/redirect',
    loadComponent: () =>
      import('./features/auth/oauth2-redirect/oauth2-redirect.component').then(
        (m) => m.OAuth2RedirectComponent,
      ),
    title: 'Autenticando... | CineCrew',
  },
  {
    path: 'clubs',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/clubs/club-list/club-list.component').then((m) => m.ClubListComponent),
        title: 'Meus Clubes | CineCrew',
      },
      {
        path: 'join/:inviteCode',
        loadComponent: () =>
          import('./features/clubs/join/join-club.component').then((m) => m.JoinClubComponent),
        title: 'Entrar no Clube | CineCrew',
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/clubs/club-detail/club-detail.component').then(
            (m) => m.ClubDetailComponent,
          ),
        title: 'Clube | CineCrew',
      },
    ],
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./features/watchlist/watchlist.component').then((m) => m.WatchlistComponent),
    canActivate: [authGuard],
    title: 'Lista de Desejos | CineCrew',
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/events/event-detail/event-detail.component').then(
        (m) => m.EventDetailComponent,
      ),
    canActivate: [authGuard],
    title: 'Evento | CineCrew',
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./features/movies/movie-search/movie-search.component').then(
        (m) => m.MovieSearchComponent,
      ),
    canActivate: [authGuard],
    title: 'Buscar Filmes | CineCrew',
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Página não encontrada | CineCrew',
  },
];
