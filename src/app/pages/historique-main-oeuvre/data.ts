export interface ChartType {
    chart?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    stroke?: any;
    labels?: any;
    legend?: any;
    type?: any;
    height?: any;
    dataLabels?: any;
    xaxis?: any;
}


const earningLineChart: ChartType = {
    series: [{
      name: 'Coût Main d’œuvre'
    }],
    chart: {
      height: 288,
      type: 'line',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 8,
        opacity: 0.2
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#556ee6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: [] 
    }
  };
export { earningLineChart };
