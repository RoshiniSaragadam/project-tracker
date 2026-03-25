export default function UserAvatar({ color }: { color: string }) {
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: color,
        border: "2px solid white",
      }}
    />
  );
}