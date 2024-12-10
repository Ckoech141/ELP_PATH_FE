import { Component, HostListener } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { Observable, map, forkJoin, finalize } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FeedscommentComponent } from '../feedscomment/feedscomment.component';
import { faFacebook,faTwitter,faLinkedin,faWhatsapp} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent {
likePost(_t6: any) {
throw new Error('Method not implemented.');
}
commentOnPost(_t6: any) {
throw new Error('Method not implemented.');
}
sharePost(_t6: any) {
throw new Error('Method not implemented.');
}
  userProfileData: any;
  userInfo: any;
  data: any[] = [];
  page: number = 1;
  pageSize: number = 3; // Adjust this to your desired page size
  loadingProfileData = false;
  loadingFeedsData = false;
  authUser: any=[]
  likeCounted:any[]=[]
  expandedIndex: number | null = null;  // Used to track which feed's images are expanded

  screenWidth: number;  // To store screen width

  serverUrl:string=''
  share: any;
  public faFacebook = faFacebook
  public faWhatsapp= faWhatsapp
  public faTwitter=faTwitter
  public faLinkedin=faLinkedin


  openLinkedIn(data:any) {
    const description = data.description
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
   }
   
   openFacebook(data:any) {
    const description = data.description
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
   }
   
   openTwitter(data:any) {
    const description = data.description
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
   }
   
   openWhatsApp(data:any) {
    const description = data.description
    const url = `whatsapp://send?text=${encodeURIComponent(description)}`;
    window.open(url, '_blank');
   }

  constructor(
    public dialog:MatDialog,
    public http: HttpServiceService) {
      this.screenWidth = window.innerWidth;  // Set initial width
      this.onResize();
    } // Constructor to inject HttpServiceService

  feedsData: any[] = []; // Array to store fetched feed data

  ngOnInit() {
    this.serverUrl = this.http.serverUrl
    const userData = localStorage.getItem('userData'); // Check if user data is available in local storage
    if (userData) {
      this.userInfo = JSON.parse(userData);
      
      if (userData) {
        this.userInfo = JSON.parse(userData);
        this.getProfileData();
      }

      this.getFeeds(); // Fetch feeds when user data is available
    }
    this.likesCount();
    
  }

  renderAlt(d: any) {
    console.log('HELLO');
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


  getFeeds() {
    this.loadingFeedsData = true;
    const getFeedsUrl = `${this.http.serverUrl}v2/feeds/all`;
    this.http.getData(getFeedsUrl)
      .subscribe({
        next: (response: any) => {
          this.feedsData = response.payload.map((feed: any) => ({
            ...feed,
            visibleImages: this.limitImages(feed.images, false)
          }));
          console.log("feeds", this.feedsData);
          this.loadingFeedsData = false;
        },
        error: (error: any) => {
          console.error('Error fetching feeds:', error);
          this.loadingFeedsData = false;
        }
      });
  }

  limitImages(images: string[], showAll: boolean): string[] {
    const limit = this.screenWidth > 600 ? 4 : 2;
    return showAll ? images : images.slice(0, limit);
  }

  toggleImages(index: number) {
    const feed = this.feedsData[index];
    if (this.expandedIndex === index) {
      // Toggle off if currently expanded
      feed.visibleImages = this.limitImages(feed.images, false);
      this.expandedIndex = null;
    } else {
      // Expand images
      feed.visibleImages = this.limitImages(feed.images, true);
      this.expandedIndex = index;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.screenWidth = window.innerWidth;
    this.feedsData.forEach((feed, index) => {
      feed.visibleImages = this.limitImages(feed.images, this.expandedIndex === index);
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
      this.likeCounted= res
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

}
