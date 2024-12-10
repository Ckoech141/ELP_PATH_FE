import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminAddEventFormComponent } from '../admin-add-event-form/admin-add-event-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-chapter-update',
  templateUrl: './admin-chapter-update.component.html',
  styleUrl: './admin-chapter-update.component.scss'
})
export class AdminChapterUpdateComponent {
  userId!: string;
  imageUrl!: string;
  chapterForm!: FormGroup;
  leader!:FormGroup
  chapterUsersurl!: string;
  chapterUsers: any;
  url!:string
  eventType!: string;
  selectedImage!: [File];

  constructor(
    private http: HttpServiceService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AdminAddEventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        // form builder
        this.chapterForm = this.fb.group({
          chapterName: new FormControl(data.data.nickName),
          chapterDescription: new FormControl(data.data.chapterDescription),
          chapterImage: [File]
        });
  }

  ngOnInit() {
    this.leader = new FormGroup({
      leader: new FormControl(this.data.data.chapterLeader),
    })
    // Determine the URL based on whether data is available or not
    console.log('chapterId in event form', this.data.data);
    if (this.data.data) {
      //http://52.15.152.26:5555/v2/chapters/4249/display-chapter-members
      this.chapterUsersurl = `${this.http.serverUrl}v2/chapters/${this.data.data.id}/display-chapter-members`
      //http://52.15.152.26:5555/v2/chapters/12/update

      this.url =
        this.http.serverUrl +
        'v2/chapters/' +
        this.data.data.id +
        '/update';
    } else {
      this.url = this.http.serverUrl + 'v2/events/create-event';
    }
    this.getChapterMembers()
  }

  // Handle file input change
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files;
      this.chapterForm.get('chapterImage')?.setValue(Array.from(this.selectedImage) as any);
      Array.from(this.selectedImage).forEach((img) => {
        const reader = new FileReader();
        reader.readAsDataURL(img as any);
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
      });
    }
    console.log("selected images", this.chapterForm.get('chapterImage')?.value)
  }
 
  getChapterMembers(){
    console.log(this.chapterUsersurl);
    
    this.http.getData(this.chapterUsersurl).subscribe(
      ((res) =>{
        console.log("users",res.payload);
        this.chapterUsers = res.payload
      }),
      ((e) =>{console.error(e);
      }),
      () => {}
    )
  }



  // Handle form submission
  submit() {
    console.log('event type', this.eventType);

    // Create form data object for submitting
    const formData = new FormData();

    // Add form control values to the formData
    Object.keys(this.chapterForm.controls).forEach((controlName) => {
      formData.append(controlName, this.chapterForm.get(controlName)?.value);
    });
    Array.from(this.selectedImage).forEach((file: any) => {
      formData.append('chapterImage', file);
    });
    
    console.log("Data to be submitted", formData.getAll)

    // Submit the form data to the server using HttpService

    this.http.putData(this.url, formData).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);
        console.log(this.chapterForm.value);
        console.log(formData)

        this.dialogRef.close();

        // Handle the response data here
        // localStorage.setItem('token', JSON.stringify(response));
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },
      complete: () => {
        //http://52.15.152.26:5555/v2/chapters/v2/set-leader/47/130
        const url = this.http.serverUrl +'v2/chapters/v2/set-leader/' + this.data.data.id + '/' + this.leader.value.leader
        console.log(url);
        
        this.http.setChapterLeader(url).subscribe(
          ((res) =>{
            console.log(res);
            
          }),
          ((e) =>{
            console.error(e);
          }),
          () => {
            this.snackBar.open("Chapter details and chapter President set successfully ", "Close" , {duration:3600})
          }
        )
      },
    });
  }
}
