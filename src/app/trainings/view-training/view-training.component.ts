import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TrainedData } from '../training.model';
import { TrainingService } from '../training.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css']
})
export class ViewTrainingComponent implements OnInit, OnDestroy {
  router: any;
  columnsToDisplay = ['ServiceName', 'Priotize', 'Update', 'Delete'];
  dataSource: MatTableDataSource<TrainedData>;
  constructor(
    public trainingsService: TrainingService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}
  isLoading = true;
  trainingsSub: any;
  @Input() trainedData: TrainedData[];
  records = 10;
  trainingsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20, 50];
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.isLoading = true;
    this.trainingsService.getTrainedServices();
    this.userId = this.authService.getUserId();
    this.trainingsSub = this.trainingsService
      .getTrainedServicesUpdateListener()
      .subscribe((data) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
        this.dataSource = new MatTableDataSource(data.trainedData);
        this.records = data.trainedData.length;
        this.dataSource.paginator = this.paginator;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(serviceId: string) {
    this.isLoading = true;
    this.trainingsService.deleteTraining(serviceId);
  }

  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.trainingsPerPage = event.pageSize;
    this.trainingsService.getTrainedServices();
    console.log(event);
  }

  ngOnDestroy() {
    this.trainingsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
