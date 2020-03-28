import { Game } from "../Game";
import React = require("react");
import { State, UIState } from "./reducers/UIReducer";
import { connect } from "react-redux";

export interface OwnProps {
  game: Game;
}

export interface StateProps {
  text: string;
}

function mapStateToProps(state: State) {
  return {
    text: state.uiState.text,
  };
}

type UIContainerProps = OwnProps & StateProps;

class UIContainer extends React.Component<UIContainerProps> {
  public render() {
    return (
      <h1 style={{ position: "absolute", color: "white" }}>
        {" "}
        {this.props.text}{" "}
      </h1>
    );
  }
}

export default connect(mapStateToProps)(UIContainer);
