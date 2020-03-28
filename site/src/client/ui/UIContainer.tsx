import { Game } from "../Game";
import React = require("react");
import { State, UIState } from "./reducers/UIReducer";
import { connect } from "react-redux";

export interface OwnProps {
  game: Game;
}

export interface StateProps {
  count: number;
}

function mapStateToProps(state: State) {
  return {
    count: state.uiState.bounceCount,
  };
}

type UIContainerProps = OwnProps & StateProps;

class UIContainer extends React.Component<UIContainerProps> {
  public render() {
    return (
      <h1 style={{ position: "absolute", color: "white" }}>
        {" "}
        {this.props.count}{" "}
      </h1>
    );
  }
}

export default connect(mapStateToProps)(UIContainer);
