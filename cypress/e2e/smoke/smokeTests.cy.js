describe('Smoke Test - Vérification des éléments sur la page d\'accueil', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080#/');
  });

  it('Vérifier la présence des champs et boutons de connexion', () => {
    cy.get('[data-cy="login-submit"]').should('exist'); 
  });

  it('Vérifier la présence des boutons d\'ajout au panier quand l\'utilisateur est connecté', () => {
    cy.get('[data-cy="product-home-link"]').should('exist');
  });

  it('Vérifier la présence du champ de disponibilité du produit', () => {
    cy.get('[data-cy="product-home"]').each(($product) => {
      cy.wrap($product).find('[data-cy="product-home-availability"]').should('exist'); 
    });
  });

  it('Vérifier la présence de la section des produits', () => {
    cy.get('.list-products').should('exist');
    cy.get('.mini-product').should('have.length.greaterThan', 0);
  });

  it('Vérifier le texte du header', () => {
    cy.get('.text-header h1').should('contain.text', 'Il y en a pour tous les gouts');
    cy.get('.text-header p').should('contain.text', 'Vous etes unique, votre savon devrait l\'etre aussi.');
  });

  it('Vérifier la présence de l\'image du header', () => {
    cy.get('.images-header img').should('have.attr', 'src').and('include', 'header.png');
  });

});
