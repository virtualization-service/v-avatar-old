import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TrainingInfo, Rankers, TrainedData } from './training.model';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
const newTrainingUrl =
  'http://controller-service-vavtar-services.apps.openshift.ne-innovation.com/virtualization-train';
const exitingTrainingsUrl =
  'http://datasaver-vavtar-services.apps.openshift.ne-innovation.com/api/Data/operations';
const deleteTrainingUrl =
  'http://datasaver-vavtar-services.apps.openshift.ne-innovation.com/api/Data/operation';
const rankTrainingUrl =
  'http://datasaver-vavtar-services.apps.openshift.ne-innovation.com/api/Data/ranker';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private rankers: Rankers;
  private rankersUpdated = new Subject<{
    rankers: Rankers;
  }>();

  private trainedData: TrainedData[];
  private trainedServicesUpdated = new Subject<{
    trainedData: TrainedData[];
  }>();
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) {}

  addNewTraining(trainingInfo: TrainingInfo) {
    const requestData = JSON.stringify(trainingInfo);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post<{ result: string }>(newTrainingUrl, requestData, httpOptions)
      .subscribe(
        (responseData) => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: responseData.result },
          });
          this.router.navigate(['/']);
        },
        (error) => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: error },
          });
        }
      );
  }

  getPriorityTrainings(servicePath: string) {
    this.http
      .get<{ operation: any; data: any }>(
        rankTrainingUrl + '?operation=' + servicePath
      )
      .pipe(
        map((rankersData) => {
          return {
            rankers: {
              operation: rankersData.operation,
              data: rankersData.data,
            },
          };
        })
      )
      .subscribe((tansformedRankers) => {
        this.rankers = tansformedRankers.rankers;
        this.rankersUpdated.next({
          rankers: this.rankers,
        });
      });
  }

  deleteTraining(servicePath: string) {
    this.http
      .delete<{ operation: any; data: any }>(
        deleteTrainingUrl + '?operation=' + servicePath
      )
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          console.log('Error Occured: ' + error);
        }
      );
  }

  updateRakerTraining(rankersData: Rankers) {
    const requestData = JSON.stringify(rankersData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    this.http
      .post<{ result: string }>(rankTrainingUrl, requestData, httpOptions)
      .subscribe(
        (responseData) => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: responseData.result },
          });
          this.router.navigate(['/']);
        },
        (error) => {
          this.dialog.open(MessageDialogComponent, {
            data: { message: error },
          });
        }
      );
  }

  getTrainedServices() {
    this.http
      .get<{}>(exitingTrainingsUrl)
      .pipe(
        map((trainedServices) => {
          const resultServices = Object.keys(trainedServices).map((ind) => {
            return {
              ServiceName: trainedServices[ind],
              Priotize: '',
              Update: '',
              Delete: '',
            };
          });
          return {
            trainedData: resultServices,
          };
        })
      )
      .subscribe((tansformedNames) => {
        this.trainedData = tansformedNames.trainedData;
        this.trainedServicesUpdated.next({
          trainedData: this.trainedData,
        });
      });
  }

  getRankerTrainingUpdateListener() {
    return this.rankersUpdated.asObservable();
  }

  getTrainedServicesUpdateListener() {
    return this.trainedServicesUpdated.asObservable();
  }
}
