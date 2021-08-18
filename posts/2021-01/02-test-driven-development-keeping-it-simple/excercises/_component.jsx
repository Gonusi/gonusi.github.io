import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

const initialState = {
	charCounts: null,
	error: null,
	isLoading: true,
};

const charSelectReducer = (state, action) => {
	switch (action.type) {
		case "SUCCESS":
			return {
				charCounts: action.charCounts,
				error: null,
				isLoading: false,
			};
		case "ERROR":
			return {
				charCounts: null,
				error: action.error,
				isLoading: false,
			};
		default:
			return state;
	}
};

const CharSelect = ({ lowercaseUrl, uppercaseUrl }) => {
	const [value, setValue] = useState("");
	const [{ charCounts, error, isLoading }, dispatch] = useReducer(
		charSelectReducer,
		initialState
	);

	useEffect(() => {
		const { token: cancelToken, cancel } = axios.CancelToken.source();
		(async () => {
			try {
				const [{ data: lowercase }, { data: uppercase }] = await Promise.all([
					axios.get(lowercaseUrl, { cancelToken }),
					axios.get(uppercaseUrl, { cancelToken }),
				]);
				const charCounts = lowercase
					.concat(uppercase)
					.sort((a, b) => a > b)
					.reduce((acc, char) => {
						const lowChar = char.toLowerCase();
						acc[lowChar] = ++acc[lowChar] || 1;
						return acc;
					}, {});
				dispatch({ type: "SUCCESS", charCounts });
			} catch (e) {
				dispatch({ type: "ERROR", error: "Unexpected error" });
			}
		})();

		return () => {
			cancel();
		};
	}, [axios]);

	if (isLoading) return "Loading...";
	if (error) return error;
	return (
		<>
			<select data-testid="select" onChange={(e) => setValue(e.target.value)} value={value}>
				<option value="" data-testid="char-select-option">
					Select char
				</option>
				{Object.keys(charCounts).map((char) => (
					<option key={char} value={char} data-testid="char-select-option">
						{char}: {charCounts[char]}
					</option>
				))}
			</select>
			<button>Next</button>
		</>
	);
};

export default CharSelect;
