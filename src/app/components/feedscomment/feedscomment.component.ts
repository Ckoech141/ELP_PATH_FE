import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-feedscomment',
  templateUrl: './feedscomment.component.html',
  styleUrl: './feedscomment.component.scss'
})
export class FeedscommentComponent implements OnInit {
feedData: any
authUser:any
comments:any[]=[]
  constructor( @Inject (MAT_DIALOG_DATA) public data:any,
    private http: HttpServiceService,
    private fb:FormBuilder,
    public dialogRef : MatDialogRef<FeedscommentComponent>
  ){
    this.feedData = data.feed,
    this.authUser = data.User
}


  @ViewChildren('comment') comment!: QueryList<any>;
  @ViewChild('content')content!: ElementRef;
  ngOnInit(): void {
    this.getComments()
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.scrollToBottom();
    this.comment.changes.subscribe(this.scrollToBottom);
  }
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onSubmit(f: NgForm) {
    const postForm = this.fb.group({
      emoji:[],
      image:null,
      message: [f.value.comment],
  });
    const formData = new FormData();
    const form = postForm.value;
    // formData.append('message', form.message ? form.message : ''  );
    // console.log("hjdfdfioioifd",);
    this.http.postFeedComment(this.feedData.id, this.authUser.id, form).subscribe(
      ((res) =>{
        console.log(res);
        
      }),      
      ((error) => {
        console.error(error);
        
      }),
      (() =>{
        this.getComments()
        f.resetForm()
      })
    )
    console.log(f.value); // { first: '', last: '' }
    console.log(f.valid); // false
  }

  getComments(){
    this.http.getFeedComments(this.feedData.id).subscribe(
      ((res) =>{
      
        this.comments = res.payload
        console.log("CommentsIUIOIOOO",this.comments);
        
      }),
      ((error) => {
        console.error(error);
        
      }),
      (() =>{

      })

    )
  }

}