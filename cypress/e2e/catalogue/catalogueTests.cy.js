describe('Affichage des produits sur la page d\'accueil', () => {
  beforeEach(() => {
    // Visiter la page des produits avant chaque test
    cy.visit('http://localhost:8080/#/products');
  });

  it('vérifie que la page se charge correctement', () => {
    cy.url().should('include', '/products');
    cy.get('section#other-products').should('be.visible');
  });

  it('vérifie l\'affichage de tous les produits et leurs informations', () => {
    cy.get('[data-cy="product"]').should('have.length.greaterThan', 0);
    cy.get('[data-cy="product-picture"]').should('be.visible');
    cy.get('[data-cy="product-name"]').should('be.visible');
    cy.get('[data-cy="product-ingredients"]').should('be.visible');
    cy.get('[data-cy="product-link"]').should('be.visible');
  });

  it('vérifie les informations spécifiques de chaque produit', () => {
    cy.get('[data-cy="product"]').each(($product) => {
      cy.wrap($product).within(() => {
        cy.get('[data-cy="product-picture"]').should('be.visible');
        cy.get('[data-cy="product-name"]').should('be.visible');
        cy.get('[data-cy="product-ingredients"]').should('be.visible');
        cy.get('[data-cy="product-price"]').should('be.visible');
        cy.get('[data-cy="product-availability"]').should('be.visible');
      });
    });
  });
});
