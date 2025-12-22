import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get("/articles?status=original");
      setArticles(res.data);
    } catch (err) {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading articles...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">BeyondChats Articles</h1>

      {articles.length === 0 && <p>No articles found.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border rounded-lg p-5 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {article.content.substring(0, 100)}...
            </p>

            <p className="text-sm text-gray-500 mb-4">
              Published: {new Date(article.created_at).toDateString()}
            </p>

            <button
              onClick={() => navigate(`/articles/${article.id}`)}
              className="px-4 py-2 bg-sky-700 text-white rounded hover:bg-blue-700"
            >
              View Article
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
