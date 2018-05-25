# Lonely Hearts Dating Site

Implement with jQuery, CSS and HTML:
1. A top bar which consists of a search box to search for a contact, the login user and profile photo.
2. The left side bar which consists of a list of full names of contacts.
3. The right main panel which consists of the details about the selected contact. The details include the selected contact photo, a button to send a message, rating (number of hearts with a max of 5), a description of the contact. A table of likes and dislikes.

Some added clarification:
1. Login functionality is not implemented.
2. Send message functionality is not implemented.
3. Layout should be responsive.

## Solution details
1. Implements HTML5, CSS3, jQuery.
2. Demonstrates closures, promises and some ES6.
3. CSS coded in LESS (file included).
4. Refrained from using any external libraries, but would recommend building both the search results menu and the contact details in a template (such as `handlebars.js`).
5. Developed in Chrome, tested in mobile and tablet.
6. Includes slightly different behavior/layout for mobile for better UX.
7. Empty search will return all profiles in the JSON file (intentional behavior).