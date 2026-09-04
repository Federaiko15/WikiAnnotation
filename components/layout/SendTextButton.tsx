import { useRouter } from "next/navigation";

export default function SendTextButton() {
  const router = useRouter();

  function handleClick() {
    router.push(`/text`);
  }

  return (
    <button onClick={handleClick} className="prova-btn" id="submit-btn">
      Invia testo ➔
    </button>
  );
}
