import { Component, ViewChild, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-bio-form',
  templateUrl: './bio-form.component.html',
  styleUrls: ['./bio-form.component.scss'],
})
export class BioFormComponent {
  biodata: any;
  constructor(
    private http: HttpServiceService,
    public dialogRef: MatDialogRef<BioFormComponent>,
    private notificationService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  @ViewChild('bio', { static: false }) bio!: NgForm;
  url!: string;
  userId!: any;
  userData!: any;
  bioId:any;
  bioInfo:any
  isUpdating:boolean = false
  description!: string;
  minLength: number = 100; 
  maxLength: number =800; 
  validateMessage() {
    if (this.description.length < this.minLength) {
        this.description = this.description.substring(0, this.minLength);
    } else if (this.description.length > this.maxLength) {
        this.description = this.description.substring(0, this.maxLength);
    }
  }

 
  ngOnInit() {
    this.bioInfo = this.data.biodata
    console.log("bhhh", this.bioInfo);
    console.log("uyy", this.data );
    
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData)
      this.userId = this.userData.id;
      // Use the parsed data in your application
    }
    console.log("hello", this.data?.data.editAdd);
    

      if (this.data?.data.editAdd == 'add') {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
          console.log("1234", this.data.biodata);
          this.userData = JSON.parse(storedData)
          this.userId = this.userData.id;
          // Use the parsed data in your application
        }
      } else {
        const userData = localStorage.getItem('userData');
        if (userData) {
          console.log("adfgsgds", this.data.biodata);
          
          this.userData = JSON.parse(userData)
          this.userId = this.userData.id;
          const bioid = this.userData.bioId;
          this.url = this.http.serverUrl + 'bio/' + this.userId + bioid + '/update';
        }
      }

      this.getbioData() 
    }

    getbioData() {
      console.log("hello there", this.userId);
      
      this.url = this.http.serverUrl + 'bio/' + this.userId + '/view';
      this.http.getData(this.url).subscribe({
        next: (response) => {
          console.log('user bio', response);
          console.log( 'user id ', this.userId)
          this.biodata= response.payload.description; 
          // Prepopulate the form with data from the API response
         
            this.description = response.payload.description
            this.bioId = response.payload.id
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle the error here
        },
        complete: () => {},
      });
    }
     
  submit() {
    console.log('thiiiiiis bio value',this.bio.value);
    this.isUpdating = true
    if (this.data?.data.editAdd == 'add'){
      let url = this.http.serverUrl + 'bio/' + this.userId + '/add'
      this.http.postData(url, this.bio.value).subscribe({
        next: (response) => {
          console.log('POST request successful:', response);
          // Handle the response data here
          // localStorage.setItem('token', JSON.stringify(response));
          this.dialogRef.close();
          this.notificationService.alertSuccess(response.message)
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle the error here
        },
        complete: () => {
          this.getbioData()
        },
      });
    }else{
      console.log("qwert",this.biodata);
      
      this.http.updateBio(this.userId, this.bioId, this.bio.value).subscribe(
        ((res) => {
          console.log(res);
          this.notificationService.alertSuccess(res.message)
        }),
        ((e) => {console.log(e);
        }),
        () => {
          this.isUpdating = false
          this.getbioData()
          this.dialogRef.close();
          
        }
      )
    }

  }
}
