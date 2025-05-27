import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from '../../services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Employee } from '../../models/employee.model';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  const mockEmployee: Employee = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    position: 'Developer',
    department: 'IT',
    education: 'Bachelor in CS',
    experience: '5 years',
    skills: 'Angular, TypeScript',
    languages: 'English, French',
    certifications: 'AWS Certified'
  };

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getEmployeeById',
      'createEmployee',
      'updateEmployee'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    employeeService.getEmployeeById.and.returnValue(of(mockEmployee));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.employeeForm.get('firstName')?.value).toBe('');
    expect(component.employeeForm.get('lastName')?.value).toBe('');
    expect(component.employeeForm.get('email')?.value).toBe('');
  });

  it('should load employee data in edit mode', () => {
    component.ngOnInit();
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith(1);
    expect(component.isEditMode).toBeTrue();
    expect(component.employeeForm.get('firstName')?.value).toBe(mockEmployee.firstName);
  });

  it('should validate required fields', () => {
    const form = component.employeeForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['firstName'].setValue('John');
    form.controls['lastName'].setValue('Doe');
    form.controls['email'].setValue('john@example.com');
    form.controls['phone'].setValue('1234567890');
    form.controls['position'].setValue('Developer');
    form.controls['department'].setValue('IT');
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.employeeForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should create new employee', () => {
    const newEmployee = { ...mockEmployee, id: undefined };
    employeeService.createEmployee.and.returnValue(of(newEmployee));
    
    component.employeeForm.patchValue(newEmployee);
    component.onSubmit();
    
    expect(employeeService.createEmployee).toHaveBeenCalledWith(newEmployee);
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should update existing employee', () => {
    employeeService.updateEmployee.and.returnValue(of(mockEmployee));
    
    component.employeeForm.patchValue(mockEmployee);
    component.onSubmit();
    
    expect(employeeService.updateEmployee).toHaveBeenCalledWith(mockEmployee.id, mockEmployee);
    expect(router.navigate).toHaveBeenCalledWith(['/employees']);
  });

  it('should show confirmation modal before submitting', () => {
    component.employeeForm.patchValue(mockEmployee);
    component.confirmSubmit();
    
    expect(component.showConfirmModal).toBeTrue();
  });

  it('should not show confirmation modal if form is invalid', () => {
    component.confirmSubmit();
    
    expect(component.showConfirmModal).toBeFalse();
  });

  it('should cancel submission', () => {
    component.showConfirmModal = true;
    component.cancelSubmit();
    
    expect(component.showConfirmModal).toBeFalse();
  });
}); 