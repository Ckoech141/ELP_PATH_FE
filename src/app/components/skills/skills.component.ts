import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { SkillsFormComponent } from '../skills-form/skills-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { SkillsEditFormComponent } from '../skills-edit-form/skills-edit-form.component';



@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent implements OnInit {
  [x: string]: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  userId!: any;
  technicalLevelUrl:string= ''
  softSkillsLevelUrl:string= ''
  LanguageLevelUrl:string= ''
  technicalSkills:any[] = []
  softSkills:any[] = []
  LanguageSkills:any[] = []

  @Input() userIdadmin!: string;
  @Input() viewer!: string;
  @Input() skillsData: { name: string }[] = [];
  
  skills:any[] = []
  


  constructor(public dialog: MatDialog,public snackBar:MatSnackBar,public http: HttpServiceService) {}

  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');
    if (this.userIdadmin) {
      console.log('useridadmin', this.userIdadmin.toString());
      this.userId = this.userIdadmin.toString();
    } else if (storedData) {
      const parsedData = JSON.parse(storedData);
      this.userId = parsedData.id;
    }

    this.technicalLevelUrl = `${this.http.serverUrl}skills/get-technical-skills/${this.userId}`
    this.softSkillsLevelUrl = `${this.http.serverUrl}skills/get-soft-skills/${this.userId}`
    this.LanguageLevelUrl = `${this.http.serverUrl}skills/get-language-skills/${this.userId}`

    this.getTechnicalSkills();
    this.getLanguageSkills()
    this.getSoftSkills()
   
  }


  addTechnicalSkill(){
        // Open the dialog using the MatDialog service
        const dialogRef: MatDialogRef<SkillsFormComponent> = this.dialog.open(
          SkillsFormComponent,
          {
            width: '60%', // Set the width of the dialog
    
            data: { data: this.userId , action:"addTechnicalSkill"},
             // You can pass data to the dialog component using the `data` property
          }
        );
    
        // Handle the dialog result (if needed)
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
          this.ngOnInit();
        });
  }

  // soft skills
  addSoftSkill(){
            // Open the dialog using the MatDialog service
            const dialogRef: MatDialogRef<SkillsFormComponent> = this.dialog.open(
              SkillsFormComponent,
              {
                width: '40%', // Set the width of the dialog
        
                data: { data: this.userId , action:"addSoftSkill"},
                 // You can pass data to the dialog component using the `data` property
              }
            );
        
            // Handle the dialog result (if needed)
            dialogRef.afterClosed().subscribe((result) => {
              console.log(`Dialog result: ${result}`);
              this.ngOnInit();
            });
  }
  sformDialog(): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<SkillsFormComponent> = this.dialog.open(
      SkillsFormComponent,
      {
        width: '40%', // Set the width of the dialog

        data: { data: this.userId , action:"addLanguageLevel"},// You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }


  getTechnicalSkills(): void {
    this.http.getAllSkills(this.technicalLevelUrl).subscribe ({
      next: (resp: any) => {
        console.log(resp)
        this.technicalSkills = resp.payload;
        
      },
      error: (Error) => {
        console.error('Error fetching feedback:', Error.error.message);

      }
    });
}
getSoftSkills(): void {
  this.http.getAllSkills(this.softSkillsLevelUrl).subscribe ({
    next: (resp: any) => {
      console.log(resp)
      this.softSkills = resp.payload;
     // console.log('skills are working', this.skills);
      
    },
    error: (Error) => {
      console.error('Error fetching feedback:', Error.error.message);

    }
  });
}

getLanguageSkills(): void {
  this.http.getAllSkills(this.LanguageLevelUrl).subscribe ({
    next: (resp: any) => {
      console.log(resp)
      this.LanguageSkills = resp.payload;
    //  console.log('skills are working', this.skills);
      
    },
    error: (Error) => {
      console.error('Error fetching feedback:', Error.error.message);

    }
  });
}

//editing skills
editLanguageSkill(skill:any){
  const dialogRef: MatDialogRef<SkillsEditFormComponent> = this.dialog.open(SkillsEditFormComponent,{
    data:{skill:skill, data:this.userId, action:"editLanguageLevel"}
    
  })
  dialogRef.afterClosed().subscribe((result) => {
    console.log(`Dialog result: ${result}`);
    this.getLanguageSkills()
  });
}
//edit soft skills
editSoftSkill(skill:any){
  const dialogRef: MatDialogRef<SkillsEditFormComponent> = this.dialog.open(SkillsEditFormComponent,{
    data:{skill:skill, data:this.userId, action:"editSoftSkill"}
  })

  dialogRef.afterClosed().subscribe((result) => {
    console.log(`Dialog result: ${result}`);
    this.getSoftSkills()
  });
}
//edit technical skills
editTechnicalSkill(skill:any){
  const dialogRef: MatDialogRef<SkillsEditFormComponent> = this.dialog.open(SkillsEditFormComponent,{
    data:{skill:skill, data:this.userId, action:"editTechnicalSkill"}
  })

  dialogRef.afterClosed().subscribe((result) => {
    console.log(`Dialog result: ${result}`);
    this.getTechnicalSkills
  });
}
deleteSkill(skillId: any): void {
  const dialogRef:MatDialogRef<AdminAddSpotlightDeleteComponent> = this.dialog.open(AdminAddSpotlightDeleteComponent);
  console.log(skillId)


  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // User clicked 'Yes', proceed with deletion
      this.http.deleteSkill(skillId, this.userId).subscribe({
        next: () => {
          console.log('Skill deleted successfully');

          // Find the deleted item index in the 'rowData' array
          const deletedIndex = this.skills.findIndex(item => item.id === skillId);

          // Remove the deleted item from the 'rowData' array locally
          if (deletedIndex !== -1) {
            this.skills.splice(deletedIndex, 1);
          }

          this.snackBar.open('Skill deleted successfully', 'Close', { duration: 2000 });
          // You can perform additional actions after successful deletion
          this.ngOnInit();
        },
        error: (error: any) => {
          console.error('Error deleting skill', error);
          // Handle error as needed
        },
        complete() {
         
        },
      });
    } else {
      // User clicked 'No', do nothing
      console.log('Deletion cancelled by the user.');
    }
  });
}    

}
