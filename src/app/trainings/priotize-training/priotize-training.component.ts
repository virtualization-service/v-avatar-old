import { Component, OnInit, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TrainingService } from '../training.service';
import { Rankers } from '../training.model';

@Component({
  selector: 'app-priotize-training',
  templateUrl: './priotize-training.component.html',
  styleUrls: ['./priotize-training.component.css'],
})
export class PriotizeTrainingComponent implements OnInit {
  systemDefined = [];
  userModified = [];
  rankersSub: any;
  @Input() rankers: Rankers;
  constructor(public trainingsService: TrainingService){ }
  ngOnInit(): void {
    this.trainingsService.getPriorityTrainings();
    this.rankersSub = this.trainingsService
      .getRankerTrainingUpdateListener()
      .subscribe((rankersData: { rankers: Rankers; }) => {
        setTimeout(() => {
        }, 2000);
        this.systemDefined = rankersData.rankers.data.map((opt) => {
           return (opt.rank + '   ' + opt.name);
        });
        // TODO: Santosh - Need to modify the logic later
        const tt = this.systemDefined;
        this.userModified = tt;
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
  }
}
