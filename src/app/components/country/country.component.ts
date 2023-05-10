import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';
import { EChartsOption } from 'echarts';
import { CovidInfo } from 'src/app/covid-data';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit {
  public countries: any = [];
  // countries api url
  private apiURL = 'https://corona-api.com/countries';
  public response: any = [];
  public details: any = {};
  public loading: Boolean = true;
  public period: boolean = false;
  public tableData: CovidInfo[] = [];
  // chart variables
  public basicOptions: EChartsOption = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    legend: {
      orient: 'vertical',
      align: 'right',
      itemGap: 10,
      top: '0',
      right: '10px',
    },
    tooltip: {
      trigger: 'axis',
      showDelay: 0,
      transitionDuration: 0.2,
    },
  };
  public totalConfirmedOption: EChartsOption;
  public totalRecoverOption: EChartsOption;
  public totalDeathsOption: EChartsOption;
  public totalConfirmedShort: EChartsOption;
  public totalRecoverShort: EChartsOption;
  public totalDeathsShort: EChartsOption;

  public confirmedOption: EChartsOption;
  public recoverOption: EChartsOption;
  public deathsOption: EChartsOption;
  public confirmedShort: EChartsOption;
  public recoverShort: EChartsOption;
  public deathsShort: EChartsOption;

  constructor(
    private dataService: DataServiceService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    // get countries from dataservice and sort
    this.dataService.getGlobalData().subscribe(
      (data) => (this.countries = data),
      (err) => console.log('HTTP Error', err),
      () => {
        console.log('from countries', this.countries);
        this.countries.data.sort((a: any, b: any) =>
          a.name > b.name ? 1 : -1
        );
      }
    );
  }

  async updateValue(o: any) {
    try {
      let country = o.value;
      this.loading = true;
      let obj = this.countries['data'].find((el: any) => el.name == country);

      let { data } = await this.httpClient
        .get<any>(`${this.apiURL}/${obj?.code}`)
        .pipe(delay(1000))
        .toPromise();

      this.response = data;

      let population = this.response.population || 0;
      let updated_at = this.response.timeline.length
        ? this.response.timeline?.[0]['date']
        : this.response['updated_at'].split('T')[0];
      let death_rate =
        this.response['latest_data']['calculated']['death_rate'] ?? 0;
      let recovery_rate =
        this.response['latest_data']['calculated']['recovery_rate'] ?? 0;
      let cases_per_ml =
        this.response['latest_data']['calculated'][
          'cases_per_million_population'
        ] || 0;

      this.details = {
        ...this.details,
        population,
        updated_at,
        death_rate: Math.round(death_rate * 100) / 100,
        recovery_rate: Math.round(recovery_rate * 100) / 100,
        cases_per_ml,
      };

      //------------ TABLE ------------------
      if (this.response.timeline.length) {
        this.response['timeline'] = this.response['timeline'].reverse();

        //------------ CHARTS ------------------
        this.totalConfirmedOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Confirmed',
          },
          series: [
            {
              data: this.response['timeline'].map((el: any) => el.confirmed),
              type: 'line',
            },
          ],
        };

        this.totalRecoverOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Recovered',
          },
          series: [
            {
              data: this.response['timeline'].map((el: any) => el.recovered),
              type: 'line',
              color: 'green',
            },
          ],
        };

        this.totalDeathsOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Deaths',
          },
          series: [
            {
              data: this.response['timeline'].map((el: any) => el.deaths),
              type: 'line',
              color: 'red',
            },
          ],
        };

        // --- Daily Cases Charts ----
        this.confirmedOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Confirmed',
          },
          series: [
            {
              data: this.response['timeline'].map(
                (el: any) => el.new_confirmed
              ),
              type: 'bar',
            },
          ],
        };

        this.recoverOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Recovered',
          },
          series: [
            {
              data: this.response['timeline'].map(
                (el: any) => el.new_recovered
              ),
              type: 'bar',
              color: 'green',
            },
          ],
        };

        this.deathsOption = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline'].map((el: any) => el.date),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Deaths',
          },
          series: [
            {
              data: this.response['timeline'].map((el: any) => el.new_deaths),
              type: 'bar',
              color: 'red',
            },
          ],
        };
        // ---- Chart on short period ----

        this.totalConfirmedShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Confirmed',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.confirmed)
                .slice(-90),
              type: 'line',
            },
          ],
        };

        this.totalRecoverShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Recovered',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.recovered)
                .slice(-90),
              type: 'line',
              color: 'green',
            },
          ],
        };

        this.totalDeathsShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Total Deaths',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.deaths)
                .slice(-90),
              type: 'line',
              color: 'red',
            },
          ],
        };

        this.confirmedShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Confirmed',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.new_confirmed)
                .slice(-90),
              type: 'bar',
            },
          ],
        };

        this.recoverShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Recovered',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.new_recovered)
                .slice(-90),
              type: 'bar',
              color: 'green',
            },
          ],
        };

        this.deathsShort = {
          ...this.basicOptions,
          xAxis: {
            type: 'category',
            data: this.response['timeline']
              .map((el: any) => el.date)
              .slice(-90),
            axisTick: {
              show: true,
            },
            axisLabel: {
              rotate: 30,
            },
          },
          yAxis: {
            type: 'value',
            axisLine: { show: true },
            name: 'Daily Deaths',
          },
          series: [
            {
              data: this.response['timeline']
                .map((el: any) => el.new_deaths)
                .slice(-90),
              type: 'bar',
              color: 'red',
            },
          ],
        };
      }

      this.loading = false;
    } catch (err) {
      console.log(err);
    }
  }

  // --- period change ----
  onChange(val: any) {
    this.period = true ? val.value == 'm' : false;
  }
}
