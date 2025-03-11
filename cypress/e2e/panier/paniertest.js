describe('Ajout d\'un produit avec stock', () => {
    before(() => {
     
      cy.login('test2@test.fr', 'testtest');
    });
  
    it('Ajoute un produit avec un stock et vérifie son ajout', () => {
      
      cy.visit('/page-ajout-produit');
  
      
      cy.get('input[name="nom-produit"]') 
        .type('Produit Test');
  
      cy.get('input[name="prix"]')
        .type('99.99');
  
      cy.get('input[name="stock"]')
        .type('50'); 
  
      cy.get('button[type="submit"]') 
        .click();
  
      cy.wait(500); 
  
      cy.get('.produit-list') 
        .should('contain', 'Produit Test')
        .and('contain', '50');
  
      
      cy.intercept('POST', '/api/produits').as('addProduct'); 
      cy.wait('@addProduct').its('response.statusCode').should('eq', 200);
    });
  });
  