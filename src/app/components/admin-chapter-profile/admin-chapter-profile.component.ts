import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpServiceService } from 'src/app/services/http-service.service';
@Component({
  selector: 'app-admin-chapter-profile',
  templateUrl: './admin-chapter-profile.component.html',
  styleUrls: ['./admin-chapter-profile.component.scss'],
})
export class AdminChapterProfileComponent {
  constructor(
    public http: HttpServiceService,
    public snackBar:MatSnackBar,
  ) {}
  @Input() chapterid!: string;

  countMembers!: number;
  chapterData!: any;
  chapterDescription!: string;
  chapterName!: string;
  chapterId!: string;

  imageUrl!: string;
  ngOnInit() {
    this.getChapter();
  }

  // method to get chapter details
  getChapter() {
   // `${this.http.serverUrl}v2/chapters/${this.chapterId}/view`
    const getChapterUrl =
      this.http.serverUrl + 'v2/chapters/' + this.chapterid + '/view';

    this.http.getData(getChapterUrl).subscribe({
      next: (response) => {
        this.chapterData = response.payload;
        console.log('chapter info',  this.chapterData);
        this.imageUrl = response.payload.chapterImage;

        this.chapterDescription = response.chapterDescription;
        this.chapterName = response.payload.chapterName;

        this.getChapterMembers();
      },
      error: (error) => {
        this.snackBar.open(error.error.message, "Close", {duration:3600})
        console.log(error);
      },
      complete: () => {},
    });
  }
  // method to get chapter members
  getChapterMembers() {
    //http://52.15.152.26:5555/v2/chapters/12/display-chapter-members
    const getChapterMembers =
      this.http.serverUrl +
      'v2/chapters/' +
      this.chapterid +
      '/display-chapter-members';
    this.http.getData(getChapterMembers).subscribe({
      next: (response) => {
        this.countMembers = response.payload.length;
      },
      error: (error) => {
        this.snackBar.open(error.error.message, "Close", {duration:3600})
      },
      complete: () => {},
    });
  }
}
