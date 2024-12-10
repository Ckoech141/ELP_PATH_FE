import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-add-event-form',
  templateUrl: './admin-add-event-form.component.html',
  styleUrls: ['./admin-add-event-form.component.scss'],
})
export class AdminAddEventFormComponent {
  isSubmitting:boolean = false;
  userId!: string;
  imageUrl!: string;
  eventForm!: FormGroup;
  url!: string;
  eventType!: string;
  selectedImage!: [File];
  authUser!:any
  constructor(
    private snackbar:MatSnackBar,
    private http: HttpServiceService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminAddEventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // form builder
    const user = localStorage.getItem('userData')
    if (user) {
      this.authUser = JSON.parse(user)
    }
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventLink: [''],
      eventDescription: ['', Validators.required],
      organizer: ['', Validators.required],
      location: [''],
      eventImage: [[]]
    });

    // Determine the URL based on whether data is available or not
    console.log('chapterId in event form', this.data.data);
    if (this.data.data) {
      if (this.data.type) {
        this.url =  this.http.serverUrl +'v2/events/' + this.data.data + '/' +this.authUser.id + '/create-hub-event';
      } else {
        this.url =  this.http.serverUrl +'v2/events/' + this.data.data + '/' +this.authUser.id + '/create-chapter-event';
      }
    } else {
      this.url = this.http.serverUrl + 'v2/events/create-event';
    }
  }

  // Handle file input change
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedImage = event.target.files;
      this.eventForm.get('eventImage')?.setValue(Array.from(this.selectedImage) as any);
      Array.from(this.selectedImage).forEach((img) => {
        const reader = new FileReader();
        reader.readAsDataURL(img as any);
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
      });
    }
    console.log("selected images", this.eventForm.get('eventImage')?.value)
  }

  // Handle changes in the event type selection
  onEventTypeChange(newValue: string): void {
    console.log('Input value changed:', newValue);
    if (newValue === 'Both') {
      this.eventForm.get('eventLink')?.setValidators(Validators.required);
      this.eventForm.get('location')?.setValidators(Validators.required);
      this.triggerChangeDetection();
    } else if (newValue === 'Online') {
      this.eventForm.get('eventLink')?.setValidators(Validators.required);
      this.eventForm.get('location')?.clearValidators();
      this.triggerChangeDetection();
    } else if (newValue === 'Physical') {
      this.eventForm.get('location')?.setValidators(Validators.required);
      this.eventForm.get('eventLink')?.clearValidators();
      this.triggerChangeDetection();
    } else {
      this.eventForm.get('eventLink')?.clearValidators();
      this.eventForm.get('location')?.clearValidators();
    }
    this.eventForm.get('eventLink')?.updateValueAndValidity();
    this.eventForm.get('location')?.updateValueAndValidity();
  }

  // Trigger manual change detection
  triggerChangeDetection(): void {
    this.cdr.detectChanges();
  }

  // Handle form submission
  submit() {
    console.log('event type', this.eventType);
    this.isSubmitting = true
    // Create form data object for submitting
    const formData = new FormData();

    // Add form control values to the formData
    Object.keys(this.eventForm.controls).forEach((controlName) => {
      formData.append(controlName, this.eventForm.get(controlName)?.value);
    });

    Array.from(this.selectedImage).forEach((file: any) => {
      formData.append('eventImage', file);
    });
    
    console.log("Data to be submitted", formData)

   // Submit the form data to the server using HttpService

    this.http.postData(this.url, formData).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);
        console.log(this.eventForm.value);
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
        this.isSubmitting = false;
        this.snackbar.open("Event added successfully", "Close", {duration:3600})
      },
    });
  }
}
