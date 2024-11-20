import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Create new user', () => {
    it('should return a new user', async () => {
        const app = new Elysia().post('/user/create', ({ body }) => {
            return body
        })

        const response = await app
            .handle(new Request('http://localhost:3000/user/create', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'John Doe',
                    email: 'john.doe@gmail.com',
                    password: '1234',
                })}))

        //Expect response status to be 201 Created
        expect(response.status).toBe(200)
})
})