import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminChapterUpdateComponent } from '../admin-chapter-update/admin-chapter-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-chapters',
  templateUrl: './admin-chapters.component.html',
  styleUrls: ['./admin-chapters.component.scss'],
})
export class AdminChaptersComponent {
  isSubmitting:boolean = false
  dataUrl: any[]=[];
  data: any;
  filteredData: any[] = [];
  isLoading:boolean = false;
  
  constructor(public http: HttpServiceService,     
    private fb:FormBuilder,
    private dialog: MatDialog,
    private snackBar:MatSnackBar
    ) {}

  chapterData: any[] = [];
  filterform!: FormGroup;
  filteredChapterData: any[] = [];
  filterText: string = '';
  selectedFilter: string = '';
  selected='';
  showFilterInput: boolean = false;
 

  ngOnInit() {
   
    this.filterform=this.fb.group({
    chapterId: ["",[Validators.required]],
    chapterName: ["",[Validators.required]],
    })
    this.getAllChapters();
    // this.getChapters()
  }

  //http://52.15.152.26:5555/v2/chapters/get-chapters-with-members
  // method to get all chapters
  getAllChapters() {
    this.isLoading = true
    const url = `${this.http.serverUrl}v2/chapters/get-chapters-with-members`
    this.http.getData(url).subscribe(
      ((res) =>{
        console.log(res);
        this.dataUrl = res.payload;
        const items: any[] = []
        res.payload.forEach((chapter: { chapterType: any; }) =>{
          console.log("ckj" , chapter);
          
          if (chapter?.chapterType == 'Institutional') {
            items.push(chapter)
          }
        })
        this.dataUrl = items
        this.filteredData = [...items];
        console.log("filt", this.filteredData);
        
      }),
      ((error) =>{
        this.isLoading = false
        this.snackBar.open(error.error.message)
      }),
      () => {
        this.isLoading = false
      }
    )

 }
 
    updateChapter(chapter:any){
      this.dialog.open(AdminChapterUpdateComponent, {
        width:"40vw",
        data: {data:chapter}
      })
    }
  // getChapters(){
  //   const getChaptersUrl = this.http.serverUrl + 'chapters/all'; // Modify the URL accordingly
  //   this.http.getData(getChaptersUrl).subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       this.chapterData = response.map((item: any) => ({
  //         chapterName: item.chapterName,
  //         chapterDescription: item.chapterDescription,
  //         imageUrl:
  //           item.chapterImage !== null
  //             ? 'data:' +
  //               item.chapterImage.type +
  //               ';base64,' +
  //               item.chapterImage.data
  //             : null,
  //         // chapterType: item.chapterType.chapterTypeName,
  //         // chapterId: item.id.toString(),
  //       }));
  //       console.log(this.chapterData);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {},
  //   });
  // }
  getChapterById(){}
  getChapterByName(){}
  filterChapter(){}
  


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
  
    if (this.selectedFilter === 'chapterId') {
      this.filteredData = this.dataUrl.filter((chapter: any) => 
        chapter.id.toString() === filterValue
      );
    } else if (this.selectedFilter === 'chapterName') {
      this.filteredData = this.dataUrl.filter((chapter: any) => 
        chapter.chapterName.toLowerCase().includes(filterValue)
      );
    }
  }
  
  
  
  
  

}

