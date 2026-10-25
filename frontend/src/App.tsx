import { useEffect, useMemo, useState } from "react";
import "./index.css";

type Listing = {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  emoji: string;
  comments: string[];
};

const startingListings: Listing[] = [
  {
    id: 1,
    title: "Wireless earbuds",
    category: "Electronics",
    location: "WALC",
    description: "Black wireless earbuds in a charging case.",
    emoji: "🎧",
    comments: [],
  },
  {
    id: 2,
    title: "Water bottle",
    category: "Personal items",
    location: "Purdue Memorial Union",
    description: "Blue insulated bottle with a flip-top lid.",
    emoji: "🧴",
    comments: [],
  },
  {
    id: 3,
    title: "Keyring with keys",
    category: "Personal items",
    location: "Corec",
    description: "Three keys on a plain metal ring.",
    emoji: "🔑",
    comments: [],
  },
  {
    id: 4,
    title: "Gray knit scarf",
    category: "Clothing",
    location: "Wetherill Hall",
    description: "Soft gray scarf left in a classroom.",
    emoji: "🧣",
    comments: [],
  },
];

export default function App() {
  const [listings, setListings] = useState<Listing[]>(() => {
  const saved = localStorage.getItem("boiler-return-listings");
  if (saved) {
    try {
      return JSON.parse(saved) as Listing[];
    } catch {
      localStorage.removeItem("boiler-return-listings");
    }
  }
  return startingListings;
});

useEffect(() => {
  localStorage.setItem("boiler-return-listings", JSON.stringify(listings));
}, [listings]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [reportOpen, setReportOpen] = useState(false);
  const [claiming, setClaiming] = useState<Listing | null>(null);
  const [commentText, setCommentText] = useState<Record<number, string>>({});

  const visibleListings = useMemo(
    () =>
      listings.filter((item) => {
        const matchesSearch = `${item.title} ${item.location} ${item.description}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory =
          category === "All" || item.category === category;
        return matchesSearch && matchesCategory;
      }),
    [listings, search, category],
  );

  function addListing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const newListing: Listing = {
      id: Date.now(),
      title: String(form.get("title")),
      category: String(form.get("category")),
      location: String(form.get("location")),
      description: String(form.get("description")),
      emoji: "📦",
      comments: [],
    };

    setListings((current) => [newListing, ...current]);
    setReportOpen(false);
    event.currentTarget.reset();
  }

  function addComment(event: React.FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    const message = commentText[id]?.trim();
    if (!message) return;

    setListings((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, comments: [...item.comments, message] }
          : item,
      ),
    );
    setCommentText((current) => ({ ...current, [id]: "" }));
  }

  return (
    <main>
      <header className="topbar">
        <a className="logo" href="#">BOILER<span> RETURN</span></a>
        <button className="gold-button" onClick={() => setReportOpen(true)}>
          + Report a found item
        </button>
      </header>

      <section className="hero">
        <p className="eyebrow">PURDUE CAMPUS LOST &amp; FOUND</p>
        <h1>Lost something?<br /><span>Let’s bring it back.</span></h1>
        <p>Find what you lost or help a fellow Boilermaker get it back.</p>
        <a className="gold-button link-button" href="#listings">Browse found items ↓</a>
      </section>

      <section className="board" id="listings">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">THE COMMUNITY BOARD</p>
            <h2>Recently found</h2>
          </div>
          <span>{visibleListings.length} items</span>
        </div>

        <div className="filters">
          <input
            aria-label="Search listings"
            placeholder="Search items or places..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Personal items</option>
            <option>Clothing</option>
            <option>Books</option>
          </select>
        </div>

        <div className="grid">
          {visibleListings.map((item) => (
            <article className="card" key={item.id}>
              <div className="item-image">{item.emoji}</div>
              <div className="card-content">
                <span className="tag">{item.category}</span>
                <h3>{item.title}</h3>
                <p className="location">⌖ {item.location}</p>
                <p>{item.description}</p>

                <button
                  className="text-button"
                  onClick={() => setClaiming(item)}
                >
                  Claim this item →
                </button>

                <div className="comments">
                  <strong>Comments</strong>
                  {item.comments.map((comment, index) => (
                    <p className="comment" key={`${item.id}-${index}`}>{comment}</p>
                  ))}
                  <form onSubmit={(event) => addComment(event, item.id)}>
                    <input
                      aria-label={`Comment on ${item.title}`}
                      placeholder="Leave a message for the finder..."
                      value={commentText[item.id] ?? ""}
                      onChange={(event) =>
                        setCommentText((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                    />
                    <button aria-label="Post comment">Post</button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleListings.length === 0 && (
          <p className="empty">No matches. Try a different search.</p>
        )}
      </section>

      <footer>Made for Boilermakers, by Boilermakers.</footer>

      {reportOpen && (
        <div className="overlay" role="presentation">
          <section className="dialog" role="dialog" aria-modal="true">
            <button className="close" onClick={() => setReportOpen(false)}>×</button>
            <p className="eyebrow dark">HELP AN ITEM FIND ITS WAY HOME</p>
            <h2>Report a found item</h2>
            <form className="stack" onSubmit={addListing}>
              <label>Item name<input name="title" required placeholder="e.g. Black headphones" /></label>
              <label>Category
                <select name="category" required>
                  <option value="">Choose one</option>
                  <option>Electronics</option>
                  <option>Personal items</option>
                  <option>Clothing</option>
                  <option>Books</option>
                </select>
              </label>
              <label>Where was it found?<input name="location" required placeholder="Building or campus area" /></label>
              <label>Description<textarea name="description" required placeholder="Describe visible details. Keep one detail private for verification." /></label>
              <label>Photo (optional)<input name="photo" type="file" accept="image/*" /></label>
              <button className="gold-button">Post listing</button>
            </form>
          </section>
        </div>
      )}

      {claiming && (
        <div className="overlay" role="presentation">
          <section className="dialog" role="dialog" aria-modal="true">
            <button className="close" onClick={() => setClaiming(null)}>×</button>
            <p className="eyebrow dark">MOCK VERIFICATION QUIZ</p>
            <h2>Is this your {claiming.title.toLowerCase()}?</h2>
            <p>The Flask backend can later generate these questions from the uploaded photo.</p>
            <form className="stack" onSubmit={(event) => {
              event.preventDefault();
              setClaiming(null);
              alert("Demo claim submitted! Connect this form to Flask for real verification.");
            }}>
              <label>What detail helps identify your item?
                <input required placeholder="A color, sticker, case, or other detail" />
              </label>
              <label>Where did you last have it?
                <input required placeholder="Campus location" />
              </label>
              <button className="gold-button">Submit claim</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}