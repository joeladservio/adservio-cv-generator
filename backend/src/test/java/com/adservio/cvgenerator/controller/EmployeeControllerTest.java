package com.adservio.cvgenerator.controller;

import com.adservio.cvgenerator.model.Employee;
import com.adservio.cvgenerator.service.EmployeeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = createTestEmployee();
    }

    @Test
    void createEmployee_ShouldReturnCreated() throws Exception {
        given(employeeService.createEmployee(any(Employee.class)))
                .willReturn(testEmployee);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testEmployee)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName", is(testEmployee.getFirstName())));
    }

    @Test
    void getAllEmployees_ShouldReturnList() throws Exception {
        Employee employee2 = createTestEmployee();
        employee2.setId(2L);
        
        given(employeeService.getAllEmployees())
                .willReturn(Arrays.asList(testEmployee, employee2));

        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(2)));
    }

    @Test
    void getEmployeeById_WhenExists_ShouldReturnEmployee() throws Exception {
        given(employeeService.getEmployeeById(1L))
                .willReturn(Optional.of(testEmployee));

        mockMvc.perform(get("/api/employees/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is(testEmployee.getFirstName())));
    }

    private Employee createTestEmployee() {
        Employee employee = new Employee();
        employee.setId(1L);
        employee.setFirstName("John");
        employee.setLastName("Doe");
        employee.setEmail("john.doe@example.com");
        employee.setPhone("+1234567890");
        employee.setPosition("Software Engineer");
        employee.setDepartment("Engineering");
        return employee;
    }
} 