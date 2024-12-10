import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { surveyService } from 'src/app/services/survey.service';
import { institution } from 'src/assets/json_files/institutions';
import { region } from 'src/assets/json_files/regions';

@Component({
  selector: 'app-admin-survey-add-form',
  templateUrl: './admin-survey-add-form.component.html',
  styleUrl: './admin-survey-add-form.component.scss'
})
export class AdminSurveyAddFormComponent implements OnInit {
  capturedData: any = {}; 
  submittedData: any[] = []; 

  @Output() submittedDataEvent = new EventEmitter<any[]>();
  @ViewChild('formContainer') formContainer!: ElementRef;
  isSending: boolean = false;
  institutional = institution;
  regional = region;
  recipient: string = '';
  subject: string = '';
  sending: boolean = false;
  title: string = '';
  // surveyform!: FormGroup;
  public faCircleDot = faCircleDot

  surveyForm: FormGroup
  i: FormGroup = new FormGroup({
    text: new FormControl("")
  })





  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private snack:MatSnackBar,
    private SurveyService: surveyService,
    private toastr: ToastrService) {
    this.surveyForm = this.fb.group({
      // subject: new FormControl(''),
      title: [''],
      institutional: [''],
      regional: [''],
      questions: this.fb.array([])

    });
  }
  ngOnInit(): void {

  }

  get questions() {
    return this.surveyForm.get('questions') as FormArray;
  }

  get questionControls() {
    return this.questions.controls
  }



  addQuestion() {
    this.questions.push(this.fb.group({
      question:''
    }));
    console.log(this.surveyForm.value);
    console.log('hi');

  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  sendSurvey() {
    this.isSending = true;
    if (this.surveyForm.valid) {
      const formValue = this.surveyForm.value;
      const title = formValue.title;
      const institution = formValue.institutional;
      const region = formValue.regional;

      this.submittedData.push({...this.capturedData});
          this.capturedData = {};
     
      const questionsList = this.questions.controls.map((control: any) => {
        return control.value;
      });
      console.log(questionsList);

      const data = {
        title: title,
        Institutional: institution,
        Regional: region,
        questionsList: questionsList
      };

      this.SurveyService.sendSurvey(data).subscribe(
        response => {
          console.log('Survey sent successfully!', response);
          this.snack.open('Survey sent successfully!', 'Close', {duration:3600});
          this.isSending = false;
        },
        error => {
          this.snack.open(error.error.message, 'Close', {duration:3600});
          this.isSending = false;
        }
        
      );
    } else {
      this.toastr.error('Please fill out all the required fields.', 'Validation Error');
    }
  }

}


