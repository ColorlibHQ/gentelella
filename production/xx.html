 .xxs{
        position: fixed;  margin: 15px;
        right: 0;
        float: right;
        width: 400px;
        z-index: 4000; 
        bottom: 0
    }
    .dsp_none{
        display: none;
    }


<!-- flot -->
<script type="text/javascript">
    //define chart clolors ( you maybe add more colors if you want or flot will add it automatic )
    var chartColours = ['#96CA59', '#3F97EB', '#72c380', '#6f7a8a', '#f7cb38', '#5a8022', '#2c7282'];

    //generate random number for charts
    randNum = function () {
        return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
    }

    $(function () {
        var d1 = [];
        //var d2 = [];

        //here we generate data for chart
        for (var i = 0; i < 30; i++) {
            d1.push([new Date(Date.today().add(i).days()).getTime(), randNum() + i + i + 10]);
            //    d2.push([new Date(Date.today().add(i).days()).getTime(), randNum()]);
        }

        var chartMinDate = d1[0][0]; //first day
        var chartMaxDate = d1[20][0];//last day

        var tickSize = [1, "day"];
        var tformat = "%d/%m/%y";

        //graph options
        var options = {
            grid: {
                show: true,
                aboveData: true,
                color: "#3f3f3f",
                labelMargin: 10,
                axisMargin: 0,
                borderWidth: 0,
                borderColor: null,
                minBorderMargin: 5,
                clickable: true,
                hoverable: true,
                autoHighlight: true,
                mouseActiveRadius: 100
            },
            series: {
                lines: {
                    show: true,
                    fill: true,
                    lineWidth: 2,
                    steps: false
                },
                points: {
                    show: true,
                    radius: 4.5,
                    symbol: "circle",
                    lineWidth: 3.0
                }
            },
            legend: {
                position: "ne",
                margin: [0, -25],
                noColumns: 0,
                labelBoxBorderColor: null,
                labelFormatter: function (label, series) {
                    // just add some space to labes
                    return label + '&nbsp;&nbsp;';
                },
                width: 40,
                height: 1
            },
            colors: chartColours,
            shadowSize: 0,
            tooltip: true, //activate tooltip
            tooltipOpts: {
                content: "%s: %y.0",
                xDateFormat: "%d/%m",
                shifts: {
                    x: -30,
                    y: -50
                },
                defaultTheme: false
            },
            yaxis: {min: 0},
            xaxis: {
                mode: "time",
                minTickSize: tickSize,
                timeformat: tformat,
                min: chartMinDate,
                max: chartMaxDate
            }
        };
        var plot = $.plot($("#placeholder33x"),
        [{
                label: "Email Sent",
                data: d1,
                lines: {fillColor: "rgba(150, 202, 89, 0.12)"}, //#96CA59 rgba(150, 202, 89, 0.42)
                points: {fillColor: "#fff"}
            }], options);
    });
</script>
<!-- /flot -->