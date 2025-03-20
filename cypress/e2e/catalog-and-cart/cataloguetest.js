describe('Affichage des produits sur la page d’accueil', () => {
  beforeEach(() => {
      cy.visit('http://localhost:8080/#/');
  });

  it('Charge la page sans erreur', () => {
      cy.get('#other-products').should('be.visible');
  });

  it('Affiche tous les produits avec leurs informations', () => {
      cy.get('[data-cy=product-home]').should('have.length.greaterThan', 0);
      cy.get('[data-cy=product-home-img]').should('be.visible');
      cy.get('[data-cy=product-home-name]').should('not.be.empty');
      cy.get('[data-cy=product-home-ingredients]').should('not.be.empty');
      cy.get('[data-cy=product-home-price]').each(($el) => {
        cy.wrap($el)
          .invoke('text')
          .should('match', /^[0-9]+,[0-9]{2} €$/);
      });
      
      cy.get('[data-cy=product-home-link]').should('be.visible');
  });

  it('Vérifie l’affichage de chaque produit', () => {
      cy.get('[data-cy=product-home]').each(($product) => {
          cy.wrap($product).find('[data-cy=product-home-img]').should('be.visible');
          cy.wrap($product).find('[data-cy=product-home-name]').should('exist');
          cy.wrap($product).find('[data-cy=product-home-ingredients]').should('exist');
          cy.wrap($product).find('[data-cy=product-home-price]').should('exist');
          cy.wrap($product).find('[data-cy=product-home-stock]').should('exist');
          cy.wrap($product).find('[data-cy=product-home-link]').should('be.visible');
      });
  });

  it('Vérifie l’affichage des détails du produit', () => {
    cy.visit('http://localhost:8080/#/products/4'); 

    cy.get('[data-cy=detail-product-img]').should('be.visible');
    cy.get('[data-cy=detail-product-name]').should('exist');
    cy.get('[data-cy=detail-product-description]').should('exist');
    cy.get('[data-cy=detail-product-skin]').should('exist');
    cy.get('[data-cy=detail-product-aromas]').should('exist');
    cy.get('[data-cy=detail-product-ingredients]').should('exist');
    cy.get('[data-cy=detail-product-price]').should('exist');
    cy.get('[data-cy=detail-product-stock]').should('exist');
    cy.get('[data-cy=detail-product-quantity]').should('exist');
    cy.get('[data-cy=detail-product-add]').should('exist');
});



it('Vérifie la redirection vers la page produit', () => {
  cy.visit('http://localhost:8080/#/products');

  
  cy.get('[data-cy=product]').should('have.length.greaterThan', 0); 
  cy.get('[data-cy=product-link]').first().click(); 
  cy.url().should('include', '/products/');  
  cy.get('[data-cy=detail-product-name]').should('exist'); 
});

it('Vérifie la présence de l\'image, du prix, du nom, du bouton et du stock', () => {
  cy.visit('http://localhost:8080/#/products'); 
  cy.get('[data-cy=product]').should('have.length.greaterThan', 0);

 
  cy.get('[data-cy=product]').each(($product) => {
    cy.wrap($product).find('[data-cy=product-picture]').should('be.visible'); 
    cy.wrap($product).find('[data-cy=product-name]').should('exist');
    cy.wrap($product).find('[data-cy=product-price]').should('exist'); 
    cy.wrap($product).find('[data-cy=product-link]').should('exist'); 
    cy.wrap($product).find('[data-cy=product-ingredients]').should('exist'); 
  });
});


});
