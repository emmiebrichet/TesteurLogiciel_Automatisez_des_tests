it("Vérification des limites : nombre négatif", () => {
    cy.visit("http://localhost:8080/#/products");
    cy.get(".product-item").first().click();

    cy.get(".quantity-input").clear().type("-1"); // Entrer un nombre négatif
    cy.get(".add-to-cart").click();

    cy.get(".error-message").should("be.visible").and("contain", "Quantité invalide"); // Vérifie qu'un message d'erreur apparaît
  });

  it("Vérification des limites : supérieur à 20", () => {
    cy.visit("http://localhost:8080/#/productss");
    cy.get(".product-item").first().click();

    cy.get(".quantity-input").clear().type("21"); // Entrer un nombre supérieur à 20
    cy.get(".add-to-cart").click();

    cy.get(".error-message").should("be.visible").and("contain", "Stock insuffisant");
  });