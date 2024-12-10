import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, INJECTOR, Injectable, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormField } from '@angular/material/form-field';
import { jsPDF } from "jspdf";
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-user-resume',
  templateUrl: './user-resume.component.html',
  styleUrl: './user-resume.component.scss'
})
export class UserResumeComponent {
  @ViewChild('cv', {static: false}) element!: ElementRef
  cvForm: any
  user: any
  userInfo: any
  userId: any
  userData: any[] = []
  isCvComplete: Boolean = true
  userDataRequired: any[] = []
  scholarAchievements: any[] = []
  scholarWorkPlaces: any[] = []
  scholarEducation: any[] = []
  scholarSkills: any[] = []
  technicalSkills: any[] = []
  languageSkills: any[] = []
  scholarProfile:any = {}
  scholarBio: any
  isUser: boolean = true
  

  appUser = {
    "firstName" : "",
    "lastName" : "",
    "email":"",
    "bioDescription":"",
    "careerDescription":"",
    "careerRole": "",
    "CopanyName":""
  }


     constructor(private http: HttpClient, private htp: HttpServiceService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialogRef: MatDialogRef<UserResumeComponent>){}

  ngOnInit(){
    this.user = localStorage.getItem('userData')
    this.userInfo = JSON.parse(this.user)
    console.log("local storage id",this.userInfo.id);

    if(this.data != this.userInfo.id){
      this.isUser = false
    }

    this.userId = this.data
    this.appUser.firstName = `${this.userInfo.firstName}` 
    this.appUser.lastName =  this.userInfo.lastName

    this.getUserInfo();

  }
  getUserInfo(){
    const url = this.htp.serverUrl + "profile/cv/" + this.userId
    const res = this.http.get(url)

    res.subscribe(
      (response: any) =>{
        console.log("user cv", response)
        if(response.payload != null){
          this.userData = response.payload
          if(response.payload.career != null){
            this.scholarWorkPlaces = response.payload.career

          }
          if(response.payload.education != null){
            this.scholarEducation = response.payload.education
          }
          if(response.payload.achievements != null){
            this.scholarAchievements = response.payload.achievements
          }
          if(response.payload.softSkills != null){
            const item: any[] = []
            const soft = response.payload.softSkills.forEach((e:any) => {
              if (e.softSkillsLevel != null) {
                item.push(e)
              }
              this.scholarSkills = item              
            }) 
          }
          if(response.payload.bio != null){
            this.scholarBio = response.payload.bio.description
          }
          if(response.payload.profile != null){
            const ourObject:any = response.payload.profile 
            for (const [key, value] of Object.entries(ourObject)) {
              if(value != null){
                this.scholarProfile[key] = value
              }
            }
          }
          if(response.payload.languageSkills != null){
            const item: any[] = []
            const lang = response.payload.languageSkills.forEach((e:any) => {
              if (e.languageLevel != null) {
                item.push(e)
              }
              this.languageSkills = item              
            }) 
            
          }
          if(response.payload.skills != null){
            const item: any[] = []
            const lang = response.payload.skills.forEach((e:any) => {
              if (e.technicalLevel != null) {
                item.push(e)
              }
              this.technicalSkills = item              
            }) 
          }


        }
        console.log("Not hard coded email address",this.appUser.email);
        console.log("Not hardcoded id",this.userId);

      },
      (error) => {
        console.log("user cv", error)
      }
    )
  }

  generateCv() {
    if (this.scholarEducation.length < 1 || this.scholarWorkPlaces.length < 1 || this.scholarAchievements.length < 1) {
        if (this.scholarEducation.length == 0) {
            this.userDataRequired.push(`Please add your education details`);
        }
        if (this.scholarWorkPlaces.length == 0) {
            this.userDataRequired.push(`Please add your work experience details`);
        }
        if (this.scholarAchievements.length == 0) {
            this.userDataRequired.push(`Please add your achievement details`);
        }
        this.isCvComplete = false;
    } else {
        // Validate education details
        for (let i = 0; i < this.scholarEducation.length; i++) {
            const ourObject = this.scholarEducation[i];
            for (const [key, value] of Object.entries(ourObject)) {
                if (value == null) {
                    this.userDataRequired.push(`Please update education details ${i + 1} -> ${key}`);
                }
            }
        }

        // Validate career details
        let checkDates: { [key: string]: any } = {};
        for (let j = 0; j < this.scholarWorkPlaces.length; j++) {
            const workPlace = this.scholarWorkPlaces[j];
            for (const [key, value] of Object.entries(workPlace)) {
                if (key !== "end_date" && key !== "toDate") {
                    if (value == null) {
                        this.userDataRequired.push(`Please update work experience ${j + 1} -> ${key}`);
                    }
                } else {
                    checkDates[key] = value;
                }
            }
        }

        // Validate achievements
        for (let k = 0; k < this.scholarAchievements.length; k++) {
            const achievement = this.scholarAchievements[k];
            for (const [key, value] of Object.entries(achievement)) {
                if (value == null) {
                    this.userDataRequired.push(`Please update achievements ${k + 1} -> ${key}`);
                }
            }
        }

        if (this.userDataRequired.length > 0) {
            this.isCvComplete = false;
        } else {
            // Define objects to be used in the cv
            let pdf = new jsPDF('p', 'pt', 'a4');

            // Adjust CSS styles if necessary
            let element = this.element.nativeElement;
            element.style.width = '656pt'; // Width of A4 in points
            element.style.height = 'auto';

            // Generate and download the cv
            pdf.html(element, {
                callback: (pdf) => {
                    // Save the PDF
                    pdf.save("curiculum_vitae.pdf");
                },
                x: 10,
                y: 10,
                html2canvas: {
                    scale: 0.5, // Adjust scale as needed
                    windowWidth: element.scrollWidth, // Ensure the entire width is considered
                    windowHeight: element.scrollHeight // Ensure the entire height is considered
                }
            });
        }
    }
}

  close(){
    this.dialogRef.close()
  }

}
