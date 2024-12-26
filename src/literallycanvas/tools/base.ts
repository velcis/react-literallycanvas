import { LCProps } from "../../@types/LiterallyCanvas";

class Tool {
  name: string | null = null;
  iconName: string | null = null;
  usesSimpleAPI: boolean = true;
  protected lc: LCProps;

  constructor(lc: LCProps) {
    this.lc = lc;
  }

  begin = (x: number, y: number, lc: any) => {};
  continue = (x: number, y: number, lc: any) => {};
  end = (x: number, y: number, lc: any) => {};
  didBecomeActive = (lc: any) => {};
  willBecomeInactive = (lc: any) => {};
}

class ToolWithStroke extends Tool {
  strokeWidth: number;
  unsubscribe: () => void;

  constructor(lc) {
    super(lc);
    this.strokeWidth = lc.opts.defaultStrokeWidth;
    this.optionsStyle = "stroke-width";
  }

  didBecomeActive = (lc: any) => {
    const unsubscribeFuncs = [];
    this.unsubscribe = () => {
      for (const func of unsubscribeFuncs) {
        func();
      }
    };

    unsubscribeFuncs.push(
      lc.on("setStrokeWidth", (strokeWidth) => {
        this.strokeWidth = strokeWidth;
        lc.trigger("toolDidUpdateOptions");
      })
    );
  };

  willBecomeInactive = (lc) => {
    this.unsubscribe();
  };
}

export { Tool, ToolWithStroke };
