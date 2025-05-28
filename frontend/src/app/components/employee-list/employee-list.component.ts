import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
declare var bootstrap: any;

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  employeeToDelete: Employee | null = null;
  showDetailsModal = false;
  error: string | null = null;
  loading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 30, 50];
  totalPages = 1;
  totalItems = 0;
  startIndex = 0;
  endIndex = 0;
  private pageChange = new Subject<number>();

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // Debounce page changes to prevent rapid fire requests
    this.pageChange.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(page => {
      this.handlePageChange(page);
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.error = null;
    this.loading = true;
    
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.totalItems = data.length;
        this.calculatePagination();
        this.updateDisplayedEmployees();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.error = 'Erreur lors du chargement des employés';
        this.loading = false;
      }
    });
  }

  calculatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);
  }

  updateDisplayedEmployees(): void {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.totalItems);
    
    // Optimisation: slice seulement si nécessaire
    if (this.startIndex !== this.endIndex) {
      this.displayedEmployees = this.employees.slice(this.startIndex, this.endIndex);
    } else {
      this.displayedEmployees = [];
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.next(page);
    }
  }

  private handlePageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayedEmployees();
  }

  onPageSizeChange(): void {
    const oldStartIndex = this.startIndex;
    this.currentPage = Math.floor(oldStartIndex / this.pageSize) + 1;
    this.calculatePagination();
    this.updateDisplayedEmployees();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, this.currentPage - halfVisible);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Ajuster startPage si on est proche de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Ajouter les ellipses si nécessaire
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(-1); // -1 représente les ellipses
      }
    }
    
    // Ajouter les pages du milieu
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Ajouter les ellipses de fin si nécessaire
    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push(-1);
      }
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employee-form', id]);
  }

  deleteEmployee(employee: Employee): void {
    this.employeeToDelete = employee;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  confirmDelete(): void {
    if (this.employeeToDelete && this.employeeToDelete.id) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
        next: () => {
          this.loadEmployees();
          const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
          modal?.hide();
          this.employeeToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.error = 'Erreur lors de la suppression de l\'employé';
        }
      });
    }
  }

  viewEmployee(id: number): void {
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.selectedEmployee = employee;
        this.showDetailsModal = true;
      },
      error: (error) => {
        console.error('Error loading employee details:', error);
        this.error = 'Erreur lors du chargement des détails de l\'employé';
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEmployee = null;
  }

  generateCV(employee: Employee): void {
    if (employee.id) {
      this.employeeService.generateCV(employee.id).subscribe({
        next: (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        },
        error: (error) => {
          console.error('Error generating CV:', error);
          this.error = 'Erreur lors de la génération du CV';
        }
      });
    }
  }
} 