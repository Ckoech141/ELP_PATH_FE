import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-user-achievent-edit-form',
  templateUrl: './user-achievent-edit-form.component.html',
  styleUrl: './user-achievent-edit-form.component.scss'
})
export class UserAchieventEditFormComponent {
editAchievementForm!: FormGroup
userId:any
userData:any
isupdating:boolean = false

constructor(@Inject(MAT_DIALOG_DATA) 
public data: any, 
private snackBar:MatSnackBar,
private matref:MatDialogRef<UserAchieventEditFormComponent>,
private http:HttpServiceService){

  this.editAchievementForm = new FormGroup({
    name: new FormControl(data.data.name),
    description: new FormControl(data.data.description)
  })
}

ngOnInit(){
  const storedData = localStorage.getItem('userData');
  console.log("12345", storedData);
  
  if (storedData) {
    this.userData = JSON.parse(storedData)
    this.userId = this.userData.id;
    // Use the parsed data in your application
  }
}
editAchievement(){
  
  if (this.editAchievementForm.value.name == '' ||  this.editAchievementForm.value.name == null) {
    alert("achievement name is empty")
  }else if (this.editAchievementForm.value.description == '' ||  this.editAchievementForm.value.description == null) {
    alert("achievement description is empty")
  } else {
    this.isupdating = true
    this.http.editAchievement(this.userId, this.data.data.id, this.editAchievementForm.value).subscribe(
      ((res) =>{
        console.log(res);
        
      }),
      ((err) => {
        console.error(err);
        
      }),
      () => {
       this.isupdating = false
       this.matref.close()
       this.snackBar.open("Achievement Updated successfully","Close", {duration:2000})
      }
    )
  }
}
}
