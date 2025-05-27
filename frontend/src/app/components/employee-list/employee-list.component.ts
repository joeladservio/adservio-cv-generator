import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  displayedEmployees: Employee[] = []; // Employés affichés sur la page courante
  selectedEmployee: Employee | null = null;
  showDetailsModal = false;
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;
  maxFileSize = 5 * 1024 * 1024; // 5MB

  // Propriétés de pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        // Inverser l'ordre des employés pour avoir les plus récents en premier
        this.employees = data.map(employee => {
          if (employee.photo) {
            if (typeof employee.photo === 'string') {
              if (!employee.photo.startsWith('data:image')) {
                employee.photo = `data:image/jpeg;base64,${employee.photo}`;
              }
            }
          }
          return employee;
        }).reverse(); // Inverser l'ordre du tableau
        
        this.totalPages = Math.ceil(this.employees.length / this.pageSize);
        this.updateDisplayedEmployees();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        alert('Erreur lors du chargement des employés');
      }
    });
  }

  // Méthodes de pagination
  updateDisplayedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedEmployees = this.employees.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedEmployees();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPhotoSelected(event: Event, employee: Employee): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > this.maxFileSize) {
        alert('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const updatedEmployee = {
          ...employee,
          photo: base64String
        };
        this.employeeService.updateEmployee(employee.id!, updatedEmployee).subscribe({
          next: () => {
            this.loadEmployees();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour de la photo:', error);
            alert('Erreur lors de la mise à jour de la photo');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  viewEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.selectedEmployee = employee;
        this.showDetailsModal = true;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        alert('Erreur lors du chargement des détails de l\'employé');
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedEmployee = null;
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employee-form', id]);
  }

  confirmDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  deleteEmployee(): void {
    if (this.employeeToDelete?.id) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
        next: () => {
          this.loadEmployees();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de l\'employé');
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  downloadCV(employee: Employee): void {
    const doc = new jsPDF();
    let yPosition = 20;
    const margin = 14;
    const pageWidth = doc.internal.pageSize.width;
    
    // En-tête
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41); // Couleur sombre pour le titre
    doc.text('Curriculum Vitae', pageWidth / 2, yPosition, { align: 'center' });
    
    // Nom et prénom
    yPosition += 15;
    doc.setFontSize(18);
    doc.text(`${employee.firstName} ${employee.lastName}`, pageWidth / 2, yPosition, { align: 'center' });
    
    // Ligne de séparation
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    // Informations personnelles
    yPosition += 15;
    doc.setFontSize(16);
    doc.setTextColor(13, 110, 253); // Bleu pour les titres de section
    doc.text('Informations Personnelles', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41); // Retour à la couleur sombre pour le contenu
    doc.text(`Email: ${employee.email}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Téléphone: ${employee.phone}`, margin, yPosition);
    
    // Informations professionnelles
    yPosition += 15;
    doc.setFontSize(16);
    doc.setTextColor(13, 110, 253);
    doc.text('Informations Professionnelles', margin, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(33, 37, 41);
    doc.text(`Poste: ${employee.position}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Département: ${employee.department}`, margin, yPosition);
    
    // Formation
    if (employee.education) {
      yPosition += 15;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Formation', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      const educationLines = doc.splitTextToSize(employee.education, pageWidth - (2 * margin));
      doc.text(educationLines, margin, yPosition);
      yPosition += (educationLines.length * 7);
    }
    
    // Expérience
    if (employee.experience) {
      yPosition += 15;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Expérience', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      const experienceLines = doc.splitTextToSize(employee.experience, pageWidth - (2 * margin));
      doc.text(experienceLines, margin, yPosition);
      yPosition += (experienceLines.length * 7);
    }
    
    // Compétences
    if (employee.skills) {
      yPosition += 15;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Compétences', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      const skillsLines = doc.splitTextToSize(employee.skills, pageWidth - (2 * margin));
      doc.text(skillsLines, margin, yPosition);
      yPosition += (skillsLines.length * 7);
    }
    
    // Langues
    if (employee.languages) {
      yPosition += 15;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Langues', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      const languagesLines = doc.splitTextToSize(employee.languages, pageWidth - (2 * margin));
      doc.text(languagesLines, margin, yPosition);
      yPosition += (languagesLines.length * 7);
    }
    
    // Certifications
    if (employee.certifications) {
      yPosition += 15;
      doc.setFontSize(16);
      doc.setTextColor(13, 110, 253);
      doc.text('Certifications', margin, yPosition);
      
      yPosition += 10;
      doc.setFontSize(12);
      doc.setTextColor(33, 37, 41);
      const certificationsLines = doc.splitTextToSize(employee.certifications, pageWidth - (2 * margin));
      doc.text(certificationsLines, margin, yPosition);
    }
    
    // Pied de page
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Téléchargement du PDF
    doc.save(`CV_${employee.lastName}_${employee.firstName}.pdf`);
  }
} 