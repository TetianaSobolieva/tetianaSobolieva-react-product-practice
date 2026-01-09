/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getCategorie = categoryId => {
  const foundCategory = categoriesFromServer.find(
    category => category.id === categoryId,
  );

  return foundCategory || null;
};

const getUser = ownerId => {
  const foundUser = usersFromServer.find(user => user.id === ownerId);

  return foundUser || null;
};

const fullProductsList = productsFromServer
  .map(product => ({
    ...product,
    category: getCategorie(product.categoryId),
  }))
  .map(product => ({
    ...product,
    user: product.category ? getUser(product.category.ownerId) : null,
  }));

export const App = () => {
  // console.log(fullProductsList);

  const [userToFilter, setUserToFilter] = useState('');
  const [query, setQuery] = useState('');
  const [categoriesToFilter, setCategoriesToFilter] = useState([]);

  const products = fullProductsList
    .filter(product => {
      if (userToFilter === '') {
        return product;
      }

      return product.user?.name === userToFilter;
    })
    .filter(product => {
      const lowerCasedName = product.name.toLowerCase();
      const lowerCasedQuery = query.toLowerCase();

      return lowerCasedName.includes(lowerCasedQuery);
    })
    .filter(product => {
      if (categoriesToFilter.length === 0) {
        return product;
      }

      if (product.category) {
        return categoriesToFilter.includes(product.category.title);
      }

      return product;
    });

  const handleInput = event => {
    setQuery(event.target.value);
  };

  const clearInput = () => setQuery('');

  const resetFilters = () => {
    setUserToFilter('');
    clearInput();
    setCategoriesToFilter([]);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({
                  'is-active': userToFilter === '',
                })}
                onClick={e => {
                  e.preventDefault();
                  setUserToFilter('');
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': userToFilter === user.name,
                  })}
                  key={user.id}
                  onClick={e => {
                    e.preventDefault();
                    setUserToFilter(user.name);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  // value="qwe"
                  value={query}
                  onChange={handleInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={clearInput}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button is-success mr-6', {
                  'is-outlined': categoriesToFilter.length > 0,
                })}
                onClick={event => {
                  event.preventDefault();
                  setCategoriesToFilter([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': categoriesToFilter.includes(category.title),
                  })}
                  href="#/"
                  key={category.id}
                  onClick={event => {
                    event.preventDefault();
                    setCategoriesToFilter(currCategories => {
                      const { title } = category;

                      if (currCategories.includes(title)) {
                        // eslint-disable-next-line max-len
                        return currCategories.filter(
                          currCategory => currCategory.title !== category.title,
                        );
                      }

                      return [...currCategories, title];
                    });
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!products.length ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>
                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-link': product.user?.sex === 'm',
                        'has-text-danger': product.user?.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
