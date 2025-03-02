import axios from "axios";
import {z} from "zod";
import {createZodRoute} from "next-zod-route";
import {NextResponse} from 'next/server';

const querySchema = z.object({
    bookKey: z.string(),
});

export const GET = createZodRoute().query(querySchema).handler(async (request, context) => {
    const {bookKey} = context.query;

    if (!bookKey) {
        return NextResponse.json({error: 'Book key is required'}, {status: 400});
    }

    try {
        const response = await axios.get(`https://openlibrary.org${bookKey}.json`);
        return NextResponse.json(response.data, {status: 200});
    } catch {
        return NextResponse.json({error: 'Failed to fetch book data'}, {status: 500});
    }
});