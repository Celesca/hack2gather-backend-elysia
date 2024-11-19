# HACKA with Elysia

Hacka is the application for hackathon finder 

![image](https://github.com/user-attachments/assets/d5dfe7b4-2efe-44a4-8795-2c10f94d6259)


```bash
bun create elysia ./elysia-example
```




## Development
To start the development server run:
```bash
bun run dev
```

Sync the prisma schema with the MySQL

`bunx prisma migrate dev --name init`


Open http://localhost:3000/ with your browser to see the result.


Deploy : 

bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts

Backlogs for the Swipe Feature :

Swipe Page API Design:
You’ll need two main API endpoints:

GET /profiles-to-swipe:

Purpose: Fetch profiles for the user to swipe on (exclude users they've already swiped).
Input: UserID (e.g., Alice)
Output: List of potential profiles (excluding already-swiped users).
POST /swipe:

Purpose: Record a swipe action (like or dislike).
Input: SwipingUserID, SwipedUserID, SwipeAction (like or dislike)
Output: Success message, and optionally whether it's a match.
