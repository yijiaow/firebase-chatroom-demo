interface MessageProps {
  content: string;
  createdAt: { seconds: number } | null;
  displayName: string;
  photoURL: string | null;
}

const Message: React.FC<MessageProps> = ({
  content = '',
  createdAt,
  displayName = 'Unknown',
  photoURL,
}) => {
  return (
    <div className="flex items-start px-4 py-4 rounded-md hover:bg-gray-50 dark:hover:bg-coolDark-600 overflow-hidden">
      {photoURL && (
        <img
          src={photoURL}
          alt="Avatar"
          width={45}
          height={45}
          className="rounded-full mr-4"
        />
      )}
      <div className="flex items-center mb-1">
        {displayName && <p className="text-primary-500">User: {displayName}</p>}
        {createdAt && (
          <span className="text-gray-500 text-xs">
            {new Date(createdAt.seconds * 1000).toString()}
          </span>
        )}
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Message;
