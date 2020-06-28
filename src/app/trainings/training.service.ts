import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Training, TrainingInfo, Rankers, TrainedData } from './training.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
const virtualizationUrl = 'http://controller-service-virtualization.apps.openshift.ne-innovation.com/virtualization-train';
const operationsUrl = 'http://datasaver-virtualization.apps.openshift.ne-innovation.com/api/Data/operations';
const rankerUrl = 'http://datasaver-virtualization.apps.openshift.ne-innovation.com/api/Data/ranker';
@Injectable({ providedIn: 'root' })
export class TrainingService {
  private trainingsUpdated = new Subject<{
    trainings: Training[];
    postCount: number;
  }>();

  private rankers: Rankers;
  private rankersUpdated = new Subject<{
    rankers: Rankers;
  }>();

  private trainedData: TrainedData[];
  private trainedServicesUpdated = new Subject<{
    trainedData: TrainedData[];
  }>();
  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router) {}

  addNewTraining(trainingInfo: TrainingInfo) {
    const requestData = JSON.stringify(trainingInfo);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.post<{ result: string; }>(virtualizationUrl, requestData, httpOptions)
    .subscribe(
      (responseData) => {
        this.dialog.open(MessageDialogComponent, { data: { message: responseData.result } });
        this.router.navigate(['/']);
      },
      (error) => {
        this.dialog.open(MessageDialogComponent, { data: { message: error } });
      }
    );
  }

  getPriorityTrainings(servicePath: string) {
    this.http.get<{ operation: any; data: any; }>(rankerUrl + '?operation=' + servicePath)
    .pipe(
      map((rankersData) => {
        return {
          rankers: {
            operation: rankersData.operation,
            data: rankersData.data
          }
        };
      })
    )
    .subscribe((tansformedRankers) => {
      this.rankers = tansformedRankers.rankers;
      this.rankersUpdated.next({
        rankers: this.rankers
      });
    });
  }

  updateRakerTraining(rankersData: Rankers) {
    const requestData = JSON.stringify(rankersData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.post<{ result: string; }>(rankerUrl, requestData, httpOptions)
    .subscribe(
      (responseData) => {
        this.dialog.open(MessageDialogComponent, { data: { message: responseData.result } });
        this.router.navigate(['/']);
      },
      (error) => {
        this.dialog.open(MessageDialogComponent, { data: { message: error } });
      }
    );
  }


  getTrainedServices() {
    this.http.get<{ }>(operationsUrl)
    .pipe(
      map((trainedServices) => {
        const resultServices = Object.keys(trainedServices).map((ind) => {
          return {
            ServiceName: trainedServices[ind],
            Priotize: '',
            Update: '',
            Delete: ''
          };
        });
        return {
          trainedData: resultServices
        };
      })
    )
    .subscribe((tansformedNames) => {
     this.trainedData = tansformedNames.trainedData;
     this.trainedServicesUpdated.next({
      trainedData: this.trainedData
      });
    });
  }

  getTrainingUpdateListener() {
    return this.trainingsUpdated.asObservable();
  }

  getRankerTrainingUpdateListener() {
    return this.rankersUpdated.asObservable();
  }

  getTrainedServicesUpdateListener() {
    return this.trainedServicesUpdated.asObservable();
  }


}
