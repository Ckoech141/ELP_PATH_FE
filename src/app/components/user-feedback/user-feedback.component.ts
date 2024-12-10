import { Component, OnInit } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-feedback',
  templateUrl: './user-feedback.component.html',
  styleUrls: ['./user-feedback.component.scss']
})
export class UserFeedbackComponent implements OnInit {
  form!: FormGroup;
  userId: any;

  constructor(
    private snackBar: MatSnackBar,
    private feedbackService: FeedbackService,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    const userData = localStorage.getItem('userData');

    if(userData) {
      const userInfo = JSON.parse(userData);
      this.userId = userInfo.id;
    }
    this.form = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  postFeedback() {
      // Check if the feedback is not empty
        // Call the FeedbackService to post the feedback
        console.log("body....", this.form.value)
        this.feedbackService.postFeedback(this.form.value, this.userId).subscribe({
          next: (response) => {
              console.log('Feedback posted successfully', response);
              this.snackBar.open('Feedback posted successfully', 'Close',{duration:2000});

              // Reset the form to clear the textarea
      this.form.reset();
          },
          error: (error) => {
              console.error('Error posting feedback', error.message);
              this.toast.error('Error posting feedback');
          },
          complete: () => {}
          }
      );
  }
}
