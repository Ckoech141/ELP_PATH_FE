import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-scholar-job',
  standalone: false,
  templateUrl: './scholar-job.component.html',
  styleUrl: './scholar-job.component.scss'
})
export class ScholarJobComponent {
  bio: Boolean = true
  qualities: any[] = []
  responses: any[] = []
  user:any
  userData: any[] = []
  userDataRequired: any[] = []
  jsonedUser:any
  scholarEducation: any[] = []
  scholarWorkPlaces: any[] = []
  scholarAchievements: any[] = []
  notApplied:boolean = true

  appUser = {
    "name" : ""
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
     private dialogRef: MatDialogRef<ScholarJobComponent>,
     private htp: HttpClient,
     private htpp: HttpServiceService
  ){}


  ngOnInit(){
    this.qualities = this.data.jobQualifications
    this.responses = this.data.jobResponsibilities
    console.log("job information...",this.data)
    this.user = localStorage.getItem('userData')
    this.jsonedUser = JSON.parse(this.user)
    this.getUpdatedUserInfo(this.jsonedUser.id)
    this.appUser.name = `${this.jsonedUser.firstName} ${this.jsonedUser.lastName}`
  }

  getUpdatedUserInfo(userId: any){
    const url = this.htpp.serverUrl + "profile/cv/" + userId
    const res = this.htp.get(url)

    res.subscribe(
      (response: any) => {
        this.userData = response.payload
        this.scholarEducation = response.payload.education
        this.scholarWorkPlaces = response.payload.career
        this.scholarAchievements = response.payload.achievements
      //console.log("scholar education length........",this.scholarEducation.length);
      //console.log("scholar work places length........",this.scholarWorkPlaces.length);
      //console.log("scholar achievements length........",this.scholarAchievements.length);


        console.log("User Cv", this.userData)

      }
    )
  }

  submitEasyApply(jobId:any){
    if(this.scholarEducation.length < 1 || this.scholarWorkPlaces.length < 1 || this.scholarAchievements.length < 1){
      
      if(this.scholarEducation.length == 0){
        this.userDataRequired.push(`Please add your education details`)
      }
      if(this.scholarWorkPlaces.length == 0){
        this.userDataRequired.push(`Please add your work experience details`)
      }
      if(this.scholarAchievements.length == 0){
        this.userDataRequired.push(`Please add your achievement details`)
      }
      
      this.bio = false
    }else{
      //getting the scholar education details
      for(let i =0; i< this.scholarEducation.length; i++){
        const ourObject:any = this.scholarEducation[i]
        for (const [key, value] of Object.entries(ourObject)) {
          if(value == null){
            this.userDataRequired.push(`Please update education details ${i + 1} -> ${key}`)
          }
          console.log(this.userDataRequired);
      }
      }

      //getting scholar career details
      let checkDates:any = {}
      for(let j = 0; j <this.scholarWorkPlaces.length; j++){
        const workPlace = this.scholarWorkPlaces[j];
        for(const[key, value] of Object.entries(workPlace)){
          if(key != "end_date" && key != "toDate"){
            if(value == null){
            this.userDataRequired.push(`Please update work experience ${j + 1} -> ${key}`)
            }
          }else{
            checkDates[key] = value
          }
        }
      }

      //getting scholar achievements
      for(let k = 0; k < this.scholarAchievements.length; k++){
        const achievement = this.scholarAchievements[k];
        for(const [key, value] of Object.entries(achievement)){
          if(value == null){
            this.userDataRequired.push(`Please update achievements ${k + 1} -> ${key}`)
          }
        } 
      }

      if(this.userDataRequired.length > 0){
        this.bio = false;
      }else{
        //applying the job for the user
        const url = `${this.htpp.serverUrl}opportunities/${this.jsonedUser.id}/${this.data.id}/easyApply`
        const response = this.htp.post(url, null)
        response.subscribe(
          (value: any) => {
            this.notApplied = false;
            console.log(value)
            // if the message is successfull please do something...
          },
          (error: any) => {
            console.log(error)
          }
        )
      }

  }
  }
  close(){
    this.dialogRef.close()
  }

}
