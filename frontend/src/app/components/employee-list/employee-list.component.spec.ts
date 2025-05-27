import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;
  let router: jasmine.SpyObj<Router>;

  const mockEmployees: Employee[] = [
    {
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
    }
  ];

  beforeEach(async () => {
    const employeeServiceSpy = jasmine.createSpyObj('EmployeeService', [
      'getAllEmployees',
      'getEmployeeById',
      'deleteEmployee'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: EmployeeService, useValue: employeeServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    employeeService.getAllEmployees.and.returnValue(of(mockEmployees));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    expect(employeeService.getAllEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
  });

  it('should view employee details', () => {
    const employeeId = 1;
    employeeService.getEmployeeById.and.returnValue(of(mockEmployees[0]));
    
    component.viewEmployee(employeeId);
    
    expect(employeeService.getEmployeeById).toHaveBeenCalledWith(employeeId);
    expect(component.selectedEmployee).toEqual(mockEmployees[0]);
    expect(component.showDetailsModal).toBeTrue();
  });

  it('should navigate to edit employee', () => {
    const employeeId = 1;
    
    component.editEmployee(employeeId);
    
    expect(router.navigate).toHaveBeenCalledWith(['/employee-form', employeeId]);
  });

  it('should confirm delete employee', () => {
    const employee = mockEmployees[0];
    
    component.confirmDelete(employee);
    
    expect(component.employeeToDelete).toEqual(employee);
    expect(component.showDeleteModal).toBeTrue();
  });

  it('should delete employee', () => {
    const employee = mockEmployees[0];
    employeeService.deleteEmployee.and.returnValue(of(void 0));
    component.employeeToDelete = employee;
    
    component.deleteEmployee();
    
    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(employee.id);
    expect(component.showDeleteModal).toBeFalse();
    expect(employeeService.getAllEmployees).toHaveBeenCalled();
  });

  it('should handle pagination', () => {
    const mockEmployees = Array(15).fill(null).map((_, index) => ({
      id: index + 1,
      firstName: `Employee ${index + 1}`,
      lastName: 'Test',
      email: `employee${index + 1}@test.com`,
      phone: '1234567890',
      position: 'Developer',
      department: 'IT'
    }));

    employeeService.getAllEmployees.and.returnValue(of(mockEmployees));
    component.ngOnInit();

    expect(component.totalItems).toBe(15);
    expect(component.totalPages).toBe(2);
    expect(component.employees.length).toBe(10); // itemsPerPage default value
  });

  it('should change page', () => {
    const mockEmployees = Array(15).fill(null).map((_, index) => ({
      id: index + 1,
      firstName: `Employee ${index + 1}`,
      lastName: 'Test',
      email: `employee${index + 1}@test.com`,
      phone: '1234567890',
      position: 'Developer',
      department: 'IT'
    }));

    employeeService.getAllEmployees.and.returnValue(of(mockEmployees));
    component.ngOnInit();

    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(component.employees.length).toBe(5); // Remaining items on second page
  });
}); 