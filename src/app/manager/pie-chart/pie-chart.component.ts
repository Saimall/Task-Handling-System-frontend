import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
})
export class PieChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data: any;
  @Input() options: any;
  chart: any;

  ngOnInit(): void {
    this.createChart(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['options']) {
      if (this.chart) {
        this.chart.destroy(); 
      }
      this.createChart(); 
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  createChart() {
    if (this.data && this.options) {
      this.chart = new Chart('pieCanvas', {
        type: 'doughnut',
        data: this.data,
        options: this.options
      });
    }
  }
}
