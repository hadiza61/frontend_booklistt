import React, { useEffect, useState } from "react";

function BookDetails({ bookId, onBack, refreshBooks }) {
  const [book, setBook] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState("");
  const [editComment, setEditComment] = useState("");

  // Fetch book details
  const fetchBookDetails = () => {
      fetch(`https://backend-booklistt.onrender.com/books/${bookId}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error("Error fetching book details:", err));
  };

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  // Add review
  const handleAddReview = () => {
    if (!name || !rating || !comment) {
      alert("Please fill in all fields.");
      return;
    }

    fetch(`https://backend-booklistt.onrender.com/books/${bookId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment })
    })
      .then(res => res.json())
      .then(newReview => {
        setBook(prev => ({
          ...prev,
          reviews: [...prev.reviews, newReview]
        }));
        setName("");
        setRating("");
        setComment("");
        refreshBooks(); // Update main list rating
      })
      .catch(err => console.error("Error adding review:", err));
  };

  // Delete review
  const handleDeleteReview = (reviewId) => {
    fetch(`https://backend-booklistt.onrender.com/books/${bookId}/reviews/${reviewId}`, {
      method: "DELETE"
    })
      .then(() => {
        setBook(prev => ({
          ...prev,
          reviews: prev.reviews.filter(r => r.id !== reviewId)
        }));
        refreshBooks(); // Update main list rating
      })
      .catch(err => console.error("Error deleting review:", err));
  };

  // Start editing
  const handleEditClick = (review) => {
    setEditReviewId(review.id);
    setEditName(review.name);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // Save edit
  const handleSaveEdit = () => {
    fetch(`https://backend-booklistt.onrender.com/books/${bookId}/reviews/${editReviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        rating: editRating,
        comment: editComment
      })
    })
      .then(res => res.json())
      .then(updatedReview => {
        setBook(prev => ({
          ...prev,
          reviews: prev.reviews.map(r =>
            r.id === updatedReview.id ? updatedReview : r
          )
        }));
        setEditReviewId(null);
        setEditName("");
        setEditRating("");
        setEditComment("");
        refreshBooks(); // Update main list rating
      })
      .catch(err => console.error("Error editing review:", err));
  };

  if (!book) return <p>Loading book details...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <button onClick={onBack} style={{ marginBottom: "10px" }}>⬅ Back</button>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Rating:</strong> {book.rating}</p>

      <h3>Reviews</h3>
      {book.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        book.reviews.map(r => (
          <div key={r.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "8px" }}>
            {editReviewId === r.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  style={{ display: "block", marginBottom: "5px" }}
                />
                <input
                  type="number"
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  placeholder="Rating"
                  style={{ display: "block", marginBottom: "5px" }}
                />
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Comment"
                  style={{ display: "block", marginBottom: "5px" }}
                />
                <button onClick={handleSaveEdit}>💾 Save</button>
                <button onClick={() => setEditReviewId(null)}>❌ Cancel</button>
              </>
            ) : (
              <>
                <p><strong>{r.name}</strong> ⭐ {r.rating}</p>
                <p>{r.comment}</p>
                <button onClick={() => handleEditClick(r)}>✏ Edit</button>
                <button onClick={() => handleDeleteReview(r.id)}>🗑 Delete</button>
              </>
            )}
          </div>
        ))
      )}

      <h3>Add Review</h3>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ display: "block", marginBottom: "5px", width: "200px" }}
      />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={e => setRating(e.target.value)}
        style={{ display: "block", marginBottom: "5px", width: "200px" }}
      />
      <textarea
        placeholder="Comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        style={{ display: "block", marginBottom: "5px", width: "300px", height: "80px" }}
      />
      <button onClick={handleAddReview}>Add Review</button>
    </div>
  );
}

export default BookDetails;


