describe('Smoke Test - Vérification des éléments sur la page d\'accueil', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080#/'); // Accès à la page d'accueil
  });

  it('Vérifier la présence des champs et boutons de connexion', () => {
    cy.get('[data-cy="nav-link-login"]').should('exist'); // Vérification du bouton de connexion
  });

  it('Vérifier la présence des boutons d\'ajout au panier quand l\'utilisateur est connecté', () => {
    cy.get('a[data-cy="nav-link-login"]').click();
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');
    cy.get('button[data-cy="login-submit"]').click();

    cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion'); // Vérification de la déconnexion
    cy.get('[data-cy="nav-link-cart"]').should('exist'); // Vérification du lien vers le panier
  });

  it('Vérifier la présence et le contenu des informations des produits', () => {
    cy.get('[data-cy="product-home"]').each(($product) => {
      cy.wrap($product).find('[data-cy="product-home-img"]').should('exist');
      cy.wrap($product).find('[data-cy="product-home-name"]').should('exist').and('not.be.empty');
      cy.wrap($product).find('[data-cy="product-home-ingredients"]').should('exist').and('not.be.empty');
      cy.wrap($product).find('[data-cy="product-home-price"]').should('exist').and('not.be.empty');
      cy.wrap($product).find('[data-cy="product-home-link"]').should('exist');
    });
  });

  it('Vérifier la présence du champ de disponibilité du produit', () => {
    cy.get('[data-cy="product-home"]').each(($product) => {
      cy.wrap($product).find('[data-cy="product-home-availability"]').should('exist').and('not.be.empty');
    });
  });

});

  

