$(function () {

    /* data stolen from http://howmanyleft.co.uk/vehicle/jaguar_'e'_type */
    var day_data = [
        {"period": "2012-10-01", "licensed": 807, "sorned": 660},
        {"period": "2012-09-30", "licensed": 1251, "sorned": 729},
        {"period": "2012-09-29", "licensed": 1769, "sorned": 1018},
        {"period": "2012-09-20", "licensed": 2246, "sorned": 1461},
        {"period": "2012-09-19", "licensed": 2657, "sorned": 1967},
        {"period": "2012-09-18", "licensed": 3148, "sorned": 2627},
        {"period": "2012-09-17", "licensed": 3471, "sorned": 3740},
        {"period": "2012-09-16", "licensed": 2871, "sorned": 2216},
        {"period": "2012-09-15", "licensed": 2401, "sorned": 1656},
        {"period": "2012-09-10", "licensed": 2115, "sorned": 1022}
    ];
    Morris.Bar({
        element: 'graph_bar_group',
        data: day_data,
        xkey: 'period',
        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        ykeys: ['licensed', 'sorned'],
        labels: ['Licensed', 'SORN'],
        hideHover: 'auto',
        xLabelAngle: 60
    });

    Morris.Bar({
        element: 'graph_bar',
        data: [
            {device: 'iPhone', geekbench: 136},
            {device: 'iPhone 3G', geekbench: 137},
            {device: 'iPhone 3GS', geekbench: 275},
            {device: 'iPhone 4', geekbench: 380},
            {device: 'iPhone 4S', geekbench: 655},
            {device: 'iPhone 3GS', geekbench: 275},
            {device: 'iPhone 4', geekbench: 380},
            {device: 'iPhone 4S', geekbench: 655},
            {device: 'iPhone 5', geekbench: 1571}
        ],
        xkey: 'device',
        ykeys: ['geekbench'],
        labels: ['Geekbench'],
        barRatio: 0.4,
        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        xLabelAngle: 35,
        hideHover: 'auto'
    });

    Morris.Bar({
        element: 'graphx',
        data: [
            {x: '2011 Q1', y: 2, z: 3, a: 4},
            {x: '2011 Q2', y: 3, z: 5, a: 6},
            {x: '2011 Q3', y: 4, z: 3, a: 2},
            {x: '2011 Q4', y: 2, z: 4, a: 5}
        ],
        xkey: 'x',
        ykeys: ['y', 'z', 'a'],
        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        hideHover: 'auto',
        labels: ['Y', 'Z', 'A']
    }).on('click', function (i, row) {
        console.log(i, row);
    });

    Morris.Area({
        element: 'graph_area',
        data: [
            {period: '2010 Q1', iphone: 2666, ipad: null, itouch: 2647},
            {period: '2010 Q2', iphone: 2778, ipad: 2294, itouch: 2441},
            {period: '2010 Q3', iphone: 4912, ipad: 1969, itouch: 2501},
            {period: '2010 Q4', iphone: 3767, ipad: 3597, itouch: 5689},
            {period: '2011 Q1', iphone: 6810, ipad: 1914, itouch: 2293},
            {period: '2011 Q2', iphone: 5670, ipad: 4293, itouch: 1881},
            {period: '2011 Q3', iphone: 4820, ipad: 3795, itouch: 1588},
            {period: '2011 Q4', iphone: 15073, ipad: 5967, itouch: 5175},
            {period: '2012 Q1', iphone: 10687, ipad: 4460, itouch: 2028},
            {period: '2012 Q2', iphone: 8432, ipad: 5713, itouch: 1791}
        ],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto'
    });


    Morris.Donut({
        element: 'graph_donut',
        data: [
            {label: 'Jam', value: 25},
            {label: 'Frosted', value: 40},
            {label: 'Custard', value: 25},
            {label: 'Sugar', value: 10}
        ],
        colors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        formatter: function (y) {
            return y + "%"
        }
    });

    new Morris.Line({
        element: 'graph_line',
        xkey: 'year',
        ykeys: ['value'],
        labels: ['Value'],
        hideHover: 'auto',
        lineColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        data: [
            {year: '2008', value: 20},
            {year: '2009', value: 10},
            {year: '2010', value: 5},
            {year: '2011', value: 5},
            {year: '2012', value: 20}
        ]
    });

});