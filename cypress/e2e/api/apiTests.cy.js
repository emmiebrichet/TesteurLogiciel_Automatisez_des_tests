let token;

describe('Tests d\'ajout d\'avis (succès et échec)', () => {

 
  it('devrait récupérer le token après une connexion réussie', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'testtest'
      },
    }).then((response) => {
      
      expect(response.status).to.eq(200);

     
      token = response.body.token;
      expect(token).to.not.be.empty;
      cy.log('Token récupéré :', token);
    });
  });

  
  it('ne devrait pas ajouter un avis avec des données invalides', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer ${token}`, 
      },
      body: {
        title: "", 
        comment: "bien",
        rating: 6 
      },
      failOnStatusCode: false 
    }).then((response) => {
     
      expect(response.status).to.eq(400);
      cy.log('Erreur attendue lors de l\'ajout de l\'avis:', response.body);
    });
  });

  
  it('ne devrait pas ajouter un avis sans token', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      body: {
        title: "Avis sans token",
        comment: "Test sans authentification",
        rating: 4
      },
      failOnStatusCode: false 
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log('JWT Token not found', response.body);
    });
  });

  it('ne devrait pas ajouter un avis avec un token invalide', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: {
        Authorization: `Bearer fakeToken123`,
      },
      body: {
        title: "Avis avec token invalide",
        comment: "Test token incorrect",
        rating: 3
      },
      failOnStatusCode: false 
    }).then((response) => {
     
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message", "Invalid JWT Token");
      cy.log('Réponse attendue:', response.body);
    });
  });
  

});
describe("Tests d'accès aux commandes", () => {
  const apiUrl = "http://localhost:8081/orders";
  const validToken = "Bearer VOTRE_TOKEN_VALIDE"; 
  const invalidToken = "Bearer jeton_invalide";

  it("Devrait renvoyer une erreur 401 ou 403 lorsqu'on tente d'accéder au panier sans être connecté", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      failOnStatusCode: false
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it("Devrait renvoyer une erreur 401 lorsqu'on utilise un token invalide", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      headers: { Authorization: invalidToken },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("Devrait retourner 200 et récupérer les commandes si l'utilisateur est authentifié", () => {
  cy.request({
    method: "GET",
    url: "http://localhost:8081/orders",
    headers: {
      Authorization: "Bearer VOTRE_TOKEN_VALIDE",
      "Content-Type": "application/json",
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an("array");
  });
});

  
  

  it("Devrait renvoyer une erreur 404 lorsqu'on tente de modifier une commande sans être connecté", () => {
    cy.request({
      method: "PUT",
      url: `${apiUrl}/1`,
      body: { status: "shipped" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Devrait renvoyer une erreur 404 lorsqu'on demande une commande inexistante", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/999999`,
      headers: { Authorization: validToken },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Devrait renvoyer une erreur 404 lorsqu'on tente de supprimer une commande sans être connecté", () => {
    cy.request({
      method: "DELETE",
      url: `${apiUrl}/1`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});



describe("Test de commande avec vérification du stock", () => {

  it("Ne devrait pas accepter une commande avec une quantité supérieure au stock", () => {
    
    cy.request({
      method: "GET",
      url: "http://localhost:8081/products/6", 
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const stockDisponible = response.body.stock;

   
      cy.request({
        method: "POST",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          productId: 6,
          quantity: stockDisponible + 25, 
        },
        failOnStatusCode: false, 
      }).then((response) => {
        
        expect(response.status).to.eq(200); 
        expect(response.body).to.have.property("message").that.contains("quantité dépasse le stock");

        cy.log("Erreur attendue : La quantité demandée dépasse le stock disponible.");
      });
    });
  });

});
describe("Test de commande avec vérification du stock", () => {

  it("Ne devrait pas accepter une commande avec une quantité supérieure au stock ou avec un stock négatif", () => {
  
    cy.request({
      method: "GET",
      url: "http://localhost:8081/products/3", 
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const stockDisponible = response.body.stock;

      
      if (stockDisponible < 0) {
        
        cy.request({
          method: "POST",
          url: "http://localhost:8081/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            productId: 3,
            quantity: 1, 
          },
          failOnStatusCode: false,
        }).then((response) => {
          
          expect(response.status).to.eq(400); 
          expect(response.body).to.have.property("message").that.contains("stock insuffisant");

          cy.log("Erreur attendue : Le produit a un stock négatif.");
        });
      } else {
      
        cy.request({
          method: "POST",
          url: "http://localhost:8081/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            productId: 3,
            quantity: stockDisponible + 10,
          },
          failOnStatusCode: false, 
        }).then((response) => {
          
          expect(response.status).to.eq(200); 
          expect(response.body).to.have.property("message").that.contains("quantité dépasse le stock");

          cy.log("Erreur attendue : La quantité demandée dépasse le stock disponible.");
        });
      }
    });
  });

});
describe("Test de récupération d'une fiche produit spécifique", () => {
  const productId = 3; 

  it("Devrait retourner la fiche produit pour un ID spécifique", () => {
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/products/${productId}`,
      failOnStatusCode: false 
    }).then((response) => {
      
      expect(response.status).to.eq(200);

     
      expect(response.body).to.have.property('id', productId);
      expect(response.body).to.have.property('name').that.is.a('string');
      expect(response.body).to.have.property('price').that.is.a('number');
      expect(response.body).to.have.property('description').that.is.a('string');
      

      cy.log('Fiche produit récupérée :', response.body);
    });
  });
});
