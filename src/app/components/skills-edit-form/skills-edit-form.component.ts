import { Component, ViewChild, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-skills-edit-form',
  templateUrl: './skills-edit-form.component.html',
  styleUrl: './skills-edit-form.component.scss'
})
export class SkillsEditFormComponent {
  // @ViewChild('skillsform', { static: false }) skillsform!: NgForm;
  skillsName!: string;
  isupdating:boolean = false
  level!: number;
  userId!: number;
  skill:any
  value: number = 1;
  skillsForm!: FormGroup;
  selectedValue: string = ''
  action: any;
  technicalLevelUrl:string= ''
  softSkillsLevelUrl:string= ''
  LanguageLevelUrl:string= ''


  technicalSkills=[
    'Junior',
    'Intermediate',
    'Senior'
  ]
  softSkills=[
    'Basic',
    'Advanced',
    'Intermediate'
  ]
  languageSkills=[
    'Basic',
    'Fluent',
    'Advanced',
  ]

  constructor(
    private http: HttpServiceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SkillsEditFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  url!: string;
  ngOnInit() {
    console.log('user id in bio', this.data.data.toString());
    if (this.data) {
      this.userId = this.data.data.toString();
      this.action = this.data.action
      this.skill = this.data.skill

      if (this.action == "editTechnicalSkill") {
        this.skillsForm = this.fb.group({
          skillsName: [this.skill.skillName, Validators.required],
          technicalLevel: [this.skill.technicalLevel, Validators.required],
        });
      } else if(this.action == "editSoftSkill") {
        this.skillsForm = this.fb.group({
          skillsName: [this.skill.skillName, Validators.required],
          softSkillLevel: [this.skill.softSkillLevel, Validators.required],
        });
      }else{
        this.skillsForm = this.fb.group({
          skillsName: [this.skill.skillName, Validators.required],
          languageLevel: [this.skill.languageLevel, Validators.required],
        });
      }
      
      // Use the parsed data in your application
      //urls
      //http://52.15.152.26:5555/skills/create/technical-skill/131
      //http://52.15.152.26:5555/skills/add/soft-skill/23
      //http://52.15.152.26:5555/skills/add/language-skill/23

      http://52.15.152.26:5555/skills/edit-language-skill/130/12

      this.technicalLevelUrl = `${this.http.serverUrl}skills/edit-technical-skill/${this.userId}/${this.skill.id}`
      this.softSkillsLevelUrl = `${this.http.serverUrl}skills/edit-soft-skill/${this.userId}/${this.skill.id}`
      this.LanguageLevelUrl = `${this.http.serverUrl}skills/edit-language-skill/${this.userId}/${this.skill.id}`

    }
  }
  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = +target.value;
  }

  submit() {
    
    if (this.action == "editTechnicalSkill") {
      this.isupdating = true
      this.http.editSkillsLevel(this.technicalLevelUrl, this.skillsForm.value).subscribe({
        // this.http.postSkill(this.skillsForm.value, this.userId).subscribe({
          next: (response) => {
            console.log('POST request successful:', response);
            console.log(this.skillsForm.value);
          },
          error: (error) => {
            console.log('Error:', error);
            // Handle the error here
          },
          complete: () => {
            this.isupdating = false
            this.snackBar.open('Skill updated successfully', 'Close', { duration: 2000 });
            // Handle the response data here
            // localStorage.setItem('token', JSON.stringify(response));
            this.dialogRef.close();
          },
         });
    } else if(this.action == "editSoftSkill") {
      this.isupdating = true
      this.http.editSkillsLevel(this.softSkillsLevelUrl, this.skillsForm.value).subscribe({
        // this.http.postSkill(this.skillsForm.value, this.userId).subscribe({
          next: (response) => {
            console.log('POST request successful:', response);
            console.log(this.skillsForm.value);
    

          },
          error: (error) => {
            console.log('Error:', error);
            // Handle the error here
          },
          complete: () => {
            this.isupdating = false
            this.snackBar.open('Skill updated successfully', 'Close', { duration: 2000 });
            // Handle the response data here
            // localStorage.setItem('token', JSON.stringify(response));
            this.dialogRef.close();
          },
         });
    }else{
      this.isupdating = true
      this.http.editSkillsLevel(this.LanguageLevelUrl, this.skillsForm.value).subscribe({
    // this.http.postSkill(this.skillsForm.value, this.userId).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);
        console.log(this.skillsForm.value);

  
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {
        this.isupdating = false
        this.snackBar.open('Skill updated successfully', 'Close', { duration: 2000 });
        // Handle the response data here
        // localStorage.setItem('token', JSON.stringify(response));
        this.dialogRef.close();
      },
     });
  }
  }}


  