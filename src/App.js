import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import BookmarksContext from './BookmarksContext';
import UpdateBookmark from './UpdateBookmark/UpdateBookmark'
import Nav from './Nav/Nav';
import config from './config';
import './App.css';


class App extends Component {
  state = {
    bookmarks: [],
    error: null,
  };

  

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  deleteBookmark = bookmarkId => {
    const newBookmarks = this.state.bookmarks.filter(bm =>
       bm.id !== bookmarkId
    )
    this.setState({
      bookmarks: newBookmarks
    })
  }

  updateBookmark = updatedBookmark => {
    const newBookmarks = this.state.bookmarks.map(book =>
      (book.id === updatedBookmark.id) ? updatedBookmark : book
    )
    this.setState({
      bookmarks: newBookmarks
    })
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const contextValue = {
      bookmarks: this.state.bookmarks,
      addBookmark: this.addBookmark,
      deleteBookmark: this.deleteBookmark,
      updateBookmark: this.updateBookmark,
    }
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <BookmarksContext.Provider value={contextValue}>
            <Nav />
            <div className='content' aria-live='polite'>
                <Route
                  path='/add-bookmark'
                  // render={({ history }) => {
                  //   // console.log(history)
                  //   return <AddBookmark
                  //               onAddBookmark={this.addBookmark}
                  //               onClickCancel={() => history.push('/')}
                  //           />
                  // }}
                  component={AddBookmark}
                />
                <Route
                  path='/edit/:bookmarkId'
                  component={UpdateBookmark}
                />
                <Route
                  exact path='/'
                //   render={() =>
                //   <BookmarkList
                //       bookmarks={bookmarks}
                // />}
                  component={BookmarkList} 
              />
            </div>
        </BookmarksContext.Provider>
      </main>
    );
  }
}

export default App;
