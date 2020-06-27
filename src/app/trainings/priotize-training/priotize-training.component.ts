import { Component, OnInit, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TrainingService } from '../training.service';
import { Rankers, RankerData } from '../training.model';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-priotize-training',
  templateUrl: './priotize-training.component.html',
  styleUrls: ['./priotize-training.component.css'],
})
export class PriotizeTrainingComponent implements OnInit {
  systemDefined: RankerData[];
  userModified: RankerData[];
  priotizedArr: RankerData[];
  operationName: any;
  rankerRequest: Rankers;
  rankersSub: any;
  @Input() rankers: Rankers;
  constructor(
    public trainingsService: TrainingService,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('serviceId')) {
        this.trainingsService.getPriorityTrainings(paramMap.get('serviceId'));
      }
    });
    this.rankersSub = this.trainingsService
      .getRankerTrainingUpdateListener()
      .subscribe((rankersData: { rankers: Rankers }) => {
        setTimeout(() => {}, 2000);
        this.operationName = rankersData.rankers.operation;
        this.systemDefined = rankersData.rankers.data;
        const slowClone = [...this.systemDefined];
        this.userModified = slowClone;
      });
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.priotizedArr = this.userModified;
  }

  updatePriority() {
    this.rankerRequest = {
      data: this.priotizedArr,
      operation: this.operationName
    };
    this.trainingsService.updateRakerTraining(this.rankerRequest);
  }
  resetPriority() {
    const slowClone = [...this.systemDefined];
    this.userModified = slowClone;
  }
}
