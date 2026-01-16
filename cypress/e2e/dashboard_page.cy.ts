describe("Expense Tracker Dashboard Page Tests", () => {
  const jsonServerUrl = "http://localhost:3030/transactions";
  beforeEach(() => {
    // Reset the database before each test and intercepting the GET request
    cy.intercept("GET", jsonServerUrl, { fixture: "transactions.json" }).as(
      "getTransactions"
    );
    // Intercept the POST request to create a new transaction
    cy.intercept("POST", jsonServerUrl, (req) => {
      req.reply({
        statusCode: 201,
        body: { id: 5, ...req.body },
      });
    }).as("postTransactions");
    cy.visit("/dashboard");
    cy.wait("@getTransactions");
  });

  it("should have the title and table with previous transactions", () => {
    cy.get("h1").should("exist").should("contain", "Dashboard");

    cy.get("table").should("exist");

    cy.get("thead").within(() => {
      cy.contains("Amount");
      cy.contains("Date");
      cy.contains("Category");
      cy.contains("Actions");
    });
  });

  it("should allow for the creation of new transactions", () => {
    // Current number of records
    cy.get("table tbody tr").should("have.length", 4);

    // Click on the New Transaction button
    cy.get("Button").contains("Add").should("exist");
    cy.get("Button").contains("Add").click();
    cy.url().should("include", "/new-transaction");

    // We are now on the New Transaction page
    cy.get("h2").should("exist").should("contain", "Add New Transaction");
    cy.get('input[name="amount"]').type("112");
    cy.get('input[name="date"]').type("2025-07-01");
    cy.get('select[name="type"]').select("Expense");
    cy.get('input[name="category"]').type("Food");

    cy.get("Button").contains("Add Transaction").click();

    // Verify that the POST request was made with the correct data
    cy.wait("@postTransactions").then((interception) => {
      expect(interception.response.statusCode).to.eq(201);
      expect(interception.request.body.amount).to.eq(112);
      expect(interception.request.body.date).to.eq("2025-07-01");
      expect(interception.request.body.type).to.eq("expense");
      expect(interception.request.body.category).to.eq("Food");
      expect(interception.response.body.id).to.eq(5);
    });

    cy.url().should("include", "/dashboard");

    // Verify that the new transaction is in the table
    cy.wait("@getTransactions");

    cy.get("table tbody tr").should("have.length", 5);
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.contains("112");
        cy.contains("07/01/2025");
        cy.contains("Food");
      });
  });

  it("should allow for editing transactions", () => {
    const lastTransactionId = 1;
    const newAmount = 150;
    const newDate = "2023-11-02";

    // Intercept the PUT request to update the transaction
    cy.intercept("PUT", `${jsonServerUrl}/${lastTransactionId}`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: lastTransactionId,
          amount: newAmount,
          date: newDate,
        },
      });
    }).as("putTransaction");

    cy.get("table tbody tr")
      .last()
      .within(() => {
        cy.get("Button[title='Edit Transaction']").should("exist");
        cy.get("Button[title='Edit Transaction']").click();
      });

    // User should see a offcanvas with the title "Edit Transaction"
    cy.get("div[class='offcanvas-header']")
      .should("exist")
      .should("contain", "Edit Transaction");

    // Updating the amount and date of the transaction
    cy.get('input[name="amount"]').clear().type(newAmount.toString());
    cy.get('input[name="date"]').clear().type(newDate);

    // Submitting the form
    cy.get("Button").contains("Save Changes").should("exist");
    cy.get("Button").contains("Save Changes").click();

    // Verify that the PUT request was made with the correct data
    cy.wait("@putTransaction").then((interception) => {
      expect(interception.request.body.amount).to.eq(newAmount);
      expect(interception.request.body.date).to.eq(newDate);
    });

    cy.wait("@getTransactions");
    // Verify that the user is redirected back to the dashboard and the changes are reflected
    cy.url().should("include", "/dashboard");
  });

  it("should allow for deleting transactions", () => {
    let firstTransactionAmount;
    let firstTransactionDate;
    let firstTransactionType;
    let firstTransactionCategory;

    // Current number of records
    cy.get("table tbody tr").should("have.length", 4);

    // Getting the delete button for the first transaction
    cy.get("table tbody tr")
      .first()
      .within(() => {
        firstTransactionAmount = cy.get("td").eq(0).invoke("text");
        firstTransactionDate = cy.get("td").eq(1).invoke("text");
        firstTransactionType = cy.get("td").eq(2).invoke("text");
        firstTransactionCategory = cy.get("td").eq(3).invoke("text");
        cy.get("Button[title='Delete Transaction']").should("exist");
        cy.get("Button[title='Delete Transaction']").click();
      });

    // Users should see a confirmation dialog
    cy.get("div[class='modal-header']")
      .should("exist")
      .should("contain", "Confirm Deletion?");

    // Intercepting the DELETE request
    cy.intercept("DELETE", `${jsonServerUrl}/*`, (req) => {
      req.reply({
        statusCode: 200,
      });
    }).as("deleteTransaction");

    cy.get("div[class='modal-footer']")
      .should("exist")
      .within(() => {
        cy.get("Button").contains("Cancel").should("exist");
        cy.get("Button").contains("Delete").should("exist");
        cy.get("Button").contains("Delete").click(); // Confirming the deletion
      });

    cy.wait("@deleteTransaction").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });

    // Confirming that the transaction is removed from the table
    cy.get("table tbody tr").should("have.length", 3);

    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get("td").eq(0).should("not.contain", firstTransactionAmount);
        cy.get("td").eq(1).should("not.contain", firstTransactionDate);
        cy.get("td").eq(2).should("not.contain", firstTransactionType);
        cy.get("td").eq(3).should("not.contain", firstTransactionCategory);
      });

    // Verifying that the user is still on the dashboard page
    cy.url().should("include", "/dashboard");
  });
});
