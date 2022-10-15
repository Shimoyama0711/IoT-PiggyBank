$(function () {
    const signUp  = $("#signup");
    const signIn  = $("#signin");
    const signOut = $("#signout");

    const cookie = document.cookie.split(";");
    for (let i = 0; i < cookie.length; i++) {
        const key = cookie[i].split("=")[0];
        const value = cookie[i].split("=")[1];

        if (key === "name") {
            signUp.html(`
                <i class="bi-person-check"></i>
                ${value} さん
            `);
            signUp.attr("href", "#");

            signIn.html(`
                <i class="bi-arrow-left-square-fill"></i>
                Sign Out
            `);
            signIn.attr("href", "signout.html");
            signIn.attr("id", "signout");
        }
    }
});