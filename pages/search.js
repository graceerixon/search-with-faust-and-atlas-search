import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const searchTaylorSwift = gql`
  query ACF_SEARCH_QUERY($searchTerm: String!) {
    contentNodes(where: {search: $searchTerm}) {
      nodes {
        ... on Song {
          id
          title
        }
        ... on Album {
          id
          title
        }
      }
    }
  }
`;

export default function SongFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, error, data } = useQuery(searchTaylorSwift, {
    variables: { searchTerm }
  });

  console.log(data);
  const results = data?.contentNodes?.nodes;
  const haveResults = Boolean(results?.length);

  function handleSearch(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.target));
    setSearchTerm(values["search-term"]);
  }

  return (
    <div className="songs-search">
      <form method="post" className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          name="search-term"
          placeholder="Search for a song…"
        />
        <button type="submit">Search</button>
      </form>
      <div className="songs-list">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error :(</p>
        ) : !haveResults ? (
          <p>No songs found.</p>
        ) : (
          results.map((item) => (
            <div key={item.id} className="songs-list-item">
              <h2>{item.title}</h2>
            </div>
          ))
        )}
      </div>
    </div>
  );
}