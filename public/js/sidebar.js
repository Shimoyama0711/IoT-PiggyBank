$(function () {
    const pathname = location.pathname;
    const pages = ["account", "dashboard", "settings", "deposit", "danger"];

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

    for (let i = 0; i < cookie.length; i++) {
        const key = cookie[i].split("=")[0];
        const value = cookie[i].split("=")[1];

        if (key === "name")
            $("#user-name").text(value);
    }
});