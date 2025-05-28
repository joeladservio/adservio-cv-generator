package com.adservio.cvgenerator.service;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = createTestEmployee();
    }

    @Test
    void getAllEmployees_ShouldReturnList() {
        // Given
        List<Employee> expectedEmployees = Arrays.asList(
            createTestEmployee(1L),
            createTestEmployee(2L)
        );
        when(employeeRepository.findAll()).thenReturn(expectedEmployees);

        // When
        List<Employee> actualEmployees = employeeService.getAllEmployees();

        // Then
        assertNotNull(actualEmployees);
        assertEquals(2, actualEmployees.size());
        verify(employeeRepository).findAll();
    }

    @Test
    void getEmployeeById_WhenExists_ShouldReturnEmployee() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        // When
        Optional<Employee> result = employeeService.getEmployeeById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testEmployee.getId(), result.get().getId());
        verify(employeeRepository).findById(1L);
    }

    @Test
    void createEmployee_WithValidData_ShouldReturnCreatedEmployee() {
        // Given
        Employee employeeToCreate = createTestEmployee();
        employeeToCreate.setId(null); // ID should be null for creation
        
        when(employeeRepository.save(any(Employee.class))).thenAnswer(invocation -> {
            Employee savedEmployee = invocation.getArgument(0);
            savedEmployee.setId(1L); // Simulate DB generating ID
            return savedEmployee;
        });

        // When
        Employee result = employeeService.createEmployee(employeeToCreate);

        // Then
        assertNotNull(result);
        assertNotNull(result.getId());
        assertEquals(employeeToCreate.getFirstName(), result.getFirstName());
        assertEquals(employeeToCreate.getLastName(), result.getLastName());
        assertEquals(employeeToCreate.getEmail(), result.getEmail());
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void createEmployee_WithNullEmployee_ShouldThrowException() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.createEmployee(null);
        });
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void updateEmployee_WithValidData_ShouldReturnUpdatedEmployee() {
        // Given
        Long employeeId = 1L;
        Employee existingEmployee = createTestEmployee();
        existingEmployee.setId(employeeId);

        Employee updateData = createTestEmployee();
        updateData.setId(employeeId);
        updateData.setFirstName("Updated");
        updateData.setPosition("Senior Developer");

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(existingEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(updateData);

        // When
        Employee result = employeeService.updateEmployee(employeeId, updateData);

        // Then
        assertNotNull(result);
        assertEquals(employeeId, result.getId());
        assertEquals("Updated", result.getFirstName());
        assertEquals("Senior Developer", result.getPosition());
        verify(employeeRepository).findById(employeeId);
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void updateEmployee_WithNonExistingId_ShouldThrowException() {
        // Given
        Long nonExistingId = 999L;
        when(employeeRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.updateEmployee(nonExistingId, createTestEmployee());
        });
        verify(employeeRepository).findById(nonExistingId);
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee_WhenExists_ShouldDelete() {
        // Given
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        doNothing().when(employeeRepository).deleteById(1L);

        // When
        employeeService.deleteEmployee(1L);

        // Then
        verify(employeeRepository).findById(1L);
        verify(employeeRepository).deleteById(1L);
    }

    private Employee createTestEmployee() {
        Employee employee = new Employee();
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");
        employee.setPhone("+1234567890");
        employee.setPosition("Software Engineer");
        employee.setDepartment("Engineering");
        return employee;
    }

    private Employee createTestEmployee(Long id) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");
        employee.setPhone("+1234567890");
        employee.setPosition("Software Engineer");
        employee.setDepartment("Engineering");
        return employee;
    }
} 