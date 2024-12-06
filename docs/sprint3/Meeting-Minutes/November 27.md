# Meeting Minutes – November 27, 2024

## Attendees:
- Jay Dalool
- Kin Tat Ho
- Adrian Moreira
- Ron Arvin Cruz
- Hridai Mehta
- Josh Wolowich

---

## Agenda:
1. Notifications implementation for React and Flutter.
2. Updates on current tasks and progress.
3. Discussion of invitation functionality.
4. Testing and Cypress setup.
5. Planning for the presentation and final deliverables.

---

## Key Points:

### Notifications:
- **Jay**: Working on implementing notifications for React using existing libraries.
- **Kin**: Suggested implementing Flutter notifications using a simple API pull with a timer, avoiding advanced setups.

---

### Task Updates:
- **Jay**: Confirmed Adrian is working on React components, particularly the planner functionality.
- **Hridai**: Responsible for the back-end of the shopping list.
- **Ron**: Handling To-Do List functionality (front-end and back-end). Agreed to take over the shopping list UI for Flutter.
- **Adrian**: Starting work on React front-end updates for planner-related components. Catching up after previous delays.

---

### Invitation System:
- Discussed a potential alternative to a full invitation system:
  - Sending notifications to users when added to a planner instead of using public invitation links.
  - Considered implementing a "magic link" system similar to Discord, but with security concerns raised (e.g., unauthorized access through shared links).
  - Decision: Explore creating an invite object with pending, accepted, and declined statuses for better tracking and control.

---

### Map Integration:
- **Kin**: Suggested using OpenStreetMap for itinerary visualization, as it’s open-source and avoids the complexities of managing secrets required by Google Maps.
- Idea: Display pins for destinations and allow users to manually add locations.

---

### Testing and Cypress:
- **Ron**: Set up Cypress for end-to-end testing but suggested postponing further testing until the core functionality is complete.
- **Kin**: Highlighted the option of using Playwright for testing, but the team agreed to stick with Cypress for now.

---

### Planner Bug:
- **Hridai**: Reported an issue with creating and opening planners due to WebSocket and TypeScript integration.
- **Kin**: Suspected an ID collision issue in React.
- Action: Hridai and Adrian will investigate and attempt a fix.

---

## Next Steps:
1. **Testing**:
   - Focus on end-to-end testing for the web app using Cypress.
   - Basic Cypress setup to be committed as a base for future tests.
2. **Planner Bug**:
   - Investigate and resolve ID collision and spinning wheel issues in React.
3. **Task Progress**:
   - Each team member to aim for 50-75% task completion by the next meeting.
4. **Presentation**:
   - Prepare for the technical seminar presentation scheduled for December 4, 2024.

---

## Deadlines:
- **Assignment Due**: December 9, 2024.
- **Final Exam**: December 12, 2024, at 6:00 PM.

---

## Next Meeting:
- **Date**: Saturday, November 30, 2024
- **Agenda**: Progress updates, testing results, and preparation for the presentation.

---

## Closing Notes:
- Jay emphasized the importance of showing commits and issues in the final iteration for grading purposes.
- The team agreed to prioritize functionality over extensive testing until core features are stable.
- Recording to be shared, and meeting minutes will be compiled for the final submission.
