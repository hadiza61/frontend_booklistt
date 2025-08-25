import React, { useEffect, useState } from "react";
import BookDetails from "./BookDetails";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Fetch all books
  const fetchBooks = () => {
    fetch("https://backend-booklistt.onrender.com/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Error fetching books:", err));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // If a book is selected → show details
  if (selectedBookId) {
    return (
      <BookDetails
        bookId={selectedBookId}
        onBack={() => setSelectedBookId(null)}
        refreshBooks={fetchBooks} // Pass refresh function
      />
    );
  }

  // Show book list
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📚 Book List</h1>
      {books.map(book => (
        <div
          key={book.id}
          onClick={() => setSelectedBookId(book.id)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#f9f9f9"
          }}
        >
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Rating:</strong> {book.rating}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
