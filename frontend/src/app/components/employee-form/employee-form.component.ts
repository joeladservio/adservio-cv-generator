import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  loading = false;
  employeeId: number | null = null;
  showConfirmModal = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loadEmployee(this.employeeId);
    }
  }

  get educationList() {
    return this.employeeForm.get('educationList') as FormArray;
  }

  get experienceList() {
    return this.employeeForm.get('experienceList') as FormArray;
  }

  get skillsList() {
    return this.employeeForm.get('skillsList') as FormArray;
  }

  get languagesList() {
    return this.employeeForm.get('languagesList') as FormArray;
  }

  get certificationsList() {
    return this.employeeForm.get('certificationsList') as FormArray;
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      birthDate: [''],
      birthPlace: [''],
      address: [''],
      position: ['', Validators.required],
      department: ['', Validators.required],
      hireDate: [''],
      contractType: [''],
      salary: [''],
      level: [''],
      educationList: this.fb.array([]),
      experienceList: this.fb.array([]),
      skillsList: this.fb.array([]),
      languagesList: this.fb.array([]),
      certificationsList: this.fb.array([])
    });
  }

  createEducationFormGroup(): FormGroup {
    return this.fb.group({
      degree: [''],
      school: [''],
      startYear: [''],
      endYear: [''],
      description: ['']
    });
  }

  createExperienceFormGroup(): FormGroup {
    return this.fb.group({
      title: [''],
      company: [''],
      startDate: [''],
      endDate: [''],
      description: [''],
      technologies: ['']
    });
  }

  createSkillFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      level: ['']
    });
  }

  createLanguageFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      level: ['']
    });
  }

  createCertificationFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      organization: [''],
      dateObtained: [''],
      expiryDate: ['']
    });
  }

  addEducation(): void {
    this.educationList.push(this.createEducationFormGroup());
  }

  addExperience(): void {
    this.experienceList.push(this.createExperienceFormGroup());
  }

  addSkill(): void {
    this.skillsList.push(this.createSkillFormGroup());
  }

  addLanguage(): void {
    this.languagesList.push(this.createLanguageFormGroup());
  }

  addCertification(): void {
    this.certificationsList.push(this.createCertificationFormGroup());
  }

  removeEducation(index: number): void {
    this.educationList.removeAt(index);
  }

  removeExperience(index: number): void {
    this.experienceList.removeAt(index);
  }

  removeSkill(index: number): void {
    this.skillsList.removeAt(index);
  }

  removeLanguage(index: number): void {
    this.languagesList.removeAt(index);
  }

  removeCertification(index: number): void {
    this.certificationsList.removeAt(index);
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        // Remplir les champs de base
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          birthDate: employee.birthDate,
          birthPlace: employee.birthPlace,
          address: employee.address,
          position: employee.position,
          department: employee.department,
          hireDate: employee.hireDate,
          contractType: employee.contractType,
          salary: employee.salary,
          level: employee.level
        });

        // Remplir les listes
        if (employee.educationList) {
          employee.educationList.forEach(edu => {
            this.educationList.push(this.fb.group(edu));
          });
        }

        if (employee.experienceList) {
          employee.experienceList.forEach(exp => {
            this.experienceList.push(this.fb.group(exp));
          });
        }

        if (employee.skillsList) {
          employee.skillsList.forEach(skill => {
            this.skillsList.push(this.fb.group(skill));
          });
        }

        if (employee.languagesList) {
          employee.languagesList.forEach(lang => {
            this.languagesList.push(this.fb.group(lang));
          });
        }

        if (employee.certificationsList) {
          employee.certificationsList.forEach(cert => {
            this.certificationsList.push(this.fb.group(cert));
          });
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.showConfirmModal = true;
    }
  }

  confirmSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      this.showConfirmModal = false;
      const employeeData = this.employeeForm.value;

      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.loading = false;
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.router.navigate(['/employees']);
          },
          error: (error) => {
            console.error('Error creating employee:', error);
            this.loading = false;
          }
        });
      }
    }
  }

  cancelSubmit(): void {
    this.showConfirmModal = false;
  }
} 