/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
import 'cypress-file-upload';

describe('Manual features', () => {
    it('Uploads bg image and creates three drag elements with corresponding drop areas', () => {
        cy.visit('http://localhost:3000/')
        
        cy.get('input[type="file"]').attachFile("class_diagram.png");

        cy.contains("Create drag element").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 20, 25)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 90, 75)
        cy.get(".PreviewSnippetArea").find("button").click()

        cy.contains("Create drag element").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 20, 80)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 90, 120)
        cy.get(".PreviewSnippetArea").find("button").click()

        cy.contains("Create drag element").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 20, 140)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 90, 160)
        cy.get(".PreviewSnippetArea").find("button").click()

        cy.get(".DragElementsArea").children().should("have.length", 3)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")
        cy.get(".DragElementsArea").children().first().next().next().should("contain", "A3")

        cy.get(".dropAreaDivs").children().should("have.length", 3)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
        cy.get(".dropAreaDivs").children().first().next().next().should("contain", "GAP3")
    })

    it("Has correct answer pairs", () => {
        cy.get(".answerPairs").children().should("have.length", 3)
        cy.get(".answerPairs").children().contains("1,1")
        cy.get(".answerPairs").children().contains("2,2")
        cy.get(".answerPairs").children().contains("3,3")
    })

    it("Removes a drop area", () => {
        cy.contains("GAP2").click()
        cy.contains("Remove drop area").click()

        cy.get(".dropAreaDivs").children().should("have.length", 2)
        cy.get(".dropAreaDivs").children().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().should("contain", "GAP3")
        cy.get(".dropAreaDivs").children().should("not.contain", "GAP2")

        cy.get(".answerPairs").children().should("have.length", 2)
        cy.get(".answerPairs").children().contains("1,1")
        cy.get(".answerPairs").children().not("2,2")
        cy.get(".answerPairs").children().contains("3,3")
    })

    it("Removes a drag element", () => {
        cy.contains("A1").click()
        cy.contains("Remove drag element").click()

        cy.get(".DragElementsArea").children().should("have.length", 2)
        cy.get(".DragElementsArea").children().should("contain", "A2")
        cy.get(".DragElementsArea").children().should("contain", "A3")

        cy.get(".answerPairs").children().should("have.length", 1)
        cy.get(".answerPairs").children().contains("3,3")
    })

    

})