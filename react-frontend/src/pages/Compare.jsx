import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

export default function Compare() {
  const { id } = useParams();

  const [original, setOriginal] = useState(null);
  const [updated, setUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const fetchArticles = async () => {
    try {
      const res = await api.get(`/articles/${id}/compare`);
      setOriginal(res.data.originalArticle);
      setUpdated(res.data.updatedArticle);
    } catch (err) {
      setError("Failed to load article comparison");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading comparison...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold">Article Comparison</h1>
        <Link to="/" className="text-blue-600 underline">
          Back
        </Link>
      </div>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Original */}
        <div className="w-1/2 overflow-y-scroll p-6 border-r">
          <h2 className="text-lg font-bold mb-4">Original Article</h2>

          <h3 className="text-xl font-semibold mb-4">{original.title}</h3>

          <div className="prose max-w-none">
            <ReactMarkdown>{original.content}</ReactMarkdown>
          </div>
        </div>

        {/* Updated */}
        <div className="w-1/2 overflow-y-scroll p-6">
          <h2 className="text-lg font-bold mb-4">AI-Updated Article</h2>

          {!updated ? (
            <p className="text-gray-500">Updated version not available yet.</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-4">{updated.title}</h3>

              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-blue-600 hover:text-blue-800 underline"
                      />
                    ),
                  }}
                >
                  {updated.content}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
