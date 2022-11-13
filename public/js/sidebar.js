$(function () {
    const pathname = location.pathname;
    const pages = ["account", "dashboard", "settings", "deposit", "danger"];

    // Sidebar関連
    for (let i = 0; i < pages.length; i++) {
        const n = pages[i];

        if (pathname === `/${n}.html`) {
            const link = $(`#link-${n}`);

            link.addClass("active");
            link.removeClass("link-dark");
            link.addClass("link-white");
        }
    }

    const cookie = document.cookie.split(";");

    // ユーザーがサインインしていた場合
    for (let i = 0; i < cookie.length; i++) {
        const key = cookie[i].split("=")[0];
        const value = cookie[i].split("=")[1];

        if (key === "name") {
            if (value.length > 0) {
                getUserInfo(value).done(function (response) {
                    const avatar = response["avatar"] ?? "default.jpg";

                    $("#user-name").text(value);
                    $("#avatar").attr("src", avatar);
                });
            } else {
                $("#user-name").text("Not Signed In");
                $("#avatar").attr("src", "default.jpg");
            }
        }
    }
});

function getUserInfo(name) {
    return $.ajax({
        url: "/get-user-info",
        type: "POST",
        dataType: "json",
        data: JSON.stringify({name: name})
    });
}