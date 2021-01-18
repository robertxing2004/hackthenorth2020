# meet.up
Submission to Hack the North 2020

## Inspiration
As high school students, we love making plans with friends. However, we are constantly bogged down by the process of agreeing on a time, trying to accommodate everybody's schedules. meet.up was designed to facilitate the process by automating the process of finding the best date.
meet.up can be used for both virtual and in-person events, for small hangouts or larger corporate outings.

## What it does
meet.up allows users to join groups with their friends, organizations, etc. When a group member posts an upcoming event, whether it be a movie, a D&D meet, or an Among Us game, the other group members can mark down their availability in a calendar. The forms are then processed by an algorithm, which then displays select dates when the most users are available.

## How we built it
Once we had our idea, we first created the models and planned ahead. Since we had many components stored in CockroachDB (users, groups, events, availabilities, etc), we needed to stay extremely organized. We then created the API endpoints for interacting with the database on the backend and the basic structure on the frontend, and used Github Oauth. Finally, we connected the backend and frontend, and focused on UI/UX.

## Challenges we ran into
This was our first time using CockroachDB, and we had a difficult time initially figuring out how to connect it. We are also quite inexperienced with programming in general, so our workflow was constantly slowed down due to googling things we were stuck on.
The CockroachDB outage also threw us off a little bit, but after receiving great support from the representatives, we were able to get back on track.

## Accomplishments that we're proud of
We felt proud to have brought an app to life that we could see ourselves using in our daily life, and that would serve a highly useful purpose. At the end of the day though, we're extremely happy to have experienced Hack the North for the first time!

## What we learned
We're glad to have learned about the utility of CockroachDB, and how to implement it in our app! This was also our first time using the modal class in PugJS (HTML) and CSS, which allowed us to create forms on the web app without the need for a separate webpage. We'll definitely be making more use of this in future projects!

## What's next for meet.up
We plan to add more quality of life features/fixes, and possibly host it at some point in the future for others to use. We plan on adding an explore feature, to suggest movies, restaurants, and other ideas near us.
