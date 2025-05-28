import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToEmployees(): void {
    this.router.navigate(['/employees']);
  }

  navigateToNewEmployee(): void {
    this.router.navigate(['/employee/add']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }
} 