let token;
describe("Test de connexion (Login) avec utilisateur inconnu", () => {
  it("Devrait retourner une erreur 401 si l'utilisateur est inconnu", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "utilisateur_inconnu@test.fr", 
        password: "motdepasseincorrect",
      },
      failOnStatusCode: false, 
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log("Erreur d'authentification attendue : ", response.body);
    });
  });
});


describe("Test de connexion (Login) avec utilisateur connu", () => {
  it("Devrait retourner 200 et un token pour un utilisateur connu", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr", 
        password: "testtest",     
      },
    }).then((response) => {
      expect(response.status).to.eq(200); 
      expect(response.body).to.have.property("token"); 
      cy.log("Token récupéré :", response.body.token);
    });
  });
});
describe("Tests d'ajout d'avis", () => {
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
      expect(response.status).to.eq(200);
      token = response.body.token;
      expect(token).to.not.be.empty;
      cy.log("Token récupéré :", token);
    });
  });

  it("Devrait ajouter un avis avec des données valides", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",  
      headers: { Authorization: `Bearer ${token}` },
      body: { title: "Mon avis", comment: "Très bon produit", rating: 5 },
    }).then((response) => {
      expect(response.status).to.eq(200);  
      expect(response.body).to.have.property("id");  
      cy.log("Avis ajouté :", response.body);
    });
  });

  
});


describe("Tests d'ajout d'avis (échec)", () => {
  it("Ne devrait pas ajouter un avis avec des données invalides", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",
      headers: { Authorization: `Bearer ${token}` },
      body: { title: "", comment: "bien", rating: 6 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log("Erreur attendue lors de l'ajout de l'avis :", response.body);
    });
  });

  it("Ne devrait pas ajouter un avis sans token", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",
      body: { title: "Avis sans token", comment: "Test sans authentification", rating: 4 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      cy.log("JWT Token not found", response.body);
    });
  });

  it("Ne devrait pas ajouter un avis avec un token invalide", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews",
      headers: { Authorization: "Bearer fakeToken123" },
      body: { title: "Avis avec token invalide", comment: "Test token incorrect", rating: 3 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message", "Invalid JWT Token");
      cy.log("Réponse attendue :", response.body);
    });
  });
});



describe("Tests d'accès aux commandes", () => {
  const apiUrl = "http://localhost:8081/orders";

  it("Devrait renvoyer une erreur 401 ou 403 lorsqu'on tente d'accéder au panier sans être connecté", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403]).to.include(response.status);
    });
  });

  it("Devrait renvoyer une erreur 401 lorsqu'on utilise un token invalide", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      headers: { Authorization: "Bearer jeton_invalide" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("Devrait renvoyer une erreur 403 ou 401 lorsqu'on tente de modifier une commande sans être connecté", () => {
    cy.request({
      method: "PUT",
      url: `${apiUrl}/1`,
      body: { status: "shipped" },
      failOnStatusCode: false,
    }).then((response) => {
       expect([401, 403, 404]).to.include(response.status); 
    });
  });

  it("Devrait renvoyer une erreur 404 lorsqu'on demande une commande inexistante", () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/999999`,
      headers: { Authorization: `Bearer ${token}` },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("Devrait renvoyer une erreur 403 ou 401 lorsqu'on tente de supprimer une commande sans être connecté", () => {
    cy.request({
      method: "DELETE",
      url: `${apiUrl}/1`,
      failOnStatusCode: false,
    }).then((response) => {
      expect([401, 403, 404]).to.include(response.status); 
    
    });
  });
});




describe("Tests d'accès à la documentation API", () => {
  const apiUrl = "http://localhost:8081/api/doc";

  before("Devrait récupérer le token après une connexion réussie", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      expect(token).to.not.be.empty;
      cy.log("Token récupéré :", token);
    });
  });

  it("Devrait retourner 200 et récupérer les commandes si l'utilisateur est authentifié", () => {
    cy.request({
      method: "GET",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Réponse de l'API :", response.body);
    });
  });
});



describe("Test de récupération d'une fiche produit spécifique", () => {
  const productId = 3;

  it("Devrait retourner la fiche produit pour un ID spécifique", () => {
    cy.request({
      method: "GET",
      url: `http://localhost:8081/products/${productId}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("id", productId);
      expect(response.body).to.have.property("name").that.is.a("string");
      expect(response.body).to.have.property("price").that.is.a("number");
      expect(response.body).to.have.property("description").that.is.a("string");
      cy.log("Fiche produit récupérée :", response.body);
    });
  });




let token;

describe("Test de commande avec vérification du stock", () => {
  before("Devrait récupérer le token après une connexion réussie", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      expect(token).to.not.be.empty;
      cy.log("Token récupéré :", token);
    });
  });

  it("Ne devrait pas accepter une commande avec une quantité supérieure au stock", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/products/5",
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      const stockDisponible = response.body.availableStock;

      cy.log("Stock disponible :", stockDisponible);

      cy.request({
        method: "PUT",
        url: "http://localhost:8081/orders/add",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          product: 5,
          quantity: stockDisponible + 10, 
        },
        failOnStatusCode: false, 
      }).then((response) => {
        cy.log("Réponse complète :", response);

       
        expect(response.status).to.be.oneOf([400, 422]);

        
        if (response.body.error) {
          cy.log("Erreur retournée :", response.body.error);
        } else {
          cy.log("Aucune erreur retournée !");
          throw new Error("Aucune erreur détectée alors qu'on attendait un échec.");
        }
      });
    });
  });

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

          expect(response.status).to.eq(404);
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

          expect(response.status).to.eq(404);
    
        });
      }
    });
  });
});
});
