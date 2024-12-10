import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserAchievementFormComponent } from '../user-achievement-form/user-achievement-form.component';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { UserAchieventEditFormComponent } from '../user-achievent-edit-form/user-achievent-edit-form.component';

@Component({
  selector: 'app-user-achievement',
  templateUrl: './user-achievement.component.html',
  styleUrl: './user-achievement.component.scss'
})
export class UserAchievementComponent {
  @Input() userIdadmin!: string;
  @Input() viewer!: string;
  userData: any;
  userId: any;
  achievementData:any;

  constructor(private dialog:MatDialog, private http:HttpServiceService,public snackBar:MatSnackBar,){}


  ngOnInit(){
    const storedData = localStorage.getItem('userData');
    console.log("12345", storedData);
    
    if (storedData) {
      this.userData = JSON.parse(storedData)
      this.userId = this.userData.id;
      // Use the parsed data in your application
    }
    this.getAchievements()
  }

  addAchievemnt(){
    const dialogRef: MatDialogRef<UserAchievementFormComponent> =  this.dialog.open(UserAchievementFormComponent,{
      width:'50vw',
    })
    dialogRef.afterClosed().subscribe(
      ((result) =>{
        this.ngOnInit()
      })
    )
  }

  editAchievement(achievement:any){
    const dialogRef: MatDialogRef<UserAchieventEditFormComponent> = this.dialog.open(UserAchieventEditFormComponent,{
      width:'50vw',
      data:{data:achievement}
    })
    dialogRef.afterClosed().subscribe(
      ((result) =>{
        this.ngOnInit()
      })
    )
  }

  getAchievements(){
    this.http.getAchievement(this.userId).subscribe(
      ((response) =>{
        this.achievementData = response.payload
        
      }),
      ((err) =>{}),
      ()=>{

      }
    )
  }
  deleteAchievement(id:string){
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.http.deleteAchievement(this.userId,id).subscribe(
          ((response)=>{
            console.log("mary", response.payload)
          }),
          ((e) =>{
            console.error(e);
            this.snackBar.open('There was an error deleting this achievement', 'Close', { duration: 2000 });
          }),
          () => {
            this.snackBar.open('Achievement deleted successfully', 'Close', { duration: 2000 });
            this.ngOnInit()
          }
    
    
        )
      }

  })}
}
