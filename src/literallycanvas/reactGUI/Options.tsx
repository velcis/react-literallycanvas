import React, { Component } from "react";
import { optionsStyles } from "../optionsStyles/optionsStyles";
import { createSetStateOnEventMixin } from "./createSetStateOnEventMixin";
import StrokeWidthPicker from "./StrokeWidthPicker";

type OptionsProps = {
  lc: any;
  imageURLPrefix: string;
};

type OptionsState = {
  style: string;
  tool: any;
};

class Options extends Component<OptionsProps, OptionsState> {
  constructor(props: OptionsProps) {
    super(props);
    this.state = this.getState();
  }

  componentDidMount() {
    this.props.lc.on("toolChange", this.handleToolChange);
  }

  componentWillUnmount() {
    this.props.lc.off("toolChange", this.handleToolChange);
  }

  getState(): OptionsState {
    const tool = this.props.lc.tool;
    return {
      style: tool?.optionsStyle || "",
      tool,
    };
  }

  handleToolChange = () => {
    this.setState(this.getState());
  };

  renderBody() {
    const { style } = this.state;
    const optionsStyleRenderer = optionsStyles[style];

    console.log(
      optionsStyleRenderer({
        lc: this.props.lc,
        tool: this.state.tool,
        imageURLPrefix: this.props.imageURLPrefix,
      })
    );

    return new optionsStyleRenderer({
      lc: this.props.lc,
      tool: this.state.tool,
      imageURLPrefix: this.props.imageURLPrefix,
    });

    if (optionsStyleRenderer) {
      // return new optionsStyleRenderer({
      //   lc: this.props.lc,
      //   tool: this.state.tool,
      //   imageURLPrefix: this.props.imageURLPrefix,
      // });
    }

    return null;
  }

  render() {
    return (
      <div className="lc-options horz-toolbar">
        <StrokeWidthPicker
          lc={this.props.lc}
          tool={this.props.tool}
          imageURLPrefix={this.props.imageURLPrefix}
        />
      </div>
    );
  }
}

export default Options;
