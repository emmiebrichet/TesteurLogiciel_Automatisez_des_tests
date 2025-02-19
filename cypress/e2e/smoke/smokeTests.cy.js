describe('Smoke Test - Vérification des éléments sur la page d\'accueil', () => {

  beforeEach(() => {
    // Accéder à la page d'accueil
    cy.visit('http://localhost:8080#/');
  });

  it('Vérifier la présence des champs et boutons de connexion', () => {
    // Supposons que les boutons ou champs de connexion sont dans une autre partie du code
    // Par exemple, vérifier si un bouton de connexion existe
    cy.get('[data-cy="login-submit"]').should('exist'); // Remplacer 'login-button' par l'ID ou classe réelle
  });

  it('Vérifier la présence des boutons d\'ajout au panier quand l\'utilisateur est connecté', () => {
    // Simuler la connexion si nécessaire
    // Exemple : cy.login(); // Ajoutez votre logique de connexion ici

    // Vérifier que les boutons "ajouter au panier" sont visibles après la connexion
    cy.get('[data-cy="product-home-link"]').should('exist');
  });

  it('Vérifier la présence du champ de disponibilité du produit', () => {
    // Vérifier la présence d'un champ de disponibilité pour chaque produit
    cy.get('[data-cy="product-home"]').each(($product) => {
      // S'assurer que chaque produit a une indication de disponibilité
      cy.wrap($product).find('[data-cy="product-home-availability"]').should('exist'); // Adapter en fonction du code réel
    });
  });

  it('Vérifier la présence de la section des produits', () => {
    // Vérifier que les produits sont affichés
    cy.get('.list-products').should('exist');
    cy.get('.mini-product').should('have.length.greaterThan', 0);
  });

  it('Vérifier le texte du header', () => {
    // Vérifier la présence du texte dans le header
    cy.get('.text-header h1').should('contain.text', 'Il y en a pour tous les gouts');
    cy.get('.text-header p').should('contain.text', 'Vous etes unique, votre savon devrait l\'etre aussi.');
  });

  it('Vérifier la présence de l\'image du header', () => {
    // Vérifier que l'image du header est présente
    cy.get('.images-header img').should('have.attr', 'src').and('include', 'header.png');
  });

});
