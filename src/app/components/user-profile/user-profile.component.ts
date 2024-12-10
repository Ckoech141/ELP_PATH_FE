import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { ProfilePicComponent } from '../profile-pic/profile-pic.component';
import { SocialMediaFormComponent } from '../social-media-form/social-media-form.component';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ActivatedRoute } from '@angular/router';
import { UserFeedbackComponent } from '../user-feedback/user-feedback.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Observable, catchError, map } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { UserResumeComponent } from '../user-resume/user-resume.component';
import { ScholarJobComponent } from '../scholar-job/scholar-job.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  authId:any;
  activeTab: string = 'feeds'; //active tab
  imageurl!: string; //to display image image
  profileData!: any | null; //for user profile data
  guestData:any;
  pData:any;
  urlgetimage!: string; //url to get image from api
  urlsocials!: string; //url to get user social media data
  urlprofile!: string; //url to get user profile data
  userInfo!: any; //to hold user information
  social_profileData!: any; //to hold social profile data
  userid!: any; //to hold userid
  authUserId:any;
  useridparam!: string;
  profileId!: number;
  snackBarConfig: MatSnackBarConfig = { 
    horizontalPosition: 'center',
    verticalPosition: 'top'
  };
  contactPrivacy = this.fb.group({
    emailPrivate: true,
    phoneNumberPrivate: true,
  });

  isField1Private = false;
  isField2Private = false;
  isField3Private = false;
  isField4Private = false;
  isField5Private = false;
  isField6Private = false;
  checked: boolean = false;
  skillsData: any[] = [];
  ProfileUpdateService: any;
skillData: any;
guestId:any;
userId!: any;

@Input() userIdadmin!: string;
@Input() viewer!: string;


skills:any[] = []

data: any;
results:boolean = false;
checkboxLabel1: string = ''; // initial label value
chackboxLabel2: string = ''; // initial label value




  constructor(
    private fb:FormBuilder,
    public dialog: MatDialog,
    private http: HttpServiceService,
    private httpClient: HttpClient,
    private profileService: ProfileService,
    public route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private notificationService: NotificationsService
  ) {}

  // Initialize function runs when the component is first loaded in the DOM
  ngOnInit() {
    const userData = localStorage.getItem('userData');
    const id = this.route.snapshot.paramMap.get('id');
    //this.authUserId = userData
    this.guestId = id
    if (id !== undefined && id !== null) {
      this.useridparam = id;
      this.userid = id;
      this.getPData()
      this.getSocialMediaData();
    } else if (userData) {
      this.userInfo = JSON.parse(userData);
      this.userid = this.userInfo.id.toString();
      this.getPrivacyData(this.userid);
      this.getProfileData();
      this.getSocialMediaData();
      // Handle the case when the id is null
    }

    //this.getSkills();
  }

  //============================= method to get social data from api============================
  getSocialMediaData() {
    //url get social information

    this.urlsocials =
      this.http.serverUrl + 'socials/' + this.userid.toString() + '/view';

    this.http.getData(this.urlsocials).subscribe({
      next: (response) => {
        this.social_profileData = response.payload;

        console.log('social data', this.social_profileData);
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {},
    });
  }

  // editSocials(){
  //   const dialogRef: MatDialogRef<SocialMediaFormComponent> = this.dialog.open(
  //     SocialMediaFormComponent,
  //     {
  //       panelClass: 'dialog-responsive',

  //       width: '45%',
  //       height: '75%', // Set the width of the dialog

  //       data: { data: this.data }, // You can pass data to the dialog component using the `data` property
  //     }
  //   );

  //   // Handle the dialog result (if needed)
  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     this.ngOnInit();
  //   });
  //   this.http.editSocials(this.userId, this.data).subscribe(
  //     (response)=>{
  //       console.log(response)

  //     }
  //   )
  // }

  // =========================== method to get profile data from api============================
  //my profile...no privacy settings
  getProfileData() {
    this.profileService.getProfileData(this.userid).subscribe(
      (response: any) => {

        this.profileData = response.payload;
        console.log('Image', this.profileData);
        this.profileId = this.profileData?.profile?.id;

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

  showCV(){
    this.dialog.open(UserResumeComponent,{
      width:'60%',
      height: '95%',
      data:this.userid,
    })
  }

    //my profile...no privacy settings
    getPData() {
      this.http.getPrivacy(this.userid).subscribe(
        ((res) =>{
          this.pData = res.payload;
          
          this.profileService.getProfileData(this.userid).subscribe(
            (response: any) => {
              const data = {
                ...response.payload,
                profile:this?.pData
              }
              this.profileData = data;
              console.log('Image', this.profileData);
              this.profileId = this.profileData?.profile?.id;
      
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
        })
    );
  }

  // method to get active tab
  showTab(tab: string) {
    this.activeTab = tab;
  }

  // =====================================profile pic image form=======================================
  picformDialog(editAdd: string): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<ProfilePicComponent> = this.dialog.open(
      ProfilePicComponent,
      {
        panelClass: 'dialog-responsive',
        width: '50%', // Set the width of the dialog

        data: { data: editAdd }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }

  // =============================================open profile from dialog=================================
  pformDialog(editAdd: string): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<ProfileFormComponent> = this.dialog.open(
      ProfileFormComponent,
      {
        panelClass: 'dialog-responsive',
        width: '45%', // Set the width of the dialog
        height: '80%', // Set the height of the dialog

        data: { data: editAdd }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }
  // =========================================================open social form dialog=======================
  sformDialog(editAdd: string): void {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<SocialMediaFormComponent> = this.dialog.open(
      SocialMediaFormComponent,
      {
        panelClass: 'dialog-responsive',

        width: '45%',
        height: '75%', // Set the width of the dialog

        data: { data: editAdd }, // You can pass data to the dialog component using the `data` property
      }
    );

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.ngOnInit();
    });
  }
  updateSkills() {
    // Update the skillsData array with new values
    this.skillsData = [
      { name: 'Angular', progress: 70 },
      { name: 'Data Analysis', progress: 80 },
      { name: 'Python', progress: 90 },
      { name: 'MysQL', progress: 30 },
      { name: 'DataBase', progress: 11 },
    ];
  }

  onChecked(){
    this.http.postPrivacy(this.userId, this.contactPrivacy.value).subscribe((res)=>{
      console.log("tttttttt", res)
    }),
    ((err: any)=>{
      console.error("not updateddd", err);
      
    })
    this.http.updatePrivacy(this.userid, this.contactPrivacy.value).subscribe(
      ((response) =>{
        console.log("privacy", response);
      }),
      ((e) =>{
        console.error("there was an error updating privacy settings", e); 
      }),
      () => {
        window.alert("privacy settings updated successifully")
      }
    )
    
  }

  onCheckboxChange(checked:boolean) {
    this.checkboxLabel1 = checked ? 'Public' : 'Private';
  }

  onCheckboxChange2(checked:boolean) {
    this.chackboxLabel2 = checked ? 'Public' : 'Private';
  }


  updateServer(apiUrl: string) {
   
  }
  getPrivacyData(id:any){
    this.http.getPrivacy(id).subscribe(
      ((res) =>{
        this.pData = res.payload;
        if (res.payload.email) {
          this.contactPrivacy.patchValue({
            emailPrivate:false
          })
          this.checkboxLabel1 = 'Public';
        }else{
          this.contactPrivacy.patchValue({
            emailPrivate:true
          })
          this.checkboxLabel1 = 'Private'; 
        }
        if (res.payload.phoneNo) {
          this.contactPrivacy.patchValue({
            phoneNumberPrivate:false
          })
          this.chackboxLabel2 = 'Public';
        }else{
          this.contactPrivacy.patchValue({
            phoneNumberPrivate:true
          })
          this.chackboxLabel2 = 'Private'; 
        }
        console.log("testing",this.pData);
      })
      
  );
  }
  
//   getSkills(): void {
//     this.http.getSkills(this.userId).subscribe ({
//       next: (resp: any) => {
//         console.log(resp)
//         this.skills = resp.payload;
//         console.log('skills are working', this.skills);
//       },
//       error: (Error) => {
//         console.error('Error fetching feedback:', Error.error.message);

//       }
//     });
// }
}