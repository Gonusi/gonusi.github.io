// Task:
// show "Loading..." text
// fetch data [b, a, a, a] from endpoint /lowercase
// fetch data [A, B, C, B, E] from endpoint /uppercase
//
// Join similar characters from both endpoints, display their counts sorted like this:
// - a: 4
// - b: 3
// - c
// - e: 1
//
// // hide "Loading..." text
// In case of unexpected error from any endpoint, show error message "Unexpected error".

// Wrote the tests based on the excellent example of testing-library:
// https://testing-library.com/docs/react-testing-library/example-intro

import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Component from "./_component.jsx";

let lowercaseCallCount = 0;
let upperCaseCallCount = 0;
const server = setupServer(
	rest.get("/lowercase", (req, res, ctx) => {
		lowercaseCallCount++;
		return res(ctx.json(["a", "b", "a", "c"]));
	}),
	rest.get("/uppercase", (req, res, ctx) => {
		upperCaseCallCount++;
		return res(ctx.json(["A", "D", "C", "F"]));
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("fetches lowercase and uppercase character arrays, renders total character counts", async () => {
	render(<Component lowercaseUrl="/lowercase" uppercaseUrl="/uppercase" />);
	expect(screen.getByText("Loading...")).toBeInTheDocument();
	let options;
	await waitFor(() => {
		options = screen.getAllByTestId("char-select-option");
		return options;
	});
	expect(options.length).toBe(6);
	expect(options[0]).toHaveTextContent("Select char");
	expect(options[0].selected).toBeTruthy();
	expect(options[1]).toHaveTextContent("a: 3");
	expect(options[2]).toHaveTextContent("b: 1");
	expect(options[3]).toHaveTextContent("c: 2");
	expect(options[4]).toHaveTextContent("d: 1");
	expect(options[5]).toHaveTextContent("f: 1");

	expect(options[0]).toHaveValue("");
	expect(options[1]).toHaveValue("a");
	expect(options[2]).toHaveValue("b");
	expect(options[3]).toHaveValue("c");
	expect(options[4]).toHaveValue("d");
	expect(options[5]).toHaveValue("f");

	fireEvent.change(screen.getByTestId("select"), { target: { value: "b" } });
	expect(options[0].selected).toBeFalsy();
	expect(options[2].selected).toBeTruthy();

	expect(lowercaseCallCount).toBe(1);
	expect(upperCaseCallCount).toBe(1);
	expect(screen.queryByText("Loading...")).toBeNull();
	expect(screen.getByText("Next")).toBeInTheDocument();
});

test("renders error message if unexpected fetch error occurs", async () => {
	server.use(
		rest.get("/lowercase", (req, res, ctx) => {
			return res(ctx.status(500));
		})
	);
	render(<Component lowercaseUrl="/lowercase" uppercaseUrl="/uppercase" />);
	expect(screen.getByText("Loading...")).toBeInTheDocument();
	await waitFor(() => screen.getByText("Unexpected error"));
	expect(screen.queryByText("Loading...")).toBeNull();
});
