import {serve} from "https://deno.land/std@0.164.0/http/server.ts";
import {serveDir} from "https://deno.land/std@0.164.0/http/file_server.ts";
import {Client} from "https://deno.land/x/mysql/mod.ts";

const client = await new Client().connect({
    hostname: "localhost",
    username: "root",
    db: "iot-piggybank",
    password: "IoT-PiggyBank2022",
});

// 80番ポートでHTTPサーバーを構築
serve(async (req) => {
    // 日付の出力
    const date = new Date();
    const formatted = date.toLocaleString();

    // reqあれこれ
    const method = req.method;
    const pathname = new URL(req.url).pathname;
    const userAgent = req.headers.get("user-agent");

    // ログ出力
    if (userAgent !== "Arduino")
        console.log(`[${formatted}] ${method} ${pathname}`);

    if (pathname === "/get-user-info") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const name = json.name;

            return getUserInfo(name);
        }
    }

    if (pathname === "/set-user-info") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            const name = json.name;
            const key = json.key;
            const value = json.value;

            return setUserInfo(name, key, value);
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

async function setUserInfo(name, key, value) {
    let msg = "200 OK";
    let code = 200;

    await client.execute(`UPDATE users SET ${key} = "${value}" WHERE name = "${name}"`).catch(
        function (error) {
            const e = error.toString();

            code = 400;
            console.log(e);
        }
    );

    if (key === "money") {
        await client.execute(`INSERT INTO history VALUES (0, "${name}", "${value}", NOW())`).catch(
            function (error) {
                const e = error.toString();

                code = 400;
                console.log(e);
            }
        );
    }

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}

async function getUserInfo(name) {
    let msg = "400 Bad Request";
    let code = 400;
    let MIME = "plain/text";

    const search = await client.query(`SELECT * FROM users WHERE name = "${name}"`);
    const json = JSON.parse(JSON.stringify(search));
    const obj = json[0];

    if (obj !== undefined) {
        msg = JSON.stringify(obj);
        code = 200;
        MIME = "application/json";
    }

    return new Response(msg, {
        headers: {"Content-Type": MIME},
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
        msg = obj["MAX(amount)"] ?? 0;
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
    const encrypt = await sha256(password);

    console.log(`INSERT INTO users VALUES (0, "${email}", "${name}", "${encrypt}", 0, NOW(), 0, NULL);`);

    await client.execute(`INSERT INTO users VALUES (0, "${email}", "${name}", "${encrypt}", 0, NOW(), 0, NULL);`).catch(
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
    const encrypt = await sha256(password);

    const search = await client.query(`SELECT * FROM users WHERE email = "${email}"`);
    const json = JSON.parse(JSON.stringify(search));
    const obj = json[0];

    if (obj === undefined) {
        msg = "無効なメールアドレスです";
        code = 400;
    } else {
        if (obj.password !== encrypt) {
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

async function sha256(text) {
    const uint8 = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", uint8);
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('');
}