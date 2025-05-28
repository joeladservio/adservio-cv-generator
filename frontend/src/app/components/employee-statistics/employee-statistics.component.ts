import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-employee-statistics',
  templateUrl: './employee-statistics.component.html',
  styleUrls: ['./employee-statistics.component.scss']
})
export class EmployeeStatisticsComponent implements OnInit {
  totalEmployees = 0;
  uniqueDepartments = 0;
  uniquePositions = 0;
  departmentStats: Array<{ name: string; count: number; percentage: number }> = [];
  ageStats = {
    '20-30': 0,
    '31-40': 0,
    '41-50': 0,
    '51+': 0
  };
  departmentChart: any;
  ageChart: any;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.employeeService.getEmployees().subscribe((employees: Employee[]) => {
      this.calculateStatistics(employees);
      this.initializeCharts();
    });
  }

  private calculateStatistics(employees: Employee[]): void {
    this.totalEmployees = employees.length;

    // Calculer les statistiques par département
    const departmentCounts = new Map<string, number>();
    employees.forEach(emp => {
      const dept = emp.department || 'Non spécifié';
      departmentCounts.set(dept, (departmentCounts.get(dept) || 0) + 1);
    });
    this.uniqueDepartments = departmentCounts.size;

    // Calculer les statistiques des postes uniques
    const positions = new Set(employees.map(emp => emp.position));
    this.uniquePositions = positions.size;

    // Calculer les statistiques détaillées par département
    this.departmentStats = Array.from(departmentCounts.entries()).map(([name, count]) => ({
      name,
      count,
      percentage: (count / this.totalEmployees) * 100
    }));

    // Calculer les statistiques d'âge
    employees.forEach(emp => {
      if (emp.birthDate) {
        const age = this.calculateAge(new Date(emp.birthDate));
        if (age <= 30) this.ageStats['20-30']++;
        else if (age <= 40) this.ageStats['31-40']++;
        else if (age <= 50) this.ageStats['41-50']++;
        else this.ageStats['51+']++;
      }
    });
  }

  private initializeCharts(): void {
    // Initialiser le graphique des départements
    const departmentCtx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (departmentCtx) {
      if (this.departmentChart) {
        this.departmentChart.destroy();
      }
      this.departmentChart = new Chart(departmentCtx, {
        type: 'pie',
        data: {
          labels: this.departmentStats.map(stat => stat.name),
          datasets: [{
            data: this.departmentStats.map(stat => stat.count),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: false
            }
          }
        }
      });
    }

    // Initialiser le graphique des âges
    const ageCtx = document.getElementById('ageChart') as HTMLCanvasElement;
    if (ageCtx) {
      if (this.ageChart) {
        this.ageChart.destroy();
      }
      this.ageChart = new Chart(ageCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.ageStats),
          datasets: [{
            label: 'Nombre d\'employés',
            data: Object.values(this.ageStats),
            backgroundColor: '#36A2EB',
            borderColor: '#2693e6',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
} 