$(function () {
    // 変数宣言 //
    let b1 = false;
    let b2 = false;
    let b3 = false;

    const emailRegex = /^[A-Za-z0-9][A-Za-z0-9_.-]*@[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;

    const emailInput = $("#email-input");
    const nameInput = $("#name-input");
    const passwordInput = $("#password-input");

    const emailCheck = $("#email-check");
    const nameCheck = $("#name-check");
    const passwordCheck = $("#password-check");

    const signUpButton = $("#signup-button");

    // テキストボックス更新時 //
    emailInput.on("input", checkAll);
    nameInput.on("input", checkAll);
    passwordInput.on("input", checkAll);
    $("input").on("input", canSignUp);

    // Ajax //
    signUpButton.on("click", POST);

    // 関数 //
    function checkAll() {
        check1();
        check2();
        check3();
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
        if (nameInput.val().length >= 3) {
            b2 = true;
            ok(nameCheck);
        } else {
            b2 = false;
            ng(nameCheck);
        }
    }

    function check3() {
        if (passwordInput.val().length >= 6) {
            b3 = true;
            ok(passwordCheck);
        } else {
            b3 = false;
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
        signUpButton.attr("disabled", !(b1 && b2 && b3));
    }

    function POST() {
        const email      = emailInput.val();
        const name       = nameInput.val();
        const password   = passwordInput.val();
        const d = new Date();
        const created_at = d.getFullYear() + "-" + z2(d.getMonth() + 1) + "-" + z2(d.getDate()) + " " + z2(d.getHours()) + ":" + z2(d.getMinutes()) + ":" + z2(d.getSeconds());
        const json = JSON.stringify({email: email, name: name, password: password, created_at: created_at.toString()});

        $.ajax({
            url: "/signup",
            type: "POST",
            dataType: "json",
            data: json
        }).fail(function (result) {
            const s = result.status;

            if (s === 200) {
                window.location.href = "index.html";
            } else {
                $("#error").text(result.responseText);
            }
        });
    }

    function z2(str) {
        return str.toString().padStart(2, '0');
    }
});