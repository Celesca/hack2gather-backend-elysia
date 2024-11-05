The Swipe feature in your "Hackathon Finder Tinder Application" involves users swiping on profiles to either "Like" (accept) or "Dislike" (reject) them, similar to Tinder. Here's how the Swipe Table can be structured and how the system works on the backend when a user interacts with the swipe page.

1. Swipe Table Design
The Swipe Table stores the actions users take (swiping left/right). Each row represents a single swipe from one user to another.

Example Swipe Table:
SwipeID	SwipingUserID	SwipedUserID	SwipeAction (Like/Dislike)	Timestamp
1	Alice	Bob	Like	2024-11-05 12:30:00
2	Bob	Alice	Like	2024-11-05 12:35:00
3	Alice	Charlie	Dislike	2024-11-05 12:40:00
2. System Workflow (Backend)
Step-by-Step Flow When User Enters the Swipe Page:
Here’s what happens in the backend when a user (e.g., Alice) enters the swipe page and starts swiping on profiles.

Fetch Potential Profiles for Swiping:

The system needs to fetch profiles that Alice hasn't swiped on yet.
Query: You need to exclude profiles that Alice has already swiped on (either "liked" or "disliked").
sql
Copy code
SELECT * 
FROM Users 
WHERE UserID != 'Alice' 
  AND UserID NOT IN (
    SELECT SwipedUserID 
    FROM Swipe 
    WHERE SwipingUserID = 'Alice'
  );
This will return all users except Alice and the users Alice has already swiped on.
Display Profiles in Swipe Format:

The backend will serve the fetched profiles to Alice's app, showing them one by one.
Each profile will display relevant information like username, working style (Leader, Thinker, etc.), bio, and profile picture.
User Action (Swipe):

Alice swipes left (dislike) or right (like) on a profile.
Once Alice swipes, the app makes an API call to the backend to store the swipe action.
Insert Swipe Action into Database:

After Alice swipes, the backend inserts the action into the Swipe Table:
sql
Copy code
INSERT INTO Swipe (SwipingUserID, SwipedUserID, SwipeAction, Timestamp)
VALUES ('Alice', 'Bob', 'Like', NOW());
This records Alice's swipe on Bob's profile.
Check for Mutual Swipe (Match):

When Alice swipes right (like) on Bob, the system checks if Bob has also swiped right on Alice (i.e., a mutual match).
Query to Check for a Match:
sql
Copy code
SELECT * 
FROM Swipe 
WHERE SwipingUserID = 'Bob' 
  AND SwipedUserID = 'Alice' 
  AND SwipeAction = 'Like';
If this query returns a result, it means Bob also liked Alice, so it's a match.
If it's a match, you can trigger a notification for both Alice and Bob, informing them of the match.
Notify Both Users of the Match (Optional):

If Alice and Bob both swiped right, the backend creates notifications for both users in the Notification Table:
sql
Copy code
INSERT INTO Notification (UserID, NotificationContent, Timestamp, ReadStatus)
VALUES ('Alice', 'You have a new match with Bob!', NOW(), 'Unread'),
       ('Bob', 'You have a new match with Alice!', NOW(), 'Unread');
Proceed to Next Profile:

After Alice swipes, the next profile is displayed, and the process repeats.
3. Swipe Matching Logic:
The core functionality of the swipe system is based on mutual likes:

When Alice swipes right (like) on Bob, the system checks if Bob has already swiped right on Alice.
If both users like each other, it's a match.
If Alice swipes left (dislike) or Bob hasn’t swiped on Alice yet, no match is made.
4. Swipe Actions in Database:
Each swipe is independent, meaning a swipe action is always stored as a one-way action (one user swiping on another).
The backend checks for mutual swipes by querying both directions (User A swiping User B and User B swiping User A).
5. Swipe System Optimization:
Caching: You can cache users that Alice has swiped on to avoid constantly querying the database.
Rate Limiting: Implement swipe limits to avoid abuse of the swipe feature.
Recommendations: Based on Alice’s working style (e.g., Leader), the system can prioritize showing users with compatible working styles (e.g., Thinker, Supporter). You could query the database to prioritize profiles with matching working styles.
6. Swipe Page API Design:
You’ll need two main API endpoints:

GET /profiles-to-swipe:

Purpose: Fetch profiles for the user to swipe on (exclude users they've already swiped).
Input: UserID (e.g., Alice)
Output: List of potential profiles (excluding already-swiped users).
POST /swipe:

Purpose: Record a swipe action (like or dislike).
Input: SwipingUserID, SwipedUserID, SwipeAction (like or dislike)
Output: Success message, and optionally whether it's a match.
Conclusion:
One-way records are sufficient for swipes, where each row represents one user swiping on another.
The backend handles fetching profiles, recording swipe actions, checking for mutual matches, and notifying users.
The system should efficiently check for users who haven't been swiped on yet and prioritize showing compatible profiles based on working style.
