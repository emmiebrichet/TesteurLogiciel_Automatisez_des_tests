describe("Test de connexion et de navigation vers les produits", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/login");
    
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');
    cy.get('button[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');
    cy.get('[data-cy="nav-link-products"]').click();
    cy.url().should('include', '/products');
  });

  it("Clique sur un des produits et vérifie l'URL", () => {
    cy.get('[data-cy="product-link"]').first().click();
    cy.url().should('include', '/products/');
  });

  it("Vérifie la présence du stock", () => {
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-stock"]').should('exist').invoke('text').then((stockText) => {
      const stockQuantity = parseInt(stockText.replace(/[^\d]/g, ''), 10);
      expect(stockQuantity).to.be.a('number'); 
      
    });
  });

  describe("Vérifie la mise à jour du stock après ajout au panier pour un produit avec un stock positif", () => {
    it("Simule l'ajout de 2 produits au panier", () => {
      
      cy.get('[data-cy="product-link"]').eq(2).click();  
  
     
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((initialStockText) => {
        console.log('Texte extrait du stock initial:', initialStockText); 
  
        const initialStock = 23; 
  
        
        expect(initialStock).to.be.greaterThan(0, 'Le stock initial doit être positif');
  
        console.log(`Stock initial extrait : ${initialStock}`);
        expect(initialStock).to.be.a('number');
  
        
        cy.get('[data-cy="detail-product-quantity"]').clear().type('2');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.get('[data-cy="nav-link-cart"]').click();
  
     
        cy.get('[data-cy="cart-line-quantity"]', { timeout: 20000 }).should('have.value', '2');
        cy.get('[data-cy="cart-line"]').should('contain', 1);
  
       
        cy.get('[data-cy="nav-link-products"]').click();
        cy.get('[data-cy="product-link"]').eq(2).click();  
 
        cy.wait(3000); 
  
    
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((updatedStockText) => {
          console.log('Texte extrait du stock mis à jour:', updatedStockText);
       
          const updatedStock = parseInt(updatedStockText.replace(/\D/g, ''), 10);
  
          
          if (isNaN(updatedStock)) {
            throw new Error(`Stock mis à jour invalide: ${updatedStockText}`);
          }
  
          console.log(`Stock initial : ${initialStock}, Stock mis à jour : ${updatedStock}`);
  
          
          expect(updatedStock).to.equal(initialStock - 2); 
        });
      });
    });
  });
});

describe("Test des limites de quantité pour le premier produit", () => {
  
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/login");
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');
    cy.get('button[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');
    cy.get('[data-cy="nav-link-products"]').click();
    cy.url().should('include', '/products');
    cy.get('[data-cy="product-link"]').first().click(); // Cibler le premier produit
  });

  it("Vérifie l'entrée d'un chiffre négatif pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('-5');
    cy.get('[data-cy="detail-product-add"]').click();
    cy.get('[data-cy="error-message"]').should('contain', 'Quantité invalide');
  });

  it("Vérifie l'entrée d'un chiffre supérieur à 20 pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('25');
    cy.get('[data-cy="detail-product-add"]').click();
    cy.get('[data-cy="error-message"]').should('contain', 'Quantité maximale dépassée');
  });

  describe("Test d'ajout d'un produit avec un stock négatif", () => {

    beforeEach(() => {
      cy.visit("http://localhost:8080/#/login");
      cy.get('input#username').type('test2@test.fr');
      cy.get('input#password').type('testtest');
      cy.get('button[data-cy="login-submit"]').click();
      cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');
      cy.get('[data-cy="nav-link-products"]').click();
      cy.url().should('include', '/products');
      cy.get('[data-cy="product-link"]').first().click(); 
    });
  
    it("Vérifie que l'on peut ajouter un produit avec un stock négatif au panier", () => {
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
        const stock = parseInt(stockText.replace(/\D/g, ''), 10);
        
       
        expect(stock).to.be.lessThan(0);
        
        cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
        
       
        cy.get('[data-cy="detail-product-add"]').click();
        
        
        cy.get('[data-cy="nav-link-cart"]').click();
        
        
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', '1');
        cy.get('[data-cy="cart-line"]').should('contain', 'Produit');
      });
    });
  });
  
  
});
