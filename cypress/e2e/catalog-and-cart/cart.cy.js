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

  

  it("Vérifie l'entrée d'un chiffre supérieur à 20 pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('25');
    cy.get('[data-cy="detail-product-add"]').click();

    cy.visit('http://localhost:8080/#/cart');
    cy.get('[data-cy="cart-line-quantity"]').should('have.value', '25');


  
  });


  it("Vérifie l'entrée d'un chiffre négatif pour le premier produit", () => {
    cy.get('[data-cy="detail-product-quantity"]').clear().type('-5');
    cy.get('[data-cy="detail-product-add"]').click();
    cy.visit('http://localhost:8080/#/cart');
    cy.get('[data-cy="cart-line-quantity"]').should('not.contain', '-5');
  });
  
  it("Remplit le formulaire et valide la commande", () => {
    cy.visit("http://localhost:8080/#/cart");
    cy.get('[data-cy="cart-input-lastname"]').type('Dupont');
    cy.get('[data-cy="cart-input-firstname"]').type('Jean');
    cy.get('[data-cy="cart-input-address"]').type('10 rue des Lilas');
    cy.get('[data-cy="cart-input-zipcode"]').type('75000');
    cy.get('[data-cy="cart-input-city"]').type('Paris');
    cy.get('[data-cy="cart-submit"]').click();
    cy.url().should('include', '/confirmation');
    cy.contains("Votre commande est bien validée").should("be.visible");

  });



  it("Ajoute 2 produits au panier et vérifie la mise à jour du stock", () => {
    
    cy.visit("http://localhost:8080/#/products");
    
    cy.get('[data-cy="product-link"]').eq(3).click();
  
    let initialStock; 
  
    cy.get('p.stock').should('exist').invoke('text').then((stockText) => {
      initialStock = parseInt(stockText.replace(/[^\d]/g, ''), 10);
      console.log("Stock initial extrait:", initialStock);

      cy.get('[data-cy="detail-product-quantity"]').clear().type('2');
      cy.get('[data-cy="detail-product-add"]').click();
      cy.get('[data-cy="nav-link-cart"]').click();
      cy.get('[data-cy="cart-line-quantity"]').should('have.value', '2');
      cy.get('[data-cy="nav-link-products"]').click();   
      cy.get('[data-cy="product-link"]').eq(3).click();
    });   
    
    cy.get('p.stock').should('exist').invoke('text').then((updatedStockText) => {
      const updatedStock = parseInt(updatedStockText.replace(/[^\d]/g, ''), 10);
      console.log("Stock mis à jour extrait:", updatedStock);
      expect(updatedStock).to.not.equal(initialStock);
    });

    cy.visit("http://localhost:8080/#/cart");
    cy.get('[data-cy="cart-input-lastname"]').type('Dupont');
    cy.get('[data-cy="cart-input-firstname"]').type('Jean');
    cy.get('[data-cy="cart-input-address"]').type('10 rue des Lilas');
    cy.get('[data-cy="cart-input-zipcode"]').type('75000');
    cy.get('[data-cy="cart-input-city"]').type('Paris');
    cy.get('[data-cy="cart-submit"]').click();
    cy.url().should('include', '/confirmation');
    cy.contains("Votre commande est bien validée").should("be.visible");
});


    
  it("Vérifie que l'on peut ajouter un produit avec un stock négatif au panier", () => {
    cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
        const stock = parseInt(stockText.replace(/\D/g, ''), 10);
        cy.get('[data-cy="detail-product-quantity"]').clear().type('1');

      if (stock <= 0) {

        cy.get('[data-cy="detail-product-add"]').should('be.disabled');
      } else {
     
        cy.get('[data-cy="detail-product-add"]').click();
        cy.get('[data-cy="nav-link-cart"]').click();      
        cy.get('[data-cy="cart-line-quantity"]').eq(0).should('have.value', '1');  
     
      }
    });
  });
});
 



describe('Tests XSS sur le formulaire de commande', () => {
    
  beforeEach(() => {
    cy.visit("http://localhost:8080/#/login");
    cy.get('input#username').type('test2@test.fr');
    cy.get('input#password').type('testtest');
    cy.get('button[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-logout"]').should('contain', 'Déconnexion');   
    cy.get('[data-cy="nav-link-products"]').click();
    cy.url().should('include', '/products');
    cy.visit('http://localhost:8080/#/cart');
  });

  
  it('Devrait empêcher une injection XSS basique', () => {
    const xssPayload = '<script>alert("XSS")</script>';
    cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
    cy.get('[data-cy="cart-submit"]').click();
    cy.get('[data-cy="cart-input-lastname"]').should('not.contain.html', xssPayload);
    cy.on('window:alert', (str) => {
      throw new Error(`XSS détecté : ${str}`);
    });
  });

  it('Ne doit pas interpréter du HTML', () => {
    const htmlPayload = '<b>Texte en gras</b>';
    cy.get('[data-cy="cart-input-lastname"]').type(htmlPayload);
    cy.get('[data-cy="cart-submit"]').click();
    cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<b>');
  });

 
  it('Ne doit pas autoriser des liens JavaScript', () => {
    const urlPayload = '<a href="javascript:alert(\'XSS\')">Clique ici</a>';
    cy.get('[data-cy="cart-input-address"]').type(urlPayload);
    cy.get('[data-cy="cart-submit"]').click();
    cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<a href');
  });


  it('Ne doit pas exécuter du JavaScript avec onmouseover', () => {
      const eventPayload = '<img src="#" onmouseover="alert(\'XSS\')">';
    cy.get('[data-cy="cart-input-city"]').type(eventPayload);
    cy.get('[data-cy="cart-submit"]').click();

    cy.on('window:alert', (str) => {
      throw new Error(`XSS détecté avec onmouseover : ${str}`);
    });
    cy.get('[data-cy="cart-input-city"]').should('not.contain.html', eventPayload);
  });

  it('Ne doit pas exécuter du JavaScript inline', () => {
      const jsPayload = '"><img src=x onerror=alert("XSS")> ';
      cy.get('[data-cy="cart-input-lastname"]').type(jsPayload);
      cy.get('[data-cy="cart-submit"]').click();
      cy.on('window:alert', (str) => {
      throw new Error(`XSS détecté avec onerror : ${str}`);
    });

      
  });

  
  it('Ne doit pas accepter des styles CSS malveillants', () => {
      const cssPayload = '"; background: url(javascript:alert("XSS"));';
    cy.get('[data-cy="cart-input-zipcode"]').type(cssPayload);
    cy.get('[data-cy="cart-submit"]').click();

    cy.get('[data-cy="cart-input-zipcode"]').invoke('css', 'background').should('not.include', 'javascript:');
  });



  

  
  it('Ne doit pas autoriser le double encodage d\'une attaque XSS', () => {
    const doubleEncodedPayload = '%3Cscript%3Ealert("XSS")%3C/script%3E';

    cy.get('[data-cy="cart-input-lastname"]').type(doubleEncodedPayload);
    cy.get('[data-cy="cart-submit"]').click();

    cy.get('[data-cy="cart-input-lastname"]').should('not.contain', '<script>');
  });

  
  it('Ne doit pas autoriser la fermeture de balise HTML suivie d\'une injection', () => {
    const closeTagPayload = '</textarea><script>alert("XSS")</script>';

    cy.get('[data-cy="cart-input-address"]').type(closeTagPayload);
    cy.get('[data-cy="cart-submit"]').click();

    cy.get('[data-cy="cart-input-address"]').should('not.contain.html', '<script>');
  });

  

  
  it('Ne doit pas exécuter du JavaScript dans un champ numérique', () => {
    const numericXssPayload = '123<script>alert("XSS")</script>';

    cy.get('[data-cy="cart-input-zipcode"]').type(numericXssPayload);
    cy.get('[data-cy="cart-submit"]').click();

    cy.get('[data-cy="cart-input-zipcode"]').should('not.contain.html', '<script>');
  });

  
  it('Ne doit pas exécuter du JavaScript lors de la validation de commande', () => {
    const xssPayload = '<script>alert("XSS")</script>';

    cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-firstname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-address"]').type(xssPayload);
    cy.get('[data-cy="cart-input-zipcode"]').type(xssPayload);
    cy.get('[data-cy="cart-input-city"]').type(xssPayload);

    cy.get('[data-cy="cart-submit"]').click();

   
    cy.on('window:alert', (str) => {
        throw new Error(`XSS détecté lors de la validation de commande : ${str}`);
    });

    cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-firstname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-zipcode"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-city"]').invoke('html').should('not.contain', '<script>');

  });
  
  it('Ne doit pas exécuter du JavaScript et numero dans code postal lors de la validation de commande', () => {
    const xssPayload = '<script>alert("XSS")</script>';

    
    cy.get('[data-cy="cart-input-lastname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-firstname"]').type(xssPayload);
    cy.get('[data-cy="cart-input-address"]').type(xssPayload);
    cy.get('[data-cy="cart-input-zipcode"]').type(75000);
    cy.get('[data-cy="cart-input-city"]').type(xssPayload);

  
    cy.get('[data-cy="cart-submit"]').click();

    
    cy.on('window:alert', (str) => {
        throw new Error(`XSS détecté lors de la validation de commande : ${str}`);
    });


    cy.get('[data-cy="cart-input-lastname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-firstname"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-address"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-zipcode"]').invoke('html').should('not.contain', '<script>');
    cy.get('[data-cy="cart-input-city"]').invoke('html').should('not.contain', '<script>');
  });
});

