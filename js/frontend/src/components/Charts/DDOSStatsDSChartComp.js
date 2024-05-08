import React from 'react';
import ReactApexChart from 'react-apexcharts';

class DDOSStatsPacketChartComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {
        chart: {
          type: 'bar',
          height: 750,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '45%',
            endingShape: 'rounded',
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: "Top 3 attacker's packets count sent in the record",
          align: 'center',
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {},
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            },
          },
        },
      },
    };
  }

  componentDidMount() {
    this.generateChartData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attacks !== this.props.attacks) {
      this.generateChartData();
    }
  }

  generateChartData = () => {
    const { attacks } = this.props;
  
    const packetCounts = {};
  
    attacks.forEach(attack => {
      attack.attackers.forEach(attacker => {
        const { attacker_ip, size } = attacker;
        if (packetCounts[attacker_ip]) {
          packetCounts[attacker_ip] += size;
        } else {
          packetCounts[attacker_ip] = size;
        }
      });
    });
  
    const sortedAttackers = Object.keys(packetCounts).sort(
      (a, b) => packetCounts[b] - packetCounts[a]
    );
  
    const topThreeAttackers = sortedAttackers.slice(0, (sortedAttackers.length / (sortedAttackers.length / 20)));
  
    const categories = [];
    const seriesData = [];
  
    topThreeAttackers.forEach(attacker_ip => {
      categories.push(attacker_ip);
      seriesData.push(packetCounts[attacker_ip]);
    });
  
    this.setState({
      series: [
        {
          name: 'Size (BYTES)',
          data: seriesData,
        },
      ],
      options: {
        ...this.state.options,
        xaxis: {
          categories: categories,
        },
      },
    });
  };
  

  render() {
    return (
      <div>
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="heatmap"
          height={this.props.height}
          width={this.props.width}
        />
      </div>
    );
  }
}

export default DDOSStatsPacketChartComp;