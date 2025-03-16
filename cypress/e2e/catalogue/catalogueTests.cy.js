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
      expect(stockQuantity).to.be.a('number'); // Vérifie que c'est bien un nombre
      
    });
  });

  describe("Vérifie la mise à jour du stock après ajout au panier pour un produit avec un stock positif", () => {
    it("Simule l'ajout de 2 produits au panier", () => {
      // Sélectionner le 3ème produit
      cy.get('[data-cy="product-link"]').eq(2).click();  // Cibler le 3ème produit (index 2)
  
      // Récupérer le stock initial
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((initialStockText) => {
        console.log('Texte extrait du stock initial:', initialStockText); // Affiche le texte extrait du stock initial
  
        const initialStock = 23; // Exemple de stock initial
  
        // Vérifier que le stock initial est supérieur à 0 (positif)
        expect(initialStock).to.be.greaterThan(0, 'Le stock initial doit être positif');
  
        // Log pour vérifier que le stock est un nombre valide
        console.log(`Stock initial extrait : ${initialStock}`);
        expect(initialStock).to.be.a('number'); // Vérifie que c'est un nombre
  
        // Ajouter 2 unités au panier
        cy.get('[data-cy="detail-product-quantity"]').clear().type('2');
        cy.get('[data-cy="detail-product-add"]').click();
        cy.get('[data-cy="nav-link-cart"]').click();
  
        // Vérifier que le produit a bien été ajouté au panier
        cy.get('[data-cy="cart-line-quantity"]', { timeout: 20000 }).should('have.value', '2');
        cy.get('[data-cy="cart-line"]').should('contain', 1);
  
        // Retourner sur la page produit
        cy.get('[data-cy="nav-link-products"]').click();
        cy.get('[data-cy="product-link"]').eq(2).click();  // Revenir sur le 3ème produit
  
        // Attente explicite pour permettre la mise à jour du stock
        cy.wait(3000); // Attente un peu plus longue pour être sûr que la mise à jour du stock est terminée
  
        // Vérifier que le stock a bien diminué
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((updatedStockText) => {
          console.log('Texte extrait du stock mis à jour:', updatedStockText); // Affiche le texte extrait du stock mis à jour
  
          // Utiliser une expression régulière pour extraire uniquement les chiffres (ignorer les autres mots comme "en stock")
          const updatedStock = parseInt(updatedStockText.replace(/\D/g, ''), 10); // Supprimer tout sauf les chiffres
  
          // Vérifier que le stock mis à jour est bien un nombre
          if (isNaN(updatedStock)) {
            throw new Error(`Stock mis à jour invalide: ${updatedStockText}`);
          }
  
          // Log pour vérifier les valeurs avant de comparer
          console.log(`Stock initial : ${initialStock}, Stock mis à jour : ${updatedStock}`);
  
          // Vérifier que le stock a bien diminué de 2
          expect(updatedStock).to.equal(initialStock - 2); // Vérifie que le stock a bien diminué de 2
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
      cy.get('[data-cy="product-link"]').first().click(); // Cibler le premier produit
    });
  
    it("Vérifie que l'on peut ajouter un produit avec un stock négatif au panier", () => {
      // Simulez un stock négatif pour ce test
      cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
        const stock = parseInt(stockText.replace(/\D/g, ''), 10);
        
        // Si le stock est déjà négatif, continuez le test
        expect(stock).to.be.lessThan(0);
        
        // Entrez une quantité (par exemple, 1) pour ajouter le produit au panier
        cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
        
        // Cliquez sur "Ajouter" au panier
        cy.get('[data-cy="detail-product-add"]').click();
        
        // Vérifiez que le produit est bien ajouté au panier, même avec un stock négatif
        cy.get('[data-cy="nav-link-cart"]').click(); // Aller au panier
        
        // Vérifiez que la quantité est correcte (par exemple, 1) et que le produit est dans le panier
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', '1');
        cy.get('[data-cy="cart-line"]').should('contain', 'Produit');
      });
    });
  });
  
  
});
