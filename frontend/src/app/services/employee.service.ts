import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) { }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    // Convertir la photo en base64 si elle est au format File
    if (employee.photo instanceof File) {
      return new Observable(observer => {
        const reader = new FileReader();
        reader.onload = () => {
          const employeeWithBase64Photo = {
            ...employee,
            photo: reader.result as string
          };
          this.http.post<Employee>(this.apiUrl, employeeWithBase64Photo)
            .subscribe({
              next: (response) => observer.next(response),
              error: (error) => observer.error(error),
              complete: () => observer.complete()
            });
        };
        const photoFile = employee.photo as File;
        reader.readAsDataURL(photoFile);
      });
    }
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    // Convertir la photo en base64 si elle est au format File
    if (employee.photo instanceof File) {
      return new Observable(observer => {
        const reader = new FileReader();
        reader.onload = () => {
          const employeeWithBase64Photo = {
            ...employee,
            photo: reader.result as string
          };
          this.http.put<Employee>(`${this.apiUrl}/${id}`, employeeWithBase64Photo)
            .subscribe({
              next: (response) => observer.next(response),
              error: (error) => observer.error(error),
              complete: () => observer.complete()
            });
        };
        const photoFile = employee.photo as File;
        reader.readAsDataURL(photoFile);
      });
    }
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 