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
 


describe("Récupération de la liste des produits du panier", () => {
  let token; 

  before("Devrait récupérer le token après une connexion réussie", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      cy.log("Réponse de la connexion : ", response); 
      expect(response.status).to.eq(200); 
      token = response.body.token;  
      expect(token).to.not.be.empty;
      cy.log("Token récupéré :", token); 
    });
  });

  it("Devrait retourner la liste des produits du panier pour un utilisateur connecté", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/api/doc",
      headers: {
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json",
      },
      failOnStatusCode: false, 
    }).then((response) => {
      cy.log("Réponse de l'API : ", JSON.stringify(response.body, null, 2));  
  
    
      expect(response.status).to.eq(200);
  
      if (Array.isArray(response.body)) {
        expect(response.body).to.have.length.greaterThan(0); 
  
        expect(response.body[0]).to.have.property("id");
        expect(response.body[0]).to.have.property("name");
        expect(response.body[0]).to.have.property("price");
      } else {
       
        cy.log("La réponse n'est pas un tableau : ", response.body);
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

