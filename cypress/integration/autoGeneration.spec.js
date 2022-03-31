/* eslint-disable testing-library/await-async-utils */
/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
import 'cypress-file-upload';

describe('Automatic detection and generation', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        cy.get('input[type="file"]').attachFile("class_diagram.png");
      })


    it("Generates drag and drop of data types", () => {
        cy.contains("Detect data types").click()
        cy.wait(5000)

        cy.get(".DragElementsArea").children().should("have.length.greaterThan", 1)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")

        cy.get(".dropAreaDivs").children().should("have.length.greaterThan", 1)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
    })

    it("Generates drag and drop of sentences", () => {
        cy.contains("Detect attributes/functions").click()
        cy.wait(5000)

        cy.get(".DragElementsArea").children().should("have.length.greaterThan", 1)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")

        cy.get(".dropAreaDivs").children().should("have.length.greaterThan", 1)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
    })

    it("Generates drag and drop of classes", () => {
        cy.contains("Make classes drag-and-drop").click()
        cy.wait(3000)

        cy.get(".DragElementsArea").children().should("have.length.greaterThan", 1)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")

        cy.get(".dropAreaDivs").children().should("have.length.greaterThan", 1)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
    })

})