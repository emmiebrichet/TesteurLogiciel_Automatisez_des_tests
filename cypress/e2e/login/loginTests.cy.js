describe('Test de connexion', () => {
  it('Devrait permettre à l\'utilisateur de se connecter et de voir le lien vers le panier', () => {
    cy.visit('http://localhost:8080/#/login');

   
    cy.get('h1').should('contain', 'Se connecter');
    cy.get('form').should('be.visible');

    
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');

    cy.get('button[data-cy="login-submit"]').click();
    cy.wait(5000)
    cy.url().should('not.include', '/login');
    cy.get('a[data-cy="nav-link-cart"]').should('be.visible');
  });

  it('Connexion via le formulaire avec des identifiants invalides', () => {
    cy.visit('http://localhost:8080/#/login');
    cy.get('[data-cy="login-input-username"]').type('wrong@test.fr');
    cy.get('[data-cy="login-input-password"]').type('wrongpass');
    cy.get('[data-cy="login-submit"]').click();
    cy.wait(5000)
  
    cy.get('[data-cy="login-errors"]').should('contain', 'Identifiants incorrects');
    
   
    cy.get('a[data-cy="nav-link-cart"]').should('not.exist');
  });
});


describe('Tests de sécurité XSS sur la page de connexion', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/login');
  });

  it('Ne doit pas interpréter du code HTML injecté', () => {
    cy.get('[data-cy="login-input-username"]').type('<b>Test XSS</b>', { delay: 0 });
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.get('[data-cy="login-errors"]').should('contain', 'Merci de remplir correctement tous les champs');
  });

  it('Ne doit pas exécuter une balise <script> injectée', () => {
    cy.get('[data-cy="login-input-username"]').type('<script>alert("XSS")</script>', { delay: 0 });
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.on('window:alert', (text) => {
      throw new Error(`Alerte détectée : ${text}`);
    });

    cy.get('[data-cy="login-errors"]').should('not.contain', '<script>');
  });

  it('Ne doit pas exécuter un script XSS via une balise img', () => {
    cy.get('[data-cy="login-input-username"]').type('<img src=x onerror=alert("XSS")>', { delay: 0 });
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.on('window:alert', (text) => {
      throw new Error(`Alerte détectée : ${text}`);
    });

    cy.get('[data-cy="login-errors"]').should('not.contain', '<img');
  });

  it('Ne doit pas exécuter du code via un attribut onfocus', () => {
    cy.get('[data-cy="login-input-username"]').type('<input onfocus=alert("XSS")>', { delay: 0 });
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.on('window:alert', (text) => {
      throw new Error(`Alerte détectée : ${text}`);
    });

    cy.get('[data-cy="login-errors"]').should('not.contain', '<input onfocus');
  });

  it('Ne doit pas exécuter du JavaScript inline via un href', () => {
    cy.get('[data-cy="login-input-username"]').type('<a href="javascript:alert(\'XSS\')">Click me</a>', { delay: 0 });
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    cy.on('window:alert', (text) => {
      throw new Error(`Alerte détectée : ${text}`);
    });

    cy.get('[data-cy="login-errors"]').should('not.contain', '<a href="javascript');
  });

});
