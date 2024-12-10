import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Scholars } from '../interfaces/scholars';

// import { unis } from 'src/assets/json_files/schools';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  getAllAdmins: any;
  put: any;
  getHubEvents: any;
  joinHub: any;
  gethubfeeds: any;
  

  
  constructor(private http: HttpClient) {}
  // serverUrl: string = 'http://localhost:8080/';
  // serverUrl: string = 'http://192.168.0.48:8080/';

  // serverUrl: string = 'http://192.168.43.106:8080/';
    //serverUrl: string = 'http://192.168.2.9:8080/';
    //serverUrl: string = 'http://192.168.89.11:8080/';
  //  serverUrl: string = 'http://192.168.0.39:8080/';
    serverUrl: string = 'http://192.168.89.205:8080/';
  // serverUrl: string = 'http://192.168.0.77:8080/';
    // serverUrl: string = 'http://52.15.152.26:5555/';
  //  serverUrl: string = 'http://3.145.143.209:5555/'
  
     
  // serverUrl2: string = 'http://192.168.0.64:8080/';
  // serverUrl: string = 'http://192.168.0.69:8080/';
  // serverUrl: string = 'http://192.168.0.81:8080/';
  Url: string ='http://192.168.89.205:8080/profile/get-user-data';
  // Url: string ='http://localhost:8080/profile/get-user-data';
  dataUrl: string = '/assets/json_files/regions.json';
  instUrl: string = '/assets/json_files/institutions.json';

  // serverUrl: string = 'http://192.168.0.87:8080/';

  // serverUrl: string = 'http://192.168.100.232:8080/';
  getData(url: string): Observable<any> {
    const res = this.http
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap(
          () => {},
          (error) => console.error('Error', error)
        )
      );

    console.log(res);
    return res;
  }
  fetchUserDataById(id: number): Observable<any> {
    const url = `http://192.168.92.106:8080/scholars/display-scholars/${id}`;
    console.log(url)
    return this.http.get(url).pipe(
      catchError(this.handleError) // Handle errors
    );
  }
  private handleError(error: any) {
    console.error('An error occurred:', error.error.message);
    return throwError(() => new Error(error.error.message));
  }

  getDataF(url: string, filters: any): Observable<any> {
    let params = new HttpParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== '' && filters[key] !== null) {
        params = params.append(key, filters[key]);
      }
    });

    return this.http.get(url, {params}
    ); 
  }
  // REPORTS
  // http://52.15.152.26:5555/reports/scholar-report?year=2017&gender=All&branch=All&scholarType=All&ignoreCondition=true
  getScholarsreport(url:string): Observable<Blob>{
    return this.http.get(url, { responseType: 'blob' })
  }

  // Users Report
  // http://52.15.152.26:5555/reports/generate-users-Report
  getUsersreport(url: string): Observable<Blob>{
    return this.http.get(url, {responseType: 'blob'})
  }

  // Hubs Report
  // http://52.15.152.26:5555/reports/generate-report-on-hubs
  getHubsReport(url: string): Observable<Blob>{
    return this.http.get(url, {responseType: 'blob'})
  }

  // Job Opportunities Report
  // http://52.15.152.26:5555/reports/generate-job-opportunity-report?startDate=10%2F01%2F2023&endDate=10%2F01%2F2024
  getJobOpportunitiesReport(url: string): Observable<Blob>{
    return this.http.get(url, {responseType:'blob'})
  }
 
// http://52.15.152.26:5555/reports/generate-events-report?startDate=01%2F01%2F2024&endDate=01%2F03%2F2024
  getEventReport(url: string){
    return this.http.get(url, {responseType: 'blob'})
  }

  // http://52.15.152.26:5555/reports/generate-chapter-report
  getChapterReport(url: string){
    return this.http.get(url, {responseType: 'blob'})
  }


  getUsers(userId: number): Observable<any> {
    // Construct the URL with the userId
    const urlWithUserId = `${this.Url}/${userId}`;
    return this.http.get<any[]>(urlWithUserId);
  }
  //http://52.15.152.26:5555/v2/hubs/v2/set-hub-admin/12/1
 setHubAdmin(hubId:number, userId:number):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/v2/set-hub-admin/${hubId}/${userId}`
  return this.http.put<any>(url, '');
 }

  //http://52.15.152.26:5555/v2/hubs/12/display-hub-members
 // get hub members
 getHubMembers(hubId:number):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/${hubId}/display-hub-members`
  return this.http.get<any>(url);
 }

 //Notifications 
//http://52.15.152.26:5555/notifications/get-user-notification/130
getUserNotifications(userId:String):Observable<any>{
  const url = `${this.serverUrl}notifications/get-user-notification/${userId}`;
  return this.http.get<any>(url);
}

  getData1(): Observable<any> {
    return this.http.get<any[]>(this.dataUrl);
  }
  getData2(): Observable<any> {
    return this.http.get<any[]>(this.instUrl);
  }

  // getData1():Observable<any>{
  //    return unis
  // }
  // getImage(url: string): Observable<any> {
  //   return this.http.get(url, { responseType: 'text' });
  // }
  postData(serverUrl: string, data: any): Observable<any> {
    // Make the HTTP POST request
    console.log('URL', serverUrl);
    const headers = new HttpHeaders();
    return this.http.post(serverUrl, data, { headers });
  }
  

  postEvent(url: string, data: any, eventImage: any): Observable<any> {
    const headers = new HttpHeaders();

    return this.http.post(url, data, {})
  }

  postSkill(data: any, userId: number): Observable<any> {
    const postSkillUrl = `${this.serverUrl}skills/create/${userId}`;
    console.log('FormData'+data)
    console.log('Form'+userId)
    
    return this.http.post(postSkillUrl, data).pipe()
  }

  postSocial(data: any, userId: number): Observable<any> {
    const postSocialUrl = `${this.serverUrl}socials/${userId}/add`;
    console.log('FormData', data)
    console.log('user ID', userId)
    
    return this.http.post(postSocialUrl, data);
  }

  editSocials(userId: any, data: any): Observable<any>{
    const editSocialsUrl = `${this.serverUrl}socials/${userId}/update`

    return this.http.put(data, editSocialsUrl)

  }

  deleteCareer(id: any, userId:string): Observable<any> {
    const deleteCareerUrl = `${this.serverUrl}career/${id}/${userId}/delete`;
    
    console.log('id', id)
    return this.http.delete(deleteCareerUrl)
  }

  deleteEvent(eventId: any): Observable<any> {
    const deleteEventUrl = `${this.serverUrl}v2/events/${eventId}/delete`;
    
    console.log('eventId', eventId)
    return this.http.delete(deleteEventUrl)
  }
  //

  deleteSkill(skillId: number, userId:number): Observable<any> {
    const deleteSkillUrl = `${this.serverUrl}skills/delete/${userId}/${skillId}`
    
    console.log('skill Id', skillId)
    return this.http.delete(deleteSkillUrl)
  }

  deleteUser(userId: any): Observable<any> {
    const deleteUserUrl = `${this.serverUrl}/users/${userId}/delete`
    
    console.log('user Id', userId)
    return this.http.delete(deleteUserUrl)
  }

  postScholarDataForVerification(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `http://52.15.152.26:5555/join-request/alumni/verify-details`;
    console.log("service data", data)
    return this.http.post(url, data, { headers });
  }
 // http://52.15.152.26:5555/v2/feeds/1/1/delete
  deleteFeed(userId:any, feedId:any): Observable<any>{
    const deleteFeedUrl = `${this.serverUrl}v2/feeds/${userId}/${feedId}/delete`
    return this.http.delete(deleteFeedUrl);
  }
  //http://3.140.250.115:5555/v2/feeds/12/13/edit
  editFeed(feedId:any,userId:any,data:any):Observable<any>{
    const headers = new HttpHeaders({'content-type':'application/json'})
    const url = `${this.serverUrl}v2/feeds/${userId}/${feedId}/edit`;
    return this.http.put(url,data,{headers});
  }
  //http://3.140.250.115:5555/like/add/{userId}/142?userId=79

  postLikeFeed(userId:any, feedId:any): Observable<any>{
    const headers = new HttpHeaders({'content-type':'application/json'})
    const url = `${this.serverUrl}like/add/${userId}/${feedId}?userId=${userId}`
    return this.http.post(url,{headers});
  }
  //  http://3.140.250.115:5555/like/total/142 
  postLikeCount(feedId:any): Observable<any>{
    const url = `${this.serverUrl}like/all/${feedId}`
    return this.http.get<any>(url)
  }
  //http://3.140.250.115:5555/comments/add/12/147
  postFeedComment(feedId:any, userId:any, comment:any): Observable<any>{
    const url = `${this.serverUrl}comments/add/${userId}/${feedId}`;
    const headers = new HttpHeaders({'content-type':'application/json'});
    return this.http.post<any>(url, comment,{headers});
  }
 // http://3.140.250.115:5555/comments/all/124
 getFeedComments(feedId:any):Observable<any>{
  const url = `${this.serverUrl}comments/all/${feedId}`
  return this.http.get<any>(url);
 }

  postNoData(url: string): Observable<any> {
    // Make the HTTP POST request
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.http.post(url, '', { headers });
  }
  putData(url: string, data: any): Observable<any> {
    // Make the HTTP PUT request
    console.log('content-data', data);
    const headers = new HttpHeaders();
    return this.http.put(url, data, { headers });
  }
  deleteData(url: string): Observable<any> {
    const headers = new Headers();
    return this.http.delete(url);
  }
  
  getPaginatedData(page: number, pageSize: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get(this.serverUrl, { params });
  }

  getSkills(userId: number): Observable<any> {
    const getSkillsUrl = `${this.serverUrl}skills/get/${userId}`;  
    return this.http.get<any>(getSkillsUrl);
  }

  getTvetScholars(year:any): Observable<any> {
    const getTvetScholarsUrl = `${this.serverUrl}/scholars/tvet/scholars-view`;  

    console.log('Tvet Scholars', getTvetScholarsUrl)
    return this.http.get<any>(getTvetScholarsUrl);
  }

  getLocalScholars(year:any): Observable<any> {
    const getLocalScholarsUrl = `${this.serverUrl}/scholars/local/scholars-view`;  

    console.log('Local Scholars', getLocalScholarsUrl)
    return this.http.get<any>(getLocalScholarsUrl);
  }

  getGlobalScholars(year: any): Observable<any> {
    const getGlobalScholarsUrl = `${this.serverUrl}scholars/global/scholars-view`;  

    console.log('Global Scholars', getGlobalScholarsUrl)
    return this.http.get<any>(getGlobalScholarsUrl);
  }

  getAlumni(year: any): Observable<any> {
    const getAlumniUrl = `${this.serverUrl}scholars/alumni/view`;

    console.log('alumni scholars', getAlumniUrl)
    return this.http.get<any>(getAlumniUrl);
  }
  getCurrent(year: any): Observable<any> {
    const getCurrentUrl = `${this.serverUrl}scholars/alumni/view`;

    console.log('current scholars', getCurrentUrl)
    return this.http.get<any>(getCurrentUrl);
  }

  //http://52.15.152.26:5555/scholars/registered/Unregistered/user/view
  //get registered/unregistered scolars
  getReg(year: any): Observable<any> {
 const getRegUrl=`${this.serverUrl}scholars/registered/Unregistered/user/view`;
 console.log('registered uders',getRegUrl);
 
    return this.http.get<any>(getRegUrl);
}

  
  getScholars(year: any): Observable<any> {
    const getScholarsUrl = `${this.serverUrl}scholars/${year}/scholars-view?year=${year}`;
    //http://52.15.152.26:5555/scholars/{year}/scholars-view?year=${year}
    console.log('scholars', getScholarsUrl)
    return this.http.get<any>(getScholarsUrl);
  }

  getScholarDetails(scholarId:any): Observable<any>{
    const scholarDetailsUrl = `${this.serverUrl}scholars/scholar-description/${scholarId}?id=${scholarId}`
    // `http://52.15.152.26:5555/scholars/scholar-description/{userId}?id=79`
    console.log("scholarDetailsUrl", scholarDetailsUrl);

    return this.http.get<any>(scholarDetailsUrl)
  }
//http://52.15.152.26:5555/v2/events/234/display-chapter-events

  getChapterEvents(chapterId:any):Observable<any>{
    let chapterEventsUrl = `${this.serverUrl}v2/events/${chapterId}/display-chapter-events`;
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.http.get<any>(chapterEventsUrl, {headers});
  }
  setChapterLeader(url:string):Observable<any>{
    return this.http.put<any>(url,'')
  }
  //subscribe to chapter event
  //http://52.15.152.26:5555/v2/events/112/participate/12
  eventSubscribe(userId:string, eventId:string):Observable<any>{
    const url = `${this.serverUrl}v2/events/${userId}/participate/${eventId}`
    return this.http.post<any>(url,'');
  }
  //approve events
  //http://52.15.152.26:5555/v2/events/approve-hub-events/12?b=true
  approveEvents(url:string):Observable<any>{
    return this.http.put<any>(url,'')
  }
  generateReport(): Observable<Blob> {
    const generateReportUrl = `${this.serverUrl}scholars/generateReport`;
    
    return this.http.get(generateReportUrl, { responseType: 'blob' });
  }

  
  downloadReport(year: any): Observable<Blob> {
    const downloadReportUrl = `${this.serverUrl}scholars/generateReport/${year}`;
    
    return this.http.get(downloadReportUrl, { responseType: 'blob' });
  }

  //http://3.140.250.115:5555/v2/chapters/all
  getChapters():Observable<any>{
    const url = `${this.serverUrl}v2/chapters/all`
    return this.http.get(url);
  }
 //http://3.140.250.115:5555/v2/chapters/1/1/join
 joinChapter(userId:any, chapterId:any):Observable<any>{
  const url = `${this.serverUrl}v2/chapters/${userId}/${chapterId}/join`
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post<any>(url, {headers})
 }

 leaveChapter(userId:any, chapterId:any):Observable<any>{
  const url = `${this.serverUrl}v2/chapters/${userId}/${chapterId}/join`
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post<any>(url, {headers})
 }


//Get user Chapters
//http://52.15.152.26:5555/v2/chapters/130/chapters

 getUserChapters(userId:any):Observable<any>{
  const url = `${this.serverUrl}v2/chapters/${userId}/chapters`;
  return this.http.get<any>(url);
 }

//hubs
//join===http://52.15.152.26:5555/v2/hubs/123/15/join
joinHubs(userId:any, chapterId:any):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/${userId}/${chapterId}/join`
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post<any>(url, {headers})
 }

 //http://52.15.152.26:5555/v2/hubs/v2/set-hub-admin/12/1
//  setHubAdmin(hubId:number, userId:number):Observable<any>{
//   const url = `${this.serverUrl}v2/hubs/v2/set-hub-admin/${hubId}/${userId}`
//   return this.http.put<any>(url, '');
//  }
 //http://52.15.152.26:5555/v2/hubs/12/display-hub-members
 // get hub members
//  getHubMembers(hubId:number):Observable<any>{
//   const url = `${this.serverUrl}v2/hubs/${hubId}/display-hub-members`
//   return this.http.get<any>(url);
//  }
 //http://52.15.152.26:5555/v2/hubs/12/delete
 //delete hub
 deleteHub(hubId:number):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/${hubId}/delete`
  return this.http.delete<any>(url);
 }

 //GET USER JOUNED HUBS
 //http://52.15.152.26:5555/v2/hubs/120/view
 getUserHubs(userId:any):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/${userId}/view`;
  return this.http.get<any>(url);
 }

//http://52.15.152.26:5555/v2/hubs/123/120/leave
 leavehub(userId:any, hubId:any):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/${userId}/${hubId}/leave`
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post<any>(url, {headers})
 }

 //http://52.15.152.26:5555/v2/events/2/display-hub-events
 gethubEvents(hubId:any):Observable<any>{
  let hubEventsUrl = `${this.serverUrl}v2/events/${hubId}/display-hub-events`;
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.get<any>(hubEventsUrl, {headers});
}
//http://52.15.152.26:5555/v2/hubs/v2/get-membership-for-approval
getHubApprovalRequsts():Observable<any>{
  const url = `${this.serverUrl}v2/hubs/v2/get-membership-for-approval`
  return this.http.get<any>(url);
}

//  make postPrivacy request
//http://52.15.152.26:5555/privacy/add/131

postPrivacy(userId:number, body:any): Observable<any>{
  const url=`${this.serverUrl}privacy/add/${userId}`
  return this.http.post<any>(url,body)
}
//updating privacy settings
updatePrivacy(userId:number, body:any): Observable<any>{
  const url=`${this.serverUrl}privacy/update/${userId}`
  return this.http.put<any>(url,body)
}
//approve or declibe hubjoin requests
//http://52.15.152.26:5555/v2/hubs/v2/approve-joining-hub/12?approve=true
ActOnHubJoinReq(userId:number, state:boolean):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/v2/approve-joining-hub/${userId}?approve=${state}`
  return this.http.put<any>(url, '');
}
//getting privacy settings
getPrivacy(userId:number): Observable<any>{
  const url=`${this.serverUrl}privacy/${userId}/view`
  return this.http.get<any>(url)
}

//get hub by id
//http://52.15.152.26:5555/v2/hubs/get-hub/12
getHubById(hubId:number):Observable<any>{
  const url = `${this.serverUrl}v2/hubs/get-hub/${hubId}`
  return this.http.get(url);
}

 //add technical skill
 //http://52.15.152.26:5555/skills/create/technical-skill/131
 postSkillsLevel( url:string, data:any): Observable<any>{
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post(url,data)
 }
 //
 editSkillsLevel( url:string, data:any): Observable<any>{
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.put(url,data)
 }
 //http://52.15.152.26:5555/skills/get-technical-skills/130
getAllSkills(url:string):Observable<any>{
  return this.http.get<any>(url)
}
//http://52.15.152.26:5555/achievements/add/123
createAchievement(userId:number, data:any):Observable<any>{
  const url = `${this.serverUrl}achievements/add/${userId}`
  return this.http.post<any>(url,data)
}
//get achievements
//http://52.15.152.26:5555/achievements/get/12
getAchievement(userId:number):Observable<any>{
  const url = `${this.serverUrl}achievements/get/${userId}`
  return this.http.get<any>(url)
}
//delete achievement
//http://52.15.152.26:5555/achievements/delete/130/12
deleteAchievement(userId:string, achievementId:string):Observable<any>{
  const url = `${this.serverUrl}achievements/delete/${userId}/${achievementId}`
  return this.http.delete<any>(url)
}
//edit achievement
//http://52.15.152.26:5555/achievements/update/12/1
editAchievement(userId:string, achievementId:string, data:any):Observable<any>{
  const url = `${this.serverUrl}achievements/update/${userId}/${achievementId}`
  return this.http.put<any>(url, data)
}
//education
//delete
//http://52.15.152.26:5555/education/130/3/delete

deleteEducation(userId:number, educationId:Number): Observable<any>{
  const url = `${this.serverUrl}education/${userId}/${educationId}/delete`
  return this.http.delete<any>(url)
}

// post county request
// http://52.15.152.26:5555/profile/131/12/create
postCounty(userId:number, countyId:number,body:any): Observable<any>{
  const url=`${this.serverUrl}profile/create/${userId}/${countyId}`
  return this.http.post<any>(url,body)
}
//update bio 
//http://52.15.152.26:5555/bio/13/12/update
updateBio(userId:string, bioId:string, data:any):Observable<any>{
  const url=`${this.serverUrl}bio/${userId}/${bioId}/update`
  return this.http.put<any>(url, data)
}

//Post newletter
//http://52.15.152.26:5555/NewsLetter/request-newsletter/stevenjoss%40gmail.com



postNewsletter(email:any):Observable<any> {
  const url =`${this.serverUrl}NewsLetter/request-newsletter/${email}`;
  const headers = new HttpHeaders({ 'content-type': 'application/json' });
  return this.http.post<any>(url,'')
  
}


// get Dials
// http://52.15.152.26:5555/countries/dial-codes
getDial(codeId : any):Observable<any>{
  const url = `${this.serverUrl}countries/dial-codes`
  return this.http.get<any>(url)
  
}
}
 