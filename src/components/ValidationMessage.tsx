interface ValidationMessageProps {
  id?: string;
  message: string;
}

/** Inline field error. The visible "Error:" text means colour is not the only cue. */
export function ValidationMessage({ id, message }: ValidationMessageProps) {
  return (
    <p className="field__error" id={id}>
      <strong>Error: </strong>
      {message}
    </p>
  );
}
