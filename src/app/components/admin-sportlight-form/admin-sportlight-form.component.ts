import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceService } from 'src/app/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-sportlight-form',
  templateUrl: './admin-sportlight-form.component.html',
  styleUrls: ['./admin-sportlight-form.component.scss']
})
export class AdminSportlightFormComponent implements OnInit {
  formData: FormGroup;
  isSubmitting = false;

  constructor(
    private http: ServiceService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AdminSportlightFormComponent>,
    public snackBar: MatSnackBar
  ) {
    this.formData = this.formBuilder.group({
      title: [''],
      content: [''],
      image: [null],
      videoUrl: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.isSubmitting = true;
    this.http.postSpotlights(this.formData.value).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close();
        this.isSubmitting = false;
        this.snackBar.open('Spotlight Added Successfully', 'close', {
          duration: 2000 // Duration in milliseconds
        });
      },
      error => {
        console.error('Error adding spotlight:', error);
        this.isSubmitting = false;
      }
    );
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.formData.patchValue({ image: input.files[0] });
    }
  }
}
