package com.adservio.cvgenerator.service;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testEmployee = createTestEmployee(1L);
    }

    @Test
    void testGetAllEmployees() {
        List<Employee> employees = Arrays.asList(
            createTestEmployee(1L),
            createTestEmployee(2L)
        );

        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(employeeRepository, times(1)).findAll();
        
        // Verify properties of returned employees
        Employee firstEmployee = result.get(0);
        assertEquals("John", firstEmployee.getFirstName());
        assertEquals("Doe", firstEmployee.getLastName());
        assertEquals("john@example.com", firstEmployee.getEmail());
        assertEquals("Developer", firstEmployee.getPosition());
    }

    @Test
    void testGetEmployeeById() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        Optional<Employee> result = employeeService.getEmployeeById(1L);

        assertTrue(result.isPresent());
        Employee employee = result.get();
        assertEquals(testEmployee.getId(), employee.getId());
        assertEquals(testEmployee.getFirstName(), employee.getFirstName());
        assertEquals(testEmployee.getLastName(), employee.getLastName());
        assertEquals(testEmployee.getEmail(), employee.getEmail());
        assertEquals(testEmployee.getPhone(), employee.getPhone());
        assertEquals(testEmployee.getPosition(), employee.getPosition());
        assertEquals(testEmployee.getDepartment(), employee.getDepartment());
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    void testGetEmployeeByIdNotFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Employee> result = employeeService.getEmployeeById(1L);

        assertFalse(result.isPresent());
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    void testCreateEmployee() {
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee result = employeeService.createEmployee(testEmployee);

        assertNotNull(result);
        assertEquals(testEmployee.getId(), result.getId());
        assertEquals(testEmployee.getFirstName(), result.getFirstName());
        assertEquals(testEmployee.getLastName(), result.getLastName());
        assertEquals(testEmployee.getEmail(), result.getEmail());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testCreateEmployeeWithInvalidEmail() {
        Employee invalidEmployee = createTestEmployee(1L);
        invalidEmployee.setEmail("invalid-email");

        when(employeeRepository.save(any(Employee.class))).thenThrow(new RuntimeException("Invalid email format"));

        assertThrows(RuntimeException.class, () -> {
            employeeService.createEmployee(invalidEmployee);
        });

        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testUpdateEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee updatedEmployee = createTestEmployee(1L);
        updatedEmployee.setFirstName("Jane");
        updatedEmployee.setLastName("Smith");
        updatedEmployee.setPosition("Senior Developer");

        Employee result = employeeService.updateEmployee(1L, updatedEmployee);

        assertNotNull(result);
        assertEquals(updatedEmployee.getFirstName(), result.getFirstName());
        assertEquals(updatedEmployee.getLastName(), result.getLastName());
        assertEquals(updatedEmployee.getPosition(), result.getPosition());
        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testUpdateEmployeeNotFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            employeeService.updateEmployee(1L, testEmployee);
        });

        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void testUpdateEmployeeWithInvalidData() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        
        Employee invalidEmployee = createTestEmployee(1L);
        invalidEmployee.setEmail("invalid-email");

        when(employeeRepository.save(any(Employee.class))).thenThrow(new RuntimeException("Invalid email format"));

        assertThrows(RuntimeException.class, () -> {
            employeeService.updateEmployee(1L, invalidEmployee);
        });

        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    void testDeleteEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        doNothing().when(employeeRepository).deleteById(1L);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteEmployeeNotFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            employeeService.deleteEmployee(1L);
        });

        verify(employeeRepository, times(1)).findById(1L);
        verify(employeeRepository, never()).deleteById(anyLong());
    }

    @Test
    void testCreateEmployeeWithNullFields() {
        Employee invalidEmployee = new Employee();
        invalidEmployee.setId(1L);
        // All other fields are null

        when(employeeRepository.save(any(Employee.class))).thenThrow(new RuntimeException("Required fields cannot be null"));

        assertThrows(RuntimeException.class, () -> {
            employeeService.createEmployee(invalidEmployee);
        });

        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    private Employee createTestEmployee(Long id) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john@example.com");
        employee.setPhone("1234567890");
        employee.setPosition("Developer");
        employee.setDepartment("IT");
        employee.setEducation("Bachelor in CS");
        employee.setExperience("5 years");
        employee.setSkills("Java, Spring");
        employee.setLanguages("English, French");
        employee.setCertifications("AWS Certified");
        return employee;
    }
} 