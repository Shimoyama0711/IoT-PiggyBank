$(function () {
    const name = getName();
    const send = $("#send");

    drawDefault(name);

    $("#avatar-upload").on("change", function (data) {
        const file = data.target.files[0];

        let image = new Image();
        let reader = new FileReader();

        reader.onload = function (event) {
            image.onload = function () {
                const canvas = document.getElementById("avatar-thumbnail");
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
                ctx.drawImage(image, 0, 0, 256, 256);
            }

            image.src = event.target.result;
        }
        reader.readAsDataURL(file);

        send.removeClass("disabled");
    });

    send.on("click", uploadImage);
});

// デフォルトアイコンの描画
function drawDefault(name) {
    const canvas = document.getElementById("avatar-thumbnail");
    const ctx = canvas.getContext("2d");

    getUserInfo(name).done(function (response) {
        const image = new Image();
        image.src = "default.jpg";

        image.onload = () => {
            ctx.drawImage(image, 0, 0, 256, 256);
        };

        $("#avatar").attr("src", response["avatar"]);
    });
}

// 名前の取得
function getName() {
    const cookie = document.cookie.split(";");

    for (let i = 0; i < cookie.length; i++) {
        const key = cookie[i].split("=")[0];
        const value = cookie[i].split("=")[1];

        if (key === "name")
            return value;
    }

    return "Not Signed In";
}

// ユーザー情報の取得
function getUserInfo(name) {
    return $.ajax({
        url: "/get-user-info",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({name: name})
    });
}

// ImgBB にアップロードする
function uploadImage() {
    const thumbnail = document.getElementById("avatar-thumbnail");
    const base64 = thumbnail.toDataURL().split(',')[1];
    const alert = $("#avatar-alert");

    const formData = new FormData();
    formData.append("image", base64);

    const settings = {
        "url": "https://api.imgbb.com/1/upload?key=ecd3a94703d6f6d0ffab121d079e2682",
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
        alert.html(`<i class="bi-check-circle-fill"></i> アバターを変更しました`);
        $(".avatar").attr("src", url);

        console.log(response);

        const settings2 = {
            "url": "/set-user-info",
            "method": "POST",
            "dataType": "json",
            "data": JSON.stringify({name: getName(), key: "avatar", value: url})
        }

        console.log("[settings2] " + JSON.stringify(settings2));

        $.ajax(settings2);
    }).fail(function (error) {
        alert.css("display", "block");
        alert.removeClass("alert-success");
        alert.addClass("alert-danger");
        alert.html(`<i class="bi-x-square-fill"></i> アバターの変更に失敗しました`);

        console.log(settings);
        console.error("Failed to upload image.");
        console.log(JSON.stringify(error));
    });
}