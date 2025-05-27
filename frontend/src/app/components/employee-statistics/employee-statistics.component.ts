import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-employee-statistics',
  templateUrl: './employee-statistics.component.html',
  styleUrls: ['./employee-statistics.component.scss']
})
export class EmployeeStatisticsComponent implements OnInit {
  @ViewChild('experienceChart') experienceChartCanvas!: ElementRef;
  chart: Chart | null = null;
  experienceData: { [key: string]: number } = {};

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployeesData();
  }

  loadEmployeesData(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.processExperienceData(employees);
        this.createExperienceChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
      }
    });
  }

  private processExperienceData(employees: Employee[]): void {
    this.experienceData = {};
    
    employees.forEach(employee => {
      if (employee.experience) {
        const years = this.extractYearsOfExperience(employee.experience);
        if (years !== null) {
          const yearRange = this.getYearRange(years);
          this.experienceData[yearRange] = (this.experienceData[yearRange] || 0) + 1;
        }
      }
    });
  }

  private extractYearsOfExperience(experience: string): number | null {
    const match = experience.match(/(\d+)\s*ans?/);
    return match ? parseInt(match[1], 10) : null;
  }

  private getYearRange(years: number): string {
    if (years <= 2) return '0-2 ans';
    if (years <= 5) return '3-5 ans';
    if (years <= 8) return '6-8 ans';
    if (years <= 10) return '9-10 ans';
    return '10+ ans';
  }

  private createExperienceChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = Object.keys(this.experienceData);
    const data = Object.values(this.experienceData);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre d\'employés',
          data: data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribution des employés par années d\'expérience',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    const ctx = this.experienceChartCanvas.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, config);
  }
} 