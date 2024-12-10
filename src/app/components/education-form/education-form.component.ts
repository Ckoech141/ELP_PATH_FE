import { Component, ViewChild, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
})
export class EducationFormComponent {

  // @ViewChild('eduform', { static: false }) eduform!: NgForm;
  eduStatus: any[] = [ 'Alumni','CurrentScholar' ]  
 checked= false;
 courselevel: any;
  course!: string;
  userId!: string;
  educationId!: any;
  institutionId: any;
  courseId!: any;
  userData!: any;
  eduForm!: FormGroup;
  isChecked: boolean = true;
  urlGetInstitution!: string;
  urlGetCluster!: string;
  urlGetClusterCourse!: string;
  institutionOptions: any[] = [];
  loadedInstitutions = 20;
  loadMore = true;
  courses!: any[];
  categories!: any[];
  grades: string[] = ['First Class Honors', 'Scond Class Honors Upper D'];
  grade: any;
  clusterOptions!: any[];
  courseOptions!: any[];
  loading: boolean = true;
  ongoing: boolean = false;
  selectedYearOfStudy: any;
  selectedSemester: any;
  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  saving:boolean=false;
  selected:boolean=false;

  //year of study
  years: string[] = ["1", "2", "3", "4", "5"];
  sessions: string[] = ["Semester One", "Semester Two", "Semester Three"];
  items: any[] = [
    {"value":"Yes", "item": true},
    {"value":"No", "item": false}
  ]
categoryOptions: any;
start_date: any;
end_date: any;
status= this.fb.group({
  state:false,
});
countries: any[] = [];




  constructor(
    private fb: FormBuilder,
    private http: HttpServiceService,
    public dialogRef: MatDialogRef<EducationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationsService
  ) {
    // Create a reactive form using FormBuilder
    this.eduForm = new FormGroup({
      institution: new FormControl(['', Validators.required]),
      course: new FormControl('', Validators.required),
      clusters:new FormControl(''),
      courseLevel: new FormControl(''),
      startYear : new FormControl(''),
      educationType: new FormControl(''),
      grade: new FormControl(''),
      country: new FormControl(''),
      graduationYear: new FormControl(''),
      expectedGraduationYear:new FormControl('')
    })
  }

  url!: string;
  ngOnInit() {
    //let country = "uganda"
    //this.getInstitution(country);
    this.getCluster();
    this.getCountries()
    
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData)
      this.userId = this.userData.id;
      // Use the parsed data in your application
    }
    const action = this.data.action
    console.log("action =" , action);
    if (this.data.action == "edit") {
      const data = this.data.edu
      this.eduForm.patchValue({
       courseLevel : data.courseLevel,
       graduationYear : data.graduationYear,
        grade : data.grade,
        startYear : data?.startYear,
        clusters : data?.course?.courseCluster?.id,
       course : data?.course?.id,
        educationType : data?.educationType,
        institution : data?.institution?.id
      })
    
        console.log("asd", data);

     
      
    }
    
  }

  filterCountries(event:Event){
    console.log("our event", event)
    const countDiv = document.getElementById('count')
    countDiv?.style.display == 'block'
    const filteredValue = (event.target as HTMLInputElement).value
    console.log("filtered value", filteredValue)


  }

  getCountries(){
    const url = `${this.http.serverUrl}countries/dial-codes`
    const response = this.http.getData(url)

    response.subscribe(
      (res: any) => {

        this.countries = res.payload
        console.log("countries", this.countries)
      }, 
      (error: any) => {
        console.log("error countries", error)
      }
    )
  }

  // Fetch Institution data from the server
  getInstitution(country: any) {
    this.urlGetInstitution = this.http.serverUrl + 'education/get-universities/' + country; // URL to fetch insitiutuion data
    this.http.getData(this.urlGetInstitution).subscribe({
      next: (response: any) => {
        console.log("response null", response);
        this.institutionOptions = []
        if(response != null){
          this.institutionOptions = response.payload
        }
        console.log("HELLOooooooo", this.institutionOptions);
        const items: any[] = []
        response.payload.forEach((e: { name: any; }) =>{
          items.push(e.name)
        })
        this.options = items
      //  console.log('hub info', this.options);
        // Set Institution options array
      },
      error: (error) => {
        console.log('Error:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  onCourseSelectionChange(id:number): void {
    //selectedClusterId = this.courses.find(cluster => cluster.id === this.eduForm.value.clusters);
    this.courseId = id
   
  }

  onGradeSelectionChange(event: any): void {
    const selectedGrade = this.eduForm.get('grade')?.value;
     this.grade = selectedGrade;
  }

  onInstitutionSelectionChange(event: any): void {
    this.institutionId = this.eduForm.value.institution
  }

  onYearOfStudyChange(event: any): void {
    const yrOfStudy = this.eduForm.get('yearOfStudy')?.value;
    this.selectedYearOfStudy = yrOfStudy;
  }

  onSemesterSelectionChange(event: any): void {
    const selectedSem = this.eduForm.get('semester')?.value;
    this.selectedSemester = selectedSem;
  }

  onStillLearningChange(event: any): void {
    this.ongoing = this.eduForm.get('stillLearning')?.value
  }

  getCluster() {
    // Set the URL to fetch cluster data
    this.urlGetCluster = this.http.serverUrl + 'education/course-clusters/all';

    // Send an HTTP GET request to fetch cluster data
    this.http.getData(this.urlGetCluster).subscribe({
      next: (response) => {

        // When the request is successful, store the cluster data in the 'clusterOptions' variable
        this.clusterOptions = response.payload;
        console.log("grttst", this.clusterOptions);
        
      },
      error: (error) => {
        // Handle and log any errors that occur during the request
        console.log('Error:', error);
      },
      complete: () => { },
    });
  }

  getCourses(id:number) {
    console.log("12345678", id);
   
   console.log(this.eduForm.value.clusters);
   
    // Log the selected cluster ID from a form
    const selectedCluster = this.clusterOptions.find(cluster => cluster.id == id);

    if(selectedCluster) {
      // Get the selected cluster ID from the form and convert it to a string
      const clusterId = selectedCluster.id;
      console.log("selecta", selectedCluster);
      
      // Call the 'getClusterCourse' function to fetch course data for the selected cluster
      this.getClusterCourse(clusterId.toString());
    }
  }

  getClusterCourse(clusterId: string) {
    // Set the URL to fetch course data for the selected cluster
    const urlGetClusterCourses =
      this.http.serverUrl + `education/course-clusters/${clusterId}`;

    // Send an HTTP GET request to fetch course data for the selected cluster
    this.http.getData(urlGetClusterCourses).subscribe({
      next: (response) => {
        // When the request is successful, store the course data in the 'courseOptions' variable
        this.courseOptions = response.payload.courses;

        // Update the 'courses' variable with the course options
        this.courses = this.courseOptions;

      },
      error: (error) => {
        // Handle and log any errors that occur during the request
        console.log('Error:', error);
      },
      complete: () => {},
    });
  }

  submit() {
    this.saving=true;

   const data = {
    "courseLevel": this.eduForm.value.courseLevel,
    "educationType": this.eduForm.value.educationType,
    "startYear": this.eduForm.value.startYear,
    "graduationYear": this.eduForm.value.graduationYear,
    "expectedGraduationYear": this.eduForm.value.expectedGraduationYear,
    "grade": this.eduForm.value.grade
    }

    console.log("end data", data);
    const institutionId = this.eduForm.value.institution
    const courseId = this.eduForm.value.course
    const country = this.eduForm.value.country
    
    if (this.data.action != "edit") {
      this.url = this.http.serverUrl + 'education/' + this.userId +"/"+institutionId+"/"+courseId+'/'+country+'/create';

      this.http.postData(this.url, data).subscribe({
        next: (response) => {
          //Handle the response data here
          localStorage.setItem('token', JSON.stringify(response));
          this.dialogRef.close();
          this.notificationService.alertSuccess(response.message)
        },
        error: (error) => {
          this.notificationService.alertWarning(error.error.message)
          // Handle the error here
          this.saving =false
        },
        complete: () => {
          this.saving=false;
        },
      });
    } else {
      //http://52.15.152.26:5555/education/213/Afghan%20University/1/create
      //http://52.15.152.26:5555/education/213/Afghan
      //http://52.15.152.26:5555/education/130/2/15/12/update
      const url = `${this.http.serverUrl}education/${this.userId}/${this.data?.edu?.id}/${courseId}/${institutionId}/${country}/update`
      this.http.putData(url, data).subscribe(
      ((response) =>{
        localStorage.setItem('token', JSON.stringify(response));
        this.dialogRef.close();
        this.notificationService.alertSuccess(response.message)
         // Handle the error here
         this.saving =false
      }),
      ((e) =>{
        this.notificationService.alertWarning(e.error.message)
      }),
      () => {}
      )
    }
 
  }
  onCountryChange(country: string) {
    this.selected = true; 
    console.log(country); 
    this.getInstitution(country)
 }
}
