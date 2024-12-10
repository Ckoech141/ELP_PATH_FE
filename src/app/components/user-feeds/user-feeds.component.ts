import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, finalize, map } from 'rxjs';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserEditFeedComponent } from '../user-edit-feed/user-edit-feed.component';
import { FeedscommentComponent } from '../feedscomment/feedscomment.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-feeds',
  templateUrl: './user-feeds.component.html',
  styleUrl: './user-feeds.component.scss'
})
export class UserFeedsComponent {
  userProfileData: any;
  userInfo: any;
  data: any[] = [];
  page: number = 1;
  pageSize: number = 3; // Adjust this to your desired page size
  loadingProfileData = false;
  loadingFeedsData = false;
  authUser: any=[]
  likeCounted:any[]=[]
  userId: any;
  serverUrl:string = '';
  visitedProfileUserId:any;

  constructor(
    public dialog:MatDialog,
    private router: ActivatedRoute, 
    private http: HttpServiceService,
    private snackBar:MatSnackBar) {} // Constructor to inject HttpServiceService

  feedsData: any[] = []; // Array to store fetched feed data

  ngOnInit() {

    
    this.serverUrl = this.http.serverUrl;
    const userData = localStorage.getItem('userData'); // Check if user data is available in local storage
    if (userData) {
      this.userInfo = JSON.parse(userData);
      console.log("123456789", userData);
      
      if (userData) {
        this.visitedProfileUserId = this.router.snapshot.paramMap.get('id');
        this.userInfo = JSON.parse(userData);
        if (this.visitedProfileUserId) {
          this.userId = this.visitedProfileUserId
        } else {
          this.userId = this.userInfo.id
        }
        const getFeedsUrl = this.http.serverUrl + 'v2/feeds/' + this.userInfo?.id + '/view';
        this.getProfileData();
        // this.userId = this.userInfo.id; // Assign userId here
      }

      this.getFeeds(this.userId); // Fetch feeds when user data is available
    }
    this.likesCount();
  }
  
  
  // =========================== method to get profile data from api============================
  getProfileData() {
    this.loadingProfileData = true;
    // url get profile information
    const urlprofile =
      this.http.serverUrl + 'profile/' + this.userInfo.id + '/view';

    console.log(this.userInfo);
    // Fetch profile data from the server
    this.http
      .getData(urlprofile)
      .pipe(finalize(() => (this.loadingProfileData = false)))
      .subscribe({
        next: (response) => {
          this.userProfileData = response;
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle the error here
        },
        complete: () => {},
      });
  }

  handleImageError(event: any){
    event.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScuQGyYbgV9HFyiunO9mF6_lnB6MYwcx6t3w&usqp=CAU';
  }
  // Fetches feeds data from the server
  getFeeds(userId: any) {
    console.log('user Id', userId)
    this.loadingFeedsData = true;

    const getFeedsUrl = this.http.serverUrl + 'v2/feeds/' + userId + '/view';
    this.http
      .getData(getFeedsUrl)
      .pipe(finalize(() => (this.loadingFeedsData = false)))
      .subscribe({
        next: (response) => {
          // Create an array of observables that combine feed data with user profile information
          console.log('feeds', response);
          this.feedsData = response.payload;
          
        },
        error: (error) => {
          console.error('Error fetching feeds:', error); // Log any errors that occur during data fetching
        },
        complete: () => {},
      });
  }

  // Fetches user profile information from the server
  getUserProfile(userId: string): Observable<any> {
    const getProfileUrl =
      this.http.serverUrl + 'profile/' + this.userInfo.id + '/view'; // API endpoint URL for fetching user profile

    // Fetch user profile data and map it to the user's profile image if available
    return this.http.getData(getProfileUrl).pipe(
      map((response: any) => {
        console.log(response.feedImage);
        return response.feedImage !== null ? response.feedImage : ''; // Return the profile image data if available, otherwise an empty string
      })
    );
  }

  // Calculates and returns the time difference between the post date and current date
  getTimeDifference(postDate: string): string {
    const now = new Date();
    const postDateTime = new Date(postDate);

    const timeDifferenceInSeconds = Math.floor(
      (now.getTime() - postDateTime.getTime()) / 1000
    );

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} second${
        timeDifferenceInSeconds !== 1 ? 's' : ''
      } ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 604800) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 2419200) {
      const weeks = Math.floor(timeDifferenceInSeconds / 604800);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (timeDifferenceInSeconds < 29030400) {
      const months = Math.floor(timeDifferenceInSeconds / 2419200);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(timeDifferenceInSeconds / 29030400);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  }

  likeThisPost(data:any){
    console.log(this.userInfo?.id, 'liked this post' , data.id);
    this.http.postLikeFeed(this.userInfo.id, data.id).subscribe(
      ((res) =>{
        console.log(res);
        this.likesCount()
      }),
      ((error) => console.error(error))
    )
  }

likesCount(){
this.feedsData.forEach( (value) =>{
  this.http.postLikeCount(value.id).subscribe(
    ((res) =>{
      this.likeCounted= res.payload.count
      console.log("COUNTED LIKES", this.likeCounted);
      
    })
  )
});
}

addComment(data:any){
  this.dialog.open(FeedscommentComponent, {
   
    data:{
      feed : data,
      User:this.userInfo
      
    }
  })
}
deleteFeed(data:any){
  const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);

  dialogRef.afterClosed().subscribe((result) => {
    console.log("delete",result);
    
    if (result) {
      // User clicked 'Yes', proceed with deletion
      this.http.deleteFeed(data?.id,this.userId).subscribe({
        next: () => {
          console.log('Feed deleted successfully');

            const deletedIndex = this.data.findIndex(item => item.id === data?.id);
  
            // Remove the deleted item from the 'feeds' array locally
            this.getFeeds(this.userId)
            if (deletedIndex !== -1) {
              this.data.splice(deletedIndex, 1);
            }


          this.snackBar.open('Feed deleted successfully', 'Close', { duration: 2000 });
          // You can perform additional actions after successful deletion
        },
        error: (error) => {
          console.error('Error deleting feed', error);
          // Handle error as needed
        }
      });
    } else {
      // User clicked 'No', do nothing
      console.log('Deletion cancelled by the user.');
    }
  });
}

editFeed(data:any){
  this.dialog.open(UserEditFeedComponent,{
    width:"45%",
    data: {feed:data}
  }

    );
}

}
