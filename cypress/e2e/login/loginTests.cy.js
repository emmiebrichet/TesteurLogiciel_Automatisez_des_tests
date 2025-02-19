describe('Test de connexion', () => {
    it('Devrait permettre à l\'utilisateur de se connecter et de voir le lien vers le panier', () => {
      // Visiter la page de connexion
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
      cy.get('a[data-cy="nav-link-cart"]').should('be.visible'); // Vérifie la présence du lien vers le panier
    });
  });
  

  it('Connexion via le formulaire avec des identifiants invalides', () => {
    cy.visit('http://localhost:8080/#/login'); // Correct URL for visiting the login page
    cy.get('[data-cy="login-input-username"]').type('wrong@test.fr');
    cy.get('[data-cy="login-input-password"]').type('wrongpass');
    cy.get('[data-cy="login-submit"]').click(); // Fix the selector for the submit button
    cy.get('[data-cy="login-errors"]').should('contain','Identifiants incorrects');
  });

  describe('Test de connexion - Mot de passe oublié', () => {
    it('Devrait permettre à l\'utilisateur de réinitialiser son mot de passe', () => {
      // Visiter la page de connexion
      cy.visit('http://localhost:8080/#/login');
  
      // Vérifier que le formulaire de connexion est affiché
      cy.get('h1').should('contain', 'Se connecter');
      cy.get('form').should('be.visible');
  
      // Vérifier la présence du lien "Mot de passe oublié"
      cy.get('a[data-cy="forgot-password-link"]').should('be.visible');
  
      // Cliquer sur le lien "Mot de passe oublié"
      cy.get('a[data-cy="forgot-password-link"]').click();
  
      // Vérifier que l'on est redirigé vers la page de réinitialisation du mot de passe
      cy.url().should('include', '/reset-password');
      cy.get('h1').should('contain', 'Réinitialiser votre mot de passe');
      
      // Vérifier la présence du formulaire de réinitialisation
      cy.get('form').should('be.visible');
  
      // Saisir l'email pour la réinitialisation du mot de passe
      cy.get('input#email').type('test2@test.fr');
  
      // Soumettre le formulaire pour réinitialiser le mot de passe
      cy.get('button[data-cy="reset-password-submit"]').click();
  
      // Vérifier que l'utilisateur reçoit une confirmation ou un message d'information
      cy.get('[data-cy="reset-password-confirmation"]').should('contain', 'Instructions de réinitialisation envoyées');
    });
  });
  