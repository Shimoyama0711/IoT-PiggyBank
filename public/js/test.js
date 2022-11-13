$(function () {
    const imgbbUpload = $("#imgbb-upload");
    const send = $("#imgbb-send");

    drawDefault();
    updateDate();
    updateRGB();

    setInterval(updateDate, 100);

    $("#update-rgb").on("click", updateRGB);
    $("#getLocation").on("click", getLocation);
    $("#roll-dice").on("click", rollDice);
    $("#sha-256-input").on("input", updateSHA256);

    // サムネイル表示
    imgbbUpload.on("change", function (data) {
        const file = data.target.files[0];

        let image = new Image();
        let reader = new FileReader();

        reader.onload = function (event) {
            image.onload = function () {
                const canvas = document.getElementById("imgbb-thumbnail");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
                ctx.drawImage(image, 0, 0, 256, 256);
            }

            image.src = event.target.result;
        }
        reader.readAsDataURL(file);

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

// SHA-256出力の更新
async function updateSHA256() {
    const str = $("#sha-256-input").val();
    const encryption = await sha256(str);
    $("#sha-256-output").val(encryption);
}

// SHA-256の生成
async function sha256(text) {
    const uint8 = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
}

// デフォルトアイコンの描画
function drawDefault() {
    const canvas = document.getElementById("imgbb-thumbnail");
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = "default.jpg";

    image.onload = () => {
        ctx.drawImage(image, 0, 0, 256, 256);
    };
}

// ImgBB にアップロードする
function uploadImage() {
    const thumbnail = document.getElementById("imgbb-thumbnail");
    const base64 = thumbnail.toDataURL().split(',')[1];
    const alert = $("#imgbb-alert");

    const formData = new FormData();
    formData.append("image", base64);

    const settings = {
        "url": "https://api.imgbb.com/1/upload?key=ecd3a94703d6f6d0ffab121d079e2682&expiration=180",
        "method": "POST",
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formData,
    }

    $.ajax(settings).done(function (response) {
        const json = JSON.parse(response);
        const url = json["data"]["url"];

        alert.css("display", "block");
        alert.removeClass("alert-danger");
        alert.addClass("alert-success");
        alert.html(`<i class="bi-check-circle-fill"></i> 画像のアップロードに成功しました<br>180秒後に自動削除されます<br><a href="${url}">${url}</a>`);

        console.log(response);
    }).fail(function (error) {
        alert.css("display", "block");
        alert.removeClass("alert-success");
        alert.addClass("alert-danger");
        alert.html(`<i class="bi-x-square-fill"></i> 画像のアップロードに失敗しました`);

        console.log(settings);
        console.error("Failed to upload image.");
        console.log(JSON.stringify(error));
    });
}