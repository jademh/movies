import React from 'react';
import Select from 'react-select';

const MovieFilter = (props) => {

  const {
    filters,
    activeFilter,
    onChange
  } = props;

  return (
    <div className="filter">
      <Select onChange={(val) => onChange(val)} options={filters} value={filters.find(filter => filter.value === activeFilter)} />
    </div>
  )
}

export default MovieFilter;