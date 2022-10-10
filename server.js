import { serve } from "https://deno.land/std@0.158.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.158.0/http/file_server.ts";

let red = 0;
let green = 0;
let blue = 0;
let money = 0;

// 80番ポートでHTTPサーバーを構築
serve(async (req) => {
    const method = req.method;
    const pathname = new URL(req.url).pathname;

    /*
     * DEBUG *
    console.log("====================");
    console.log(req);
    console.log("====================");
     */

    console.log("====================");
    console.log(`${method} ${pathname}`);
    console.log("====================");

    if (pathname === "/rgb") {
        if (method === "GET") {
            const params = new URL(req.url).searchParams;
            const R = params.get("red");
            const G = params.get("green");
            const B = params.get("blue");

            if (R !== null) red = Number(R);
            if (G !== null) green = Number(G);
            if (B !== null) blue = Number(B);

            return new Response(JSON.stringify({red, green, blue}), {
                headers: {"Content-Type": "application/json"},
                status: 200
            });
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