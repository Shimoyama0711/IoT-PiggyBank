import {serve} from "https://deno.land/std@0.158.0/http/server.ts";
import {serveDir} from "https://deno.land/std@0.158.0/http/file_server.ts";
import {Client} from "https://deno.land/x/mysql@v2.10.2/mod.ts";

const client = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "iot-piggybank",
    password: "IoT-PiggyBank2022",
});

// 80番ポートでHTTPサーバーを構築
serve(async (req) => {
    // 日付の出力
    //const date = new Date();
    //const formatted = date.toLocaleString();

    // reqあれこれ
    const method = req.method;
    const pathname = new URL(req.url).pathname;
    //const userAgent = req.headers.get("user-agent");

    // ログ出力
    //if (userAgent !== "Arduino")
        //console.log(`[${formatted}] ${method} ${pathname}`);

    if (pathname === "/get-money") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const name = json.name;

            return getMoney(name);
        }
    }

    if (pathname === "/add-money") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const name = json.name;
            const value = json.value;

            return addMoney(name, value);
        }
    }

    if (pathname === "/set-money") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const name = json.name;
            const value = json.value;

            return setMoney(name, value);
        }
    }

    if (pathname === "/get-history") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const start = json.start;
            const end = json.end;

            return getHistory(start, end);
        }
    }

    if (pathname === "/signup") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);

            let E = json.email.replace("@", "\@");
            let N = json.name;
            let P = json.password;

            return signUp(E, N, P);
        }
    }

    if (pathname === "/signin") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);

            let E = json.email.replace("@", "\@");
            let P = json.password;

            return signIn(E, P);
        }
    }

    // ファイルを返す
    const dir = await serveDir(req, {
        fsRoot: "./public/",
        showDirListing: true,
        enableCors: true
    });

    if (dir.status === 404) {
        const html = await Deno.readFile("./public/404.html");

        return new Response(html, {
            headers: {"Content-Type": "text/html"},
            status: 404,
            statusText: "404 Not Found"
        });
    }

    return dir;
}, { port: 80 }).then(r => {
    console.log("then() => " + r);
});

async function getMoney(name) {
    let msg = "400 Bad Request";
    let code = 400;
    let MIME = "plain/text";

    const search = await client.query(`SELECT * FROM users WHERE name = "${name}"`);
    const json = JSON.parse(JSON.stringify(search));
    const obj = json[0];

    if (obj !== undefined) {
        const array = {name: obj.name, money: obj.money};
        msg = JSON.stringify(array);
        code = 200;
        MIME = "application/json";
    }

    return new Response(msg, {
        headers: {"Content-Type": MIME},
        status: code
    });
}

async function addMoney(name, value) {
    let msg = "200 OK";
    let code = 200;

    await client.execute(`UPDATE users SET money = money + ${value} WHERE name = "${name}"`).catch(
        function (error) {
            const e = error.toString();

            code = 400;
            console.log(e);
        }
    );

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}

async function setMoney(name, value) {
    let msg = "200 OK";
    let code = 200;

    await client.execute(`UPDATE users SET money = ${value} WHERE name = "${name}"`).catch(
        function (error) {
            const e = error.toString();

            code = 400;
            console.log(e);
        }
    );

    await client.execute(`INSERT INTO history VALUES (0, "${name}", "${value}", NOW())`).catch(
        function (error) {
            const e = error.toString();

            code = 400;
            console.log(e);
        }
    );

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}

async function getHistory(start, end) {
    let msg = "400 Bad Request";
    let code = 400;
    let MIME = "plain/text";

    const search = await client.query(`SELECT MAX(amount) FROM history WHERE date BETWEEN "${start}" AND "${end}"`);
    const json = JSON.parse(JSON.stringify(search));
    const obj = json[0];

    if (json[0] !== undefined) {
        msg = obj["MAX(amount)"];
        code = 200;
    }

    return new Response(msg, {
        headers: {"Content-Type": MIME},
        status: code
    });
}

async function signUp(email, name, password) {
    let msg = "200 OK";
    let code = 200;

    await client.execute(`INSERT INTO users VALUES (0, "${email}", "${name}", "${password}", 0, NOW());`).catch(
        function (error) {
            const e = error.toString();
            code = 400;

            if (e.includes("email_UNIQUE"))
                msg = "そのEメールアドレスは既に登録されています";

            if (e.includes("name_UNIQUE"))
                msg = "そのユーザー名は既に登録されています";
        }
    );

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}

async function signIn(email, password) {
    let msg;
    let code = 200;

    const search = await client.query(`SELECT * FROM users WHERE email = "${email}"`);
    const json = JSON.parse(JSON.stringify(search));
    const obj = json[0];

    if (obj === undefined) {
        msg = "無効なメールアドレスです";
        code = 400;
    } else {
        if (obj.password !== password) {
            msg = "パスワードが違います";
            code = 400;
        } else
            msg = `${obj.name}`;
    }

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}