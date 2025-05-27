package com.adservio.cvgenerator.controller;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllEmployees() throws Exception {
        List<Employee> employees = Arrays.asList(
            createTestEmployee(1L),
            createTestEmployee(2L)
        );

        when(employeeService.getAllEmployees()).thenReturn(employees);

        mockMvc.perform(get("/api/employees"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[1].id").value(2));

        verify(employeeService, times(1)).getAllEmployees();
    }

    @Test
    public void testGetEmployeeById() throws Exception {
        Employee employee = createTestEmployee(1L);

        when(employeeService.getEmployeeById(1L)).thenReturn(Optional.of(employee));

        mockMvc.perform(get("/api/employees/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(employeeService, times(1)).getEmployeeById(1L);
    }

    @Test
    public void testGetEmployeeByIdNotFound() throws Exception {
        when(employeeService.getEmployeeById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/employees/1"))
            .andExpect(status().isNotFound());

        verify(employeeService, times(1)).getEmployeeById(1L);
    }

    @Test
    public void testCreateEmployee() throws Exception {
        Employee employee = createTestEmployee(1L);

        when(employeeService.createEmployee(any(Employee.class))).thenReturn(employee);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(employeeService, times(1)).createEmployee(any(Employee.class));
    }

    @Test
    public void testCreateEmployeeWithInvalidEmail() throws Exception {
        Employee employee = createTestEmployee(1L);
        employee.setEmail("invalid-email");

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isBadRequest());

        verify(employeeService, never()).createEmployee(any(Employee.class));
    }

    @Test
    public void testCreateEmployeeWithMissingRequiredFields() throws Exception {
        Employee employee = new Employee();
        employee.setId(1L);
        // Missing firstName and lastName

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isBadRequest());

        verify(employeeService, never()).createEmployee(any(Employee.class));
    }

    @Test
    public void testUpdateEmployee() throws Exception {
        Employee employee = createTestEmployee(1L);

        when(employeeService.updateEmployee(anyLong(), any(Employee.class))).thenReturn(employee);

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.firstName").value("John"))
            .andExpect(jsonPath("$.lastName").value("Doe"));

        verify(employeeService, times(1)).updateEmployee(anyLong(), any(Employee.class));
    }

    @Test
    public void testUpdateEmployeeWithInvalidData() throws Exception {
        Employee employee = createTestEmployee(1L);
        employee.setEmail("invalid-email");

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isBadRequest());

        verify(employeeService, never()).updateEmployee(anyLong(), any(Employee.class));
    }

    @Test
    public void testUpdateEmployeeWithMismatchedId() throws Exception {
        Employee employee = createTestEmployee(2L);

        mockMvc.perform(put("/api/employees/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(employee)))
            .andExpect(status().isBadRequest());

        verify(employeeService, never()).updateEmployee(anyLong(), any(Employee.class));
    }

    @Test
    public void testDeleteEmployee() throws Exception {
        doNothing().when(employeeService).deleteEmployee(anyLong());

        mockMvc.perform(delete("/api/employees/1"))
            .andExpect(status().isNoContent());

        verify(employeeService, times(1)).deleteEmployee(1L);
    }

    @Test
    public void testDeleteEmployeeWithInvalidId() throws Exception {
        doThrow(new RuntimeException("Employee not found")).when(employeeService).deleteEmployee(999L);

        mockMvc.perform(delete("/api/employees/999"))
            .andExpect(status().isNotFound());

        verify(employeeService, times(1)).deleteEmployee(999L);
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