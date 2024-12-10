import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceService } from 'src/app/services/service.service';
import { ScholarJobComponent } from '../scholar-job/scholar-job.component';
export interface JobOpportunity {
  id: number;
  jobTitle: string;
  jobDescription: string;
  howToApply: string;
  applicationDeadLine: string;
  jobType: string;
  organization: any;
  jobQualifications: string[];
  jobResponsibilities: string[];
  jobSalary: number;
  educationLevel: string;
  jobPoster: {
    id: number;
    name: string;
    type: string;
    data: string;
  };
}

@Component({
  selector: 'app-admin-jobcard-list',
  templateUrl: './admin-jobcard-list.component.html',
  styleUrls: ['./admin-jobcard-list.component.scss'],
})
export class AdminJobcardListComponent implements OnInit {
  dataSource: any
  message:string = ""
  number:any
  userInfo: any
  data: any[]=[];
  displayedColumns:any[] = ["jobs"]

  constructor(private service:ServiceService, private dialog: MatDialog){

  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userInfo = JSON.parse(userData);
      console.log('userdata', this.userInfo);
    }else{
      this.userInfo = "No name"
    }
    this.message = "All jobs"
    this.getJobPostings()
  }

  showPermanentJobs(){
    const perm:any[] = []

    for (let index = 0; index < this.data.length; index++) {

      const element = this.data[index].jobType;
      if(element == "PERMANENT"){
        perm.push(this.data[index])
      }
      
    }
    console.log(perm)
    this.message = "Permanent Jobs"
    this.number = perm.length
    this.dataSource = perm
  }

  showTemporaryJobs(){
    
    const perm:any[] = []

    for (let index = 0; index < this.data.length; index++) {

      const element = this.data[index].jobType;
      if(element != "PERMANENT"){
        perm.push(this.data[index])
      }
      
    }
    console.log("perm",perm)
    this.message = "Temporary Jobs"
    this.number = perm.length
    this.dataSource = perm
  }

  searchJob(event: Event){
      const filterValue = (event.target as HTMLInputElement).value;
      console.log(filterValue)
      this.message = filterValue
      let perm:any[] = []
      const response = this.service.searchJobOpportunity(filterValue)
      response.subscribe(
        (response: any)=>{
          console.log(response.payload)
          perm = response.payload
          this.number = perm.length
          this.dataSource = perm
        },
        (error: any)=>{
          console.log(error)
        }
      )

  }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

  getJobPostings(){
    this.service.getJobOpportunities().subscribe(
      (response: any) => {
        // Handle the response, which should be an array of job postings
        this.data= response.payload;
        this.dataSource = this.data
        console.log("all jobs",response.payload)
        this.number = this.data.length

      },
    
      (error) => {
        // Handle error
        console.error('Error:', error);
      }
    );
    this.number = this.data.length

  }

  showJob(jobData: any){
    this.dialog.open(ScholarJobComponent, {
      width:'60%',
      height:'96%',
      data: jobData
    })
  }

}
