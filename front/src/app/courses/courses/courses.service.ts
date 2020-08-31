import * as Highcharts from 'highcharts';

export const option1 = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Nombre d\'activités faites les 6 derniers mois'
  },
  xAxis: {
    categories: ['Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Nombre d\'activités'
    },
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [{
    name: 'Forum',
    data: [35, 50, 60, 34, 58, 40]
  }, {
    name: 'Wiki',
    data: [40, 43, 33, 49, 57, 47]
  }, {
    name: 'Quiz',
    data: [58, 57, 31, 37, 43, 33]
  }, {
    name: 'Glossaire',
    data: [53, 36, 42, 50, 37, 31]
  }, {
    name: 'Ressource extérieur',
    data: [36, 38, 30, 33, 54, 50]
  }]
};

export const option2 = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Nombre d\'activités faites le dernier mois'
  },
  xAxis: {
    categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4']
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Nombre d\'activités'
    },
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || 'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [{
    name: 'Forum',
    data: [35, 50, 60, 34]
  }, {
    name: 'Wiki',
    data: [40, 43, 33, 49]
  }, {
    name: 'Quiz',
    data: [58, 57, 31, 37]
  }, {
    name: 'Glossaire',
    data: [53, 36, 42, 50]
  }, {
    name: 'Ressource extérieur',
    data: [36, 38, 30, 33]
  }]
};

export const option3 = {

  chart: {
    polar: true,
  },

  title: {
    text: 'Taux de participation par type  d\'activité',
  },

  xAxis: {
    categories: ['Forum', 'Wiki', 'Quiz', 'Glossaire', 'Ressource extérieur', 'Devoir'],
    tickmarkPlacement: 'on',
  },

  yAxis: {
    name: 'Pourcentage',
    gridLineInterpolation: 'polygon',
  },

  legend: {
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical'
  },

  series: [{
    name: 'taux de participation',
    data: [50, 89, 87, 80, 81, 75],
    pointPlacement: 'on'
  }],
};

export const option4 = {

  chart: {
    polar: true,
  },

  title: {
    text: 'Taux de participation aux tests',
  },

  xAxis: {
    categories: ['Les adverbes', 'Passé composé', 'Les participes employés avec "avoir"', 'Accord, avec ou sans auxiliaire', '-é(es) ou -er', 'Futur ou conditionnel ?'],
    tickmarkPlacement: 'on',
  },

  yAxis: {
    name: 'Pourcentage',
    gridLineInterpolation: 'polygon',
  },

  legend: {
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical'
  },

  series: [{
    name: 'taux de participation',
    data: [58, 72, 54, 52, 80],
    pointPlacement: 'on'
  }],
};

export const option5 = {

  title: {
    text: 'Moyenne au test "Les adverbes"'
  },

  xAxis: {
    categories: [1, 2, 3, 4, 5]
  },

  yAxis: {
    title: {
      text: null
    }
  },

  tooltip: {
    crosshairs: true,
    shared: true,
    valueSuffix: '°C'
  },

  series: [{
    name: 'Moyenne',
    data: [12.3, 15.7, 16.4, 13.7, 16.1],
    zIndex: 1,
    marker: {
      fillColor: 'white',
      lineWidth: 2,
      lineColor: Highcharts.getOptions().colors[0]
    }
  }, {
    name: 'Range',
    data: [
      [8, 18],
      [9.3, 18.5],
      [10.6, 18.3],
      [10.6, 16.8],
      [11.3, 17.4], ],
    type: 'arearange',
    lineWidth: 0,
    linkedTo: ':previous',
    color: Highcharts.getOptions().colors[0],
    fillOpacity: 0.3,
    zIndex: 0,
    marker: {
      enabled: false
    }
  }]
};

export const option6 = {

  chart: {
    polar: true,
    type: 'line'
  },

  title: {
    text: 'Evalutation des tests',
  },

  xAxis: {
    categories: ['Les adverbes', 'Passé composé', 'Les participes employés avec "avoir"', 'Accord, avec ou sans auxiliaire', '-é(es) ou -er', 'Futur ou conditionnel ?'],
    tickmarkPlacement: 'on',
    lineWidth: 0
  },

  yAxis: {
    gridLineInterpolation: 'polygon',
    max: 20
  },


  legend: {
    align: 'right',
    verticalAlign: 'middle',
    layout: 'vertical'
  },

  series: [{
    name: 'Moyenne',
    data: [15.5, 13.5, 12.5, 18, 12.5, 16.5],
    pointPlacement: 'on'
  }, {
    name: 'Minimum',
    data: [6.5, 3.5, 8, 9, 5, 9],
    pointPlacement: 'on'
  }, {
    name: 'Maximum',
    data: [18, 20, 18, 20, 16, 19],
    pointPlacement: 'on'
  }],

  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal'
        },
        pane: {
          size: '70%'
        }
      }
    }]
  }
};
