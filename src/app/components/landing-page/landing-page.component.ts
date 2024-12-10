import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  QueryList,
  AfterViewInit,
  HostListener,
  

} from '@angular/core';
import {
  faMinus,
  faPlus,
  faClock,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons';
import { ServiceService } from 'src/app/services/service.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ContentDialogComponent } from '../content-dialog/content-dialog.component';




type YourItemType = {
  faq: string;
  counts: any;
  isHidden: boolean;
};
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('count', [
      state('initial', style({ opacity: 0, transform: 'translateY(20px)' })),
      state('final', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('initial => final', animate('1s ease-in-out')),
    ]),

    trigger('cardAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('5000ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('5000ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  slides: any[] = new Array(4).fill({id: -1, src: '', title: '', subtitle: ''});
  showNavigationArrows = false;
	showNavigationIndicators = false;
  loading: boolean = false;
  animateCards = true;
  public faPlus = faPlus;
  public faMinus = faMinus;
  public faAnglesLeft = faAnglesLeft;
  public faAnglesRight = faAnglesRight;
  public faClock = faClock;
  public panelOpenState: boolean = false;
  public item_nav_hidden: boolean = false;
  jobList: any[] = [1, 2, 3];
  landingJobs: any[] = []
  public list: any[] = [
    { img: '/assets/images/landing_page/elimuv22.jpg', width: 15 },
    { img: '/assets/images/landing_page/PAN7953-1-1536x1020.jpg', width: 10 },
    {
      img: '/assets/images/landing_page/pexels-katerina-holmes-5905902-removebg-preview (1).png',
      width: 8,
    },
    { img: '/assets/images/landing_page/dr-mwangi-wtf-2020.jpg', width: 3 },
  ];
  cards: any[] = [
    {
      image: '/assets/images/landing_page/wings-to-fly.png',
      scholar: 'High School Scholars',
      counts: "60,009",
      state: 'initial',
    },

    
    {
      image: '/assets/images/landing_page/elp.png',
      scholar: 'University Scholars',
      counts: "23,825",
      state: 'initial',
      color: 'red',
    },

    {
      
      image: '/assets/images/landing_page/download__1_-removebg-preview (1).png',
      scholar: 'TVET Scholars',
      counts: "3,471",
      state: 'initial',
      color: 'red',
    },
    {
      image: '/assets/images/landing_page/internship-3833168-3185247-removebg-preview.png',
      scholar: 'Paid Internships',
      counts: "8,337",
      state: 'initial',
    },
    {
      image:'/assets/images/landing_page/global-education.png',
      scholar: 'Global Scholarships',
      counts: 891,
      state: 'initial',
    },
  ];
  faqs: YourItemType[] = [
    {
      faq: 'How can I discover job opportunities ?',
      counts:
        ' provides a dedicated job board where you can find part-time jobs, internships, and other employment opportunities tailored to students. Browse listings and apply directly through the platform.',
      isHidden: true,
    },
    {
      faq: ' Is the website free to use?',
      counts:
        'The site is designed to help the ELPs got connected to other ELPs all over the world',
      isHidden: true,
    },
    {
      faq: 'How do I report inappropriate content or behavior on the platform?',
      counts:
        'Your safety is important to us. If you encounter any inappropriate content or behavior, you can report it through our platform. Our moderation team will review and take appropriate action.',
      isHidden: true,
    },
    {
      faq: 'How can I reset my password if I forget it?',
      counts:
        'If you forget your password, simply click on the Forgot Password link on the login page. Well guide you through the process of resetting your password',
      isHidden: true,
    },
  ];



  spotlight: any[] = [];
  morevideos: any[] = [];


  jobPostings: any;
  private sectionInView = false;
  imageSrc: string = '';
  itemsPerPage = 4;
  currentPage = 0;
  newsUpate: any[]=[];
  newsUpate1: any[] = []
  newletter: any;
  fileType!: string;
  fileSize!: string;
  newsLetterData: any;
  pdfUrl: string = '';
  

  

  openContentDialog(spot: any) {
    this.dialog.open(ContentDialogComponent, {
      width: '90%',
      data: spot
    });
  }

  constructor(
    configue: NgbCarouselConfig,
    private service: ServiceService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private http: HttpServiceService,
    private route: Router,
    private dialog: MatDialog,
    private sanitizer:DomSanitizer
  ) {
    configue.showNavigationArrows = false;
		configue.showNavigationIndicators = false;
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const sectionElement =
      this.elementRef.nativeElement.querySelector('.cards');
    const sectionOffset = sectionElement.getBoundingClientRect().top;

    // You can adjust this offset threshold as needed
    const offsetThreshold = window.innerHeight - 100;

    if (sectionOffset <= offsetThreshold && !this.sectionInView) {
      this.sectionInView = true;
      this.startCountingAnimation();
    }
  }

  ngOnInit(): void {
    this.getJobPostings();
    this.getGetSpotlight();
    this.adjustItemsPerPage();
    this.getNewsUpdate();
    this.getNewsLetter();
    this.slides[0] = {
      id: 0,
      src: '../../../assets/images/landing_page/Equity Rwanda 2.jpg',
      class: 'carousel-item active',
      title: 'ELP COMMUNITY -Connecting Scholars',
      subtitle: 'WELCOME TO ELP. Elp Community is a social, professional, learning platform for ‘Wings to Fly’ and Elimu Scholarship alumni in Local & Global Universities,  Pre-university Interns, TVET scholarship program and Equity ELP East Africa region (Uganda, Rwanda and DRC)'};
    this.slides[1] = {
      id: 0,
      src: '../../../assets/images/uganda cohot 4.jpg',
      class:'carousel-item',
      title: 'ELP COMMUNITY -Connecting Scholars',
      subtitle:'Equity Leaders Program was established in 1998 as a leadership development initiative for top performing students who have demonstrated youthful talent with a great promise.The program aims to create a community of transformative leaders who work together across borders and sectors to drive sustainable economic growth and social prosperity.'
    }
    this.slides[2] = {
      id: 0,
      src: '../../../assets/images/landing_page/ELP Kenya.jpg',
      class: 'carousel-item active',
      title: 'ELP COMMUNITY -Connecting Scholars',
      subtitle: 'Empowering a continent by creating better livelihoods through scholar interaction globally. Discover ELP, where scholars from shared origins unite, fostering lasting connections as they journey through diverse academic paths, all from the same place.'
    };
    this.slides[3] = {
      id: 0,
      src: '../../../assets/images/landing_page/Equity DRC.jpg',
      class: 'carousel-item active',
      title: 'ELP COMMUNITY -Connecting Scholars',
      subtitle: 'ELP develops leadership and innovation skills by providing scholars with meaningful professional opportunities and networks across the world.'
    };
    
  }


  ngAfterViewInit() {
    this.startCountingAnimation();
  }


  isOpen(item: any) {
    item.isHidden = !item.isHidden;
  }
  getJobPostings() {
    this.service.getJobOpportunities().subscribe((response) => {
      // Handle the response, which should be an array of job postings
      this.jobPostings = response;
      const myJobsArray: any[] = this.jobPostings.payload
      if(myJobsArray.length >= 5){
        this.landingJobs[0] = myJobsArray[myJobsArray.length - 1]
        this.landingJobs[1] = myJobsArray[myJobsArray.length - 2]
        this.landingJobs[2] = myJobsArray[myJobsArray.length - 3]
        this.landingJobs[3] = myJobsArray[myJobsArray.length - 4]
        this.landingJobs[4] = myJobsArray[myJobsArray.length - 5]
      }else if(myJobsArray.length < 5 && myJobsArray.length > 3)
      {
        this.landingJobs[0] = myJobsArray[myJobsArray.length - 1]
        this.landingJobs[1] = myJobsArray[myJobsArray.length - 2]
        this.landingJobs[2] = myJobsArray[myJobsArray.length - 3]
      }else if(myJobsArray.length < 3 && myJobsArray.length > 1){
        this.landingJobs[0] = myJobsArray[myJobsArray.length - 1]
        this.landingJobs[1] = myJobsArray[myJobsArray.length - 2]
      }
      

      console.log("jobs", myJobsArray);
    });
  }

  dateFormat(d: Date) {
    d = new Date(d);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDay();

    return `${year}-${month > 9 ? month : '0' + month}-${
      day > 9 ? day : '0' + day
    }`;
  }

  getGetSpotlight() {
    this.service.getSpotlight().subscribe((res: any) => {
      this.spotlight = res.payload.map((p: any) => {
        if (p.videoUrl) {
          return {
            ...p,
           // `https://www.youtube.com/embed/${this.getYoutubeVideoId(p.videoUrl)}?autoplay=0`
             videoUrl:this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.getYoutubeVideoId(p.videoUrl)}?autoplay=0`)
             
          };
          
        } else {
          return {
            ...p,
            date: this.dateFormat(p.date),
          };
        }
      
      });
      let date = res.payload.date;

      if (res.payload && res.payload.date) {
        for (let i = 0; i <= date.length; i++) {
          console.log('en-US', date[i]);
        }
      }

      if (res.payload && Array.isArray(res.payload.date)) {
        const formattedDates = res.payload.date.map((date: string) => {
          const objectDate = new Date(date);
          return objectDate.toLocaleDateString('en-US');
        });
        console.log('en-US', formattedDates);
      }
    });
  }

  getNewsUpdate(){
    this.service.getNewsData().subscribe(
      (res)=>{
        this.newsUpate=res.payload;
        console.log("WE WE WE", res.payload)
        console.log("------------------------------------------------yes-------------------------")

        //array used in the landing page
        this.newsUpate1[3] = this.newsUpate[this.newsUpate.length - 1]
        this.newsUpate1[2] = this.newsUpate[this.newsUpate.length - 2]
        this.newsUpate1[1] = this.newsUpate[this.newsUpate.length - 3]
        this.newsUpate1[0] = this.newsUpate[this.newsUpate.length - 4]
  
      }
    )
  }

  downloadFile(): void {
    this.loading = true; // Set loading to true when starting the download

    this.service.GetdownloadFile(18).subscribe({
      next: (res: Blob) => {
        this.loading = false; // Set loading to false when the download is complete
        this.pdfUrl = URL.createObjectURL(res);
        const blobUrl = URL.createObjectURL(res);
        console.log("pddfff"+blobUrl)

        window.open(blobUrl, '_blank');
      },
      error: (error) => {
        this.loading = false; // Set loading to false if there's an error during the download
        console.error('Error downloading file:', error);
      },
      complete: () => {}
  });
  }
    getNewsLetter(){
      this.service.getNewsLetter(18).subscribe(
        // (res)=>{
        //   this.newsLetterData=res.payload
        //   console.log('newsletter',this.newsLetterData )

        //   this.spotlight=res.payload.map((p:any) => {
        //     return {
        //       ...p,
        //       date: this.dateFormat(p.date)
        //     }
        //   }     
        //   )
        //   console.log(this.spotlight)
      
        //   let date=res.payload.date
  
        //   if(res.payload && res.payload.date){
        //     for(let i=0; i<=date.length; i++){
        //       console.log('en-US', date[i])
        //     }
        //   }
        
          
        //   if (res.payload && Array.isArray(res.payload.date)) {
        //     const formattedDates = res.payload.date.map((date: string) => {
        //       const objectDate = new Date(date);
        //       return objectDate.toLocaleDateString('en-US');
  
              
        //     }
            
            
        //     )
        //     console.log('en-US',formattedDates)
        //     ;}
    

        // }
      )
    }  

  startCountingAnimation() {
    this.cards.forEach((item, index) => {
      const countElement = document.getElementsByClassName('counts')[index];
      const finalValue = item.counts;
      this.animateCountUp(countElement, finalValue, 1000); // Adjust the duration as needed
    });
  }

  animateCountUp(element: Element, finalValue: number, duration: number) {
    const startTime = Date.now();
    const initialValue = 1;
    const interval = 1000 / 60; // 60 frames per second

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const count = Math.floor(
          initialValue + progress * (finalValue - initialValue)
        );
        this.renderer.setProperty(element, 'textContent', count);
        setTimeout(animate, interval);
      } else {
        this.renderer.setProperty(element, 'textContent', finalValue);
      }
    };

    animate();
  }
  get startIndex(): number {
    return this.currentPage * this.itemsPerPage;
  }

  get endIndex(): number {
    return this.startIndex + this.itemsPerPage;
  }

  // Function to navigate to the previous page
  prevPage() {
    this.currentPage = Math.max(0, this.currentPage - 1);
  }

  // Function to navigate to the next page
  nextPage() {
    const lastPage = Math.ceil(this.spotlight.length / this.itemsPerPage) - 1;
    this.currentPage = Math.min(lastPage, this.currentPage + 1);
    console.log("12345678",this.spotlight);
    
  }
//news
newsPrevPage() {
  this.currentPage = Math.max(0, this.currentPage - 1);
}

// Function to navigate to the next page
newsNextPage() {
  const lastPage = Math.ceil(this.newsUpate.length / this.itemsPerPage) - 1;
  this.currentPage = Math.min(lastPage, this.currentPage + 1);
}
//view adjustment

@HostListener('window:resize', ['$event'])
onResize(event: Event): void {
  this.adjustItemsPerPage();
  
}
adjustItemsPerPage(){
  const screenWidth = window.innerWidth;

  if (screenWidth < 600) {
    this.itemsPerPage = 1;
  } else if (screenWidth < 780) {
    this.itemsPerPage = 2;
  } else if(screenWidth > 780){
    this.itemsPerPage = 4;
  }else{
    this.itemsPerPage = 4;
  }
}

  getYoutubeVideoId(url: string){
    const id = new URLSearchParams(url.split('?')[1]);
    return id.get('v') ||null;
  }

  allNews(){
    this.route.navigate(["/allnews"])
  }
}



import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commafy'
})
export class CommafyPipe implements PipeTransform {

  transform(value: number): any {
    if (!isNaN(value)) {
      // Add logic to format the number with commas
      const parts = value.toString().split('.');
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
      return `${integerPart}${decimalPart}`;
    }
    return value;
  }
}




