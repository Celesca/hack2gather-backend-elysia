# Hack2gather with Elysia

Hack2gather is the application for hackathon finder 

![Screenshot 2024-11-08 003259](https://github.com/user-attachments/assets/75e3467e-c547-406a-a69c-ecd77b3e54e7)

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
