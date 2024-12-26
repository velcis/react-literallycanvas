import { create } from "zustand";

// Zustand store for undo/redo state
interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  setUndoRedoState: (state: Partial<UndoRedoState>) => void;
}

const useUndoRedoStore = create<UndoRedoState>((set) => ({
  canUndo: false,
  canRedo: false,
  undo: () => console.log("Undo action triggered"), // Replace with actual logic
  redo: () => console.log("Redo action triggered"), // Replace with actual logic
  setUndoRedoState: (state) => set((prevState) => ({ ...prevState, ...state })),
}));

interface UndoRedoButtonProps {
  undoOrRedo: "undo" | "redo";
  imageURLPrefix: string;
}

const UndoRedoButton: React.FC<UndoRedoButtonProps> = ({
  undoOrRedo,
  imageURLPrefix,
}) => {
  const { canUndo, canRedo, undo, redo } = useUndoRedoStore();
  const isEnabled = undoOrRedo === "undo" ? canUndo : canRedo;
  const onClick = isEnabled
    ? () => (undoOrRedo === "undo" ? undo() : redo())
    : undefined;

  const src = `${imageURLPrefix}/${undoOrRedo}.png`;
  const style = { backgroundImage: `url(${src})` };
  const title = undoOrRedo === "undo" ? "Undo" : "Redo";
  const className = `lc-${undoOrRedo} toolbar-button thin-button ${
    !isEnabled && "disabled"
  }`;

  return (
    <div
      className={className}
      title={title}
      style={style}
      onClick={onClick}
    ></div>
  );
};

const UndoRedoButtons: React.FC<{ imageURLPrefix: string }> = ({
  imageURLPrefix,
}) => {
  return (
    <div className="lc-undo-redo">
      <UndoRedoButton undoOrRedo="undo" imageURLPrefix={imageURLPrefix} />
      <UndoRedoButton undoOrRedo="redo" imageURLPrefix={imageURLPrefix} />
    </div>
  );
};

export default UndoRedoButtons;
