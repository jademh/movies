import React from 'react';

const MovieFilter = (props) => {

  const {
    filters,
    activeFilter,
    onChange
  } = props;

  return (
    <select onChange={onChange}>
      {filters.map(filter => {
        return (
          <option key={filter.id} value={filter.id} selected={activeFilter === filter.id}>{filter.name}</option>
        )
      })}
    </select>
  )
}

export default MovieFilter;