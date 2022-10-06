$(function () {
    setInterval(updateDate, 250);

    $("#getLocation").on("click", getLocation);
    $("#roll-dice").on("click", rollDice);
});

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 日時を更新する関数
function updateDate() {
    const date = new Date();

    $("#date").text(date.getFullYear() + "/" + (date.getMonth() + 1).toString().padStart(2, '0') + "/" + date.getDate().toString().padStart(2, '0') + " (" + weekdays[date.getDay()] + ")");
    $("#time").text(date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0'));
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