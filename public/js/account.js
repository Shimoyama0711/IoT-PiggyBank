$(function () {
    const name = getName();

    drawAvatar(name);

    getUserInfo(name).done(function (response) {
        $("#account-name").text(response["name"]);
        $("#account-email").text(response["email"]);
        $("#account-password").text(response["password"]);
        $("#account-created-at").text(response["created_at"]);
    });
});

// アバターの描画
function drawAvatar(name) {
    getUserInfo(name).done(function (response) {
        const url = response["avatar"] ?? "default.jpg";
        $("#avatar-thumbnail").attr("src", url);
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