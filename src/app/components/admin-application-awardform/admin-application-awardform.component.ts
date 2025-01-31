import { Component, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-application-awardform',
  templateUrl: './admin-application-awardform.component.html',
  styleUrls: ['./admin-application-awardform.component.scss'],
})
export class AdminApplicationAwardformComponent {
  applicationform!: FormGroup;
  urlGetApplicantData!: string;
  applicationId!: string;

  constructor(
    private http: HttpServiceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminApplicationAwardformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the application form using FormBuilder
    this.applicationform = this.fb.group({
      applicantFirstName: ['', Validators.required],
      applicantLastName: ['', Validators.required],
      applicationStatus: ['', Validators.required],
      dateOfApplication: ['', Validators.required],
      dateOfAwarding: ['', Validators.required],
      dateOfInterview: ['', Validators.required],
      scholarCode: ['', Validators.required],
      branch: this.fb.group({
        id: ['', Validators.required],
      }),
    });
  }

  ngOnInit() {
    if (this.data.award !== undefined) {
      console.log('applicant id in awardform', this.data.award);
      this.getApplicant(this.data.award);
      this.applicationId = this.data.award;
    }
  }

  // Fetch applicant data from the server
  getApplicant(id: string) {
    // Initialize URL for HTTP request
    this.urlGetApplicantData =
      this.http.serverUrl +
      'applications/display-applications/' +
      id.toString(); // URL to fetch applicant data
    this.http.getData(this.urlGetApplicantData).subscribe({
      next: (response) => {
        console.log('applicant data', response);

        this.applicationform
          .get('applicantFirstName')
          ?.setValue(response.applicantFirstName);
        this.applicationform
          .get('applicantLastName')
          ?.setValue(response.applicantLastName);
        this.applicationform.get('applicationStatus')?.setValue('AWARDED');
        this.applicationform
          .get('dateOfApplication')
          ?.setValue(response.dateOfApplication);
        this.applicationform
          .get('branch')
          ?.get('id')
          ?.setValue(response.branch.id);
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }

  // Handle form submission
  submit() {
    console.log('SCH number', this.applicationform.value);

    const url =
      this.http.serverUrl +
      'applications/update-application/' +
      this.applicationId.toString();
    // Submit application form data to the server

    this.http.putData(url, this.applicationform.value).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);
        console.log(this.applicationform.value);

        this.dialogRef.close();

        // Handle the response data here
        // localStorage.setItem('token', JSON.stringify(response));
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {},
    });
  }
}
