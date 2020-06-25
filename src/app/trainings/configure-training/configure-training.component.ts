import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-training',
  templateUrl: './configure-training.component.html',
  styleUrls: ['./configure-training.component.css'],
})
export class ConfigureTrainingComponent {
  constructor() {}

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  minValue = 0;
  maxValue = 0;
  vertical = false;
  tickInterval = 1;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }
}
