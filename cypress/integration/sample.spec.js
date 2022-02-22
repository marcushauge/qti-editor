/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
import 'cypress-file-upload';

describe('My First Test', () => {
    it('Uploads bg image and creates two drag elements with corresponding drop areas', () => {
        cy.visit('http://localhost:3000/')
        
        cy.get('input[type="file"]').attachFile("class_diagram.png");

        cy.contains("Create drag element").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 20, 25)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 90, 75)
        cy.contains("createDragElement").click()

        cy.contains("Create drag element").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 20, 80)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 90, 120)
        cy.contains("createDragElement").click()

        cy.get(".DragElementsArea").children().should("have.length", 2)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")

        cy.get(".dropAreaDivs").children().should("have.length", 2)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
    })
})