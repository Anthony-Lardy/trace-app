import {
  Component,
  OnInit,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import {option1, option2, option3, option4, option5, option6} from './courses.service';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');
let Exporting = require('highcharts/modules/exporting');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Exporting(Highcharts);

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
})

export class CoursesComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public Highcharts = Highcharts;
  public courseId: string;

  option1 = option1;
  option2 = option2;
  option3 = option3;
  option4 = option4;
  option5 = option5;
  option6 = option6;


  constructor(public route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.option1 = {
        ...this.option1,
        title: {
          text: `Courses ${id}`
        }
      }
    });
  }

}
