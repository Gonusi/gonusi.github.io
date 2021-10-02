import React from "react";
import { mount } from "@cypress/react";
import ViewDurationTracker from "./ViewDurationTracker";

beforeEach(() => {
  cy.viewport(320, 640);
});

it("renders children inside a div", () => {
  mount(<ViewDurationTracker>I am a single child</ViewDurationTracker>);
  cy.get("[data-cy=TimedViewContainer]").contains("I am a single child");
});

it("calls callback passing correct arguments", function () {
  // Let's use window and not worry about it for once.
  // cy.spy only accepst [object, property] so 
  // let's not complicate our own lives for now.  
  window.callback = ({ viewDuration, properties }) => {
    expect(viewDuration).to.be.greaterThan(100);
    // Expect 200ms view duration, but allow up to 250ms 
    // The programattic scrolling part consumes a few ms so we're adjusting for taht
    expect(viewDuration).to.be.lessThan(150);
    expect(properties.id).to.be.equal(1);
  };

  cy.spy(window, "callback").as("callback");
  mount(
    <div style={{ paddingTop: "10000px" }}>
      <ViewDurationTracker onViewDurationMsChange={callback} properties={{ id: 1 }}>
        I am a single child
      </ViewDurationTracker>
    </div>
  );

  // At this point we're in a real browser, on the top of the viewport
  cy.scrollTo("bottom");
  // We've now scrolled ±10000px down
  cy.wait(200);
  // After waiting a 200ms we scroll back up
  cy.scrollTo("top");
  // And we check that our callback was called.
  // Callback above contains more checks
  cy.get("@callback").should("have.been.called");

  // Possibly the more "Cypress'y" way to do this for reference:
  // cy.get("@callback").should(
  //  "have.been.calledWithMatch",
  //  Cypress.sinon.match.number
  //    .and(Cypress.sinon.match((x) => x > 100, "> 100"))
  //    .and(Cypress.sinon.match((x) => x < 150, "< 150"))
  // );
});