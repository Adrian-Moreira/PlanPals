describe('Login Page Tests', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('http://localhost:5173/login');  // Adjust this URL if necessary
  });

  it('should display the login form', () => {
    // Check if the email input field is visible
    cy.get('input#email').should('be.visible');
    // Check if the login button is visible and initially disabled
    cy.get('button').contains('Login').should('be.visible').and('be.disabled');
  });

  it('should show error message for incorrect username', () => {
    const invalidUsername = 'nonexistentuser';
    const password = 'wrongpassword';

    // Type incorrect username and password
    cy.get('input#email').type(invalidUsername);
    cy.get('input#password').type(password);
    
    // Click the login button
    cy.get('button').contains('Login').click();

    // Wait for the error message to show up
    cy.get('input#email')
      .parent()
      .should('have.class', 'Mui-error');
    cy.contains('Incorrect username or password.').should('be.visible');
  });

  it('should login with valid credentials', () => {
    const validUsername = 'validuser'; // Change this to a valid username for your test
    const password = 'validpassword'; // Change this to a valid password for your test

    // Type valid username and password
    cy.get('input#email').type(validUsername);
    cy.get('input#password').type(password);
    
    // Click the login button
    cy.get('button').contains('Login').click();

    // Check if user is redirected to the homepage after login
    cy.url().should('eq', 'http://localhost:3000/'); // Adjust the URL after login
    cy.contains('Welcome, validuser').should('be.visible'); // Check if a welcome message appears
  });

  it('should disable login button if form is incomplete', () => {
    // Try to click login without entering username or password
    cy.get('button').contains('Login').click();
    
    // The button should be disabled
    cy.get('button').contains('Login').should('be.disabled');
  });
});
