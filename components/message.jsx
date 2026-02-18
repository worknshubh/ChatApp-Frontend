export default function Message(props) {
  return (
    <>
      <div
        className={`flex ${props.me === true ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`inline-block min-w-10 max-w-80 rounded-3xl p-4 m-3 ${props.me === true ? "bg-blue-400" : "bg-[#aaa]"}`}
        >
          <h2 className="text-white text-2xl break-all">{props.message}</h2>
        </div>
      </div>
    </>
  );
}
