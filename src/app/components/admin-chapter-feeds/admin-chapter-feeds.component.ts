
import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { EventsServiceService } from 'src/app/services/events-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-admin-chapter-feeds',
  templateUrl: './admin-chapter-feeds.component.html',
  styleUrls: ['admin-chapter-feeds.component.scss'],
})
export class AdminChapterFeedsComponent {
  @Input() chapterid: string = '';
  chapterData: any;
  userProfileData: any;
  feedsData: any[] = [];
  imageUrl:any;
  showWhat: Boolean = false
  isLoading: boolean = false

  constructor( private route: ActivatedRoute,
      private snackBar: MatSnackBar,
      public http:HttpServiceService,
     private httpService: EventsServiceService){}

  ngOnInit(){

    this.route.queryParams.subscribe(params => {
      this.chapterid = params['chapterId'];
      console.log("id", this.chapterid);
      this.getChapterFeeds(this.chapterid)
      
    })
  }

  getChapterFeeds(chapterId: any){
    this.isLoading = true
    const res =  this.httpService.getChapterEvents(chapterId);
    res.subscribe(
      (response: any) => {
        this.feedsData = response.payload
      console.log("id", this.feedsData);

        if(this.feedsData.length != 0){
          this.showWhat = true;
        }
      },
      (error) => {
        this.isLoading = false
        this.snackBar.open(error.error.message, "Close", {duration:3600})
      },
      () => {
        this.isLoading = false
      }
    )
  }
}
