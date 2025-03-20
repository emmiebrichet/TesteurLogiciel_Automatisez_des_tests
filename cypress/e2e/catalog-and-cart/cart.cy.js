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

  it("Simule l'ajout de 2 produits au panier", () => {
  
    cy.get('[data-cy="product-link"]').eq(2).click();  
  
   
    cy.get('[data-cy="detail-product-quantity"]').clear().type('2');
    cy.get('[data-cy="detail-product-add"]').click();
    
  
    cy.wait(1000); 
    
  
    cy.get('[data-cy="nav-link-cart"]').click();
    
  
    cy.get('[data-cy="cart-line-quantity"]', { timeout: 20000 }).should('have.value', '2');
    
    
    cy.get('[data-cy="cart-line"]').should('contain', 1);
  
    
    cy.get('[data-cy="nav-link-products"]').click();
  
    
    cy.get('[data-cy="product-link"]').eq(2).click();  
  
    cy.wait(3000);
  
    cy.get('[data-cy="detail-product-stock"]').invoke('text').then((updatedStockText) => {
      const updatedStock = parseInt(updatedStockText.replace(/\D/g, ''), 10);
      
      if (isNaN(updatedStock)) {
        throw new Error(`Stock mis à jour invalide: ${updatedStockText}`);
      }
      
      console.log(`Stock initial: 23, Stock mis à jour: ${updatedStock}`);
      
      
      expect(updatedStock).to.equal(23 - 2);
    });
  });

});

describe("Test de finalisation de commande", () => {
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/login");

    // Connexion à l'application
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');
    cy.get('button[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');

    // Navigation vers les produits
    cy.get('[data-cy="nav-link-products"]').click();
    cy.url().should('include', '/products');

    // Ajout d'un produit au panier
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
    cy.get('[data-cy="detail-product-add"]').click();

    // Aller au panier
    cy.wait(1000);
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url().should('include', '/cart');
  });

  it("Remplit le formulaire et valide la commande", () => {
    // Vérifier que le panier n'est pas vide
    cy.get('[data-cy="cart-line"]').should('exist');

    // Remplissage du formulaire
    cy.get('[data-cy="cart-input-lastname"]').type('Dupont');
    cy.get('[data-cy="cart-input-firstname"]').type('Jean');
    cy.get('[data-cy="cart-input-address"]').type('10 rue des Lilas');
    cy.get('[data-cy="cart-input-zipcode"]').type('75000');
    cy.get('[data-cy="cart-input-city"]').type('Paris');

    // Valider la commande
    cy.get('[data-cy="cart-submit"]').click();

    // Vérification de la redirection ou d'un message de confirmation
    cy.url().should('include', '/confirmation');
    
    cy.contains("Votre commande est bien validée").should("be.visible");
  });
});


describe("Test des limites de quantité de produit", () => {

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

  it("Vérifie l'entrée d'un chiffre négatif pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('-5');
    cy.get('[data-cy="detail-product-add"]').click();
  });

  it("Vérifie l'entrée d'un chiffre supérieur à 20 pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('25');
    cy.get('[data-cy="detail-product-add"]').click();
    
  });
  it("Vérifie que l'on peut ajouter un produit avec un stock négatif au panier", () => {
    cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
      const stock = parseInt(stockText.replace(/\D/g, ''), 10);
      cy.get('[data-cy="detail-product-quantity"]').clear().type('1');
  
      if (stock <= 0) {
        
        cy.get('[data-cy="detail-product-add"]').should('be.actif');
      } else {
        
        cy.get('[data-cy="detail-product-add"]').click();
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', '1');
        cy.get('[data-cy="cart-line"]').should('contain', 'Sentiments printaniers');
      }
    });
  }); 
  
});

describe('Tests XSS sur le formulaire de commande', () => {
    
  beforeEach(() => {
      cy.visit("http://localhost:8080/#/login");
      
      // Connexion avant les tests
      cy.get('input#username').type('test2@test.fr');
      cy.get('input#password').type('testtest');
      cy.get('button[data-cy="login-submit"]').click();
      cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');

      // Accès au panier
      cy.get('[data-cy="nav-link-products"]').click();
      cy.url().should('include', '/products');
      cy.visit('http://localhost:8080/#/cart');
  });

  // 🔹 Test 1 : Injection simple de script
  it('Devrait empêcher une injection XSS basique', () => {
      const xssPayload = '<script>alert("XSS")</script>';

      cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
      cy.get('[data-cy="cart-submit"]').click();

      // Vérifier que le script n'est pas exécuté
      cy.get('[data-cy="cart-input-lastname"]').should('not.contain.html', xssPayload);

      // Vérifier qu'aucune alerte ne s'affiche
      cy.on('window:alert', (str) => {
          throw new Error(`XSS détecté : ${str}`);
      });
  });

  // 🔹 Test 2 : Vérifier qu'un HTML malveillant n'est pas interprété
  it('Ne doit pas interpréter du HTML', () => {
      const htmlPayload = '<b>Texte en gras</b>';

      cy.get('[data-cy="cart-input-lastname"]').type(htmlPayload);
      cy.get('[data-cy="cart-submit"]').click();

      
      cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<b>');
  });

  // 🔹 Test 3 : Vérifier si une URL malveillante est bloquée
  it('Ne doit pas autoriser des liens JavaScript', () => {
      const urlPayload = '<a href="javascript:alert(\'XSS\')">Clique ici</a>';

      cy.get('[data-cy="cart-input-address"]').type(urlPayload);
      cy.get('[data-cy="cart-submit"]').click();
      cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<a href');
  });

  // 🔹 Test 4 : Vérifier les attaques avec onmouseover
  it('Ne doit pas exécuter du JavaScript avec onmouseover', () => {
      const eventPayload = '<img src="#" onmouseover="alert(\'XSS\')">';

      cy.get('[data-cy="cart-input-city"]').type(eventPayload);
      cy.get('[data-cy="cart-submit"]').click();

      cy.on('window:alert', (str) => {
          throw new Error(`XSS détecté avec onmouseover : ${str}`);
      });

      cy.get('[data-cy="cart-input-city"]').should('not.contain.html', eventPayload);
  });

  // 🔹 Test 5 : Vérifier si le JavaScript inline est exécuté
  it('Ne doit pas exécuter du JavaScript inline', () => {
      const jsPayload = '"><img src=x onerror=alert("XSS")> ';

      cy.get('[data-cy="cart-input-lastname"]').type(jsPayload);
      cy.get('[data-cy="cart-submit"]').click();

      cy.on('window:alert', (str) => {
          throw new Error(`XSS détecté avec onerror : ${str}`);
      });

      
  });

  // 🔹 Test 6 : Vérifier une attaque CSS malveillante
  it('Ne doit pas accepter des styles CSS malveillants', () => {
      const cssPayload = '"; background: url(javascript:alert("XSS"));';

      cy.get('[data-cy="cart-input-zipcode"]').type(cssPayload);
      cy.get('[data-cy="cart-submit"]').click();

      cy.get('[data-cy="cart-input-zipcode"]').invoke('css', 'background').should('not.include', 'javascript:');
  });


  // 🔹 Test 7 : Vérifier qu'un payload JSON malveillant est bloqué
it('Ne doit pas permettre l\'injection XSS via JSON', () => {
  const jsonPayload = '{"name":"<script>alert(\'XSS\')</script>"}';

  cy.get('[data-cy="cart-input-firstname"]').type(jsonPayload);
  cy.get('[data-cy="cart-submit"]').click();

  cy.get('[data-cy="cart-input-firstname"]').should('not.contain.html', '<script>');
});

// 🔹 Test 8 : Vérifier le double encodage pour contourner la protection
it('Ne doit pas autoriser le double encodage d\'une attaque XSS', () => {
  const doubleEncodedPayload = '%3Cscript%3Ealert("XSS")%3C/script%3E';

  cy.get('[data-cy="cart-input-lastname"]').type(doubleEncodedPayload);
  cy.get('[data-cy="cart-submit"]').click();

  cy.get('[data-cy="cart-input-lastname"]').should('not.contain', '<script>');
});

// 🔹 Test 9 : Vérifier une tentative de fermeture de balise pour injection
it('Ne doit pas autoriser la fermeture de balise HTML suivie d\'une injection', () => {
  const closeTagPayload = '</textarea><script>alert("XSS")</script>';

  cy.get('[data-cy="cart-input-address"]').type(closeTagPayload);
  cy.get('[data-cy="cart-submit"]').click();

  cy.get('[data-cy="cart-input-address"]').should('not.contain.html', '<script>');
});

// 🔹 Test 10 : Vérifier l'injection XSS dans un champ caché
it('Ne doit pas autoriser une injection XSS dans un champ caché', () => {
  cy.get('[data-cy="cart-hidden-input"]').invoke('val', '<script>alert("XSS")</script>').trigger('change');
  cy.get('[data-cy="cart-submit"]').click();

  cy.on('window:alert', (str) => {
      throw new Error(`XSS détecté via champ caché : ${str}`);
  });
});

// 🔹 Test 11 : Vérifier qu'un champ numérique ne peut pas contenir de script
it('Ne doit pas exécuter du JavaScript dans un champ numérique', () => {
  const numericXssPayload = '123<script>alert("XSS")</script>';

  cy.get('[data-cy="cart-input-zipcode"]').type(numericXssPayload);
  cy.get('[data-cy="cart-submit"]').click();

  cy.get('[data-cy="cart-input-zipcode"]').should('not.contain.html', '<script>');
});

  // 🔹 Test 12 : Vérifier la protection XSS sur la validation de commande
  it('Ne doit pas exécuter du JavaScript lors de la validation de commande', () => {
    const xssPayload = '<script>alert("XSS")</script>';

    // Remplir tous les champs du formulaire avec la charge XSS
    cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-firstname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-address"]').type(xssPayload);
    cy.get('[data-cy="cart-input-zipcode"]').type(xssPayload);
    cy.get('[data-cy="cart-input-city"]').type(xssPayload);

    // Cliquer sur le bouton de validation de la commande
    cy.get('[data-cy="cart-submit"]').click();

    // Vérifier qu'aucune alerte ne s'affiche (preuve que le script n'est pas exécuté)
    cy.on('window:alert', (str) => {
        throw new Error(`XSS détecté lors de la validation de commande : ${str}`);
    });

    // Vérifier que les entrées ne contiennent pas de HTML interprété
    cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-firstname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-zipcode"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-city"]').invoke('html').should('not.contain', '<script>');

});


  
  it('Ne doit pas exécuter du JavaScript lors de la validation de commande', () => {
    const xssPayload = '<script>alert("XSS")</script>';

    // Remplir tous les champs du formulaire avec la charge XSS
    cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-firstname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-address"]').type(xssPayload);
    cy.get('[data-cy="cart-input-zipcode"]').type(75000);
    cy.get('[data-cy="cart-input-city"]').type(xssPayload);

    // Cliquer sur le bouton de validation de la commande
    cy.get('[data-cy="cart-submit"]').click();

    // Vérifier qu'aucune alerte ne s'affiche (preuve que le script n'est pas exécuté)
    cy.on('window:alert', (str) => {
        throw new Error(`XSS détecté lors de la validation de commande : ${str}`);
    });

    // Vérifier que les entrées ne contiennent pas de HTML interprété
    cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-firstname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-zipcode"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-city"]').invoke('html').should('not.contain', '<script>');
});



});

