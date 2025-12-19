import { useEffect, useState } from "react";
import { CatalogApi } from "./api/catalog";

export default function App() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await CatalogApi.getParts({ page: 1, limit: 12 });
        setParts(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Завантаження…</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Каталог запчастин</h1>
      {parts.length === 0 ? (
        <p>Поки що немає запчастин. Додай через адмінку (API).</p>
      ) : (
        <ul>
          {parts.map((p) => (
            <li key={p._id}>
              <b>{p.title}</b> — {p.price} грн
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
