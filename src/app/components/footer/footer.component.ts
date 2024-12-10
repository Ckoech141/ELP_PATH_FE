import { Component } from '@angular/core';
import { faFacebook, faInstagram,faTwitter,faLinkedin,faTelegram,faYoutube} from '@fortawesome/free-brands-svg-icons';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public faFacebook = faFacebook
  public faInstagram= faInstagram
  public faTwitter=faTwitter
  public faLinkedin=faLinkedin
  public faTelegram =faTelegram 
  public fahome=faHome 
  public faYoutube=faYoutube
  date = new Date();
  data: any;
  email: any;
  subscriptionForm!: FormGroup;
issubscribing: boolean = false;
  

  constructor(private Http:HttpServiceService,private snackBar:MatSnackBar){
    this.subscriptionForm = new FormGroup({
      email: new FormControl('')
    })
  }


  submitEmail(){
    this.issubscribing= true;
    this.Http.postNewsletter(this.subscriptionForm.value.email ).subscribe(
      
      ((res)=>{
        console.log('hellooo', res);
        this.snackBar.open("Newsletter subscription successfull", "Close", {duration: 2000})
        
      }),
      ((error)=>{
        this.issubscribing= false
        this.snackBar.open("Email is already subscribed", "Close", {duration:3600})
        
       
        
      }),
      ()=>{
        this.issubscribing= false;
        this.snackBar.open("Email subscribed successfully", "Close", {duration:3600})
      }
    )
  }
}

