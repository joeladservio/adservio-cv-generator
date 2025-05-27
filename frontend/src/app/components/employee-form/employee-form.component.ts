import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  showConfirmModal = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      position: ['', Validators.required],
      department: ['', Validators.required],
      education: [''],
      experience: [''],
      skills: [''],
      languages: [''],
      certifications: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    if (this.employeeId) {
      this.employeeService.getEmployeeById(this.employeeId).subscribe({
        next: (employee) => {
          const { id, ...employeeData } = employee;
          this.employeeForm.patchValue(employeeData);
          Object.keys(this.employeeForm.controls).forEach(key => {
            const control = this.employeeForm.get(key);
            control?.markAsTouched();
          });
        },
        error: (error) => {
          console.error('Erreur lors du chargement de l\'employé:', error);
          alert('Erreur lors du chargement de l\'employé');
        }
      });
    }
  }

  confirmSubmit(): void {
    if (this.employeeForm.valid) {
      this.showConfirmModal = true;
    } else {
      this.employeeForm.markAllAsTouched();
      alert('Veuillez remplir tous les champs obligatoires');
    }
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee = this.employeeForm.value;
      if (this.isEditMode) {
        this.employeeService.updateEmployee(this.employeeId!, employee).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: error => {
            console.error('Erreur lors de la mise à jour:', error);
            if (error.error?.message) {
              alert(error.error.message);
            } else {
              alert('Une erreur est survenue lors de la mise à jour de l\'employé');
            }
          }
        });
      } else {
        this.employeeService.createEmployee(employee).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: error => {
            console.error('Erreur lors de la création:', error);
            if (error.error?.message) {
              alert(error.error.message);
            } else {
              alert('Une erreur est survenue lors de la création de l\'employé');
            }
          }
        });
      }
      this.showConfirmModal = false;
    }
  }

  cancelSubmit(): void {
    this.showConfirmModal = false;
  }

  isFieldRequired(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return field?.hasValidator(Validators.required) ?? false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('email')) {
      return 'Veuillez entrer une adresse email valide';
    }
    if (field?.hasError('minlength')) {
      return 'Ce champ doit contenir au moins 2 caractères';
    }
    if (field?.hasError('pattern')) {
      return 'Veuillez entrer un numéro de téléphone valide (10 chiffres)';
    }
    return '';
  }
} 