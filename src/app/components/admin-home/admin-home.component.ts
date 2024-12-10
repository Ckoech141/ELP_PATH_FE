import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent {
  logoimg:string ='assets/images/equity-bank-logo.png';
  isShowing!: boolean;
  bgColor: string = 'bg-dark'
  navbgColor: string = 'black;'

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
