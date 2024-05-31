let projectId = Cypress.env('descope_gold_project_id')
const email = "chris+MyTestCase_404_404_200_200_NoMFA@descope.com"
let password = "N3w404User!11#"

describe('Fresh user - Sign in - not in descope or GFM (404)', () => {
  beforeEach(() => {
    // Set the default command timeout for longer operations
    Cypress.config('defaultCommandTimeout', 30000); // Extend timeout to 20 seconds
    cy.deleteUser(email);
  });

  it('should enter email, password, and submit code from text', () => {
    // Visit the Descope Explorer page
    cy.visit('https://explorer.descope.com/?flow=combined-flow-v2&project='+ projectId);

    // Input email
    cy.get('input[type="email"]')
      .should('be.visible') // Ensure it's visible
      .type(email); // Enter email


    // Input existing password
    cy.get('input[type="password"]').first() // Assume first is existing password
      .should('be.visible') // Ensure it's visible
      .type(password); // Enter existing password

    // Input new password
    cy.get('input[type="password"]').last() // Assume last is new password
      .should('be.visible') // Ensure it's visible
      .type(password); // Enter new password


    // Click "Sign in" button
    cy.get('.descope-button') // Ensure correct class
      .contains('Sign in') // Ensure it's the correct button
      .should('be.visible') // Ensure it's visible
      .click(); // Click "Sign in"

    // Input existing password
    cy.get('input[name="firstName"]').first() // Assume first is existing password
      .should('be.visible') // Ensure it's visible
      .type("First"); // Enter existing password

    // Input new password
    cy.get('input[name="lastName"]').last() // Assume last is new password
      .should('be.visible') // Ensure it's visible
      .type("Last"); // Enter new password

    cy.get('descope-password[data-id="password"]').find('input').should('be.visible').focus().type(password, {force: true});
    
    cy.get('descope-password[data-id="confirm"]').find('input').should('be.visible').focus().type(password, {force: true});


    // Click "Sign in" button
    cy.get('.descope-button') // Ensure correct class
      .contains('Sign Up') // Ensure it's the correct button
      .should('be.visible') // Ensure it's visible
      .click(); // Click "Sign in"

    // Open the dropdown
    cy.get('descope-combo-box').shadow().find('.descope-input-wrapper').click();

    // Wait for the dropdown options to be visible
    cy.get('descope-combo-box').shadow().find('div[data-id="+1"]').should('be.visible').click();

    // If you need to clear the field first before typing, you can chain the clear() method
    
    cy.get('descope-text-field[type="tel"]')
      .find('input[type="tel"]')
      .then($input => {
        // Use jQuery to set the value directly without triggering events
        // This bypasses any JavaScript behavior that might clear the field
        $input.val('2145480287');
      });

    
    // Click "Text Message" option
    cy.get('.descope-button-selection-group-item')
      .contains('Text Message') // Find the "Text Message" option
      .should('be.visible') // Ensure it's visible
      .click(); // Click "Text Message"
    
      // Click "Send Code"
    cy.get('.descope-button') // Ensure correct class
      .contains('Send Code') // Ensure it's the correct button
      .should('be.visible') // Check if it's visible
      .click(); // Click "Send Code"

    // Extract the 6-digit code and insert it into the text field
    cy.get('.descope-text') // Get the text that contains the code
      .contains('Enter Code') // Find the text that contains the code
      .invoke('text') // Get the text content
      .then((text) => {
        const code = text.match(/\d{6}/)[0]; // Extract the 6-digit code
        const codeDigits = code.split(''); // Split the code into individual digits

        cy.get('descope-wc').find('.descope-input-wrapper').find('input').should('exist') // Assertion added to wait for the OTP code input to appear
                        let otpCodeArray = Array.from(code); // Convert the OTP code string to an array
                        otpCodeArray.forEach((digit, index) => {
                            cy.get(`descope-text-field[data-id="${index}"]`).then($element => {
                                    const input = $element[0].shadowRoot.querySelector('input');
                                    input.value = digit;
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                });
        });
    })

    // Check the JWT Response for 'gfm_token' and 'XYZ_SESSION_TOKEN'
    /* cy.get('.jwt-wrapper .pre1').invoke('text').then((jwtText) => {
      const jwt = JSON.parse(jwtText);
      expect(jwt.gfm_token).to.equal('XYZ_SESSION_TOKEN');
    }); */

    // Check the Payload for the specific email address
    cy.get('.jwt-wrapper .pre2').invoke('text').then((payloadText) => {
      const payload = JSON.parse(payloadText);
      expect(payload.user.loginIds).to.include(email.toLowerCase());
    });

    // Ignore specific uncaught exceptions to prevent Cypress from failing the test
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('public key credentials')) {
        // Return false to prevent Cypress from failing the test
        return false;
      } else if (err.message.includes('CORS')) {
        return false;
      }
      return true; // If it's a different error, allow Cypress to fail
    });
  });
});
