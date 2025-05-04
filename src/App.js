import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  // Load dữ liệu từ LocalStorage khi khởi động
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts"));
    if (savedPosts) setPosts(savedPosts);
  }, []);

  // Lưu dữ liệu mỗi khi posts thay đổi
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingPostId) {
      setPosts(posts.map(post =>
        post.id === editingPostId ? { ...post, title, content } : post
      ));
      setEditingPostId(null);
    } else {
      const newPost = {
        id: Date.now(),
        title,
        content,
      };
      setPosts([newPost, ...posts]);
    }

    setTitle("");
    setContent("");
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPostId(post.id);
  };

  const handleViewDetails = (post) => {
    setModalContent(post);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <div className="container">
      <h1 className="title">📝 Viết bài Blog của bạn</h1>

      <form onSubmit={handleSubmit} className="blog-form">
        <input
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="blog-input"
        />
        <textarea
          placeholder="Nội dung bài viết"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="blog-textarea"
        />
        <button type="submit" className="blog-button">
          {editingPostId ? "Cập nhật bài viết" : "Đăng bài"}
        </button>
      </form>

      <h2 className="section-title">📚 Danh sách bài viết</h2>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">
              {post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content}
            </p>
            <div className="action-buttons">
              <button onClick={() => handleDelete(post.id)} className="btn red">Xoá</button>
              <button onClick={() => handleEdit(post)} className="btn yellow">Sửa</button>
              <button onClick={() => handleViewDetails(post)} className="btn blue">Xem chi tiết</button>
            </div>
          </li>
        ))}
      </ul>

      {modalContent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalContent.title}</h3>
            <p>{modalContent.content}</p>
            <button className="btn" onClick={closeModal}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
