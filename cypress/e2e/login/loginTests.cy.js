describe('Test de connexion', () => {
  it('Devrait permettre à l\'utilisateur de se connecter et de voir le lien vers le panier', () => {
    cy.visit('http://localhost:8080/#/login');

    // Vérifier que le formulaire est affiché
    cy.get('h1').should('contain', 'Se connecter');
    cy.get('form').should('be.visible');

    // Saisir l'email et le mot de passe
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');

    // Soumettre le formulaire
    cy.get('button[data-cy="login-submit"]').click();

    // Vérifier que l'utilisateur est connecté et que le lien vers le panier est visible
    cy.url().should('not.include', '/login');
    cy.get('a[data-cy="nav-link-cart"]').should('be.visible');
  });

  it('Connexion via le formulaire avec des identifiants invalides', () => {
    cy.visit('http://localhost:8080/#/login');
    cy.get('[data-cy="login-input-username"]').type('wrong@test.fr');
    cy.get('[data-cy="login-input-password"]').type('wrongpass');
    cy.get('[data-cy="login-submit"]').click();
    
  
    cy.get('[data-cy="login-errors"]').should('contain', 'Identifiants incorrects');
    
   
    cy.get('a[data-cy="nav-link-cart"]').should('not.exist');
  });
});


