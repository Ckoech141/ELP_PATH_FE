import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ServiceService } from 'src/app/services/service.service';



@Component({
  selector: 'app-more-videos',
  templateUrl: './more-videos.component.html',
  styleUrls: ['./more-videos.component.scss']
})
export class MoreVideosComponent implements OnInit {

  spotlight: any[] | undefined;

  constructor(private service: ServiceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getSpotlight();
  }

  getSpotlight() {
    this.service.getSpotlight().subscribe((res: any) => {
      console.log(res);
      this.spotlight = res.payload.map((p: any) => {
        if (p.videoUrl) {
          return {
            ...p,
            videoUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.getYoutubeVideoId(p.videoUrl)}?autoplay=0`)
          };
        } else {
          return {
            ...p
          };
        }
      });
    });
  }

  getYoutubeVideoId(URL: string): string {
    const id = new URLSearchParams(URL.split('?')[1]);
    return id.get('v') || '';
  }

}
