// JS | Cypress tests {% raw %}
import React from "react";
import { mount } from "@cypress/react";
import ViewDurationTracker from "./_ViewDurationTracker";

beforeEach(() => {
	cy.viewport(320, 640);
});

it("renders children inside a div", () => {
	mount(<TimedViewContainer>I am a single child</TimedViewContainer>);
	cy.get("[data-cy=TimedViewContainer]").contains("I am a single child");
});

it("calls callback with correct view duration", () => {
	const callback = cy.stub().as("callback");
	mount(
		<div style={{ paddingTop: 10000 }}>
			<TimedViewContainer onViewDurationMsChange={callback} />
		</div>
	);

	cy.scrollTo("bottom");
	// Note: should manipulate date here instead of waiting, but it's a bit out of scope here I think
	cy.wait(100);
	cy.scrollTo("top");

	cy.get("@callback").should(
		"have.been.calledWithMatch",
		Cypress.sinon.match.number
			.and(Cypress.sinon.match((x) => x > 100, "> 100"))
			// Some time is wasted on scrollTo commands, so accept up to 150ms instead of exactly 100ms
			.and(Cypress.sinon.match((x) => x < 150, "< 150"))
	);
});
// end JS | Cypress tests {% endraw %}