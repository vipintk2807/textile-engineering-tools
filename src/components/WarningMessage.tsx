interface WarningMessageProps {
  messages: readonly string[];
}

/** Engineering warning: a result exists but needs review. */
export function WarningMessage({ messages }: WarningMessageProps) {
  if (messages.length === 0) {
    return null;
  }
  return (
    <div className="message message--warning" role="note">
      {messages.map((message) => (
        <p key={message}>
          <strong>Warning: </strong>
          {message}
        </p>
      ))}
    </div>
  );
}
