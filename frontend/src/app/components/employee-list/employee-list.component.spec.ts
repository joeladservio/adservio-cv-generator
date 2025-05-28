import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployees: Employee[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '123456789',
      position: 'Developer',
      department: 'IT',
      education: 'Master in Computer Science',
      experience: '5 years of experience',
      skills: 'JavaScript, Angular, Java',
      languages: 'English, French',
      certifications: 'AWS Certified Developer'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '987654321',
      position: 'Designer',
      department: 'Design',
      education: 'Bachelor in Design',
      experience: '3 years of experience',
      skills: 'UI/UX, Figma, Adobe XD',
      languages: 'English, Spanish',
      certifications: 'Google UX Design'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'getEmployee', 'deleteEmployee', 'generateCV']);
    
    await TestBed.configureTestingModule({
      declarations: [ EmployeeListComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: EmployeeService, useValue: spy }
      ]
    }).compileComponents();

    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    employeeService.getEmployees.and.returnValue(of(mockEmployees));
    
    fixture.detectChanges();

    expect(component.employees).toEqual(mockEmployees);
    expect(component.totalItems).toBe(2);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading employees', () => {
    const errorMessage = 'Error loading employees';
    employeeService.getEmployees.and.returnValue(throwError(() => new Error(errorMessage)));
    
    fixture.detectChanges();

    expect(component.error).toBe('Erreur lors du chargement des employés');
  });

  it('should update pagination when page size changes', () => {
    employeeService.getEmployees.and.returnValue(of(mockEmployees));
    fixture.detectChanges();

    component.pageSize = 1;
    component.onPageSizeChange();

    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(2);
    expect(component.displayedEmployees.length).toBe(1);
  });

  it('should change page correctly', () => {
    employeeService.getEmployees.and.returnValue(of(mockEmployees));
    fixture.detectChanges();

    component.pageSize = 1;
    component.onPageSizeChange();
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(component.displayedEmployees[0]).toEqual(mockEmployees[1]);
  });

  it('should show employee details', () => {
    const employee = mockEmployees[0];
    employeeService.getEmployee.and.returnValue(of(employee));

    component.viewEmployee(1);

    expect(component.selectedEmployee).toEqual(employee);
    expect(component.showDetailsModal).toBeTrue();
  });

  it('should handle error when loading employee details', () => {
    const errorMessage = 'Error loading employee details';
    employeeService.getEmployee.and.returnValue(throwError(() => new Error(errorMessage)));

    component.viewEmployee(1);

    expect(component.error).toBe('Erreur lors du chargement des détails de l\'employé');
    expect(component.showDetailsModal).toBeFalse();
  });

  it('should delete employee', () => {
    employeeService.deleteEmployee.and.returnValue(of(void 0));
    employeeService.getEmployees.and.returnValue(of(mockEmployees));
    
    component.employeeToDelete = mockEmployees[0];
    component.confirmDelete();

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(1);
    expect(component.employeeToDelete).toBeNull();
  });

  it('should handle error when deleting employee', () => {
    const errorMessage = 'Error deleting employee';
    employeeService.deleteEmployee.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.employeeToDelete = mockEmployees[0];
    component.confirmDelete();

    expect(component.error).toBe('Erreur lors de la suppression de l\'employé');
  });

  it('should generate CV', () => {
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    employeeService.generateCV.and.returnValue(of(mockBlob));
    
    spyOn(window, 'open');
    spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');

    component.generateCV(mockEmployees[0]);

    expect(employeeService.generateCV).toHaveBeenCalledWith(1);
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith('blob:url');
  });

  it('should handle error when generating CV', () => {
    const errorMessage = 'Error generating CV';
    employeeService.generateCV.and.returnValue(throwError(() => new Error(errorMessage)));
    
    component.generateCV(mockEmployees[0]);

    expect(component.error).toBe('Erreur lors de la génération du CV');
  });
}); 