$(function () {
    let LABEL = "";
    let LABELS = [];
    let DATA = [];
    let context;
    let chart;

    const chartYear  = $("#chart-year");
    const chartMonth = $("#chart-month");
    const chartDay   = $("#chart-day");

    const date = new Date();
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();

    chartYear.val(Y);
    chartMonth.val(M);
    chartDay.val(D);

    getDay(Y, M, D);
    update();

    $("#debug").on("click", function () {
        if (chart)
            chart.destroy();

        Y = chartYear.val();
        M = chartMonth.val();
        D = chartDay.val();

        getDay(Y, M, D);
        update();
    });

    function update() {
        context = document.getElementById("chart-canvas").getContext("2d");

        chart = new Chart(context, {
            type: 'line',
            data: {
                labels: LABELS,
                datasets: [{
                    label: LABEL,
                    data: DATA,
                    borderColor: "#61b778"
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    function getDay(year, month, day) {
        DATA = [];
        LABEL = `${year}年${month}月${day}日`;

        for (let i = 0; i <= 23; i++) {
            LABELS[i] = `${i}時`;
            getHistory(`${year}-${month}-${day} ${i}:00:00`, `${year}-${month}-${day} ${i}:59:59`).done(function (data) {
                console.log(data);
                DATA.push(data);
            });
        }
    }

    function getHistory(start, end) {
        return $.ajax({
            url: "/get-history",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({start: start, end: end})
        });
    }
});

