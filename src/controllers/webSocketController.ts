import { Elysia, t } from "elysia";

export const webSocketController = new Elysia({ prefix: "/ws" })
    .ws("/", {
        // validate incoming message
        body: t.Object({
            message: t.String()
        }),
        query: t.Object({
            id: t.String()
        }),
        // handle incoming message
        message(ws, { message }) {
            // Get schma from 'ws.data'
            const { id } = ws.data.query;
            ws.send({
                id,
                message,
                time: Date.now()
            })
        }
    })