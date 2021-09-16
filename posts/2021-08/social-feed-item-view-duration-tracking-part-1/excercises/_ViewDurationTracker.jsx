// JS | React {% raw %}
import React, { useEffect, useRef, useReducer } from "react";

const initialState = { lastEntryTime: 0, viewDuration: 0 };

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
          : 0
      };
    }
    default: {
      return state;
    }
  }
};

const ViewDurationTracker = ({
  children,
  properties,
  onViewDurationMsChange,
  ...props
}) => {
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
    let observer = new IntersectionObserver(intersectionCallback, {
      threshold: 0.85
    });
    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (state.viewDuration) {
      onViewDurationMsChange?.({
        viewDuration: state.viewDuration,
        properties
      });
    }
  }, [state.viewDuration]);

  return (
    <div data-cy="TimedViewContainer" ref={elementRef} {...props}>
      {children}
    </div>
  );
};

export default ViewDurationTracker;
// end JS | React {% endraw %}
