import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-admin-userfeeback',
  templateUrl: './admin-userfeeback.component.html',
  styleUrls: ['./admin-userfeeback.component.scss']
})
export class AdminUserfeebackComponent implements OnInit {
  @ViewChild(MatExpansionPanel) panel!: MatExpansionPanel;
copyToClipboard: any;

  
constructor(private feedbackService:FeedbackService,private router: Router,
    public dialog: MatDialog,
    private snackBar:MatSnackBar){}
  feedback: any[] = []
  feedbackId:any
  isLoading:boolean = true

 
  
  

  ngOnInit(): void {
      this.getAllFeedback();      
  }

  preventCollapse(event: Event): void {
      event.stopImmediatePropagation();
  }
  

  deleteFeedback(feedbackId: number): void {
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.feedbackService.deleteFeedback(feedbackId).subscribe({
          next: () => {
            console.log('Feedback deleted successfully');
  
            // Find the deleted item index in the 'feedback' array
            const deletedIndex = this.feedback.findIndex(item => item.id === feedbackId);
  
            // Remove the deleted item from the 'feedback' array locally
            if (deletedIndex !== -1) {
              this.feedback.splice(deletedIndex, 1);
            }
  
            this.snackBar.open('Feedback deleted successfully', 'Close', { duration: 2000 });
            // You can perform additional actions after successful deletion
          },
          error: (error) => {
            console.error('Error deleting feedback', error);
            // Handle error as needed 
          }
        });
      } else {
        // User clicked 'No', do nothing
        console.log('Deletion cancelled by the user.');
      }
    });
  }
  
  onRepostClick() {
    console.log('Button clicked!')
    // Perform any necessary repost logic here (optional)
  
    // Redirect to the post feed page
    this.router.navigate(['/feeds']);
  }
   

  getAllFeedback(): void {
    this.feedbackService.getAllFeedback().subscribe({
      next: (feedbackData: any) => {
          this.feedback = feedbackData.payload;
          this.isLoading = false;
        },
      error: (error: Error) => {
          console.error('Error fetching feedback:', error.message);
          // Handle error if needed
          this.isLoading = false
      }
      }
    );
  }
}
