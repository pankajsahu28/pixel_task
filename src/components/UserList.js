import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchUsers, setSortBy, setSortOrder, setGender, setCountry } from '../store/userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, status, total, sortBy, sortOrder, gender, country } = useSelector((state) => state.users);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers({ limit, skip: 0, sortBy, sortOrder, gender, country }));
    }
  }, [status, dispatch, sortBy, sortOrder, gender, country]);

  useEffect(() => {
    setHasMore(list.length < total);
  }, [list, total]);

  const loadMore = () => {
    if (hasMore) {
      dispatch(fetchUsers({ limit, skip: list.length, sortBy, sortOrder, gender, country }));
    }
  };

  const handleSort = (column) => {
    if (column === sortBy) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(column));
      dispatch(setSortOrder('asc'));
    }
    dispatch({ type: 'users/reset' }); // Reset the list when sorting
  };

  const handleFilter = (type, value) => {
    if (type === 'gender') {
      dispatch(setGender(value));
    } else if (type === 'country') {
      dispatch(setCountry(value));
    }
    dispatch({ type: 'users/reset' }); // Reset the list when filtering
  };

  const sortedAndFilteredUsers = [...list]
    .filter(user => gender ? user.gender === gender : true)
    .filter(user => country ? user.address.country.toLowerCase().includes(country.toLowerCase()) : true)
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div>
      <h1>User List</h1>
      <div>
        <label>
          Gender:
          <select value={gender} onChange={(e) => handleFilter('gender', e.target.value)}>
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Country:
          <input type="text" value={country} onChange={(e) => handleFilter('country', e.target.value)} />
        </label>
      </div>
      <InfiniteScroll
        dataLength={sortedAndFilteredUsers.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('firstName')}>Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('age')}>Age {sortBy === 'age' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default UserList;