import {QueryResult, QueryResultRow, sql} from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

async function getCurrentCount() {
    let data: number | undefined;
    try {
        const result: QueryResult<QueryResultRow> = await sql`SELECT COUNT (*) AS count FROM counter`;
        console.log(result);
        data = parseInt(result.rows[0].count);
    } catch (error) {
        console.error(error);
        data = undefined;
    }
    return data;
}

async function increaseCount() {
    try {
        await sql`INSERT INTO counter VALUES (now())`;
    } catch (error) {
        return false;
    }
    return true;
}

export default async function handler(request: Request) {
    // const urlParams = new URL(request.url).searchParams;
    // const query = Object.fromEntries(urlParams);
    // const cookies = request.headers.get('cookie');

    if (request.method === 'GET') {
        let count = await getCurrentCount();

        return new Response(
            JSON.stringify({
                count,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } else if (request.method === 'POST') {
        if (await increaseCount()) {
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
        } else {
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
    }
    return new Response(
        JSON.stringify({
            msg: "Method not allowed"
        }),
        {
            status: 405,
            headers: {
                'content-type': 'application/json',
            }
        }
    );
}