import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-user-achievement-form',
  templateUrl: './user-achievement-form.component.html',
  styleUrl: './user-achievement-form.component.scss'
})
export class UserAchievementFormComponent {
  achievementForm!:FormGroup
  data:any;
  userId:any
  userData:any
  isupdating:boolean = false
  constructor(private http: HttpServiceService,
   private snackbar:MatSnackBar,
    private dialog:MatDialogRef<UserAchievementFormComponent>
    ){
    this.achievementForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl('')
    })
  }

  ngOnInit() {
    const storedData = localStorage.getItem('userData');
    console.log("12345", storedData);
    
    if (storedData) {
      this.userData = JSON.parse(storedData)
      this.userId = this.userData.id;
      // Use the parsed data in your application
    }
  }

  createAchievement(){
    
    this.data = this.achievementForm.value;
    console.log("achievements", this.achievementForm.value);
    if (this.data.name == '' || this.data.name == null) {
      alert('achievement name is required')
    } else if(this.data.description == '' || this.data.description == null){
      alert('achievement description is required')
    }else{
      this.isupdating = true
      this.http.createAchievement(this.userId, this.data).subscribe({
        next: (res) =>{
          console.log(res);
          this.snackbar.open('There was an error creating your achievement', 'Close', { duration: 2000 });
          this.isupdating = false
        },
        error: (e) =>{},
        complete:()=>{
          this.isupdating = false
          this.snackbar.open('Skill updated successfully', 'Close', { duration: 2000 });
          this.dialog.close()
        }
      })
    }
    
  }
  
}
