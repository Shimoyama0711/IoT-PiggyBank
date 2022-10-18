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
    const method = req.method;
    const pathname = new URL(req.url).pathname;

    console.log(`${method} ${pathname}`);

    if (pathname === "/getMoney") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);
            let name = json.name;

            return getMoney(name);
        }
    }

    if (pathname === "/signup") {
        if (method === "POST") {
            const data = await req.text();
            const json = JSON.parse(data);

            let E = json.email.replace("@", "\@");
            let N = json.name;
            let P = json.password;
            let C = json.created_at;

            return signUp(E, N, P, C);
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

    return serveDir(req, {
        fsRoot: "./public/",
        showDirListing: true,
        enableCors: true
    });
}, { port: 80 }).then(r => {
    console.log("then() => " + r);
});

async function getMoney(name) {
    let msg = "404 Not Found";
    let code = 404;
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

async function signUp(email, name, password, created_at) {
    let msg = "200 OK";
    let code = 200;

    await client.execute(`INSERT INTO users VALUES (0, "${email}", "${name}", "${password}", 0, "${created_at}");`).catch(
        function (error) {
            const e = error.toString();
            code = 300;

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
        code = 300;
    } else {
        if (obj.password !== password) {
            msg = "パスワードが違います";
            code = 300;
        } else
            msg = `${obj.name}`;
    }

    return new Response(msg, {
        headers: {"Content-Type": "plain/text"},
        status: code
    });
}