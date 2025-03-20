describe("Test de commande avec vérification du stock", () => {

    it("Ne devrait pas accepter une commande avec une quantité supérieure au stock", () => {
  
      cy.request({
        method: "GET",
        url: "http://localhost:8081/products/5",
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => {
        const stockDisponible = response.body.availableStock;
  
        console.log(response.body.availableStock)
  
  
        cy.request({
          method: "put",
          url: "http://localhost:8081/orders/add",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: {
            product: 5,
            quantity: -1,
          },
        
          failOnStatusCode: false,
        }).then((response) => {
          console.log(response.status);
          console.log(response.body.error.quantity(0));
          
          expect(response.status).to.eq(200);
          
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