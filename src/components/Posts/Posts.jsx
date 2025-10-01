import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Posts.css'; // Vamos criar este arquivo para o estilo

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usando async/await, uma forma mais moderna de lidar com promises
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        // Pegando apenas os 5 primeiros posts para não poluir a tela
        setPosts(response.data.slice(0, 5));
      } catch (err) {
        setError('Não foi possível carregar os posts.');
        console.error("Erro ao buscar os posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // O array vazio garante que a busca seja feita apenas uma vez

  // Exibindo uma mensagem de "Carregando..."
  if (loading) {
    return <div className="posts-container"><p>Carregando posts...</p></div>;
  }

  // Exibindo uma mensagem de erro
  if (error) {
    return <div className="posts-container"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="posts-container">
      <h2 className="posts-title">Artigos Recentes (Exemplo com Axios)</h2>
      <ul className="posts-list">
        {posts.map(post => (
          <li key={post.id} className="post-item">
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;