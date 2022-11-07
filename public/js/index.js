$(function () {
    let name = undefined;
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const key = cookies[i].split("=")[0];
        const value = cookies[i].split("=")[1];

        if (key === "name")
            name = value;
    }

    updateLastUpdate();
    reloadMoney();

    $("#reload-money").on("click", function () {
        updateLastUpdate();
        reloadMoney();
    });

    function updateLastUpdate() {
        const date = new Date().toLocaleString();
        const text = `Last Update: ${date}`;
        $("#last-update").text(text);
    }

    function reloadMoney() {
        if (name !== undefined) {
            const array = {name: name};

            $.ajax({
                url: "/get-user-info",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(array)
            }).done(function (data) {
                const json = JSON.parse(JSON.stringify(data));
                const money = Number(json.money);
                const target = Number(json.target);

                $("#money").text(`¥ ${money.toLocaleString()}`);
                $("#target").text(`¥ ${target.toLocaleString()}`);

                const remainingObj = $("#remaining");
                let sign;

                if (money > target) {
                    sign = "+";
                    remainingObj.css("color", "#58ad45");
                } else if (money < target) {
                    sign = "-";
                    remainingObj.css("color", "#bd3131");
                } else {
                    sign = "±";
                    remainingObj.css("color", "#303030");
                }

                const abs = Math.abs(money - target);
                remainingObj.text(`(${sign} ¥ ${abs.toLocaleString()})`);
            });
        } else {
            $("#money").text("¥ ---");
            $(".amazon-btn").addClass("disabled");
            $(".setting-btn").addClass("disabled");
        }
    }
});