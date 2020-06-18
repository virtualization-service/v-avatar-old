import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Training, ServiceOperationNames } from '../training.model';
import { TrainingService } from '../training.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-training',
  templateUrl: './view-training.component.html',
  styleUrls: ['./view-training.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewTrainingComponent implements OnInit, OnDestroy {
  router: any;
  columnsToDisplay = ['serviceName', 'authType', 'actionType', 'methodType'];
  dataSource: MatTableDataSource<ServiceOperationNames>;
  expandedElement: Training | null;
  constructor(
    public trainingsService: TrainingService,
    private authService: AuthService
  ) {  }
  private mode = 'new-training';
  private trainingId: string;
  isLoading = true;
  trainingsSub: any;
  @Input() serviceNames: ServiceOperationNames [];
  records = 10;
  trainingsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;
    this.trainingsService.getTrainedServices();
    this.userId = this.authService.getUserId();
    this.trainingsSub = this.trainingsService
      .getTrainedServicesUpdateListener()
      .subscribe((postData) => {
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
        this.serviceNames = postData.serviceOperationNames;
        this.dataSource = new MatTableDataSource(postData.serviceOperationNames);
        this.records = postData.serviceOperationNames.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(trainingId: string) {
    this.isLoading = true;
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.trainingsPerPage = pageData.pageSize;
    this.trainingsService.getTrainedServices();
    console.log(pageData);
  }

  ngOnDestroy() {
    this.trainingsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
