import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-file-earmark-text"></i> AdServio CV Generator
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <i class="bi bi-house"></i> Accueil
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/employees" routerLinkActive="active">
                <i class="bi bi-people"></i> Employés
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/statistics" routerLinkActive="active">
                <i class="bi bi-bar-chart"></i> Statistiques
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      background-color: #212529 !important;
    }
    
    .navbar-brand {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffffff !important;
      
      i {
        font-size: 1.5rem;
        color: #ffffff;
      }
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      color: rgba(255, 255, 255, 0.8) !important;
      
      i {
        font-size: 1.1rem;
      }
      
      &:hover {
        color: #ffffff !important;
      }
      
      &.active {
        font-weight: 500;
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
    }

    .navbar-toggler {
      border-color: rgba(255, 255, 255, 0.1);
      
      &:focus {
        box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.1);
      }
    }
  `]
})
export class AppComponent {
  title = 'AdServio CV Generator';
} 