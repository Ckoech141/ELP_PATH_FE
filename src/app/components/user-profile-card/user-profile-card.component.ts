import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.scss'],
})
export class UserProfileCardComponent {
  activeTab: string = 'bio'; //active tab
  imageurl!: string; //to display image image
  profileData!: any; //for user profile data
  urlgetimage!: string; //url to get image from api
  urlsocials!: string; //url to get user social media data
  urlprofile!: string; //url to get user profile data
  userInfo!: any; //to hold user information
  social_profileData!: any; //to hold social profile data
  constructor(public dialog: MatDialog, private http: HttpServiceService) {}

  // Initialize function runs when the component is first loaded in the DOM
  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userInfo = JSON.parse(userData);
      console.log('userdata', this.userInfo);
      this.getProfileData();
    }
  }


  // =========================== method to get profile data from api============================
  getProfileData() {
    // url get profile information
    this.urlprofile =
      this.http.serverUrl + 'profile/' + this.userInfo.id + '/view';
    // Fetch profile data from the server
    this.http.getData(this.urlprofile).subscribe({
      next: (response) => {
        this.profileData = response.payload.profile;
        this.imageurl = this.profileData.profileImage;
        localStorage.removeItem('userImageData');
        localStorage.setItem('userImageData', JSON.stringify(this.imageurl));
        console.log('data', this.profileData);
      },
      error: (error) => {
        console.log('Error:', error);
        // Handle the error here
      },

      complete: () => {},
    });
  }

  handleError(event: any){
    event.target.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAJFBMVEXQ0NDw8PDj4+Pc3NzU1NTn5+fz8/Pt7e3f39/X19fq6urNzc0EuZL3AAADYElEQVR4nO2bCZajIBRFC0EFs//9tomWpZFRUXj2uxvIv+cPMuXnhxBCCCGEEEIIIYQQQgghhBBCCCHkSShjpNZaGlU6ktMY3faieyP6VpaO5hRKjyZiZvQZgHXkILZ0XQtabGNaOvFN12PayJ3Jx2YwpQM7gLTkZbLBy4357pc/4PpGNU4XIdBmmuzdLmiF5k3MmJpX6QBTMIO9+3+7BkrGPpYXsD422psYrBGgmoCMBqoz1QZkGsqU4VkyT+qZ8DRDkgl9Z6C2AZ4185uhdHxJBJoGqmX8q2YBtmoeh7MvMaWjS2V3MvMH3E7TM9CwRtmEY3/W9Ugr5gWlbS5Qq/8Vo833gO4Qa2zGtNus4M2xDaYd+m66BRB9Uzqa0yipm7ZtGg3aLIQQQgghhBBC/hfwThLdSMBzUQdK9qLFPbXaML3Le4jN/MbwETbLu7wH9M3qjSG8jV5fyoFX2tfdArLNa3dPgmvzstzHwfaN7f4KNTdWF1Ab7XpcgGez733cvnl5H32A2ThrDLDSAi5INr5+mYH5n5G/Xxab0mHGEawxoNyEa2y2AXjIFusCYGNbW3psSofrJar3VzZVT4H9y6i6Kk028b+X6nK3jey7aJu4mVzOxrzPViJtXP/1DNjc9r0xU93E2Fj/TxzFTTbytwfCNupYXu7LzSq+oM1xl3tsNt+MgM0ZlztszHbOem3Oubxtrt3fmO9vhtvmRL8sXGpjic9lk8PlUhvrGsthk8XlQhvHetFqk8nlMhtnfBabbC4X2Xji29lkdLnExvPPoJ1NVpcLbAL7q41NZpfsNsG94somu0tmm4j4FpsLXLLaRO3hZ5tLXDLaeHt/a/M6vH+5ySb6bKVRSWdKJWwS9vDNkf3+nTZJZ15XumSwieyXezhpU5XLSZu0c9UbOLGTvuibcYbDNhW6HLaprF9+OXRyW12/zBw5gTI11tiH9FP1KvtlJjU3Nbuk2sjk+6F7Sbn33J1bVke8jelqdxltHlJjE09yiZOpv18molwA+uXDc2pMxMig1JiIkMHJS1gGKC9BGSiXgEyt+xcHT3LxytS95rfgcykdWzIPyotHBq1f3jzJxSUD6eKQwXSxy4C6WGUqPYMNY80L3Eye2bso3aBikcHFMZoJIYQQQgghpHr+AZZ6NU6cNizeAAAAAElFTkSuQmCC"

  }
}
