/* eslint-disable no-undef */
/* eslint-disable jest/valid-expect */
import 'cypress-file-upload';

describe('Go through app', () => {
    it('Uploads bg image and creates two drag elements with corresponding drop areas', () => {
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

        cy.get(".DragElementsArea").children().should("have.length", 2)
        cy.get(".DragElementsArea").children().first().should("contain", "A1")
        cy.get(".DragElementsArea").children().first().next().should("contain", "A2")

        cy.get(".dropAreaDivs").children().should("have.length", 2)
        cy.get(".dropAreaDivs").children().first().should("contain", "GAP1")
        cy.get(".dropAreaDivs").children().first().next().should("contain", "GAP2")
    })


    it("Creates one distractor element", () => {
        cy.contains("Create distractor").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 200, 30)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 270, 90)
        cy.get(".PreviewSnippetArea").find("button").click()

        cy.get(".dropAreaDivs").children().should("have.length", 2)
        cy.get(".DragElementsArea").children().should("have.length", 3)
    })


    it("Creates one drop area", () => {
        cy.contains("Create drop area").click()
        cy.get('[title="bgCanvas"]').trigger("mousedown", 270, 30)
        cy.get('[title="bgCanvas"]').trigger("mouseup", 330, 70)
        cy.get(".PreviewSnippetArea").find("button").click()

        cy.get(".dropAreaDivs").children().should("have.length", 3)
        cy.get(".DragElementsArea").children().should("have.length", 3)
    })


    it("Has set correct drag element answer for each drop area", () => {
        cy.contains("GAP1").click()
        cy.get("select option:selected").should("have.text", "A1")

        cy.contains("GAP2").click()
        cy.get("select option:selected").should("have.text", "A2")

        cy.contains("GAP3").click()
        cy.get("select option:selected").should("have.text", "empty")
    })


    it("Changes the answer of a drop area", () => {
        cy.contains("GAP2").click()
        cy.get("select").select("A1").should("have.value", 1)

        cy.contains("GAP1").click()
        cy.contains("GAP2").click()
        cy.get("select option:selected").should("have.text", "A1")
    })

})