//
// cypress/support/commands.js
//

const projectId = Cypress.env('descope_gold_project_id')
const managementKey = Cypress.env('descope_management_key')
const descopeAPIDomain = "api.descope.com"

// Define the authorization header
const authHeader = {
    'Authorization': `Bearer ${projectId}:${managementKey}`,
}

// Define the base URL for Descope API
const descopeApiBaseURL = `https://${descopeAPIDomain}/v1`;


// Add the deleteAllTestUsers command
Cypress.Commands.add('deleteAllTestUsers', () => {
    cy.request({
        method: 'DELETE',
        url: `${descopeApiBaseURL}/mgmt/user/test/delete/all`,
        headers: authHeader,
    })
})

Cypress.Commands.add('deleteUser', (email) => {
    cy.request({
        method: 'POST',
        url: `${descopeApiBaseURL}/mgmt/user/delete`,
        headers: {
            'Authorization': `Bearer ${projectId}:${managementKey}`,
            'Content-Type': 'application/json'
        },
        body: {
            loginId: email
        },
        failOnStatusCode: false
    });
});