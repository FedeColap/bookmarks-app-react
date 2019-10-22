import React, { Component } from  'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './UpdateBookmark.css';

const Required = () => (
  <span className='UpBookmark__required'>*</span>
)

class UpdateBookmark extends Component {
  static contextType = BookmarksContext;

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  // handleSubmit = e => {
  //   e.preventDefault()
  //   // get the form fields from the event
  //   const { title, url, description, rating } = e.target
  //   const bookmark = {
  //     title: title.value,
  //     url: url.value,
  //     description: description.value,
  //     rating: rating.value,
  //   }
  //   this.setState({ error: null })
  //   // validation not shown

  //   fetch(`https://localhost:8000/api/articles/${this.props.match.params.articleId}`, {
  //     method: 'PATCH',
  //     body: JSON.stringify(this.state.inputValues)
  //   })
  //     .then(res => {
  //       if (!res.ok) {
  //         // get the error message from the response,
  //         return res.json().then(error => {
  //           // then throw it
  //           throw error
  //         })
  //       }
  //       return res.json()
  //     })
  //     .then(responseData => {
  //         this.context.updateBookmark(responseData)
  //         this.props.history.push('/')
  //     })
  //     .catch(error => {
  //       this.setState({ error })
  //     })
  // }

  handleSubmit = e => {
    e.preventDefault()
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      },
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }
  //ME NE SONO PROPRIO DIMENTICATA-----------------------------
  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params
      fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${config.API_KEY}`
        }
      })
      
      .then((res) => {  
        if (!res.ok) {
            // get the error message from the response,
            return res.json().then(error => {
              // then throw it
              Promise.reject(error)
            })   
        } return res.json()
      })
      .then(responseData => {
            this.setState({
              id: responseData.id,
              title: responseData.title,
              url: responseData.url,
              description: responseData.description,
              rating: responseData.rating,
            })
      })
      .catch(error => {this.setState({ error })})
  }

  render() {
    const { error } = this.state
    const { title, url, description, rating } = this.state
    
    return (
      <section className='UpBookmark'>
        <h2>Update a bookmark</h2>
        <form
          className='UpBookmark__form'
          onSubmit={this.handleSubmit}
        >
          <div className='UpBookmark__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
              {' '}
              <Required />
            </label>
            <input
              type='text'
              name='title'
              id='title'
              placeholder='Great website!'
              required
              value={title}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
              {' '}
              <Required />
            </label>
            <input
              type='url'
              name='url'
              id='url'
              placeholder='https://www.great-website.com/'
              required
              value={url}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={description}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
              {' '}
              <Required />
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              defaultValue='1'
              min='1'
              max='5'
              required
              value={rating}
            />
          </div>
          <div className='UpBookmark__buttons'>
            {/* <button type='button' onClick={onClickCancel}> */}
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
            {' '}
            <button type='submit'>
              Save
            </button>
          </div>
        </form>
      </section>
    );
  }
}

export default UpdateBookmark;