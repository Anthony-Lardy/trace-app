import { Component, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'highcharts-chart',
  template: ''
})
export class HighchartsChartComponent implements OnDestroy, OnChanges {
  @Input() Highcharts: typeof Highcharts;
  @Input() options: Highcharts.Options;


  private chart: Highcharts.Chart;

  constructor(
    private el: ElementRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const update = changes.update && changes.update.currentValue;
    if (changes.options || update) {
      this.wrappedUpdateOrCreateChart();
    }
  }

  wrappedUpdateOrCreateChart() { // #75
      this.updateOrCreateChart();
  }

  updateOrCreateChart() {
    if (this.chart && this.chart.update) {
      this.chart.update(this.options, true, false);
    } else {
      this.chart = (this.Highcharts as any).chart(
        this.el.nativeElement,
        this.options,
      );
    }
  }

  ngOnDestroy() { // #44
    if (this.chart) {  // #56
      this.chart.destroy();
      this.chart = null;
    }
  }
}