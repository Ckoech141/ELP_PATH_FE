import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexStroke, ApexTooltip, ApexXAxis } from "ng-apexcharts"

export interface JobPost{
    id: number
    jobTitle: string 
    jobDescription: string 
    howToApply: string 
    applicationDeadLine: string 
    recordTime: string 
    jobType: string
    organization: string
    jobSalary:number
    educationLevel: string 
    jobPoster: string
    jobQualifications: string[]
    jobResponsibilities: string[]

}

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
  };