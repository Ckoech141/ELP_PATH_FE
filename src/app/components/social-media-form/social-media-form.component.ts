import { Component, Inject, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-social-media-form',
  templateUrl: './social-media-form.component.html',
  styleUrls: ['./social-media-form.component.scss'],
})
export class SocialMediaFormComponent implements OnInit {
  socialdata: any;
  userId!: number;
  url!: string;
  socialForm = this.fb.group({
    facebook: [''],
    github: [''],
    instagram: [''],
    linkedIn: [''],
    twitter: [''],
  });
  isSaving:boolean=false;

  constructor(
    private snackbar:MatSnackBar,
    private http: HttpServiceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SocialMediaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // Retrieve user data from local storage
    const userData = localStorage.getItem('userData');

    if (this.data.data.editAdd) {
      // Parse user data
      this.userId = this.data.data.id;
    } else if (userData) {
      const parsedData = JSON.parse(userData);
      this.userId = parsedData.id;
    }
    this.getSocialMediaData(); // Populate the form with existing social media data
  }

  getSocialMediaData() {
    this.url = this.http.serverUrl + 'socials/' + this.userId + '/view';
    this.http.getData(this.url).subscribe({
      next: (response) => {
        console.log('socials', response);
        this.socialdata = response.payload;

        // Prepopulate the form with data from the API response
        this.socialForm.patchValue({
          facebook: this.socialdata.facebook,
          github: this.socialdata.github,
          linkedIn: this.socialdata.linkedIn,
          twitter: this.socialdata.twitter,
          instagram: this.socialdata.instagram,
        });
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {},
    });
  }

  submit() {
    this.isSaving=true,
    console.log('social form data', this.socialForm.value);
    
    // Construct the URL based on the operation (add or edit)

    let urlUpdateSocials: string;

    if (this.data.data.editAdd === 'edit' || this.data.data === 'edit') {
      urlUpdateSocials = this.http.serverUrl + 'socials/' + this.userId + '/update';

          // Make the HTTP request
    this.http.putData(urlUpdateSocials, this.socialForm.value).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {
        this.isSaving=false,
        this.snackbar.open('social media saved successfully','Close', {duration:2000})
      },
    });
    } else if (this.data.data.editAdd === 'add' || this.data.data === 'add') {
      urlUpdateSocials = this.http.serverUrl + 'socials/' + this.userId + '/add';

          // Make the HTTP request
    this.http.postData(urlUpdateSocials, this.socialForm.value).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {},
    });
    } else {
      console.error('Invalid operation');
      return; // Exit the method
    }


  }
}
