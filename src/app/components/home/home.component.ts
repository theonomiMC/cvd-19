import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { EChartsOption } from 'echarts';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public minDate: Date;
  public covid_info: any = [];
  public timeline: any = [];
  public totalConfirmed: number = 0;
  public totalRecovered: number = 0;
  public totalDeaths: number = 0;
  public deaths: number = 0;
  public confirmed: number = 0;
  public recovered: number = 0;
  public currentDate: any = new FormControl(new Date());
  public chartOption: EChartsOption = {
    legend: {
      data: ['Confirmed', 'Recovered', 'Deaths'],
      itemGap: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      showDelay: 0,
      transitionDuration: 0.2,
    },
  };

  constructor(
    private dataService: DataServiceService,
    private datePipe: DatePipe
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 1, 0, 21);
  }

  ngOnInit(): void {
    const colors = ['#5470C6', '#91CC75', '#EE6666'];
    this.dataService.getTimeline().subscribe((data) => {
      this.timeline = data;
      this.deaths = this.timeline['data'][0]['new_deaths'];
      this.confirmed = this.timeline['data'][0]['new_confirmed'];
      this.recovered = this.timeline['data'][0]['new_recovered'];
      this.totalRecovered = this.timeline['data'][0]['recovered'];
      this.totalDeaths = this.timeline['data'][0]['deaths'];
      this.totalConfirmed = this.timeline['data'][0]['confirmed'];
      this.timeline.data = this.timeline.data.reverse();

      //---- chart -----
      this.chartOption = {
        ...this.chartOption,

        xAxis: [
          {
            axisLabel: {
              rotate: 30,
            },

            data: this.timeline['data'].map((el: any) => el.date),
          },
        ],

        yAxis: {
          type: 'value',
          name: 'COVID-19 CASES',

          axisLine: {
            show: true,
            lineStyle: {
              color: '#5470C6',
            },
          },
        },
        series: [
          {
            name: 'Confirmed',
            type: 'line',
            data: this.timeline['data'].map((el: any) => el.new_confirmed),
          },
          {
            name: 'Recovered',
            type: 'line',

            data: this.timeline['data'].map((el: any) => el.new_recovered),
          },
          {
            name: 'Deaths',
            type: 'line',
            color: '#ff0000',
            smooth: true,
            data: this.timeline['data'].map((el: any) => el.new_deaths),
          },
        ],
      };
    });
  }

  //----- get date from calender and search related info in timeline data -----
  getDate(d: any) {
    try {
      let date = this.datePipe.transform(d.value, 'yyyy-MM-dd');

      console.log(date);
      let obj = this.timeline['data']?.find((el: any) => el.date == date);
      this.totalDeaths = obj?.deaths;
      this.totalConfirmed = obj?.confirmed;
      this.totalRecovered = obj?.recovered;
      this.deaths = obj?.['new_deaths'];
      this.confirmed = obj?.['new_confirmed'];
      this.recovered = obj?.['new_recovered'];
    } catch (err) {
      console.log(err);
    }
  }
}
