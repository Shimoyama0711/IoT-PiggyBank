$(function () {
    const imgurUpload = $("#imgur-upload");
    const thumbnail = $("#imgur-thumbnail");
    const send = $("#imgur-send");

    updateDate();
    updateRGB();

    setInterval(updateDate, 100);

    $("#update-rgb").on("click", updateRGB);
    $("#getLocation").on("click", getLocation);
    $("#roll-dice").on("click", rollDice);

    // サムネイル表示
    imgurUpload.on("change", function (data) {
        const file = data.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (function () {
            const result = fileReader.result;
            thumbnail.attr("src", result);
        });

        send.removeClass("disabled");
    });

    // 送信
    send.on("click", uploadImage);
});

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 日時を更新する関数
function updateDate() {
    const date = new Date();

    $("#date").text(date.getFullYear() + "/" + (date.getMonth() + 1).toString().padStart(2, '0') + "/" + date.getDate().toString().padStart(2, '0') + " (" + weekdays[date.getDay()] + ")");
    $("#time").text(date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0'));
}

// RGBを更新する
function updateRGB() {
    $.ajax({
        url: "/rgb",
        type: "GET"
    }).done(function (data) {
        const json = JSON.parse(JSON.stringify(data));
        const red   = Number(json["red"]).toString(16).padStart(2, '0');
        const green = Number(json["green"]).toString(16).padStart(2, '0');
        const blue  = Number(json["blue"]).toString(16).padStart(2, '0');
        const colorCode = "#" + red + green + blue;

        $("#palette").css("background", colorCode);
        $("#palette-string").text(colorCode);
    });
}

// 位置情報を取得
function getLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        $("#latitude").val(latitude);
        $("#longitude").val(longitude);
    });
}

// サイコロを振る
function rollDice() {
    const r = rand(6) + 1;
    $("#dice").attr("class", `bi-dice-${r}-fill`);
}

// 乱数
function rand(max) {
    return Math.floor(Math.random() * max);
}

// imgur にアップロードする
function uploadImage() {
    const url = $("#imgur-thumbnail").attr("src");
    const base64 = url.replace(new RegExp('data.*base64,'), '');
    console.log(base64);

    $.ajax({
        url: "https://api.imgur.com/3/image",
        method: "POST",
        headers: {
            "Authorization": "Client-ID f406669d6b38872"
        },
        data: {
            image: base64
        }
    }).done(function (response) {
        console.log(response);
    }).fail(function (error) {
        console.error("Failed to upload image.");
        console.error(error);
    });
}