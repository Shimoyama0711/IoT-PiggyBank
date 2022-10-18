$(function () {
    let name = undefined;
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const key = cookies[i].split("=")[0];
        const value = cookies[i].split("=")[1];

        if (key === "name")
            name = value;
    }

    if (name !== undefined) {
        const array = {name: name};

        $.ajax({
            url: "/get-money",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(array)
        }).done(function (data) {
            const json = JSON.parse(JSON.stringify(data));
            const formatted = Number(json.money).toLocaleString();
            $("#money").text(`¥ ${formatted}`);
        });
    } else {
        $("#money").text("¥ ---");
    }
});