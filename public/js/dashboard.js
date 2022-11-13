$(function () {
    let LABEL = "";
    let LABELS = [];
    let DATA = [];
    let context;
    let chart;
    let target = 0;

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

        getUserInfo($("#user-name").text()).done(function (response) {
            target = Number(response.target) ?? 0;
            update();
        });
    });

    function update() {
        context = document.getElementById("chart-canvas").getContext("2d");

        chart = new Chart(context, {
            type: "line",
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
                maintainAspectRatio: true,
                plugins: {
                    annotation: {
                        annotations: {
                            line1: {
                                type: "line",
                                id: "hLine",
                                mode: "horizontal",
                                yMin: target,
                                yMax: target,
                                borderColor: "#e362be"
                            }
                        }
                    }
                }
            }
        });
    }

    function getUserInfo(name) {
        return $.ajax({
            url: "/get-user-info",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({name: name})
        });
    }

    function getDay(year, month, day) {
        DATA = [];
        LABEL = `${year}年${month}月${day}日`;

        for (let i = 0; i <= 23; i++) {
            LABELS[i] = `${i}時`;
            getHistory(`${year}-${month}-${day} ${i}:00:00`, `${year}-${month}-${day} ${i}:59:59`).done(function (data) {
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

