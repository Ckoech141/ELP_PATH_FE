import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminAddOrganizationFormComponent } from '../admin-add-organization-form/admin-add-organization-form.component';
import { ServiceService } from 'src/app/services/service.service';




@Component({
  selector: 'app-admin-addjob-form',
  templateUrl: './admin-addjob-form.component.html',
  styleUrls: ['./admin-addjob-form.component.scss'],
})
export class AdminAddjobFormComponent {
  // Declare class properties
  isSuccess = true
  message = ""
  isSubmitted = false
  jobPostings: any[] = [];
  jobQualifications: any[] = [];
  jobResponsibilities:any[] = [];
  error: string = '';
  url!: string;
  qualification!: any;
  responsibility!: any;
  imageUrl!: string;
  selectedImage: File | null = null; // To hold the selected image
  IevelOptions: string[] = [
    'PHD',
    'MASTERS',
    'DEGREE',
    'DIPLOMA',
    'KCSE',
    'KCPE',
    'NONE',
  ];
  jobOptions: string[] = [
    'PERMANENT',
    'TEMPORARY'
  ]
  organizationOptions: any;
  urlGetorganization!: string;
  organizationId: any;
  inputHidden:any;
  quality:any;
  qualityInput:any;
  jobsInput: any;
  errOneInput:any;
  errTwoInput:any;
  jobsResponsible: any;
  jobs: String[] = [];
  apiUrl:string = ''
  selectImage!: File;


  jobForm = this.fb.group({
    jobTitle: ['', Validators.required],
    jobType: ['', Validators.required],
    educationLevel: ['', Validators.required],
    applicationDeadLine: ['', Validators.required],
    organization: ['', Validators.required],
    jobDescription:  ['', Validators.required],
    application: ['', Validators.required],
    responsibility: ['', Validators.required],
    qualification: ['', Validators.required],
    jobPoster:  null as File | null
  })
 

  constructor(
    private service: ServiceService,
    private fb: FormBuilder,
    private http: HttpServiceService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AdminAddjobFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {  

    
  }

  splitInfo(data: any, data1: any){

    this.jobQualifications = data.split('.');
    this.jobResponsibilities = data1.split('.');
     
  }
  postJob(){
    const a = this.jobForm.get('qualification')?.value
    const b = this.jobForm.get('responsibility')?.value

    this.splitInfo(a, b)

    //creating the job instance..
    const newJob = {
      "jobTitle":this.jobForm.value.jobTitle,
      "jobType":this.jobForm.value.jobType,
      "jobDescription": this.jobForm.value.jobDescription,
      "jobPoster":this.selectImage,
      "educationLevel": this.jobForm.value.educationLevel,
      "howToApply":this.jobForm.value.application,
      "applicationDeadLine":this.jobForm.value.applicationDeadLine,
      "jobQualifications":this.jobQualifications,
      "jobResponsibilities": this.jobResponsibilities,
      "organization":this.jobForm.value.organization
    }
    const title: any = newJob.jobTitle
    const type: any = newJob.jobType
    const des: any = newJob.jobDescription
    const pos: any = newJob.jobPoster
    const edu: any = newJob.educationLevel
    const how: any = newJob.howToApply
    const dead: any = newJob.applicationDeadLine
    const qua: any = newJob.jobQualifications
    const resp: any = newJob.jobResponsibilities
    const org: any = newJob.organization

    const formData = new FormData();
    // Append each property of newJob object to formData
    // Object.keys(newJob).forEach(key => {
    //   formData.append(key, newJob[key]);
    // });

    formData.append("jobTitle", title)
    formData.append("jobType", type)
    formData.append("jobDescription", des)
    formData.append("educationLevel", edu)
    formData.append("jobPoster", pos)
    formData.append("howToApply", how)
    formData.append("applicationDeadLine", dead)
    formData.append("jobQualifications", qua)
    formData.append("jobResponsibilities", resp)
    formData.append("organization", org)

    this.apiUrl = this.http.serverUrl + "opportunities/job/create-with-poster"

     const res = this.http.postData(this.apiUrl, formData)
     res.subscribe(
      (response: any)=>{
        if(response.statusCode === 200){
            console.log("status code.", response.statusCode)
            this.isSuccess = false
            this.message = formData.get('jobTitle') + " posted successfully."
        }else{
          this.isSuccess = false
          this.message = formData.get('jobTitle') + " not posted."
        }
      }
     )
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectImage = event.target.files[0];
      this.jobForm
        .get('jobPoster')
        ?.setValue(this.selectImage as any);

      //console.log(this.profileForm.value.profileImageFile);
      // Assuming you want to display a preview of the selected image
      const reader = new FileReader();
      reader.readAsDataURL(this.selectImage);
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
    }
  }
  // Initialize the application form using FormBuilder
  onSubmit(){
    if(!this.jobForm.invalid){
        console.log("------------------------------------Form Valid-----------------------------------")
        this.isSubmitted = true;
        this.postJob()
        // this.dialog.open(
        //   AddJobInfoComponent, {
        //     data: this.jobForm.value
        //   }
        // )
        console.log(this.jobForm.value)


    }else{
      console.log("------------------------------------Form Not Valid-----------------------------------")
      console.log(this.jobForm.value)

    }
  }

    
  ngOnInit() {
    

    // Initialize URL for HTTP request
    // this.getorganization();
  }

  
  // addQualification() {
  //   if (this.qualification !== undefined) {
  //     this.jobform.value.jobQualifications.push(this.qualification);
  //     this.qualifications.push(this.qualification);
  //     this.qualification = undefined;
  //   }
  // }

  // addResponsibilities() {
  //   if (this.responsibility !== undefined) {
  //     this.jobform.value.jobResponsibilities.push(this.responsibility);
  //     this.responsibilities.push(this.responsibility);
  //     this.responsibility = undefined;
  //   }
  // }

  // open bio dialog
  addorganizationDialog() {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminAddOrganizationFormComponent> =
      this.dialog.open(AdminAddOrganizationFormComponent, {
        width: '60%', // Set the width of the dialog
        data: { data: '' }, // You can pass data to the dialog component using the `data` property
      });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }

  // Fetch branch data from the server
  getorganization() {
    this.urlGetorganization = this.http.serverUrl + 'organization/all'; // URL to fetch organization data
    this.http.getData(this.urlGetorganization).subscribe({
      next: (response) => {
        console.log('organization id', response.id);
        this.organizationOptions = response; // Set organizationOptionss array
        console.log(this.organizationOptions);
        this.organizationId = response.id;
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }

  addItemsToFormData(formData: FormData, formArray: FormArray, fieldName: string) {
    for (let i = 0; i < formArray.length; i++) {
      formData.append(`${fieldName}[${i}]`, formArray.at(i).value);
    }
  }
}
