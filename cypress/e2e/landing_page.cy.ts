describe("Expense Tracker Landing Page Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have the title on the landing page", () => {
    cy.get("h1").should("exist").should("contain", "Budget Buddy");
  });

  it("should have the application description on the landing page", () => {
    cy.get("p").should("exist");
  });

  it("should have a button to get started", () => {
    cy.get("Button").should("exist");
  });

  it("should navigate to the dashboard on clicking Get Started", () => {
    cy.get("Button").contains("Get Started").click();
    cy.url().should("include", "/dashboard");
  });
});
