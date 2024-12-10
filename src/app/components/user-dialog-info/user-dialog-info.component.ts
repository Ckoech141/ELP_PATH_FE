import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-user-dialog-info',
  templateUrl: './user-dialog-info.component.html',
  styleUrl: './user-dialog-info.component.scss'
})
export class UserDialogInfoComponent {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  scholarProfile : any = '';
  scholarData:any = []
  value = "";
  bufferValue = 75;
  scholarId: any
  user : any = '' 
  scholarInfo : any = '';
  careers: any = [];
  bio: any = [];
  education: any = [];
  skill: any = [];
  id= 79;

  constructor(
    public dialogRef: MatDialogRef<UserDialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http : HttpServiceService,
    private profilehttp : ProfileService,
    ) {
      this.scholarId = data.data.id,
      this.scholarData = data.data
    }

    ngOnInit(): void{
      this.fetchScholarDetails()
      this.getScholarProfile()
      console.log("scholardata",this.scholarData);
      
    }

    fetchScholarDetails(){
      console.log(this.scholarId);
      this.http.getScholarDetails(this.scholarId).subscribe(
        (res) => {
          console.table(res.payload)
          this.scholarInfo = res?.payload
          let x = 0
          // this.user = res?.payload.career[x].user;
          this.careers = res?.payload.career;
          this.bio =res?.payload.bio;
          this.education =res?. payload.education;
          this.skill =res?. payload.skill;
          this.value = this.skill.level
          this.user = this.careers[x].user

        },
        (error) => {
          console.error("error", error)
        },
        ()=>{}
      
      )
    }

    getScholarProfile(){
      this.profilehttp.getProfileData(this.scholarId).subscribe(
        (response) => {
          this.scholarProfile = response?.payload
      
        },
        (error) => {
          console.error("error", error);
          
        },
        () => {
          
        }
      )
    }

  
}
