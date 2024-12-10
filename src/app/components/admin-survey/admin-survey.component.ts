import { AfterViewInit, Component,OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { surveyService } from 'src/app/services/survey.service';
import { Validator, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { institution } from 'src/assets/json_files/institutions';
import { region } from 'src/assets/json_files/regions';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminSurveyAddFormComponent } from '../admin-survey-add-form/admin-survey-add-form.component';
import { Survey } from 'src/app/models/survey.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-admin-survey',
  templateUrl: './admin-survey.component.html',
  styleUrls: ['./admin-survey.component.scss']
})
export class AdminSurveyComponent implements OnInit, AfterViewInit {

  // dataSource: Survey[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['position', 'name','weight'];

  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadSurveys();
  }
  
  loadSurveys() {
    this.SurveyService.getSurvey().subscribe(
      (response: any) => {
        this.dataSource.data = response.payload; 
        this.dataSource.sort = this.sort; 
        this.dataSource.paginator = this.paginator; 
      },
      (error) => {
        console.error('Error fetching surveys: ', error);
      }
    );
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  recipient: string = '';
  title: string = '';
  sending:boolean = false;
  // surveyform!: FormGroup;
chapter = institution;
  hub = region;
  surveyform:FormGroup = new FormGroup({
    target:new FormControl(""),
    surveyName:new FormControl(""),
    surveySubject:new FormControl(""),
  })
 

  constructor(
    private http:HttpClient,
    private fb: FormBuilder,
    private SurveyService: surveyService,
    public dialog: MatDialog,
    private toastr: ToastrService) { 
      this.surveyform = this.fb.group({
        target: [''],
        surveyName: [''],
        surveySubject: [''],
        hub: [''], 
        chapter: [''], 
        title: ['']
      });
  
      
      // console.log('Initial institutional value:', this.surveyform.get('institutional')?.value);
      // console.log('Initial regional value:', this.surveyform.get('regional')?.value);}
    }
    addSurvey() {

   
      // Open the dialog using the MatDialog service
      const dialogRef: MatDialogRef<AdminSurveyAddFormComponent> = this.dialog.open(AdminSurveyAddFormComponent, {
        width: '70%',
        height:'70%',
        data: { data: 'doe' }
      });
  
      // Handle the dialog result (if needed)
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
    
sendSurvey() {
  this.sending = true
  if (this.surveyform.valid){
  const { hub, chapter, title} = this.surveyform.value;
  const institute = chapter === 'chapter' ? this.surveyform.value.chapter : null;
  const regions = hub =='hub' ? this.surveyform.value.hub : null;
  const data: any = {
    institute,
    regions,
    title
  }

  this.SurveyService.sendSurvey(data)    
    .subscribe(
      
      response => {
        console.log('Survey sent successfully!', response);
        this.toastr.success('Survey sent successfully!', 'Success');
        this.sending = false
      
      },
      error => {
        console.error('Error sending survey:', error);
        this.toastr.error('Error sending survey:', 'Error');
        this.sending = false;
      
      }
    );
}
else{
this.toastr.error('Please fill out all the required fields.', 'Validation Error');
  }
}

getData(){
 
}

}