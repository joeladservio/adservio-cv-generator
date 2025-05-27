import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/api/employees';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    const mockEmployees = [mockEmployee];

    service.getAllEmployees().subscribe(employees => {
      expect(employees).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should get employee by id', () => {
    service.getEmployeeById(1).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('should create new employee', () => {
    const newEmployee = { ...mockEmployee, id: undefined };

    service.createEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);
    req.flush(mockEmployee);
  });

  it('should update employee', () => {
    service.updateEmployee(1, mockEmployee).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockEmployee);
    req.flush(mockEmployee);
  });

  it('should delete employee', () => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when getting employees', () => {
    const errorMessage = 'Error fetching employees';

    service.getAllEmployees().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should handle error when creating employee', () => {
    const newEmployee = { ...mockEmployee, id: undefined };
    const errorMessage = 'Error creating employee';

    service.createEmployee(newEmployee).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
}); 