import { Component, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { countries } from 'src/assets/json_files/countries';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cities } from 'src/assets/json_files/cities';
import { countriesCode} from 'src/assets/json_files/countriesCode';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from 'src/app/services/profile.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent {
  // Define class properties
  formD = new FormData();

  editAdd: any;
  profileData!: any;
  userId!: any;
  countyId!:any;
  urlAddProfile!: string;
  codeId!: any;
  urlUpdateProfile!: string;
  urlGetCountry!: string;
  urlGetCounty!:string;
  urlGetProfile!: string;
  urlGetCode!:string;
  imageUrl!: string;
  selectedImage!: File;
  profileForm!: FormGroup;
  compare: string = 'technology';
  countryList!: Array<any>;
  countyList!:Array<any>;
  countryCode!:Array<any>;
  hidden:boolean=true;
  sending:boolean=false;

  // Define job status options
  jobStatus: any[] = [
    { value: 'Employed', viewValue: 'Employed' },
    { value: 'Intern', viewValue: 'Intern' },
    { value: 'Attachee', viewValue: 'Attachee' },
    { value: 'Apprentice', viewValue: 'Apprentice' },
    { value: 'NotEmployed', viewValue: 'NotEmployed' },
    { value: 'SelfEmployed', viewValue: 'SelfEmployed' },
  ];

  scholarCategories: string[] = [
    'WTF_Alumni',
    'ELP_Pre_University_Intern',
    'WTF_Alumni_and_ELP_Pre_University_Intern',
    'Elimu_Alumni',
    'Elimu_Alumni_and_ELP_Pre_University_Intern',
    'WTF_Alumni_and_TVET',
    'Elimu_Alumni_and_TVET',
    'TVET'
  ];



  // Define country options
  cityList = cities;
  

  // Define courses as an empty array

  constructor(
    private snackbar:MatSnackBar,
    private http: HttpServiceService,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private profileService: ProfileService,
    public dialogRef: MatDialogRef<ProfileFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any //data from the component where the dialogue is invoked
  ) {
    // Create a reactive form using FormBuilder
    this.profileForm = this.fb.group({
      title: [''],
      website: [''],
      jobStatus: [this.jobStatus],
      businessName:[null],
      businessStatus:[null],
      businessRegNo:[null],
      currentCountryofResidence: [this.countryList],
      currentCountyofResidence: [this.countyList],
      category: [this.scholarCategories],
      code: [null],
      phoneNo: [null],
      email: [''],
      currentCityofResidence: ['']
      
      // profileImageFile: [null],
    });
  }
  
  onCountrySelection() {
    const selectedCountry = this.profileForm.value.currentCountryofResidence; 
    const selectedCountryCode = this.countryCode.find(country => country.countryName === selectedCountry)?.dialCode;
    if (selectedCountryCode) { 
      this.profileForm.patchValue({
        phoneNo: selectedCountryCode
        
      });
    } else {
      console.log('Selected country code not found.');
    }
  }
  
  
  // Initialize function runs when the component is first loaded in the DOM
  ngOnInit() {
    this.getCounty();
    this.getCountry();
    this.getDial();

    
    // Save draft
    const draft = localStorage.getItem('step_1');
    if (draft) {
      this.profileForm.setValue(JSON.parse(draft));
    }
    this.profileForm.valueChanges
      .pipe(filter(() => this.profileForm.valid))
      .subscribe( val => localStorage.setItem('step_1', JSON.stringify(val)));
    
            

    this.editAdd = this.data ? this.data.editAdd : null;
    // Retrieve user data from local storage
    const userData = localStorage.getItem('userData');
    console.log('userdata', this.data.data.editAdd);

    if (this.data.data.editAdd) {
      // Parse user data

      this.userId = this.data.data.id;
    } else if (userData) {
      const parsedData = JSON.parse(userData);
      this.userId = parsedData.id;
    }
    this.getprofileData();

    console.log('phonnne', countriesCode);
  }

  // method to handle selected image
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files[0];
      this.profileForm
        .get('profileImageFile')
        ?.setValue(this.selectedImage as any);
      console.log(this.profileForm.value.profileImageFile);
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedImage);
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
    }
  }
  // get counties
  getCounty(){
    this.urlGetCounty=this.http.serverUrl + 'counties/all';
    this.http.getData(this.urlGetCounty).subscribe({
      next: (response) => {
        this.countyList= response.payload;
        console.log('booookkkk', this.countyList);
      },
      error: (error) => {
        console.log('Error', error);
      },
      complete: () => {},
    })
  }
  getCountry() {
    this.urlGetCountry = this.http.serverUrl + 'countries/display-countries';
    this.http.getData(this.urlGetCountry).subscribe({
      next: (response) => {
        console.log('Countries', response);
        this.countryList = response;
        console.log('Countries', this.countryList);
      },
      error: (error) => {
        console.log('Error', error);
      },
      complete: () => {},
    });
  }

  getDial(){
this.urlGetCode = this.http.serverUrl + 'countries/dial-codes'
this.http.getDial(this.urlGetCode).subscribe({
  next : (response) => {
    this.countryCode = response.payload
    console.log('codes', this.countryCode);
  },
  error : (error) => {
    console.log('leap', error);
    },
    complete : () => {},
  });
}
 
  

  // method to Fetch profile data from the server
  getprofileData() {
    // Set URLs to get profile data

    // try {
    //   this.urlGetProfile =
    //   this.http.serverUrl + 'profile/' + this.userId + '/view';
    // } catch (error: any) {
    //   console.log(error)
    //   this.snackBar.open(error.message, 'Close', {duration: 2000});
    // }

    // Fetch profile data from the server
    this.profileService.getProfileData(this.userId).subscribe(
      (response: any) => {
        console.log(response)
        if(response.success == false) {
          this.snackBar.open(response.message);
        } else {
          this.profileData = response.payload;
          console.log('ProfileData', this.profileData);
  
          if (
            this.profileData &&
            this.profileData.profile &&
            this.profileData.profile.id
          ) {
            // Set URLs for updating profile data
            this.urlUpdateProfile =
              this.http.serverUrl +
              'profile/' +
              this.profileData.profile.id +
              '/update';
          } else {
            console.error('Profile data or profile id is undefined');
          }
  

          // Prepopulate the form with data from the API response
          this.profileForm.patchValue({
            title: this.profileData.profile.title,
            website: this.profileData.profile.website,
            jobStatus: this.profileData.profile.jobStatus,
            phoneNo: this.profileData.profile.phoneNo,
            email: this.profileData.profile.email,
            currentCountryofResidence: this.profileData.profile.currentCountryofResidence,
            currentCityofResidence: this.profileData.profile.currentCityofResidence,
            currentCountyofResidence: this.profileData?.profile?.kenyanCounty?.id,
            category: this.profileData.scholarDTO.scholarCategory
          });
  
          // Convert and display profile image
          if (this.profileData.profile.profileImage !== null) {
            // this.convertTofile();
            this.imageUrl = this.profileData.profile.profileImage;
          }
        }
        // Handle the error here
      });
  }

   part1:any
   part2:any
  // Method to submit the form data
  submit() {
    console.log('profile form data', this.profileForm.value);
    this.formD = this.profileForm.value;
    const data = {
      "email": this.profileForm.value.email,
      "title": this.profileForm.value.title,
      "website": this.profileForm.value.website,
      "phoneNo": this.profileForm.value.phoneNo,
      "currentCountryofResidence": this.profileForm.value.currentCountryofResidence,
      "currentCityofResidence": this.profileForm.value.currentCityofResidence,
      "jobStatus": this.profileForm.value.jobStatus,
      "businessName": this.profileForm.value.businessName,
      "businessStatus": this.profileForm.value.businessStatus,
      "businessRegNo": this.profileForm.value.businessRegNo,
    }

    const formData = new FormData();

    // add all the activityForm control to the form data object
    Object.keys(this.profileForm.controls).forEach((controlName) => {
      formData.append(controlName, this.profileForm.get(controlName)?.value);
    });


    // =================================add & edit profile================================================

    let urlProfile: string;

  // Check if it's an edit operation
  if (this.data.data.editAdd === 'edit' || this.data.data === 'edit') {
    urlProfile = this.http.serverUrl + 'profile/' + this.profileData.profile.id + '/' + this.profileForm.value.currentCountyofResidence + '/update';
   
    // Make the HTTP PUT request
    this.http.putData(urlProfile, data).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {
        this.snackbar.open('profile data updated successfully','Close',{duration:2000})
     
      },
    });
  }

  // Check if it's an add operation
  else if (this.data.data.editAdd === 'add' || this.data.data === 'add') {
    urlProfile = this.http.serverUrl + 'profile/' + this.userId + '/' + this.profileForm.value.currentCountyofResidence + '/create';
  }

  // If none of the conditions match, handle the case
  else {
    console.error('Invalid operation');
    return; // Exit the method
  }

  // Make the Post HTTP request
  this.sending= true
  this.http.postData(urlProfile, data).subscribe({
    next: () => {
      this.dialogRef.close();
      this.sending=false
    },
    error: (error) => {
      console.log('Error:', error);
    
      // this.dialogRef.close();
      // Handle the error here
    },
    complete: () => {
      this.sending=false,
      this.snackbar.open('profile data updated successfully','Close',{duration:4000})
     
    },
  });
  }

  onChangeEmploymentStatus(status:any){
    if(status.value==='SelfEmployed'){
      this.hidden=false;
    } else {
      this.hidden=true
    }
// console.log(status.value);
  }
  onChangeBusinessStatus(state:any){
    if(state.value=== 'Registered'){
      this.hidden= false;
     
      
    }else{
      this.hidden=true
    }
  }
}