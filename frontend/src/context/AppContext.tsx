import React, { FC, createContext, useReducer } from "react";

interface InitialStateType {
  notification: {
    message?: string;
    variant?: string;
    showSnackbar: boolean;
    actionName?: string;
    onClick?: () => void;
  };
  currentUser?: {
    name: string;
    email: string;
    access_token: string;
    school: {
      id: number;
      name: string;
      logo_url: string;
      main_color: string;
    };
  } | null;
}

type ActionType =
  | "HIDE_SNACKBAR"
  | "SET_MESSAGE"
  | "SET_MESSAGE_ACTION"
  | "LOGIN"
  | "LOGOUT";

const initialState: InitialStateType = {
  notification: {
    message: undefined,
    variant: undefined,
    showSnackbar: false,
    actionName: undefined,
    onClick: undefined
  },
  currentUser: undefined
};

const reducer = (
  state: InitialStateType,
  action: { type: ActionType; payload: any }
): InitialStateType => {
  const { type, payload } = action;
  switch (type) {
    case "HIDE_SNACKBAR":
      return {
        ...state,
        notification: {
          ...state.notification,
          showSnackbar: false
        }
      };
    case "SET_MESSAGE":
      return {
        ...state,
        notification: {
          ...state.notification,
          showSnackbar: true,
          ...payload
        }
      };
    case "SET_MESSAGE_ACTION":
      return {
        ...state,
        notification: {
          ...state.notification,
          showSnackbar: true,
          ...payload
        }
      };
    case "LOGIN":
      return {
        ...state,
        currentUser: payload
      };
    case "LOGOUT":
      return {
        ...state,
        currentUser: undefined
      };

    default:
      return state;
  }
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
});

const AppProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
