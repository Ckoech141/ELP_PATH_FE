import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JobPost } from 'src/app/interfaces/Job';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-add-job-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-job-info.component.html',
  styleUrl: './add-job-info.component.scss'
})
export class AddJobInfoComponent {

  
    jobDetails: any;
    jobResponsibilities: [] = [];
    jobQualifications: [] = [];

    constructor(private formBuilder:FormBuilder,  
       @Inject(MAT_DIALOG_DATA) public data:any,
       private httpService:HttpServiceService,
       private http: HttpClient
    ){}

       ngOnInit(){
        this.jobDetails = this.data
       }


      //  postJob(){
      //   //creating the job instance..
      //   const newJob = new JobPost();
      //   newJob.jobTitle = this.jobDetails.jobTitle
      //   newJob.jobType = this.jobDetails.jobType
      //   newJob.howToApply = this.jobDetails.howToApply
      //   newJob.applicationDeadLine = this.jobDetails.applicationDeadLine
      //   // newJob.recordTime = this.jobDetails.
      //   newJob.jobQualifications = this.jobDetails.qualification.split(".")
      //   newJob.jobResponsibilities = this.jobDetails.responsibility.split(".")

      //   const url = this.httpService.serverUrl + "opportunities/job/create";

      //   // this.http.post(url, this.data).subscribe(
      //   //   (response)=>{
      //   //     console.log("response ---------", response);
      //   //   },
      //   //   (error)=>{
      //   //     console.log("error ---------", error);

      //   //   }
      //   // )
      //  }

}
