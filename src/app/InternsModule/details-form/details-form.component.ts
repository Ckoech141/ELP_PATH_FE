import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InternsService } from '../interns.service';
import { MatRadioChange } from '@angular/material/radio';


@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.scss']
})
export class DetailsFormComponent implements OnInit{
  selectedOption: any;
  selectedSchool: any;
  options = ["Father", "Mother", "Grand Father", "Grand Mother","Uncle", "Aunt", "Other"];
  myForm!: FormGroup;
  schools: any;
  currentYear!: number;
  schoolId!: number;
  loadingSchools: boolean = true

  constructor(private fb: FormBuilder, private internService: InternsService){}

  ngOnInit(): void {
      this.detailsForm();
      this.getSchools();
      this.currentYear = new Date().getFullYear();
  }

  getSchools() {
    this.loadingSchools = true
    this.internService.getSchools().subscribe({
      next: (response: any) => {
        this.schools = response.payload;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.loadingSchools = false
      }
    })
  }

  onSelectionChange(item: any): void {
    if(item) {
      console.log("Selected relationship: "+item);
    }
  }

  onSchoolChange(selectedSchool: any): void {
    if(selectedSchool) {
      this.schoolId = selectedSchool.id;
      console.log('select school id: '+this.schoolId);
    }
  }

  onGenderChange(data: MatRadioChange) {
    this.myForm.get('gender')?.setValue(data.value);
  }

  detailsForm() {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNo: ['', [Validators.required, Validators.maxLength(10)]],
      altPhoneNo: ['', [Validators.maxLength(4)]],
      schoolName: ['', Validators.required],
      completionYear: ['', Validators.required],
      courseName: ['', Validators.required],
      gender: ['', [Validators.required]],
      guardianFName: ['', Validators.required],
      guardianLName: ['', [Validators.required, Validators.maxLength(4)]],
      guardianRelationship: ['', [Validators.required, Validators.required]],
      guardianPhoneNo: ['', [Validators.required]],
      guardianAltPhoneNo: ['', [Validators.required]],
      guardianEmail: ['', [Validators.required, Validators.email]],
      acceptTerms: ['', [Validators.required]]
    });
  }


  saveDetails() {
    const data = this.myForm.value;
    this.internService.saveInternInfo(data).subscribe({
      next: () => {},
      error: () => {},
      complete: () => {}
    });
  }


  // form control getters
  get email() {return this.myForm.get('email')}
  get phoneNo() {return this.myForm.get('phoneNo')};
  get altPhoneNo() {return this.myForm.get('altPhoneNo')}
  get schoolName() { return this.myForm.get('schoolName')};
  get gender() {return this.myForm.get('gender')};
  get completionYear() { return this.myForm.get('completionYear')};
  get guardianFName() { return this.myForm.get('guardianFName')};
  get guardianLName() { return this.myForm.get('guardianLName')};
  get guardianRelationship() {return this.myForm.get('guardianRelationship')}
  get guardianPhoneNo() {return this.myForm.get('guardianPhoneNo')};
  get guardianAltPhoneNo() {return this.myForm.get('guardianAltPhoneNo')};
  get guardianEmail() {return this.myForm.get('guardianEmail')};
  get acceptedTerms() {return this.myForm.get('acceptTerms')};
}
