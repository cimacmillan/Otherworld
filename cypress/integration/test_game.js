import * as Index from "./index.js"

describe('game', function() {

    beforeEach(() => {
        Index.visitSite();
    })

    it("goes forwards and backwards", () => {
      cy.get('body').trigger('keydown', { code: "KeyW", release: false })
      cy.wait(1000)
      cy.get('body').trigger('keyup', { code: "KeyW", release: false })
  
      cy.get('body').trigger('keydown', { code: "KeyS", release: false })
      cy.wait(1000)
      cy.get('body').trigger('keyup', { code: "KeyS", release: false })

      cy.get('canvas')
      .toMatchImageSnapshot({threshold: 0.001});
    })

  })