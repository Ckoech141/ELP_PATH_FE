import { Component, ViewChild } from '@angular/core';
import { FeedsComponent } from '../feeds/feeds.component';
import { PostComponent } from '../post/post.component';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { ProfileProgressService } from 'src/app/services/profile-progress.service';
import { ProfileTracker } from 'src/app/interfaces/ProfileResponse';
import { ProfileService } from 'src/app/services/profile.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  logoimg:string ='assets/images/equity-bank-logo.png';
  isShowing!: boolean;
  bgColor: string = 'white'
  navbgColor: string = 'black;'

  constructor(
    private profileService: ProfileService,
  ){
    
  }

  ngOnInit(){
    this.isShowing = true;
  }

  ChangeBgGreen(){
    this.bgColor = 'bg-success'
  }
  ChangeBgDark(){
    this.bgColor = 'bg-dark'
  }
  ChangeBgInfo(){
    this.bgColor = 'bg-info'
  }
  ChangeBgWarning(){
    this.bgColor = 'bg-warning'
  }
  ChangeBgPri(){
    this.bgColor = 'bg-primary'
  }
  ChangeBgSec(){
    this.bgColor = 'bg-secondary'
  }
  ChangeBgLight(){
    this.bgColor = 'bg'
  }

  toggle() {
    if (this.isShowing) {
      return (this.isShowing = false);
    } else {
      return (this.isShowing = true);
    }
  }


  }
