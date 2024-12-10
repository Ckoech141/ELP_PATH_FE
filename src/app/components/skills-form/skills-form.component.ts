import { Component, ViewChild, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss'],
})
export class SkillsFormComponent {
  // @ViewChild('skillsform', { static: false }) skillsform!: NgForm;
  skillsName!: string;
  level!: number;
  userId!: number;
  isSending:boolean = false
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
    public dialogRef: MatDialogRef<SkillsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  url!: string;
  ngOnInit() {
    console.log('user id in bio', this.data.data.toString());
    if (this.data) {
      this.userId = this.data.data.toString();
      this.action = this.data.action
      console.log("bethiii", this.action);

      if (this.action == "addTechnicalSkill") {
        this.skillsForm = this.fb.group({
          skillsName: ['', Validators.required],
          technicalLevel: ['', Validators.required],
        });
      } else if(this.action == "addSoftSkill") {
        this.skillsForm = this.fb.group({
          skillsName: ['', Validators.required],
          softSkillsLevel: ['', Validators.required],
        });
      }else{
        this.skillsForm = this.fb.group({
          skillsName: ['', Validators.required],
          languageLevel: ['', Validators.required],
        });
      }
      
      // Use the parsed data in your application
      //urls
      //http://52.15.152.26:5555/skills/create/technical-skill/131
      //http://52.15.152.26:5555/skills/add/soft-skill/23
      //http://52.15.152.26:5555/skills/add/language-skill/23


      this.technicalLevelUrl = `${this.http.serverUrl}skills/create/technical-skill/${this.userId}`
      this.softSkillsLevelUrl = `${this.http.serverUrl}skills/add/soft-skill/${this.userId}`
      this.LanguageLevelUrl = `${this.http.serverUrl}skills/add/language-skill/${this.userId}`

    }
  }
  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = +target.value;
  }

  submit() {
    this.isSending = true
    if (this.action == "addTechnicalSkill") {
      this.http.postSkillsLevel(this.technicalLevelUrl, this.skillsForm.value).subscribe({
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
            this.isSending = false
            this.snackBar.open('Skill added successfully', 'Close', { duration: 2000 });
            // Handle the response data here
            // localStorage.setItem('token', JSON.stringify(response));
            this.dialogRef.close();
          },
         });
    } else if(this.action == "addSoftSkill") {
      this.http.postSkillsLevel(this.softSkillsLevelUrl, this.skillsForm.value).subscribe({
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
            this.isSending = false
            this.snackBar.open('Skill added successfully', 'Close', { duration: 2000 });
            // Handle the response data here
            // localStorage.setItem('token', JSON.stringify(response));
            this.dialogRef.close();
          },
         });
    }else{
      this.http.postSkillsLevel(this.LanguageLevelUrl, this.skillsForm.value).subscribe({
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
        this.isSending = false
        this.snackBar.open('Skill added successfully', 'Close', { duration: 2000 });
        // Handle the response data here
        // localStorage.setItem('token', JSON.stringify(response));
        this.dialogRef.close();
      },
     });
  }
  }}
