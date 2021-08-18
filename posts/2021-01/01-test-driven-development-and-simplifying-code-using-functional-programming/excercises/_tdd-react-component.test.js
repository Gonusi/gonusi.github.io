import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Counter } from "./_tdd-react-component";

it("should display the start count as 0", () => {
	const { getByTestId } = render(<Counter />);

	expect(getByTestId("count")).toHaveTextContent("Count: 0");
});

it("should increase the count by 1 when increase button is clicked", () => {
	const { getByTestId, getByText } = render(<Counter />);

	fireEvent.click(getByText("Increment"));
	expect(getByTestId("count")).toHaveTextContent("Count: 1");

	fireEvent.click(getByText("Increment"));
	expect(getByTestId("count")).toHaveTextContent("Count: 2");
});
