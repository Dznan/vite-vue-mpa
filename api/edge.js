import {sql} from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function edge(request) {
    const urlParams = new URL(request.url).searchParams;
    const query = Object.fromEntries(urlParams);
    const cookies = request.headers.get('cookie');

    if (request.method === 'GET') {
        let body;
        try {
            body = await sql`SELECT COUNT (*) FROM counter`;
        } catch (error) {
            body = null;
        }

        return new Response(
            JSON.stringify({
                body,
            }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            },
        );
    } else if (request.method === 'POST') {
        try {
            await sql`INSERT INTO counter VALUES (now())`;
        } catch (error) {
            return new Response(
                JSON.stringify({
                    msg: "ERROR"
                }),
                {
                    status: 200,
                    headers: {
                        'content-type': 'application/json',
                    },
                },
            );
        }
        return new Response(
            JSON.stringify({
                msg: "SUCCEED"
            }),
            {
                status: 200,
                headers: {
                    'content-type': 'application/json',
                },
            },
        );
    }
}