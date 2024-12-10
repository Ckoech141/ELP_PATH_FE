
import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notifications.service';
import { ProfileService } from 'src/app/services/profile.service';
import { PostFormComponent } from '../post-form/post-form.component';
@Component({
  selector: 'app-user-edit-feed',
  templateUrl: './user-edit-feed.component.html',
  styleUrl: './user-edit-feed.component.scss'
})
export class UserEditFeedComponent {
  userimageUrl!: string;
  imageUrl!: string;
  editFeedUrl!: string;
  selectedImage!: [File];
  imageData!: string;
  profileData!: any | null; //for user profile data
  profileId!: number;
  userid!: any; //to hold userid
  imageurl!: string; //to display image image
  feedData:any = ''


  constructor(
    private http: HttpServiceService,
    private fb: FormBuilder,
    private notificationService: NotificationsService,
    private profileService: ProfileService,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<UserEditFeedComponent>
  ) {
    this.feedData = data.feed
  }
  postForm = this.fb.group({
    description: [''],
    images: [Image],
  });

  ngOnInit() {
    const userImageData = localStorage.getItem('userImageData');
    console.log("mutui",this.feedData);
    
    if(userImageData) {
      this.imageData = JSON.parse(userImageData)
    }

    const userDataString = localStorage.getItem('userData');
    console.log(userDataString);

    // if (userImageData) {
    //   this.userimageUrl = JSON.parse(userImageData);
    //   console.log('userImageData', typeof this.userimageUrl);
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log('userData', userData.id.toString());
        this.editFeedUrl =
          this.http.serverUrl+'v2/feeds/'+this.feedData.id+'/'+ userData.id.toString()+'/edit';
      } catch (error) {
        console.error('Error parsing "userData":', error);
        // Handle the error (e.g., set default values or show an error message)
      }
    }
  }
  // method to handle selected image
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files;
      this.postForm.get('images')?.setValue(this.selectedImage as any);
      Array.from(this.selectedImage).forEach((img) => {
        const reader = new FileReader();
        reader.readAsDataURL(img as any);
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
      });
    }
  }
  handlingFeedsSubmit() {
    const formData = new FormData();
    const form = this.postForm.value;
    console.log("hgfdkfdllkfdkoofogf", this.postForm.value);
    
    formData.append('title', 'hello');
    formData.append('description', form.description ? form.description : '');
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append(
          'images',
          this.selectedImage[i],
          this.selectedImage[i].name
        );
      }
    }

    formData.forEach(console.log);

    this.http.putData(this.editFeedUrl, formData).subscribe({
      next: (response) => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error:', error);

        // Handle the error here
      },
      complete: () => {},
    });
  }
  // submit
  submit() {
    console.log('feed data', this.postForm.value);
    // instantiate form data object
    const formData = new FormData();
    // add all the activityForm control to the form data object
    Object.keys(this.postForm.controls).forEach((controlName) => {
      formData.append(controlName, this.postForm.get(controlName)?.value);
    });
    formData.append('title', 'hello');
    console.log('POS:');

    this.http.putData(this.editFeedUrl, formData).subscribe({
      next: (response) => {
        console.log('edit request successful:', response);

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


  getProfileData() {
    this.profileService.getProfileData(this.userid).subscribe(
      (response: any) => {
        this.profileData = response.payload;
        console.log('Image', this.profileData);
        this.profileId = this.profileData.id;

        this.imageurl = this.profileData.profile.profileImage;
        localStorage.removeItem('userImageData');
        localStorage.setItem('userImageData', JSON.stringify(this.imageurl));
        console.log('data', this.profileData);
      },
      (error) => {
        // Handle HTTP errors (e.g., network issues)
        console.error('Error:', error);
        // Optionally, show a generic error message using MatSnackBar
        this.notificationService.alertWarning(error.error.message)
      }
    );
  }
}
