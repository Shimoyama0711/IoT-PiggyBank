$(function () {
    // 変数宣言 //
    let b1 = false;
    let b2 = false;

    const emailRegex = /^[A-Za-z0-9][A-Za-z0-9_.-]*@[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

    const emailInput = $("#email-input");
    const passwordInput = $("#password-input");

    const emailCheck = $("#email-check");
    const passwordCheck = $("#password-check");

    const signInButton = $("#signin-button");

    // テキストボックス更新時 //
    emailInput.on("input", checkAll);
    passwordInput.on("input", checkAll);
    $("input").on("input", canSignUp);

    // Ajax //
    signInButton.on("click", POST);

    // 関数 //
    function checkAll() {
        check1();
        check2();
    }

    function check1() {
        if (emailRegex.test(emailInput.val())) {
            b1 = true;
            ok(emailCheck);
        } else {
            b1 = false;
            ng(emailCheck);
        }
    }

    function check2() {
        if (passwordInput.val().length >= 6) {
            b2 = true;
            ok(passwordCheck);
        } else {
            b2 = false;
            ng(passwordCheck);
        }
    }

    function ok(obj) {
        obj.removeClass("bi-x-square-fill");
        obj.addClass("bi-check-circle-fill");
        obj.css("color", "#58ad45");
    }

    function ng(obj) {
        obj.removeClass("bi-check-circle-fill");
        obj.addClass("bi-x-square-fill");
        obj.css("color", "#bd3131");
    }

    function canSignUp() {
        signInButton.attr("disabled", !(b1 && b2));
    }

    function POST() {
        const email    = emailInput.val();
        const password = passwordInput.val();
        const json = JSON.stringify({email: email, password: password});

        $.ajax({
            url: "/signin",
            type: "POST",
            dataType: "json",
            data: json
        }).fail(function (result) {
            const s = result.status;

            if (s === 200) {
                document.cookie = `name=${result.responseText}`;
                window.location.href = "index.html";
            } else {
                $("#error").text(result.responseText);
            }
        });
    }
});