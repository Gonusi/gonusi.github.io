// JS | React {% raw %}
import React, { useEffect, useRef, useReducer } from "react";

const initialState = { lastEntryTime: 0, viewDuration: 0 };

/* We have state dependent on other state item, with the change being called
in a callback function. This is a classic recipe for stale state problems in 
react functional components due to function closures.  Let's keep all the 
logic in a separate reducer, and only dispatch actions from the callback, 
instead of manipulating state directly. */
const reducer = (state, action) => {
	switch (action.type) {
		case "enterViewport": {
			return { ...state, lastEntryTime: Date.now() };
		}
		case "leaveViewport": {
			return {
				...state,
				viewDuration: state.lastEntryTime
					? state.viewDuration + (Date.now() - state.lastEntryTime)
					: 0,
			};
		}
		default: {
			return state;
		}
	}
};

const ViewDurationTracker = ({ children, onViewDurationMsChange }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const elementRef = useRef();

	const intersectionCallback = (entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				dispatch({ type: "enterViewport" });
			} else {
				dispatch({ type: "leaveViewport" });
			}
		});
	};

	useEffect(() => {
		let observer = new IntersectionObserver(intersectionCallback, { threshold: 0.85 });
		observer.observe(elementRef.current);
	}, []);

	useEffect(() => {
		if (state.viewDuration) {
			onViewDurationMsChange?.(state.viewDuration);
		}
	}, [state.viewDuration]);

	return (
		<div
			data-cy="TimedViewContainer"
			ref={elementRef}
			// yup these are the styles for now
			style={{ border: "3px solid black", width: 300, height: 300 }}
		>
			{children}
		</div>
	);
};

export default ViewDurationTracker;
// end JS | React {% endraw %}