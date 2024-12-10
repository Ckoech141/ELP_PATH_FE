import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminViewNewsComponent } from '../admin-view-news/admin-view-news.component';

@Component({
  selector: 'app-news-read-more',

  templateUrl: './news-read-more.component.html',
  styleUrl: './news-read-more.component.scss'
})
export class NewsReadMoreComponent implements OnInit {

  @Output() onDatePicked = new EventEmitter<any>();
  id:any = null
  news:any
  newsUpdates:any[] = []

  constructor(private route:ActivatedRoute,
    private service : ServiceService,
    private dialog : MatDialog

    ){}

  ngOnInit(): void {
      this.getNewsUpdate()
    
  }
  getNewsUpdate() {
    this.route.queryParams.subscribe(params => {
      // Ensure 'item' param exists to avoid potential errors
      if (params['item']) {
        this.id = params['item'];
      } else {
        console.error('Missing "item" parameter in query string');
        // Handle missing parameter appropriately (e.g., redirect to error page)
        return;
      }
    });
  
    this.service.getNewsData().subscribe(
      (res) => {
        this.newsUpdates = res.payload;
  
        // Guard against invalid `this.id` (optional chaining not needed now)
        if (this.id) {
          let data = this.newsUpdates.find(item => item.id == this.id);
  
          // Handle potential absence of matching data:
          if (!data) {
            console.warn(`News update with ID ${this.id} not found`);
            // Choose a suitable recovery mechanism (e.g., display a message)
          } else {
            this.news = data;
            console.log('news update', data);
          }
        } else {
          console.error('Invalid or missing "id" value');
          // Handle invalid ID appropriately (e.g., display an error message)
        }
      },
      (error) => {
        // Handle errors from the `service.getNewsData()` call
        console.error('Error fetching news data:', error);
        // Choose appropriate actions based on the error (e.g., display an error message)
      }
    );
  }
  

}



