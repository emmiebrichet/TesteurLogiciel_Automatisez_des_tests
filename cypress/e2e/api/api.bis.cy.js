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

          expect(response.status).to.eq(404);
    
        });
      }
    });
  });
});

