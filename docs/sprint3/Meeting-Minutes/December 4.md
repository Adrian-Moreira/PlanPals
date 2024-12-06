# Meeting Minutes – December 4, 2024

## Attendees:
- Jay Dalool
- Kin Tat Ho
- Adrian Moreira
- Ron Arvin Cruz
- Hridai Mehta
- Josh Wolowich

---

## Meeting Start Time:
**6:30 PM**

---

## Agenda:
1. Reflect on the presentation performance.
2. Prioritize bug fixes and task delegation.
3. Update on individual responsibilities.

---

## Key Points:

### Presentation Reflection:
- The team agreed that the presentation went well and was well-received by the audience.
- **Adrian** delivered the app demo effectively, showcasing the core features and maintaining a natural, conversational style.
- Feedback from the professor and peers included:
  - Positive comments on the planner module and map integration.
  - Suggestions to fix specific bugs, such as inaccurate `rwUser` fetch in the shopping list backend and WebSocket issues.

---

### Bug Fixes:
The team decided to focus on resolving pending issues based on feedback:
1. **Shopping List Backend**:
   - **Issue**: Inaccurate `rwUser` fetch causing data inconsistencies.
   - **Assigned To**: Hridai
   - **Action**: Investigate and resolve the fetch logic, ensuring proper data retrieval and validation.

2. **WebSocket and Notifications**:
   - **Issue**: Notifications not triggering consistently due to WebSocket issues.
   - **Assigned To**: Jay
   - **Action**: Debug and fix WebSocket connection errors. Ensure reliable notification functionality across the app.

3. **Flutter App**:
   - **Issue**: Flutter implementation lagging behind React version.
   - **Assigned To**: Kin
   - **Action**: Work on bringing Flutter features up to par with React, focusing on shopping list and planner modules.

4.  **React Bug Fixes**:
   - **Assigned To**: Josh
     - Investigate and fix UI rendering bugs reported during testing.
     - Ensure proper state management for dynamic updates in both the shopping list and planner modules.
     - Collaborate with Adrian to validate and refine the React components for consistency.

---

### Task Delegation for Feature Implementation:
1. **To-Do List**:
   - **Frontend (React)**: Adrian
     - Work on completing the UI and integration with the backend.
     - Ensure the list updates dynamically.
   - **Backend**: Ron
     - Implement and test API endpoints for To-Do List CRUD operations.
     - Ensure robust data handling and integration with the database.

2. **General Testing**:
   - The team will collaborate on testing the entire app once bug fixes are completed.
   - Focus will be on validating fixed bugs and ensuring stability.

---

### Timeline:
- **Bug Fixes Deadline**: December 6, 2024.
- **Next Meeting**: December 8, 2024, at 7:00 PM for Assignment and final review.

---

## Action Items:
1. **Adrian**:
   - Finalize To-Do List frontend implementation.
   - Collaborate with Ron for backend integration.
2. **Ron**:
   - Complete the To-Do List backend APIs.
   - Conduct preliminary testing to ensure API stability.
3. **Hridai**:
   - Resolve the inaccurate `rwUser` fetch in the shopping list backend.
   - Update the team on progress at the next meeting.
4. **Jay**:
   - Fix WebSocket and notification issues to ensure reliable functionality.
   - Test notifications in both React and Flutter environments.
5. **Kin**:
   - Work on aligning the Flutter app’s features with the React version.
   - Focus on shopping list and planner modules.
6. **Josh**:
   - Investigate and fix UI rendering issues in React.
   - Ensure smooth state management for dynamic updates in shopping list and planner modules.
   - Collaborate with Adrian for consistent styling and performance enhancements.
---

## Closing Notes:
- The team was satisfied with the presentation outcome but emphasized the importance of resolving all critical issues before the project submission.
- Everyone committed to their tasks and agreed to regroup on December 8 for final updates.

---

## Meeting Adjourned:
**Time**: 7:15 PM
